import { X, Truck, AlertTriangle, Clock, Wrench, DollarSign, Brain, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { Vehicle } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function RULBar({ name, percent }: { name: string; percent: number }) {
  const color = percent >= 75 ? 'bg-success' : percent >= 50 ? 'bg-warning' : percent >= 30 ? 'bg-orange-500' : 'bg-critical';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{name}</span>
        <span className={cn("font-semibold", percent < 30 ? 'text-critical' : percent < 50 ? 'text-warning' : 'text-foreground')}>{percent}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function VehicleDrawer() {
  const { selectedVehicle: v, setSelectedVehicle, recommendations } = useApp();

  if (!v) return null;
  const recs = recommendations.filter(r => r.vehicleIds.includes(v.id));
  const obdStale = (Date.now() - new Date(v.obd.lastCheck).getTime()) > 24 * 3600000;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-[480px] bg-card border-l border-border z-50 overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{v.id}</h2>
              <p className="text-xs text-muted-foreground">{v.type} — {v.classification}</p>
            </div>
          </div>
          <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Identity */}
          <section className="bg-secondary/50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Truck className="w-4 h-4" /> Identité</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground ml-1">{v.type}</span></div>
              <div><span className="text-muted-foreground">Classification:</span> <span className="text-foreground ml-1">{v.classification}</span></div>
              <div><span className="text-muted-foreground">Acquisition:</span> <span className="text-foreground ml-1">{v.acquisitionDate}</span></div>
              <div><span className="text-muted-foreground">Conducteur:</span> <span className="text-foreground ml-1">{v.driver}</span></div>
              <div><span className="text-muted-foreground">Route:</span> <span className="text-foreground ml-1">{v.route}</span></div>
            </div>
          </section>

          {/* Health + Risk */}
          <section className="grid grid-cols-2 gap-3">
            <div className={cn("rounded-xl p-4 border text-center", v.healthScore < 30 ? 'border-critical/40 glow-critical' : 'border-border')}>
              <p className="text-xs text-muted-foreground mb-1">Santé</p>
              <p className={cn("text-3xl font-bold", v.healthScore < 30 ? 'text-critical' : v.healthScore < 50 ? 'text-warning' : 'text-success')}>{v.healthScore}%</p>
            </div>
            <div className={cn("rounded-xl p-4 border text-center", v.riskScore > 70 ? 'border-critical/40 glow-critical' : 'border-border')}>
              <p className="text-xs text-muted-foreground mb-1">Risque panne</p>
              <p className={cn("text-3xl font-bold", v.riskScore > 70 ? 'text-critical' : v.riskScore > 50 ? 'text-warning' : 'text-success')}>{v.riskScore}%</p>
            </div>
          </section>

          {/* RUL */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Wrench className="w-4 h-4" /> RUL par Composant</h3>
            {v.components.map(c => (
              <RULBar key={c.name} name={`${c.name} (${c.daysRemaining}j)`} percent={c.rulPercent} />
            ))}
          </section>

          {/* OBD */}
          <section className="bg-secondary/50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Données OBD
              {obdStale && <span className="text-[10px] bg-critical/20 text-critical px-2 py-0.5 rounded-full ml-auto">⚠ &gt;24h</span>}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Temp. moteur:</span> <span className="text-foreground ml-1">{v.obd.engineTemp}°C</span></div>
              <div><span className="text-muted-foreground">RPM:</span> <span className="text-foreground ml-1">{v.obd.rpm}</span></div>
              <div><span className="text-muted-foreground">Charge:</span> <span className="text-foreground ml-1">{v.obd.engineLoad}%</span></div>
              <div><span className="text-muted-foreground">Check:</span> <span className="text-foreground ml-1">{new Date(v.obd.lastCheck).toLocaleString('fr-FR')}</span></div>
            </div>
            {v.obd.faultCodes.length > 0 && (
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {v.obd.faultCodes.map(code => (
                  <span key={code} className="text-[10px] bg-critical/20 text-critical px-2 py-0.5 rounded font-mono">{code}</span>
                ))}
              </div>
            )}
          </section>

          {/* Maintenance history */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Historique Maintenance</h3>
            <div className="space-y-1.5">
              {v.maintenanceHistory.map((m, i) => (
                <div key={i} className="bg-secondary/50 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-foreground font-medium">{m.type}</span>
                    <span className="text-muted-foreground ml-2">{m.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground">{m.cost.toLocaleString()} DZD</span>
                    <span className="text-muted-foreground ml-2">{m.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Financial */}
          <section className="bg-secondary/50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Financier</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">TCO annuel:</span> <span className="text-foreground ml-1">{v.tco.toLocaleString()} DZD</span></div>
              <div><span className="text-muted-foreground">Maint. YTD:</span> <span className="text-foreground ml-1">{v.maintenanceCostYTD.toLocaleString()} DZD</span></div>
              <div><span className="text-muted-foreground">Downtime YTD:</span> <span className="text-foreground ml-1">{v.downtimeCostYTD.toLocaleString()} DZD</span></div>
              <div><span className="text-muted-foreground">Coût/km:</span> <span className="text-foreground ml-1">{v.costPerKm} DZD</span></div>
            </div>
          </section>

          {/* WHY */}
          {v.whyCause && (
            <section className="bg-critical/10 border border-critical/30 rounded-xl p-4 space-y-1">
              <h3 className="text-sm font-semibold text-critical flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Pourquoi ?</h3>
              <p className="text-xs text-foreground/80 leading-relaxed">{v.whyCause}</p>
            </section>
          )}

          {/* AI Recommendations */}
          {recs.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-ai flex items-center gap-2"><Brain className="w-4 h-4" /> Recommandations IA</h3>
              {recs.map(r => (
                <div key={r.id} className="bg-ai/10 border border-ai/30 rounded-xl p-4 space-y-3 glow-ai">
                  <p className="text-xs text-foreground font-medium">{r.action}</p>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="bg-ai/20 text-ai px-2 py-0.5 rounded-full font-semibold">Confiance: {r.confidence}%</span>
                    <span className="text-success">Réparation: {r.repairCost.toLocaleString()} DZD</span>
                    <span className="text-critical">Panne: {r.failureCost.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-success/20 text-success text-xs py-2 rounded-lg hover:bg-success/30 transition-colors font-medium flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> Approuver
                    </button>
                    <button className="flex-1 bg-warning/20 text-warning text-xs py-2 rounded-lg hover:bg-warning/30 transition-colors font-medium">
                      Différer
                    </button>
                    <button className="flex-1 bg-critical/20 text-critical text-xs py-2 rounded-lg hover:bg-critical/30 transition-colors font-medium flex items-center justify-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Escalader
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
