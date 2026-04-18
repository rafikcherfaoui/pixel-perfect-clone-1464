import { Truck, BarChart3, MapPin, DollarSign, Bot, Wrench, AlertTriangle, TrendingUp, Activity, PieChart, Fuel, Shield, LogOut } from 'lucide-react';
import { useApp, Module } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/mockData';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roleLabels: Record<Role, string> = {
  'fleet-manager': 'Gestionnaire de Flotte',
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
  const { role, module, setModule } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const modules = modulesByRole[role];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <Truck className="w-6 h-6" style={{ color: '#3fb950' }} />
          <span className="text-lg font-bold text-foreground tracking-tight">
            Next<span className="text-primary">Transit</span>
          </span>
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

      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            NT
          </div>
          <div className="text-xs">
            <p className="text-foreground font-medium">Admin</p>
            <p className="text-muted-foreground">{roleLabels[role]}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
