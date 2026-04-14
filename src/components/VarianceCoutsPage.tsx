import { TrendingUp, AlertTriangle, DollarSign, MapPin } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { controllingKPIs } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const varianceCategories = [
  { category: 'Carburant', budget: 920000, reel: 980000 },
  { category: 'Maintenance', budget: 780000, reel: 857000 },
  { category: 'Main d\'œuvre', budget: 340000, reel: 365000 },
  { category: 'Immobilisation', budget: 260000, reel: 248000 },
];

const routeVariance = [
  { route: 'Route A-1', budget: 400000, reel: 420000 },
  { route: 'Route B-2', budget: 500000, reel: 510000 },
  { route: 'Route C-3', budget: 575000, reel: 680000 },
  { route: 'Route D-4', budget: 380000, reel: 365000 },
  { route: 'Route E-5', budget: 450000, reel: 445000 },
];

export default function VarianceCoutsPage() {
  const { setKpiDrawer } = useApp();

  const totalBudget = varianceCategories.reduce((s, c) => s + c.budget, 0);
  const totalReel = varianceCategories.reduce((s, c) => s + c.reel, 0);
  const globalVariance = ((totalReel - totalBudget) / totalBudget * 100);
  const worstCategory = varianceCategories.reduce((w, c) => {
    const v = (c.reel - c.budget) / c.budget;
    return v > ((w.reel - w.budget) / w.budget) ? c : w;
  });
  const overBudgetAmount = totalReel - totalBudget;
  const routesOver = routeVariance.filter(r => r.reel > r.budget).length;

  const chartData = varianceCategories.map(c => ({
    name: c.category, budget: c.budget / 1000, reel: c.reel / 1000,
  }));

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'controlling' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Variance Globale" value={`+${globalVariance.toFixed(1)}%`} icon={TrendingUp}
          variant="critical"
          onClick={() => openKPI('vc-global', 'Variance Globale vs Budget', `+${globalVariance.toFixed(1)}%`)} />
        <KPICard label="Catégorie + Déviante" value={worstCategory.category} icon={AlertTriangle}
          variant="warning" subtitle={`+${(((worstCategory.reel - worstCategory.budget) / worstCategory.budget) * 100).toFixed(1)}%`}
          onClick={() => openKPI('vc-worst', 'Catégorie la Plus Déviante', worstCategory.category)} />
        <KPICard label="Hors Budget" value={`${(overBudgetAmount / 1000).toFixed(0)}K DZD`} icon={DollarSign}
          variant="critical"
          onClick={() => openKPI('vc-amount', 'Montant Hors Budget', `${(overBudgetAmount / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Routes en Dépassement" value={routesOver} icon={MapPin}
          variant={routesOver > 2 ? 'warning' : 'default'}
          onClick={() => openKPI('vc-routes', 'Routes en Dépassement', `${routesOver}`)} />
      </div>

      {/* Grouped bar chart */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">Budget vs Réel par Catégorie (K DZD)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1c2333', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reel" name="Réel" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Variance drilldown table */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">Variance Détaillée par Catégorie</h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Catégorie</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Budget</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Réel</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Écart DZD</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Écart %</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {varianceCategories.map(c => {
              const ecart = c.reel - c.budget;
              const ecartPct = (ecart / c.budget * 100);
              const over = ecart > 0;
              return (
                <tr key={c.category}
                  className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer"
                  onClick={() => setKpiDrawer({
                    id: `vc-detail-${c.category}`, title: `Variance: ${c.category}`,
                    value: `${ecart > 0 ? '+' : ''}${ecart.toLocaleString()} DZD`, role: 'controlling',
                  })}
                >
                  <td className="py-2 px-3 text-foreground font-semibold">{c.category}</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">{c.budget.toLocaleString()} DZD</td>
                  <td className="py-2 px-3 text-right text-foreground">{c.reel.toLocaleString()} DZD</td>
                  <td className={cn("py-2 px-3 text-right font-bold", over ? 'text-critical' : 'text-success')}>
                    {over ? '+' : ''}{ecart.toLocaleString()} DZD
                  </td>
                  <td className={cn("py-2 px-3 text-right font-bold", over ? 'text-critical' : 'text-success')}>
                    {ecartPct > 0 ? '+' : ''}{ecartPct.toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold",
                      ecartPct > 5 ? 'bg-critical/20 text-critical' : ecartPct > 0 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                    )}>
                      {ecartPct > 5 ? 'Dépassement' : ecartPct > 0 ? 'Attention' : 'OK'}
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
