import { DollarSign, TrendingUp, Gauge, Clock, Activity, Zap, AlertTriangle } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { dgKPIs, trendData } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartColors = {
  cost: '#f59e0b',
  availability: '#22c55e',
  downtime: '#ef4444',
  health: '#8b5cf6',
};

export default function DGDashboard() {
  const { setKpiDrawer } = useApp();

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'dg' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Coût Flotte (mois)" value={`${(dgKPIs.totalFleetCost / 1000).toFixed(0)}K DZD`}
          icon={DollarSign} variant={dgKPIs.totalFleetCost > dgKPIs.totalFleetBudget ? 'critical' : 'default'}
          subtitle={`Budget: ${(dgKPIs.totalFleetBudget / 1000).toFixed(0)}K DZD`}
          onClick={() => openKPI('dg-total-cost', 'Coût Total Flotte', `${(dgKPIs.totalFleetCost / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="TCO/véhicule (moy)" value={`${(dgKPIs.tcoPerVehicle / 1000).toFixed(0)}K`}
          icon={TrendingUp} trend={dgKPIs.tcoTrend}
          onClick={() => openKPI('dg-tco', 'TCO Moyen par Véhicule', `${(dgKPIs.tcoPerVehicle / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Coût/km global" value={`${dgKPIs.costPerKm} DZD`} icon={Gauge}
          onClick={() => openKPI('dg-cost-km', 'Coût par Kilomètre', `${dgKPIs.costPerKm} DZD`)} />
        <KPICard label="Taux indisponibilité" value={`${dgKPIs.downtimeRate}%`} icon={Clock}
          variant={dgKPIs.downtimeRate > 5 ? 'warning' : 'success'}
          onClick={() => openKPI('dg-downtime', 'Taux d\'Indisponibilité', `${dgKPIs.downtimeRate}%`)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <KPICard label="Disponibilité" value={`${dgKPIs.availabilityRate}%`} icon={Activity} variant="success"
          onClick={() => openKPI('dg-availability', 'Taux de Disponibilité', `${dgKPIs.availabilityRate}%`)} />
        <KPICard label="Économies IA" value={`${(dgKPIs.savingsGenerated / 1000).toFixed(0)}K DZD`}
          icon={Zap} variant="ai" subtitle="Recommandations acceptées"
          onClick={() => openKPI('dg-savings', 'Économies Générées par IA', `${(dgKPIs.savingsGenerated / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Véhicules à risque" value={`${dgKPIs.highRiskPercent}%`}
          icon={AlertTriangle} variant={dgKPIs.highRiskPercent > 10 ? 'critical' : 'default'}
          subtitle="Risque >70%"
          onClick={() => openKPI('dg-high-risk', 'Véhicules à Risque Élevé', `${dgKPIs.highRiskPercent}%`)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <ChartPanel title="Coût Flotte (30j)" dataKey="cost" color={chartColors.cost} unit=" DZD" />
        <ChartPanel title="Disponibilité (30j)" dataKey="availability" color={chartColors.availability} unit="%" />
        <ChartPanel title="Taux Indisponibilité (30j)" dataKey="downtime" color={chartColors.downtime} unit="%" />
        <ChartPanel title="Santé Flotte (30j)" dataKey="health" color={chartColors.health} unit="%" />
      </div>

      {/* Executive Alerts */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Alertes Exécutives</h3>
        <div className="bg-critical/10 border border-critical/30 rounded-lg p-3 text-xs text-foreground/80 leading-relaxed">
          <strong className="text-critical">Coût flotte +6.2% ce mois.</strong> Cause principale : maintenance non planifiée (+340% par rapport au plan sur Route C-3). 3 interventions freinage d'urgence.
          <button className="ml-2 text-primary font-medium hover:underline">[Voir]</button>
        </div>
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-xs text-foreground/80 leading-relaxed">
          <strong className="text-warning">Disponibilité flotte en baisse (94% vs 95% cible).</strong> 3 véhicules critiques immobilisés. Durée moyenne de réparation +12%.
          <button className="ml-2 text-primary font-medium hover:underline">[Voir]</button>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ title, dataKey, color, unit }: { title: string; dataKey: string; color: string; unit: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h4 className="text-xs font-semibold text-muted-foreground mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} interval={6} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(240 18% 12%)', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }}
            labelStyle={{ color: 'hsl(220 20% 90%)' }}
            formatter={(v: number) => [`${typeof v === 'number' ? v.toFixed(1) : v}${unit}`, title]}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
