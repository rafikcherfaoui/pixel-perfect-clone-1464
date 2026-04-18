import { Activity, Truck, AlertTriangle, Bell, Package } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { fleetKPIs } from '@/data/mockData';
import KPICard from '@/components/KPICard';
import VehicleCard from '@/components/VehicleCard';
import VehicleDrawer from '@/components/VehicleDrawer';
import RulHoverCard from '@/components/RulHoverCard';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function FleetManagerDashboard() {
  const { vehicles, setSelectedVehicle, searchQuery, activeFilter, setKpiDrawer } = useApp();

  const filtered = useMemo(() => {
    let list = vehicles;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v => v.id.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q));
    }
    switch (activeFilter) {
      case 'Keystone': list = list.filter(v => v.classification === 'Keystone'); break;
      case 'Earner': list = list.filter(v => v.classification === 'Earner'); break;
      case 'Specialist': list = list.filter(v => v.classification === 'Specialist'); break;
      case 'Risque >70%': list = list.filter(v => v.riskScore > 70); break;
      case 'Alertes': list = list.filter(v => v.healthScore < 60 && v.active); break;
    }
    return list;
  }, [vehicles, searchQuery, activeFilter]);

  const criticalComponents = useMemo(() => {
    const all: { vehicleId: string; component: string; rul: number; days: number }[] = [];
    vehicles.forEach(v => {
      v.components.forEach(c => {
        if (c.rulPercent < 30) all.push({ vehicleId: v.id, component: c.name, rul: c.rulPercent, days: c.daysRemaining });
      });
    });
    return all.sort((a, b) => a.rul - b.rul).slice(0, 10);
  }, [vehicles]);

  const openKPI = (id: string, title: string, value: string) => {
    setKpiDrawer({ id, title, value, role: 'fleet-manager' });
  };

  return (
    <div className="flex-1 flex gap-5 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-3">
          <KPICard label="Santé Moyenne" value={`${fleetKPIs.healthAvg}%`} icon={Activity}
            variant={fleetKPIs.healthAvg < 75 ? 'warning' : 'success'}
            onClick={() => openKPI('fleet-health', 'Santé Moyenne Flotte', `${fleetKPIs.healthAvg}%`)} />
          <KPICard label="Disponibilité" value={`${fleetKPIs.availability}%`} icon={Truck}
            subtitle="Cible: 95%" variant="default"
            onClick={() => openKPI('fleet-availability', 'Disponibilité Flotte', `${fleetKPIs.availability}%`)} />
          <KPICard label="Critiques" value={fleetKPIs.criticals} icon={AlertTriangle}
            subtitle="Panne prédite <30j" variant="critical"
            onClick={() => openKPI('fleet-criticals', 'Véhicules Critiques', `${fleetKPIs.criticals}`)} />
          <KPICard label="Alertes" value={fleetKPIs.alerts} icon={Bell}
            subtitle="Santé <60%" variant="warning"
            onClick={() => openKPI('fleet-alerts', 'Alertes Actives', `${fleetKPIs.alerts}`)} />
          <KPICard label="Pièces Urgentes" value={fleetKPIs.urgentParts} icon={Package}
            subtitle="Stock ≤ 0" variant="warning"
            onClick={() => openKPI('fleet-parts', 'Pièces Urgentes', `${fleetKPIs.urgentParts}`)} />
        </div>

        {/* Heatmap */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Heatmap Santé Flotte</h2>
          <div className="grid grid-cols-10 gap-2">
            {filtered.map(v => (
              <VehicleCard key={v.id} vehicle={v} onClick={() => setSelectedVehicle(v)} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Top 10 RUL */}
      <div className="w-72 shrink-0 overflow-y-auto">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-critical" /> Top 10 RUL Critiques
          </h3>
          <div className="space-y-3">
            {criticalComponents.map((c, i) => (
              <RulHoverCard
                key={`${c.vehicleId}-${c.component}-${i}`}
                vehicleId={c.vehicleId}
                component={c.component}
                rulPercent={c.rul}
                daysRemaining={c.days}
              />
            ))}
          </div>
        </div>
      </div>

      <VehicleDrawer />
    </div>
  );
}
