import { Activity, Truck, AlertTriangle, Wrench, Gauge } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { fleetKPIs, trendData } from '@/data/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

const weeklyBreakdownData = [
  { week: 'Sem 1', planned: 3, unplanned: 1 },
  { week: 'Sem 2', planned: 2, unplanned: 3 },
  { week: 'Sem 3', planned: 4, unplanned: 2 },
  { week: 'Sem 4', planned: 3, unplanned: 4 },
];

export default function PerfFlottePage() {
  const { vehicles, setKpiDrawer } = useApp();

  const operational = vehicles.filter(v => v.active && v.healthScore >= 30).length;
  const inMaintenance = vehicles.filter(v => !v.active || v.healthScore < 30).length;
  const breakdownRate = Math.round((vehicles.filter(v => v.healthScore < 50 && v.active).length / vehicles.length) * 100);
  const totalKm = vehicles.reduce((s, v) => s + Math.round(v.tco / v.costPerKm), 0);

  const top10Pannes = useMemo(() => {
    return vehicles
      .filter(v => v.active)
      .map(v => ({
        id: v.id,
        pannes: v.obd.faultCodes.length + v.components.filter(c => c.rulPercent < 30).length,
        heures: Math.round((100 - v.healthScore) * 0.8),
        cost: v.maintenanceCostYTD,
      }))
      .sort((a, b) => b.pannes - a.pannes)
      .slice(0, 10);
  }, [vehicles]);

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'dg' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Disponibilité Flotte" value={`${fleetKPIs.availability}%`} icon={Activity}
          variant={fleetKPIs.availability < 95 ? 'warning' : 'success'} subtitle="Cible: 95%"
          onClick={() => openKPI('perf-disponibilite', 'Disponibilité Flotte', `${fleetKPIs.availability}%`)} />
        <KPICard label="Taux de Panne" value={`${breakdownRate}%`} icon={AlertTriangle}
          variant={breakdownRate > 10 ? 'critical' : 'default'}
          onClick={() => openKPI('perf-panne', 'Taux de Panne', `${breakdownRate}%`)} />
        <KPICard label="Véhicules Opérationnels" value={operational} icon={Truck}
          variant="success"
          onClick={() => openKPI('perf-operationnels', 'Véhicules Opérationnels', `${operational}`)} />
        <KPICard label="En Maintenance" value={inMaintenance} icon={Wrench}
          variant={inMaintenance > 3 ? 'warning' : 'default'}
          onClick={() => openKPI('perf-maintenance', 'Véhicules en Maintenance', `${inMaintenance}`)} />
        <KPICard label="Kilométrage Total" value={`${Math.round(totalKm / 1000)}K km`} icon={Gauge}
          onClick={() => openKPI('perf-km', 'Kilométrage Total Flotte', `${Math.round(totalKm / 1000)}K km`)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Disponibilité 30j */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3">Disponibilité Flotte (30j)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="grad-avail-perf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2333', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="availability" stroke="#22c55e" fill="url(#grad-avail-perf)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pannes par semaine */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3">Pannes par Semaine (Planifié vs Non planifié)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2333', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="planned" name="Planifié" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="unplanned" name="Non planifié" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 pannes */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">Top 10 Véhicules — Plus de Pannes ce Mois</h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Véhicule</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Nb Pannes</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Heures Perdues</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Coût</th>
            </tr>
          </thead>
          <tbody>
            {top10Pannes.map(v => (
              <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-2 px-3 text-foreground font-semibold">{v.id}</td>
                <td className={cn("py-2 px-3 text-right font-bold", v.pannes > 3 ? 'text-critical' : 'text-foreground')}>{v.pannes}</td>
                <td className="py-2 px-3 text-right text-warning">{v.heures}h</td>
                <td className="py-2 px-3 text-right text-foreground">{v.cost.toLocaleString()} DZD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
