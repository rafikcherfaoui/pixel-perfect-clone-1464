import React, { createContext, useContext, useState, useMemo } from 'react';
import { Role, Vehicle, AIRecommendation, generateVehicles, generateRecommendations } from '@/data/mockData';

export type Module = 
  | 'dashboard' | 'techmaintain' | 'fleettrack' | 'costguard' | 'ai-commander'
  | 'perf-flotte' | 'analyse-couts' | 'alertes-strategiques'
  | 'variance-couts' | 'tco-vehicule' | 'analyse-carburant' | 'roi-maintenance';

interface KPIDrawerData {
  id: string;
  title: string;
  value: string;
  role: Role;
}

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  module: Module;
  setModule: (m: Module) => void;
  vehicles: Vehicle[];
  recommendations: AIRecommendation[];
  updateRecommendation: (id: string, status: AIRecommendation['status']) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  kpiDrawer: KPIDrawerData | null;
  setKpiDrawer: (d: KPIDrawerData | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('fleet-manager');
  const [module, setModule] = useState<Module>('dashboard');
  const [vehicles] = useState(() => generateVehicles());
  const [recommendations, setRecommendations] = useState(() => generateRecommendations());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kpiDrawer, setKpiDrawer] = useState<KPIDrawerData | null>(null);

  const updateRecommendation = (id: string, status: AIRecommendation['status']) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleSetRole = (r: Role) => {
    setRole(r);
    setModule('dashboard');
    setKpiDrawer(null);
    setSelectedVehicle(null);
  };

  const value = useMemo(() => ({
    role, setRole: handleSetRole, module, setModule, vehicles, recommendations,
    updateRecommendation, searchQuery, setSearchQuery, activeFilter,
    setActiveFilter, selectedVehicle, setSelectedVehicle, kpiDrawer, setKpiDrawer,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [role, module, vehicles, recommendations, searchQuery, activeFilter, selectedVehicle, kpiDrawer]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
