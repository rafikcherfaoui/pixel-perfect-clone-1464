import { DollarSign, Fuel, Wrench, Users, Clock } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { dgKPIs, controllingKPIs } from '@/data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const costCategories = [
  { name: 'Carburant', value: Math.round(dgKPIs.totalFleetCost * 0.4), color: '#f59e0b' },
  { name: 'Maintenance', value: Math.round(dgKPIs.totalFleetCost * 0.35), color: '#ef4444' },
  { name: 'Main d\'œuvre', value: Math.round(dgKPIs.totalFleetCost * 0.15), color: '#3b82f6' },
  { name: 'Immobilisation', value: Math.round(dgKPIs.totalFleetCost * 0.1), color: '#8b5cf6' },
];

const monthlyStackedData = Array.from({ length: 6 }, (_, i) => ({
  month: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'][i],
  carburant: Math.round(dgKPIs.totalFleetCost * 0.4 * (0.85 + Math.random() * 0.3) / 1000),
  maintenance: Math.round(dgKPIs.totalFleetCost * 0.35 * (0.8 + Math.random() * 0.4) / 1000),
  mainOeuvre: Math.round(dgKPIs.totalFleetCost * 0.15 * (0.9 + Math.random() * 0.2) / 1000),
  immobilisation: Math.round(dgKPIs.totalFleetCost * 0.1 * (0.7 + Math.random() * 0.6) / 1000),
}));

const routeCosts = [
  { route: 'Route A-1', km: 12400, totalCost: 420000, costPerKm: 34, budget: 400000 },
  { route: 'Route B-2', km: 12140, totalCost: 510000, costPerKm: 42, budget: 500000 },
  { route: 'Route C-3', km: 11720, totalCost: 680000, costPerKm: 58, budget: 575000 },
  { route: 'Route D-4', km: 12170, totalCost: 365000, costPerKm: 30, budget: 380000 },
  { route: 'Route E-5', km: 12030, totalCost: 445000, costPerKm: 37, budget: 450000 },
];

export default function AnalyseCoutsPage() {
  const { setKpiDrawer } = useApp();

  const fuelCost = costCategories[0].value;
  const maintCost = costCategories[1].value;
  const labourCost = costCategories[2].value;
  const downtimeCost = costCategories[3].value;

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'dg' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Coût Total Flotte" value={`${(dgKPIs.totalFleetCost / 1000).toFixed(0)}K DZD`} icon={DollarSign}
          variant={dgKPIs.totalFleetCost > dgKPIs.totalFleetBudget ? 'critical' : 'default'}
          subtitle={`Budget: ${(dgKPIs.totalFleetBudget / 1000).toFixed(0)}K`}
          onClick={() => openKPI('ac-total', 'Coût Total Flotte', `${(dgKPIs.totalFleetCost / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Carburant" value={`${(fuelCost / 1000).toFixed(0)}K DZD`} icon={Fuel}
          onClick={() => openKPI('ac-carburant', 'Coût Carburant (mois)', `${(fuelCost / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Maintenance" value={`${(maintCost / 1000).toFixed(0)}K DZD`} icon={Wrench}
          variant="warning"
          onClick={() => openKPI('ac-maintenance', 'Coût Maintenance (mois)', `${(maintCost / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Main d'œuvre" value={`${(labourCost / 1000).toFixed(0)}K DZD`} icon={Users}
          onClick={() => openKPI('ac-labour', 'Coût Main d\'œuvre (mois)', `${(labourCost / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Immobilisation" value={`${(downtimeCost / 1000).toFixed(0)}K DZD`} icon={Clock}
          variant="warning"
          onClick={() => openKPI('ac-downtime', 'Coût Immobilisation (mois)', `${(downtimeCost / 1000).toFixed(0)}K DZD`)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Stacked bar 6 months */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3">Répartition des Coûts (6 mois, en K DZD)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyStackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1c2333', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="carburant" name="Carburant" stackId="a" fill="#f59e0b" />
              <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#ef4444" />
              <Bar dataKey="mainOeuvre" name="Main d'œuvre" stackId="a" fill="#3b82f6" />
              <Bar dataKey="immobilisation" name="Immobilisation" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3">Breakdown Coûts ce Mois</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={costCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {costCategories.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1c2333', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }}
                formatter={(v: number) => [`${(v / 1000).toFixed(0)}K DZD`]} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route cost table */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">Coût par Route</h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Route</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">km</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Coût Total</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Coût/km</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Budget</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Variance</th>
            </tr>
          </thead>
          <tbody>
            {routeCosts.map(r => {
              const variance = ((r.totalCost - r.budget) / r.budget * 100);
              return (
                <tr key={r.route} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-2 px-3 text-foreground font-semibold">{r.route}</td>
                  <td className="py-2 px-3 text-right text-foreground">{r.km.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-foreground">{r.totalCost.toLocaleString()} DZD</td>
                  <td className="py-2 px-3 text-right text-foreground">{r.costPerKm} DZD</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">{r.budget.toLocaleString()} DZD</td>
                  <td className="py-2 px-3 text-right">
                    <span className={cn("font-bold", variance > 10 ? 'text-critical' : variance > 0 ? 'text-warning' : 'text-success')}>
                      {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
