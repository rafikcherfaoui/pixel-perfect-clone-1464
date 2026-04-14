import { Brain, Check, Clock, ArrowRight, Shield, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function AICommanderModule() {
  const { recommendations, updateRecommendation } = useApp();
  const totalSaved = recommendations
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + (r.failureCost - r.repairCost), 0);

  const pending = recommendations.filter(r => r.status === 'pending');
  const acted = recommendations.filter(r => r.status !== 'pending');

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ai/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-ai" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">AI-Commander</h2>
            <p className="text-xs text-muted-foreground">Recommandations intelligentes basées sur l'analyse prédictive</p>
          </div>
        </div>
        <div className="bg-ai/10 border border-ai/30 rounded-xl px-4 py-3 glow-ai">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Valeur Protégée</p>
          <p className="text-xl font-bold text-ai">{totalSaved.toLocaleString()} DZD</p>
        </div>
      </div>

      {/* Pending */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-warning" /> En attente ({pending.length})
        </h3>
        {pending.map(r => (
          <RecommendationCard key={r.id} rec={r} onAction={(status) => updateRecommendation(r.id, status)} />
        ))}
      </div>

      {/* Acted */}
      {acted.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" /> Traitées ({acted.length})
          </h3>
          {acted.map(r => (
            <div key={r.id} className={cn(
              "bg-card border rounded-xl p-4 opacity-60",
              r.status === 'approved' ? 'border-success/30' : r.status === 'escalated' ? 'border-critical/30' : 'border-warning/30'
            )}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-foreground">{r.action}</p>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                  r.status === 'approved' ? 'bg-success/20 text-success' :
                  r.status === 'escalated' ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'
                )}>
                  {r.status === 'approved' ? 'Approuvée' : r.status === 'escalated' ? 'Escaladée' : 'Différée'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ rec, onAction }: { rec: any; onAction: (s: 'approved' | 'deferred' | 'escalated') => void }) {
  return (
    <div className="bg-card border border-ai/30 rounded-xl p-5 space-y-4 glow-ai hover:border-ai/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 pr-4">
          <div className="flex items-center gap-2 flex-wrap">
            {rec.vehicleIds.map((id: string) => (
              <span key={id} className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">{id}</span>
            ))}
            {rec.crossDomain && (
              <span className="text-[10px] bg-ai/20 text-ai px-2 py-0.5 rounded flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> {rec.crossDomain}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground font-medium mt-2">{rec.action}</p>
        </div>
        <span className="bg-ai/20 text-ai text-xs px-3 py-1 rounded-full font-bold shrink-0">
          {rec.confidence}%
        </span>
      </div>

      {/* Signals */}
      <div className="flex flex-wrap gap-1.5">
        {rec.signals.map((s: string, i: number) => (
          <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded">{s}</span>
        ))}
      </div>

      {/* Financial */}
      <div className="flex items-center gap-4 text-xs">
        <div className="bg-success/10 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Coût réparation</p>
          <p className="text-success font-bold">{rec.repairCost.toLocaleString()} DZD</p>
        </div>
        <div className="bg-critical/10 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Coût panne</p>
          <p className="text-critical font-bold">{rec.failureCost.toLocaleString()} DZD</p>
        </div>
        <div className="bg-ai/10 rounded-lg px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Économie potentielle</p>
          <p className="text-ai font-bold">{(rec.failureCost - rec.repairCost).toLocaleString()} DZD</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={() => onAction('approved')}
          className="flex-1 bg-success/20 text-success text-xs py-2.5 rounded-lg hover:bg-success/30 transition-colors font-semibold flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5" /> Approuver
        </button>
        <button onClick={() => onAction('deferred')}
          className="flex-1 bg-warning/20 text-warning text-xs py-2.5 rounded-lg hover:bg-warning/30 transition-colors font-semibold">
          Différer
        </button>
        <button onClick={() => onAction('escalated')}
          className="flex-1 bg-critical/20 text-critical text-xs py-2.5 rounded-lg hover:bg-critical/30 transition-colors font-semibold flex items-center justify-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" /> Escalader
        </button>
      </div>
    </div>
  );
}
