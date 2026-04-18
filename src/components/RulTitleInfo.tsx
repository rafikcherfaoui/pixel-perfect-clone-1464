import { useState, useRef } from 'react';
import { Info } from 'lucide-react';

export default function RulTitleInfo() {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const onEnter = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), 150);
  };
  const onLeave = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span className="relative inline-flex items-center gap-1" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span className="cursor-help">Top 10 RUL Critiques</span>
      <Info className="w-3.5 h-3.5 text-muted-foreground" />
      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-[300px] max-w-[300px] p-3 rounded-lg shadow-2xl z-50 text-[11px] space-y-2"
          style={{ backgroundColor: '#1c2333', border: '1px solid #388bfd', color: '#e6edf3' }}
        >
          <p className="font-bold text-sm">RUL — Remaining Useful Life</p>
          <p className="leading-relaxed opacity-90">
            Le RUL mesure la durée de vie restante estimée d'un composant avant d'atteindre son seuil de défaillance critique.
          </p>
          <p className="font-semibold pt-1">3 niveaux de calcul :</p>

          <div>
            <p className="opacity-90">① Dégradation linéaire (utilisé dans ce prototype) :</p>
            <code className="block mt-1 p-1.5 rounded text-[10px] font-mono" style={{ backgroundColor: '#0d1117', color: '#79c0ff' }}>
              RUL = (Seuil_critique - Valeur_actuelle) / Taux_de_dégradation
            </code>
          </div>

          <div>
            <p className="opacity-90">② Modèle de Weibull (standard industriel) :</p>
            <code className="block mt-1 p-1.5 rounded text-[10px] font-mono" style={{ backgroundColor: '#0d1117', color: '#79c0ff' }}>
              F(t) = 1 - exp[-(t/η)^β]
            </code>
            <p className="opacity-75 mt-1 text-[10px]">β = 2.1 pour composants d'usure (flottes diesel algériennes)</p>
          </div>

          <div>
            <p className="opacity-90">③ Machine Learning — LSTM / Random Forest (évolution future) :</p>
            <p className="opacity-75 mt-1 text-[10px]">
              Séries temporelles OBD : température, pression, régime, vibrations, codes erreur historiques.
              Approche utilisée par Samsara et Geotab.
            </p>
          </div>
        </div>
      )}
    </span>
  );
}
