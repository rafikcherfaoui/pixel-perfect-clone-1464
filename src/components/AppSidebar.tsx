import { Truck, BarChart3, MapPin, DollarSign, Bot, ChevronDown, Wrench, AlertTriangle, TrendingUp, Activity, PieChart, Fuel, Shield } from 'lucide-react';
import { useApp, Module } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/mockData';
import { LucideIcon } from 'lucide-react';

const roleLabels: Record<Role, string> = {
  'fleet-manager': 'Fleet Manager',
  'dg': 'Direction Générale',
  'controlling': 'Contrôleur de Gestion',
};

interface ModuleItem {
  id: Module;
  label: string;
  icon: LucideIcon;
}

const modulesByRole: Record<Role, ModuleItem[]> = {
  'fleet-manager': [
    { id: 'dashboard', label: 'Dashboard (Heatmap)', icon: BarChart3 },
    { id: 'techmaintain', label: 'TechMaintain', icon: Wrench },
    { id: 'fleettrack', label: 'FleetTrack', icon: MapPin },
    { id: 'costguard', label: 'CostGuard', icon: DollarSign },
    { id: 'ai-commander', label: 'AI Commandant', icon: Bot },
  ],
  'dg': [
    { id: 'dashboard', label: 'Tableau de Bord Exécutif', icon: BarChart3 },
    { id: 'perf-flotte', label: 'Performance Flotte', icon: Activity },
    { id: 'analyse-couts', label: 'Analyse des Coûts', icon: TrendingUp },
    { id: 'alertes-strategiques', label: 'Alertes Stratégiques', icon: AlertTriangle },
    { id: 'ai-commander', label: 'AI Commandant', icon: Bot },
  ],
  'controlling': [
    { id: 'dashboard', label: 'Tableau de Bord Financier', icon: PieChart },
    { id: 'variance-couts', label: 'Variance des Coûts', icon: TrendingUp },
    { id: 'tco-vehicule', label: 'TCO par Véhicule', icon: Truck },
    { id: 'analyse-carburant', label: 'Carburant & Main d\'Œuvre', icon: Fuel },
    { id: 'roi-maintenance', label: 'ROI Maintenance', icon: Shield },
  ],
};

export default function AppSidebar() {
  const { role, setRole, module, setModule } = useApp();
  const modules = modulesByRole[role];

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Next<span className="text-primary">Transit</span>
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 block font-medium">
          Rôle actif
        </label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full appearance-none bg-secondary text-foreground text-sm px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer pr-8"
          >
            {Object.entries(roleLabels).map(([val, label]) => (
              <option key={val} value={val} className="bg-card">{label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground px-3 mb-2 font-medium">
          Modules
        </p>
        {modules.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setModule(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
              module === id
                ? "bg-primary/15 text-primary font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            NT
          </div>
          <div className="text-xs">
            <p className="text-foreground font-medium">Admin</p>
            <p className="text-muted-foreground">{roleLabels[role]}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
