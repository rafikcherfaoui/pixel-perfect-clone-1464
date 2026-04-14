import { Shield, DollarSign, Check, Clock, TrendingUp } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function ROIMaintenancePage() {
  const { recommendations, setKpiDrawer } = useApp();

  const approved = recommendations.filter(r => r.status === 'approved');
  const deferred = recommendations.filter(r => r.status === 'deferred');
  const allActioned = recommendations.filter(r => r.status !== 'pending');

  const totalSaved = approved.reduce((s, r) => s + (r.failureCost - r.repairCost), 0);
  const totalAvoidedCost = recommendations.reduce((s, r) => s + (r.failureCost - r.repairCost), 0);
  const globalROI = approved.length > 0
    ? Math.round((approved.reduce((s, r) => s + (r.failureCost - r.repairCost), 0) / approved.reduce((s, r) => s + r.repairCost, 0)) * 100)
    : 0;

  const tableData = useMemo(() => {
    return recommendations.map(r => {
      const roi = Math.round(((r.failureCost - r.repairCost) / r.repairCost) * 100);
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 60));
      return {
        id: r.id,
        vehicleIds: r.vehicleIds,
        component: r.signals[0]?.split(' ')[0] || 'Général',
        repairCost: r.repairCost,
        failureCost: r.failureCost,
        roi,
        dateAction: baseDate.toISOString().split('T')[0],
        status: r.status,
        suiviDays: r.status === 'approved' ? `${Math.floor(Math.random() * 60 + 30)}j` : '—',
      };
    });
  }, [recommendations]);

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'controlling' });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="grid grid-cols-5 gap-3">
        <KPICard label="ROI Global IA" value={`${globalROI}%`} icon={TrendingUp}
          variant="success"
          onClick={() => openKPI('roi-global', 'ROI Global des Actions IA', `${globalROI}%`)} />
        <KPICard label="Total Économisé" value={`${(totalSaved / 1000).toFixed(0)}K DZD`} icon={DollarSign}
          variant="success"
          onClick={() => openKPI('roi-saved', 'Total DZD Économisé', `${(totalSaved / 1000).toFixed(0)}K DZD`)} />
        <KPICard label="Reco. Acceptées" value={approved.length} icon={Check}
          variant="success"
          onClick={() => openKPI('roi-approved', 'Recommandations Acceptées', `${approved.length}`)} />
        <KPICard label="Reco. Différées" value={deferred.length} icon={Clock}
          variant={deferred.length > 2 ? 'warning' : 'default'}
          onClick={() => openKPI('roi-deferred', 'Recommandations Différées', `${deferred.length}`)} />
        <KPICard label="Coût Évité Total" value={`${(totalAvoidedCost / 1000).toFixed(0)}K DZD`} icon={Shield}
          variant="ai" subtitle="Si toutes acceptées"
          onClick={() => openKPI('roi-avoided', 'Coût Évité Total', `${(totalAvoidedCost / 1000).toFixed(0)}K DZD`)} />
      </div>

      {/* Summary */}
      <div className="bg-ai/10 border border-ai/30 rounded-xl p-4 glow-ai">
        <p className="text-xs text-foreground/80 leading-relaxed">
          En acceptant <strong className="text-ai">{approved.length} recommandation(s)</strong>, vous avez évité{' '}
          <strong className="text-success">{totalSaved.toLocaleString()} DZD</strong> de pannes non planifiées ce mois.
          {deferred.length > 0 && (
            <> Il reste <strong className="text-warning">{deferred.length} recommandation(s) différée(s)</strong> représentant un coût potentiel évitable de{' '}
            <strong className="text-warning">{deferred.reduce((s, r) => s + (r.failureCost - r.repairCost), 0).toLocaleString()} DZD</strong>.</>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3">Recommandations IA — Suivi</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Véhicule</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Composant</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">Réparation</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">Panne Évitée</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-medium">ROI %</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">Suivi</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(r => (
                <tr key={r.id}
                  className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer"
                  onClick={() => setKpiDrawer({
                    id: `roi-rec-${r.id}`, title: `Recommandation: ${r.id}`,
                    value: `ROI: ${r.roi}%`, role: 'controlling',
                  })}
                >
                  <td className="py-2 px-2 text-foreground font-mono">{r.id}</td>
                  <td className="py-2 px-2 text-foreground font-semibold">{r.vehicleIds.join(', ')}</td>
                  <td className="py-2 px-2 text-foreground">{r.component}</td>
                  <td className="py-2 px-2 text-right text-foreground">{r.repairCost.toLocaleString()} DZD</td>
                  <td className="py-2 px-2 text-right text-success">{r.failureCost.toLocaleString()} DZD</td>
                  <td className={cn("py-2 px-2 text-right font-bold", r.roi > 200 ? 'text-success' : 'text-foreground')}>{r.roi}%</td>
                  <td className="py-2 px-2 text-foreground">{r.dateAction}</td>
                  <td className="py-2 px-2 text-center text-muted-foreground">{r.suiviDays}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      r.status === 'approved' ? 'bg-success/20 text-success' :
                      r.status === 'deferred' ? 'bg-warning/20 text-warning' :
                      r.status === 'escalated' ? 'bg-critical/20 text-critical' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {r.status === 'approved' ? 'Approuvée' : r.status === 'deferred' ? 'Différée' : r.status === 'escalated' ? 'Escaladée' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
