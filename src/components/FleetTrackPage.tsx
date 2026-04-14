import { useMemo } from 'react';
import { MapPin, Navigation, Truck, Wifi } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import VehicleDrawer from '@/components/VehicleDrawer';

const statuses = ['En route', 'En maintenance', 'Idle'] as const;

function getVehicleStatus(v: { healthScore: number; active: boolean }): typeof statuses[number] {
  if (!v.active || v.healthScore < 30) return 'En maintenance';
  if (v.healthScore < 50) return 'Idle';
  return 'En route';
}

export default function FleetTrackPage() {
  const { vehicles, setSelectedVehicle, searchQuery } = useApp();

  const list = useMemo(() => {
    let l = vehicles;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      l = l.filter(v => v.id.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q) || v.route.toLowerCase().includes(q));
    }
    return l;
  }, [vehicles, searchQuery]);

  const counts = useMemo(() => ({
    'En route': list.filter(v => getVehicleStatus(v) === 'En route').length,
    'En maintenance': list.filter(v => getVehicleStatus(v) === 'En maintenance').length,
    'Idle': list.filter(v => getVehicleStatus(v) === 'Idle').length,
  }), [list]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">FleetTrack</h2>
        </div>
        <div className="flex gap-2">
          {statuses.map(s => (
            <span key={s} className={cn("px-3 py-1.5 rounded-full text-xs font-medium",
              s === 'En route' ? 'bg-success/20 text-success' :
              s === 'En maintenance' ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'
            )}>
              {s}: {counts[s]}
            </span>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-card border border-border rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-ai/5" />
        <div className="relative flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="w-8 h-8" />
          <span className="text-sm font-medium">Carte Fleet — {list.filter(v => v.active).length} véhicules actifs</span>
          <div className="flex gap-4 mt-2">
            {list.filter(v => v.active).slice(0, 8).map(v => (
              <button key={v.id} onClick={() => setSelectedVehicle(v)}
                className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 hover:scale-125 transition-transform cursor-pointer",
                  getVehicleStatus(v) === 'En route' ? 'bg-success/20 border-success text-success' :
                  getVehicleStatus(v) === 'En maintenance' ? 'bg-critical/20 border-critical text-critical' :
                  'bg-warning/20 border-warning text-warning'
                )}>
                <Navigation className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Véhicule</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Route</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Conducteur</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Vitesse</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">GPS</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {list.map(v => {
              const status = getVehicleStatus(v);
              const speed = status === 'En route' ? `${60 + Math.floor(Math.random() * 40)} km/h` : '0 km/h';
              return (
                <tr key={v.id} onClick={() => setSelectedVehicle(v)}
                  className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Truck className={cn("w-4 h-4",
                        status === 'En route' ? 'text-success' : status === 'En maintenance' ? 'text-critical' : 'text-warning'
                      )} />
                      <span className="text-foreground font-semibold">{v.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground">{v.route}</td>
                  <td className="py-3 px-4 text-foreground">{v.driver}</td>
                  <td className="py-3 px-4 text-foreground">{speed}</td>
                  <td className="py-3 px-4">
                    <Wifi className={cn("w-4 h-4", v.active ? 'text-success' : 'text-critical')} />
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold",
                      status === 'En route' ? 'bg-success/20 text-success' :
                      status === 'En maintenance' ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'
                    )}>{status}</span>
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
