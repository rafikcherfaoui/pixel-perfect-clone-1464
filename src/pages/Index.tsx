import { AppProvider } from '@/contexts/AppContext';
import DashboardLayout from '@/components/DashboardLayout';

const Index = () => (
  <AppProvider>
    <DashboardLayout />
  </AppProvider>
);

export default Index;
