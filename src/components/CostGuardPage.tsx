import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const routeCosts = [
  { route: 'Route A-1', totalCost: 420000, costPerKm: 35, budget: 400000 },
  { route: 'Route B-2', totalCost: 510000, costPerKm: 42, budget: 500000 },
  { route: 'Route C-3', totalCost: 680000, costPerKm: 58, budget: 575000 },
  { route: 'Route D-4', totalCost: 365000, costPerKm: 30, budget: 380000 },
  { route: 'Route E-5', totalCost: 445000, costPerKm: 37, budget: 450000 },
];

export default function CostGuardPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const route = routeCosts.find(r => r.route === selectedRoute);

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <DollarSign className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">CostGuard</h2>
        <span className="text-xs text-muted-foreground">Coûts par route vs budget</span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Route</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Coût Total</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Coût/km</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Budget</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Variance</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {routeCosts.map(r => {
              const variance = ((r.totalCost - r.budget) / r.budget * 100);
              const over = variance > 0;
              const critical = variance > 10;
              return (
                <tr key={r.route}
                  onClick={() => setSelectedRoute(r.route === selectedRoute ? null : r.route)}
                  className={cn("border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors",
                    selectedRoute === r.route && "bg-secondary/50"
                  )}>
                  <td className="py-3 px-4 text-foreground font-semibold">{r.route}</td>
                  <td className="py-3 px-4 text-right text-foreground">{r.totalCost.toLocaleString()} DZD</td>
                  <td className="py-3 px-4 text-right text-foreground">{r.costPerKm} DZD</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{r.budget.toLocaleString()} DZD</td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn("font-bold flex items-center justify-end gap-1",
                      critical ? 'text-critical' : over ? 'text-warning' : 'text-success'
                    )}>
                      {over ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {over ? '+' : ''}{variance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold",
                      critical ? 'bg-critical/20 text-critical' : over ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                    )}>
                      {critical ? 'Dépassement' : over ? 'Attention' : 'OK'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Route drilldown */}
      {route && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Détail — {route.route}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase">Carburant</p>
              <p className="text-lg font-bold text-foreground">{Math.round(route.totalCost * 0.4).toLocaleString()} DZD</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase">Maintenance</p>
              <p className="text-lg font-bold text-warning">{Math.round(route.totalCost * 0.35).toLocaleString()} DZD</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase">Main d'œuvre</p>
              <p className="text-lg font-bold text-foreground">{Math.round(route.totalCost * 0.25).toLocaleString()} DZD</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {((route.totalCost - route.budget) / route.budget * 100) > 10 && (
              <div className="bg-critical/10 border-l-2 border-critical p-3 rounded-r-lg mt-2">
                <p className="text-critical font-semibold mb-1">POURQUOI CE DÉPASSEMENT ?</p>
                <p className="text-foreground/80">
                  Maintenance non planifiée (+340% vs plan) sur cette route. 3 interventions freinage d'urgence.
                  Conducteur D-047 freinage brusque (+23% au-dessus de la moyenne).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
