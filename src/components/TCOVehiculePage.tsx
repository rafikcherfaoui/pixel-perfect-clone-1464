import { Truck, DollarSign, AlertTriangle, TrendingDown } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

export default function TCOVehiculePage() {
  const { vehicles, setKpiDrawer } = useApp();
  const [sortKey, setSortKey] = useState<'tco' | 'maintenanceCostYTD' | 'costPerKm'>('tco');
  const [sortAsc, setSortAsc] = useState(false);

  const avgTCO = Math.round(vehicles.reduce((s, v) => s + v.tco, 0) / vehicles.length);
  const mostExpensive = vehicles.reduce((m, v) => v.tco > m.tco ? v : m);
  const overTarget = vehicles.filter(v => v.tco > avgTCO * 1.2).length;
  const potentialSavings = vehicles.filter(v => v.tco > avgTCO * 1.2).reduce((s, v) => s + (v.tco - avgTCO), 0);

  const sorted = useMemo(() => {
    return [...vehicles].sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
  }, [vehicles, sortKey, sortAsc]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'controlling' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="TCO Moyen Flotte" value={`${(avgTCO / 1000).toFixed(0)}K DZD`} icon={Truck}
          onClick={() => openKPI('tco-avg', 'TCO Moyen Flotte', `${(avgTCO / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Véhicule + Coûteux" value={mostExpensive.id} icon={AlertTriangle}
          variant="critical" subtitle={`${(mostExpensive.tco / 1000).toFixed(0)}K DZD`}
          onClick={() => openKPI('tco-max', 'Véhicule le Plus Coûteux', `${mostExpensive.id} — ${(mostExpensive.tco / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Dépassant TCO Cible" value={overTarget} icon={DollarSign}
          variant={overTarget > 5 ? 'warning' : 'default'} subtitle=">20% au-dessus moyenne"
          onClick={() => openKPI('tco-over', 'Véhicules Dépassant TCO Cible', `${overTarget}`)} />
        <KPICard label="Économies Potentielles" value={`${(potentialSavings / 1000).toFixed(0)}K DZD`} icon={TrendingDown}
          variant="success"
          onClick={() => openKPI('tco-savings', 'Économies Potentielles', `${(potentialSavings / 1000).toFixed(0)}K DZD`)} />
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">TCO par Véhicule — Tous les 50 véhicules</h4>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Modèle</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Âge</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">Carburant YTD</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('maintenanceCostYTD')}>
                  Maint. YTD {sortKey === 'maintenanceCostYTD' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">Downtime YTD</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('tco')}>
                  TCO Total {sortKey === 'tco' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('costPerKm')}>
                  Coût/km {sortKey === 'costPerKm' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(v => {
                const ratio = v.tco / avgTCO;
                const colorClass = ratio > 1.2 ? 'text-critical' : ratio < 0.8 ? 'text-success' : 'text-foreground';
                const age = new Date().getFullYear() - parseInt(v.acquisitionDate.substring(0, 4));
                const fuelEstimate = Math.round(v.tco * 0.4);
                return (
                  <tr key={v.id}
                    className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer"
                    onClick={() => setKpiDrawer({
                      id: `tco-vehicle-${v.id}`, title: `TCO: ${v.id}`,
                      value: `${v.tco.toLocaleString()} DZD`, role: 'controlling',
                    })}
                  >
                    <td className="py-2 px-2 text-foreground font-semibold">{v.id}</td>
                    <td className="py-2 px-2 text-foreground">{v.type}</td>
                    <td className="py-2 px-2 text-foreground">{age} ans</td>
                    <td className="py-2 px-2 text-right text-foreground">{fuelEstimate.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-warning">{v.maintenanceCostYTD.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-critical">{v.downtimeCostYTD.toLocaleString()}</td>
                    <td className={cn("py-2 px-2 text-right font-bold", colorClass)}>{v.tco.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-foreground">{v.costPerKm}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        !v.active ? 'bg-muted text-muted-foreground' :
                        ratio > 1.2 ? 'bg-critical/20 text-critical' :
                        ratio < 0.8 ? 'bg-success/20 text-success' : 'bg-secondary text-secondary-foreground'
                      )}>
                        {!v.active ? 'Inactif' : ratio > 1.2 ? 'Coûteux' : ratio < 0.8 ? 'Optimal' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
