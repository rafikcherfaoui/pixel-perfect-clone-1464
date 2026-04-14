import { AlertTriangle, Shield, DollarSign, Bot, Clock } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface StrategicAlert {
  id: string;
  priority: 'Critical' | 'High' | 'Medium';
  vehicleIds: string[];
  description: string;
  financialStake: number;
  status: 'En attente' | 'En cours' | 'Escaladé' | 'Traité';
}

export default function AlertesStrategiquesPage() {
  const { vehicles, recommendations, setKpiDrawer, updateRecommendation } = useApp();

  const alerts: StrategicAlert[] = useMemo(() => {
    const list: StrategicAlert[] = [];
    // From critical vehicles
    vehicles.filter(v => v.healthScore < 30 && v.active).forEach(v => {
      list.push({
        id: `alert-crit-${v.id}`, priority: 'Critical', vehicleIds: [v.id],
        description: `Véhicule ${v.id} — santé critique à ${v.healthScore}%. Composants défaillants: ${v.components.filter(c => c.rulPercent < 30).map(c => `${c.name} (${c.rulPercent}%)`).join(', ')}. Panne prédite sous ${Math.min(...v.components.map(c => c.daysRemaining))} jours.`,
        financialStake: recommendations.find(r => r.vehicleIds.includes(v.id))?.failureCost || 150000,
        status: 'En attente',
      });
    });
    // From high risk
    vehicles.filter(v => v.riskScore > 70 && v.healthScore >= 30 && v.active).forEach(v => {
      list.push({
        id: `alert-high-${v.id}`, priority: 'High', vehicleIds: [v.id],
        description: `Véhicule ${v.id} — risque panne élevé (${v.riskScore}%). Maintenance préventive recommandée. OBD: ${v.obd.faultCodes.length > 0 ? v.obd.faultCodes.join(', ') : 'aucun code actif'}.`,
        financialStake: Math.round(v.tco * 0.15),
        status: 'En attente',
      });
    });
    // From cost overruns
    list.push({
      id: 'alert-cost-c3', priority: 'High', vehicleIds: [],
      description: 'Route C-3 — dépassement budgétaire +18.3%. Maintenance non planifiée +340%. Conducteur D-047 freinage brusque +23%.',
      financialStake: 105000, status: 'En cours',
    });
    // Medium alerts
    vehicles.filter(v => v.healthScore >= 30 && v.healthScore < 60 && v.active).slice(0, 3).forEach(v => {
      list.push({
        id: `alert-med-${v.id}`, priority: 'Medium', vehicleIds: [v.id],
        description: `Véhicule ${v.id} — santé dégradée (${v.healthScore}%). Surveillance renforcée recommandée.`,
        financialStake: Math.round(v.maintenanceCostYTD * 0.3),
        status: 'En attente',
      });
    });
    return list;
  }, [vehicles, recommendations]);

  const criticalCount = alerts.filter(a => a.priority === 'Critical').length;
  const pendingCount = alerts.filter(a => a.status === 'En attente').length;
  const totalRisk = alerts.reduce((s, a) => s + a.financialStake, 0);
  const pendingRecs = recommendations.filter(r => r.status === 'pending').length;

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'dg' });
  };

  const priorityColor = (p: string) => p === 'Critical' ? 'text-critical' : p === 'High' ? 'text-warning' : 'text-muted-foreground';
  const priorityBg = (p: string) => p === 'Critical' ? 'bg-critical/20 text-critical' : p === 'High' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground';
  const statusBg = (s: string) => s === 'En attente' ? 'bg-warning/20 text-warning' : s === 'En cours' ? 'bg-primary/20 text-primary' : s === 'Escaladé' ? 'bg-critical/20 text-critical' : 'bg-success/20 text-success';

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Alertes Critiques" value={criticalCount} icon={AlertTriangle} variant="critical"
          onClick={() => openKPI('as-critical', 'Alertes Critiques Actives', `${criticalCount}`)} />
        <KPICard label="En Attente de Décision" value={pendingCount} icon={Clock} variant="warning"
          onClick={() => openKPI('as-pending', 'Alertes en Attente', `${pendingCount}`)} />
        <KPICard label="Coût Total à Risque" value={`${(totalRisk / 1000).toFixed(0)}K DZD`} icon={DollarSign}
          variant="critical" subtitle="Si aucune action"
          onClick={() => openKPI('as-risk', 'Coût Total à Risque', `${(totalRisk / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Recommandations IA" value={pendingRecs} icon={Bot} variant="ai"
          subtitle="En attente"
          onClick={() => openKPI('as-recs', 'Recommandations IA en Attente', `${pendingRecs}`)} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Toutes les Alertes Stratégiques</h3>
        {alerts.map(alert => (
          <div key={alert.id}
            className={cn("bg-card border rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/40 transition-all",
              alert.priority === 'Critical' ? 'border-critical/40' : alert.priority === 'High' ? 'border-warning/40' : 'border-border'
            )}
            onClick={() => setKpiDrawer({
              id: `alert-detail-${alert.id}`, title: `Alerte: ${alert.vehicleIds.join(', ') || 'Route C-3'}`,
              value: `${alert.financialStake.toLocaleString()} DZD`, role: 'dg',
            })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold", priorityBg(alert.priority))}>
                  {alert.priority}
                </span>
                {alert.vehicleIds.map(id => (
                  <span key={id} className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">{id}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold", statusBg(alert.status))}>
                  {alert.status}
                </span>
                <span className="text-xs font-bold text-critical">{alert.financialStake.toLocaleString()} DZD</span>
              </div>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{alert.description}</p>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); }} className="px-3 py-1.5 bg-primary/20 text-primary text-[10px] rounded-lg hover:bg-primary/30 font-semibold">
                Voir détails
              </button>
              <button onClick={(e) => { e.stopPropagation(); }} className="px-3 py-1.5 bg-critical/20 text-critical text-[10px] rounded-lg hover:bg-critical/30 font-semibold">
                Escalader
              </button>
              <button onClick={(e) => { e.stopPropagation(); }} className="px-3 py-1.5 bg-success/20 text-success text-[10px] rounded-lg hover:bg-success/30 font-semibold">
                Marquer traité
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
