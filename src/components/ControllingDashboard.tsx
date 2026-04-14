import { DollarSign, BarChart3, TrendingUp, Users, Fuel, PieChart } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { controllingKPIs } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export default function ControllingDashboard() {
  const { vehicles, setKpiDrawer } = useApp();

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'controlling' });
  };

  const tcoData = vehicles.slice(0, 15).map(v => ({
    id: v.id,
    tco: v.tco,
    maint: v.maintenanceCostYTD,
    downtime: v.downtimeCostYTD,
  }));

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Coût maint./km" value={`${controllingKPIs.maintenanceCostPerKm} DZD`}
          icon={DollarSign}
          variant={controllingKPIs.maintenanceCostPerKm > controllingKPIs.maintenanceCostPerKmBudget ? 'critical' : 'default'}
          subtitle={`Budget: ${controllingKPIs.maintenanceCostPerKmBudget} DZD`}
          onClick={() => openKPI('ctrl-maint-km', 'Coût Maintenance / km', `${controllingKPIs.maintenanceCostPerKm} DZD`)} />
        <KPICard label="Non planifié" value={`${controllingKPIs.unplannedPercent}%`}
          icon={PieChart}
          variant={controllingKPIs.unplannedPercent > controllingKPIs.unplannedTarget ? 'warning' : 'success'}
          subtitle={`Cible: <${controllingKPIs.unplannedTarget}%`}
          onClick={() => openKPI('ctrl-unplanned', 'Planifié vs Non Planifié', `${controllingKPIs.unplannedPercent}% non planifié`)} />
        <KPICard label="Variance budget" value={`+${controllingKPIs.budgetVariance}%`}
          icon={TrendingUp} variant="critical"
          onClick={() => openKPI('ctrl-variance', 'Variance Budget', `+${controllingKPIs.budgetVariance}%`)} />
        <KPICard label="ROI Maintenance" value={`${controllingKPIs.roiMaintenance}x`}
          icon={BarChart3} variant="success"
          onClick={() => openKPI('ctrl-roi', 'ROI des Actions de Maintenance', `${controllingKPIs.roiMaintenance}x`)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fuel by route */}
        <div className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => openKPI('ctrl-fuel', 'Coût Carburant par Route', '')}>
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Fuel className="w-3.5 h-3.5" /> Coût Carburant par Route</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={controllingKPIs.fuelCostByRoute}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
              <XAxis dataKey="route" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(240 18% 12%)', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                {controllingKPIs.fuelCostByRoute.map((entry, i) => (
                  <Cell key={i} fill={entry.route === 'Route C-3' ? '#ef4444' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Labour cost */}
        <div className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => openKPI('ctrl-labour', 'Coûts Main d\'Œuvre', `${(controllingKPIs.labourCost.drivers + controllingKPIs.labourCost.mechanics + controllingKPIs.labourCost.overtime).toLocaleString()} DZD`)}>
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Coûts Main-d'œuvre</h4>
          <div className="space-y-3 mt-4">
            {[
              { label: 'Conducteurs', value: controllingKPIs.labourCost.drivers, color: 'bg-primary' },
              { label: 'Mécaniciens', value: controllingKPIs.labourCost.mechanics, color: 'bg-warning' },
              { label: 'Heures sup.', value: controllingKPIs.labourCost.overtime, color: 'bg-critical', flag: true },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}{item.flag && <span className="text-critical ml-1">⚠</span>}</span>
                  <span className="text-foreground font-medium">{item.value.toLocaleString()} DZD</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)}
                    style={{ width: `${(item.value / controllingKPIs.labourCost.drivers) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TCO Table */}
      <div className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => openKPI('ctrl-tco', 'TCO par Véhicule (Détaillé)', '')}>
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">TCO par Véhicule (détail)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Véhicule</th>
                <th className="text-right py-2 text-muted-foreground font-medium">TCO</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Maintenance</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Downtime</th>
              </tr>
            </thead>
            <tbody>
              {tcoData.map(row => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-2 text-foreground font-medium">{row.id}</td>
                  <td className="py-2 text-right text-foreground">{row.tco.toLocaleString()} DZD</td>
                  <td className="py-2 text-right text-warning">{row.maint.toLocaleString()} DZD</td>
                  <td className="py-2 text-right text-critical">{row.downtime.toLocaleString()} DZD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
