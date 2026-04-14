import { Fuel, Users, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { controllingKPIs } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const fuelByRouteDriver = [
  { route: 'Route A-1', driver: 'D-003', km: 4200, litres: 580, cost: 58000, l100km: 13.8 },
  { route: 'Route A-1', driver: 'D-012', km: 4100, litres: 540, cost: 54000, l100km: 13.2 },
  { route: 'Route B-2', driver: 'D-008', km: 4500, litres: 680, cost: 68000, l100km: 15.1 },
  { route: 'Route B-2', driver: 'D-019', km: 4300, litres: 610, cost: 61000, l100km: 14.2 },
  { route: 'Route C-3', driver: 'D-007', km: 3800, litres: 720, cost: 72000, l100km: 18.9 },
  { route: 'Route C-3', driver: 'D-014', km: 3900, litres: 690, cost: 69000, l100km: 17.7 },
  { route: 'Route D-4', driver: 'D-022', km: 4400, litres: 560, cost: 56000, l100km: 12.7 },
  { route: 'Route E-5', driver: 'D-031', km: 4100, litres: 590, cost: 59000, l100km: 14.4 },
];

const labourData = [
  { name: 'D-007', role: 'Chauffeur', heuresNorm: 176, heuresSup: 24, cost: 128000, anomaly: true },
  { name: 'D-014', role: 'Chauffeur', heuresNorm: 176, heuresSup: 18, cost: 118000, anomaly: true },
  { name: 'D-003', role: 'Chauffeur', heuresNorm: 176, heuresSup: 8, cost: 102000, anomaly: false },
  { name: 'Mechanic A', role: 'Mécanicien', heuresNorm: 160, heuresSup: 32, cost: 145000, anomaly: true },
  { name: 'Mechanic B', role: 'Mécanicien', heuresNorm: 160, heuresSup: 12, cost: 115000, anomaly: false },
  { name: 'Mechanic C', role: 'Mécanicien', heuresNorm: 160, heuresSup: 8, cost: 108000, anomaly: false },
  { name: 'D-022', role: 'Chauffeur', heuresNorm: 176, heuresSup: 4, cost: 98000, anomaly: false },
  { name: 'Mechanic D', role: 'Mécanicien', heuresNorm: 160, heuresSup: 16, cost: 120000, anomaly: false },
];

export default function CarburantMainOeuvrePage() {
  const { setKpiDrawer } = useApp();

  const totalFuel = fuelByRouteDriver.reduce((s, r) => s + r.cost, 0);
  const avgCostKm = Math.round(totalFuel / fuelByRouteDriver.reduce((s, r) => s + r.km, 0));
  const totalLabour = controllingKPIs.labourCost.drivers + controllingKPIs.labourCost.mechanics + controllingKPIs.labourCost.overtime;
  const totalOvertime = labourData.reduce((s, l) => s + l.heuresSup, 0);
  const worstFuelDriver = fuelByRouteDriver.reduce((w, r) => r.l100km > w.l100km ? r : w);
  const avgL100km = fuelByRouteDriver.reduce((s, r) => s + r.l100km, 0) / fuelByRouteDriver.length;

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'controlling' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Carburant Total" value={`${(totalFuel / 1000).toFixed(0)}K DZD`} icon={Fuel}
          onClick={() => openKPI('cm-fuel', 'Coût Carburant Total', `${(totalFuel / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Coût/km Carburant" value={`${avgCostKm} DZD`} icon={DollarSign}
          onClick={() => openKPI('cm-costkmfuel', 'Coût/km Carburant', `${avgCostKm} DZD`)} />
        <KPICard label="Main d'œuvre Total" value={`${(totalLabour / 1000).toFixed(0)}K DZD`} icon={Users}
          onClick={() => openKPI('cm-labour', 'Coût Main d\'œuvre Total', `${(totalLabour / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Heures Sup." value={`${totalOvertime}h`} icon={Clock}
          variant={totalOvertime > 80 ? 'warning' : 'default'}
          subtitle={`${controllingKPIs.labourCost.overtime.toLocaleString()} DZD`}
          onClick={() => openKPI('cm-overtime', 'Heures Supplémentaires', `${totalOvertime}h — ${controllingKPIs.labourCost.overtime.toLocaleString()} DZD`)} />
        <KPICard label="Conducteur + Coûteux" value={worstFuelDriver.driver} icon={AlertTriangle}
          variant="critical" subtitle={`${worstFuelDriver.l100km} L/100km`}
          onClick={() => openKPI('cm-worstdriver', 'Conducteur le + Coûteux en Carburant', `${worstFuelDriver.driver} — ${worstFuelDriver.l100km} L/100km`)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fuel section */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Fuel className="w-3.5 h-3.5" /> Carburant par Route & Conducteur</h4>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Route</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Conducteur</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">km</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">Litres</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">Coût</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">L/100km</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">vs Moy</th>
                </tr>
              </thead>
              <tbody>
                {fuelByRouteDriver.map((r, i) => {
                  const vsMoy = ((r.l100km - avgL100km) / avgL100km * 100);
                  return (
                    <tr key={i}
                      className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer"
                      onClick={() => setKpiDrawer({
                        id: `cm-fuelrow-${r.driver}`, title: `Carburant: ${r.driver} (${r.route})`,
                        value: `${r.l100km} L/100km`, role: 'controlling',
                      })}
                    >
                      <td className="py-2 px-2 text-foreground">{r.route}</td>
                      <td className="py-2 px-2 text-foreground font-semibold">{r.driver}</td>
                      <td className="py-2 px-2 text-right text-foreground">{r.km.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-foreground">{r.litres}</td>
                      <td className="py-2 px-2 text-right text-foreground">{r.cost.toLocaleString()}</td>
                      <td className={cn("py-2 px-2 text-right font-bold", r.l100km > avgL100km * 1.15 ? 'text-critical' : 'text-foreground')}>
                        {r.l100km}
                      </td>
                      <td className={cn("py-2 px-2 text-right font-bold text-[10px]", vsMoy > 10 ? 'text-critical' : vsMoy < -5 ? 'text-success' : 'text-foreground')}>
                        {vsMoy > 0 ? '+' : ''}{vsMoy.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Labour section */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Main d'Œuvre</h4>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Nom</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Rôle</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">H. Norm.</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">H. Sup.</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">Coût Total</th>
                  <th className="text-center py-2 px-2 text-muted-foreground font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {labourData.map((l, i) => (
                  <tr key={i}
                    className={cn("border-b border-border/50 hover:bg-secondary/30 cursor-pointer", l.anomaly && 'bg-critical/5')}
                    onClick={() => setKpiDrawer({
                      id: `cm-labourrow-${l.name}`, title: `Main d'œuvre: ${l.name}`,
                      value: `${l.cost.toLocaleString()} DZD`, role: 'controlling',
                    })}
                  >
                    <td className="py-2 px-2 text-foreground font-semibold">{l.name}</td>
                    <td className="py-2 px-2 text-foreground">{l.role}</td>
                    <td className="py-2 px-2 text-right text-foreground">{l.heuresNorm}h</td>
                    <td className={cn("py-2 px-2 text-right font-bold", l.heuresSup > 16 ? 'text-critical' : 'text-foreground')}>
                      {l.heuresSup}h
                    </td>
                    <td className="py-2 px-2 text-right text-foreground">{l.cost.toLocaleString()}</td>
                    <td className="py-2 px-2 text-center">
                      {l.anomaly ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-critical/20 text-critical">Anomalie</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/20 text-success">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
