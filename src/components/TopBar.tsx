import { Search, Truck } from 'lucide-react';
import { useApp, Module } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import DateRangePicker from '@/components/DateRangePicker';
import type { Role } from '@/data/mockData';

const filters = ['Tous', 'Keystone', 'Earner', 'Specialist', 'Risque >70%', 'Alertes'];

const roleHeaders: Record<Role, { title: string; subtitle: string }> = {
  'fleet-manager': { title: 'Gestionnaire de Flotte', subtitle: 'Opérations en temps réel' },
  'dg': { title: 'Direction Générale', subtitle: 'Performance Stratégique' },
  'controlling': { title: 'Contrôleur de Gestion', subtitle: 'Analyse Financière' },
};

const navTabs: Record<Role, { id: Module; label: string }[]> = {
  'fleet-manager': [],
  'dg': [
    { id: 'dashboard', label: 'Tableau de Bord Exécutif' },
    { id: 'perf-flotte', label: 'Performance Flotte' },
    { id: 'analyse-couts', label: 'Analyse des Coûts' },
    { id: 'alertes-strategiques', label: 'Alertes Stratégiques' },
    { id: 'ai-commander', label: 'AI Commandant' },
  ],
  'controlling': [
    { id: 'dashboard', label: 'Tableau de Bord Financier' },
    { id: 'variance-couts', label: 'Variance des Coûts' },
    { id: 'tco-vehicule', label: 'TCO par Véhicule' },
    { id: 'analyse-carburant', label: "Carburant & Main d'Œuvre" },
    { id: 'roi-maintenance', label: 'ROI Maintenance' },
  ],
};


export default function TopBar() {
  const { role, module, setModule, searchQuery, setSearchQuery, activeFilter, setActiveFilter, vehicles } = useApp();
  const varianceCount = vehicles.filter(v => v.healthScore < 50 && v.active).length;
  const header = roleHeaders[role];

  const tabs = navTabs[role];

  return (
    <div className="shrink-0">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-5 gap-4">
        <div className="shrink-0 mr-2 flex items-center gap-2.5">
          <Truck className="w-6 h-6" style={{ color: '#3fb950' }} />
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">{header.title}</h1>
            <p className="text-[11px] text-muted-foreground">{header.subtitle}</p>
          </div>
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

        {role === 'fleet-manager' && (
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
        )}

        {role === 'dg' && (
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                Vue Stratégique — 30 derniers jours
              </span>
              <span className="text-[11px] text-muted-foreground ml-1">· {dateFr}</span>
            </div>
          </div>
        )}

        {role === 'controlling' && (
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Période d'analyse : Mois en cours</span>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-secondary text-foreground text-xs px-3 py-1.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m} {today.getFullYear()}</option>
              ))}
            </select>
          </div>
        )}
      </header>

      {tabs.length > 0 && (
        <nav className="h-11 border-b border-border bg-card/30 flex items-center px-5 gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const active = module === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setModule(tab.id)}
                className={cn(
                  "h-full px-4 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                  active
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
                style={active ? { borderBottomColor: '#388bfd', color: '#ffffff' } : { color: '#8b949e' }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
