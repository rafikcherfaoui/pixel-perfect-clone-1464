import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RulHoverCardProps {
  vehicleId: string;
  component: string;
  rulPercent: number;
  daysRemaining: number;
}

export default function RulHoverCard({ vehicleId, component, rulPercent, daysRemaining }: RulHoverCardProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const urgency =
    rulPercent < 20
      ? { color: '#f85149', label: '🔴 Critique', desc: 'Intervention immédiate' }
      : rulPercent < 35
      ? { color: '#fb923c', label: '🟠 Urgent', desc: 'Planifier sous 7 jours' }
      : { color: '#fbbf24', label: '🟡 Surveillance', desc: 'RUL à surveiller' };

  // Mock concrete numbers
  const dailyRevenue = 150000;
  const failureProb = Math.min(0.95, (100 - rulPercent) / 100 + 0.05);
  const impact = Math.round(daysRemaining * dailyRevenue * failureProb);
  const riskPct = Math.round(failureProb * 100);

  const onEnter = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), 200);
  };
  const onLeave = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="space-y-1 cursor-pointer hover:bg-secondary/40 rounded-md p-1.5 -m-1.5 transition-colors">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground font-medium">{vehicleId}</span>
          <span className="text-muted-foreground">{component}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${rulPercent}%`, backgroundColor: urgency.color }} />
          </div>
          <span className="text-[10px] font-bold w-8 text-right" style={{ color: urgency.color }}>
            {rulPercent}%
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground">{daysRemaining} jours restants</p>
      </div>

      {open && (
        <div
          className={cn(
            'absolute right-full top-0 mr-3 w-80 p-4 rounded-lg shadow-2xl z-50 text-xs space-y-3',
          )}
          style={{ backgroundColor: '#1c2333', border: `1px solid ${urgency.color}` }}
        >
          <div className="pb-2 border-b border-border">
            <h4 className="text-sm font-bold text-foreground">
              {vehicleId} — {component}
            </h4>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">RUL — Remaining Useful Life</p>
            <p className="text-muted-foreground leading-relaxed">
              Durée de vie restante estimée avant atteinte du seuil de défaillance.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">Calcul appliqué</p>
            <p className="text-muted-foreground">Méthode : Dégradation linéaire</p>
            <code className="block mt-1 p-2 bg-secondary rounded text-[10px] text-primary font-mono">
              RUL = (Seuil_critique - Valeur_actuelle) / Taux_de_dégradation
            </code>
            <p className="text-muted-foreground mt-2">
              RUL actuel : <span className="text-foreground font-semibold">{rulPercent}%</span> — {daysRemaining} jours restants
            </p>
            <p className="text-muted-foreground">
              Seuil critique : atteint dans {daysRemaining} jours si usage normal
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">Risque associé</p>
            <p className="text-muted-foreground">Probabilité de défaillance (Weibull) :</p>
            <code className="block mt-1 p-2 bg-secondary rounded text-[10px] text-primary font-mono">
              F(t) = 1 - exp[-(t/η)^β], β = 2.1
            </code>
            <p className="text-muted-foreground mt-2">
              Risque calculé : <span className="font-semibold" style={{ color: urgency.color }}>{riskPct}%</span>
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">Impact financier</p>
            <p className="text-muted-foreground">Impact si non traité :</p>
            <p className="text-foreground mt-1">
              {daysRemaining} j × {dailyRevenue.toLocaleString('fr-FR')} DZD × {riskPct}% ={' '}
              <span className="font-bold" style={{ color: urgency.color }}>
                {impact.toLocaleString('fr-FR')} DZD
              </span>
            </p>
          </div>

          <div
            className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-center"
            style={{ backgroundColor: `${urgency.color}20`, color: urgency.color }}
          >
            {urgency.label} — {urgency.desc}
          </div>
        </div>
      )}
    </div>
  );
}
