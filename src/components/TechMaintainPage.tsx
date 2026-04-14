import { useState, useMemo } from 'react';
import { Wrench, AlertTriangle, Clock, Filter } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import VehicleDrawer from '@/components/VehicleDrawer';

type TechFilter = 'all' | 'critical' | 'warning' | 'scheduled';

export default function TechMaintainPage() {
  const { vehicles, setSelectedVehicle, searchQuery } = useApp();
  const [filter, setFilter] = useState<TechFilter>('all');

  const filtered = useMemo(() => {
    let list = vehicles.filter(v => v.active);
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v => v.id.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q));
    }

    switch (filter) {
      case 'critical': return list.filter(v => v.healthScore < 30);
      case 'warning': return list.filter(v => v.healthScore >= 30 && v.healthScore < 60);
      case 'scheduled': return list.filter(v => v.maintenanceHistory.some(m => m.type === 'Préventif'));
      default: return list.filter(v => v.healthScore < 75 || v.obd.faultCodes.length > 0);
    }
  }, [vehicles, filter, searchQuery]);

  const obdStale = (check: string) => (Date.now() - new Date(check).getTime()) > 24 * 3600000;

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">TechMaintain</h2>
          <span className="text-xs text-muted-foreground">Alertes maintenance actives</span>
        </div>
        <div className="flex gap-1.5">
          {(['all', 'critical', 'warning', 'scheduled'] as TechFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}>
              {f === 'all' ? 'Tous' : f === 'critical' ? 'Critique' : f === 'warning' ? 'Attention' : 'Planifié'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Véhicule</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Santé</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Codes Défaut</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Composants Critiques</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dernier OBD</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => {
              const critComps = v.components.filter(c => c.rulPercent < 30);
              const isStale = obdStale(v.obd.lastCheck);
              return (
                <tr key={v.id} onClick={() => setSelectedVehicle(v)}
                  className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-foreground font-semibold">{v.id}</span>
                    <span className="text-muted-foreground ml-2">{v.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("font-bold",
                      v.healthScore < 30 ? 'text-critical' : v.healthScore < 60 ? 'text-warning' : 'text-success'
                    )}>{v.healthScore}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {v.obd.faultCodes.length > 0 ? v.obd.faultCodes.map(c => (
                        <span key={c} className="bg-critical/20 text-critical px-1.5 py-0.5 rounded font-mono text-[10px]">{c}</span>
                      )) : <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {critComps.length > 0 ? critComps.map(c => (
                        <div key={c.name} className="flex items-center gap-2">
                          <span className="text-foreground">{c.name}</span>
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-critical rounded-full" style={{ width: `${c.rulPercent}%` }} />
                          </div>
                          <span className="text-critical font-semibold text-[10px]">{c.rulPercent}%</span>
                        </div>
                      )) : <span className="text-muted-foreground">OK</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-foreground", isStale && "text-critical")}>
                      {new Date(v.obd.lastCheck).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </span>
                    {isStale && <span className="ml-1 text-critical text-[10px]">⚠ &gt;24h</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold",
                      v.healthScore < 30 ? 'bg-critical/20 text-critical' :
                      v.healthScore < 60 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                    )}>
                      {v.healthScore < 30 ? 'Critique' : v.healthScore < 60 ? 'Attention' : 'Normal'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <VehicleDrawer />
    </div>
  );
}
