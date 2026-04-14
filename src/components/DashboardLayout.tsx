import { useApp } from '@/contexts/AppContext';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import FleetManagerDashboard from '@/components/FleetManagerDashboard';
import DGDashboard from '@/components/DGDashboard';
import ControllingDashboard from '@/components/ControllingDashboard';
import AICommanderModule from '@/components/AICommanderModule';
import TechMaintainPage from '@/components/TechMaintainPage';
import FleetTrackPage from '@/components/FleetTrackPage';
import CostGuardPage from '@/components/CostGuardPage';
import KPIDetailDrawer from '@/components/KPIDetailDrawer';
import PerfFlottePage from '@/components/PerfFlottePage';
import AnalyseCoutsPage from '@/components/AnalyseCoutsPage';
import AlertesStrategiquesPage from '@/components/AlertesStrategiquesPage';
import VarianceCoutsPage from '@/components/VarianceCoutsPage';
import TCOVehiculePage from '@/components/TCOVehiculePage';
import CarburantMainOeuvrePage from '@/components/CarburantMainOeuvrePage';
import ROIMaintenancePage from '@/components/ROIMaintenancePage';

export default function DashboardLayout() {
  const { role, module } = useApp();

  const renderContent = () => {
    // Shared modules
    if (module === 'ai-commander') return <AICommanderModule />;
    
    // Fleet Manager modules
    if (module === 'techmaintain') return <TechMaintainPage />;
    if (module === 'fleettrack') return <FleetTrackPage />;
    if (module === 'costguard') return <CostGuardPage />;
    
    // DG modules
    if (module === 'perf-flotte') return <PerfFlottePage />;
    if (module === 'analyse-couts') return <AnalyseCoutsPage />;
    if (module === 'alertes-strategiques') return <AlertesStrategiquesPage />;
    
    // Controlling modules
    if (module === 'variance-couts') return <VarianceCoutsPage />;
    if (module === 'tco-vehicule') return <TCOVehiculePage />;
    if (module === 'analyse-carburant') return <CarburantMainOeuvrePage />;
    if (module === 'roi-maintenance') return <ROIMaintenancePage />;

    // Default dashboards per role
    switch (role) {
      case 'fleet-manager': return <FleetManagerDashboard />;
      case 'dg': return <DGDashboard />;
      case 'controlling': return <ControllingDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 p-5 overflow-hidden flex">
          {renderContent()}
        </main>
      </div>
      <KPIDetailDrawer />
    </div>
  );
}
