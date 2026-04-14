import { Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/mockData';

const filters = ['Tous', 'Keystone', 'Earner', 'Specialist', 'Risque >70%', 'Alertes'];

const roleHeaders: Record<Role, { title: string; subtitle: string }> = {
  'fleet-manager': { title: 'Gestionnaire de Flotte', subtitle: 'Opérations en temps réel' },
  'dg': { title: 'Direction Générale', subtitle: 'Performance Stratégique' },
  'controlling': { title: 'Contrôleur de Gestion', subtitle: 'Analyse Financière' },
};

export default function TopBar() {
  const { role, searchQuery, setSearchQuery, activeFilter, setActiveFilter, vehicles } = useApp();
  const varianceCount = vehicles.filter(v => v.healthScore < 50 && v.active).length;
  const header = roleHeaders[role];

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-5 gap-4 shrink-0">
      <div className="shrink-0 mr-2">
        <h1 className="text-sm font-bold text-foreground leading-tight">{header.title}</h1>
        <p className="text-[11px] text-muted-foreground">{header.subtitle}</p>
      </div>

      <div className="w-px h-8 bg-border shrink-0" />

      <div className="relative w-56">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary text-sm text-foreground pl-9 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {f}
          </button>
        ))}
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/20 text-warning">
          Variances: {varianceCount}
        </span>
      </div>
    </header>
  );
}
