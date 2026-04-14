export type Role = 'fleet-manager' | 'dg' | 'controlling';

export interface VehicleComponent {
  name: string;
  rulPercent: number;
  daysRemaining: number;
}

export interface OBDData {
  lastCheck: string;
  engineTemp: number;
  rpm: number;
  engineLoad: number;
  faultCodes: string[];
}

export interface MaintenanceRecord {
  date: string;
  type: string;
  mechanic: string;
  cost: number;
  duration: string;
}

export interface Vehicle {
  id: string;
  type: string;
  classification: 'Keystone' | 'Earner' | 'Specialist' | 'Standard';
  acquisitionDate: string;
  driver: string;
  healthScore: number;
  riskScore: number;
  active: boolean;
  components: VehicleComponent[];
  obd: OBDData;
  maintenanceHistory: MaintenanceRecord[];
  tco: number;
  maintenanceCostYTD: number;
  downtimeCostYTD: number;
  costPerKm: number;
  route: string;
  whyCause?: string;
}

export interface AIRecommendation {
  id: string;
  vehicleIds: string[];
  action: string;
  confidence: number;
  repairCost: number;
  failureCost: number;
  signals: string[];
  crossDomain?: string;
  status: 'pending' | 'approved' | 'deferred' | 'escalated';
}

const classifications: Vehicle['classification'][] = ['Keystone', 'Earner', 'Specialist', 'Standard'];
const routes = ['Route A-1', 'Route B-2', 'Route C-3', 'Route D-4', 'Route E-5'];
const drivers = Array.from({ length: 50 }, (_, i) => `D-${String(i + 1).padStart(3, '0')}`);
const mechanics = ['Mechanic A', 'Mechanic B', 'Mechanic C', 'Mechanic D'];
const faultCodePool = ['P0300', 'P0171', 'P0420', 'P0442', 'P0301', 'P0174', 'P0128'];

function randRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateComponents(healthScore: number): VehicleComponent[] {
  const names = ['Freins', 'Pompe à eau', 'Turbo', 'Injecteurs', 'Filtres', 'Pneus'];
  return names.map(name => {
    const base = healthScore + randRange(-20, 20);
    const rul = Math.max(2, Math.min(100, base));
    return { name, rulPercent: rul, daysRemaining: Math.round(rul * 3.6) };
  });
}

function generateMaintenanceHistory(): MaintenanceRecord[] {
  const types = ['Préventif', 'Correctif', 'Urgence', 'Inspection'];
  return Array.from({ length: 5 }, (_, i) => ({
    date: `2025-${String(randRange(1, 12)).padStart(2, '0')}-${String(randRange(1, 28)).padStart(2, '0')}`,
    type: types[randRange(0, types.length - 1)],
    mechanic: mechanics[randRange(0, mechanics.length - 1)],
    cost: randRange(5000, 45000),
    duration: `${randRange(1, 8)}h`,
  }));
}

export function generateVehicles(): Vehicle[] {
  const vehicles: Vehicle[] = [];

  for (let i = 1; i <= 50; i++) {
    const id = `NL-${String(i).padStart(3, '0')}`;
    let healthScore: number;
    let active = true;

    if (i === 7) healthScore = 18;
    else if (i === 24) healthScore = 55;
    else if (i === 37) healthScore = 48;
    else if (i === 14 || i === 22) healthScore = randRange(25, 40);
    else if (i === 45 || i === 50) { healthScore = 0; active = false; }
    else healthScore = randRange(50, 98);

    let components = generateComponents(healthScore);
    if (i === 7) {
      components = [
        { name: 'Freins', rulPercent: 11, daysRemaining: 12 },
        { name: 'Pompe à eau', rulPercent: 13, daysRemaining: 14 },
        { name: 'Turbo', rulPercent: 14, daysRemaining: 15 },
        { name: 'Injecteurs', rulPercent: 15, daysRemaining: 16 },
        { name: 'Filtres', rulPercent: 45, daysRemaining: 90 },
        { name: 'Pneus', rulPercent: 38, daysRemaining: 72 },
      ];
    }
    if (i === 24) {
      components[2] = { name: 'Turbo', rulPercent: 15, daysRemaining: 18 };
    }
    if (i === 37) {
      components[1] = { name: 'Pompe à eau', rulPercent: 13, daysRemaining: 14 };
      components[2] = { name: 'Turbo', rulPercent: 14, daysRemaining: 16 };
    }

    const lastCheckHoursAgo = i === 7 ? 36 : randRange(1, 20);
    const lastCheck = new Date(Date.now() - lastCheckHoursAgo * 3600000).toISOString();

    vehicles.push({
      id,
      type: i % 3 === 0 ? 'Semi-remorque' : i % 3 === 1 ? 'Porteur' : 'Fourgon',
      classification: classifications[i % classifications.length],
      acquisitionDate: `20${randRange(18, 23)}-${String(randRange(1, 12)).padStart(2, '0')}-01`,
      driver: drivers[i - 1],
      healthScore,
      riskScore: Math.max(0, 100 - healthScore + randRange(-10, 10)),
      active,
      components,
      obd: {
        lastCheck,
        engineTemp: randRange(75, 105),
        rpm: randRange(700, 2200),
        engineLoad: randRange(20, 95),
        faultCodes: i === 7 ? ['P0300', 'P0171', 'P0420'] : i === 14 ? ['P0442'] : faultCodePool.slice(0, randRange(0, 2)),
      },
      maintenanceHistory: generateMaintenanceHistory(),
      tco: randRange(200000, 800000),
      maintenanceCostYTD: randRange(30000, 180000),
      downtimeCostYTD: randRange(5000, 60000),
      costPerKm: randRange(15, 85),
      route: i === 7 || i === 14 ? 'Route C-3' : routes[randRange(0, routes.length - 1)],
      whyCause: i === 7
        ? 'Freins RUL à 11% + Conducteur D-047 freinage brusque (+23% au-dessus de la moyenne) → usure accélérée sur Route C-3'
        : i === 14
        ? 'Turbo RUL à 28% + charge moteur élevée prolongée sur Route C-3 → dégradation prématurée'
        : undefined,
    });
  }
  return vehicles;
}

export function generateRecommendations(): AIRecommendation[] {
  return [
    {
      id: 'rec-001',
      vehicleIds: ['NL-007'],
      action: 'Remplacement immédiat freins + pompe à eau. Retrait du service.',
      confidence: 94,
      repairCost: 42000,
      failureCost: 185000,
      signals: ['Freins RUL 11%', 'Pompe à eau RUL 13%', 'OBD P0300 actif', 'Dernier check >24h'],
      status: 'pending',
    },
    {
      id: 'rec-002',
      vehicleIds: ['NL-007'],
      action: 'Coaching conducteur D-047 : réduction freinage brusque.',
      confidence: 87,
      repairCost: 3000,
      failureCost: 45000,
      signals: ['Freinage brusque +23%', 'Route C-3 variance +18%'],
      crossDomain: 'Maintenance + Formation conducteur',
      status: 'pending',
    },
    {
      id: 'rec-003',
      vehicleIds: ['NL-024'],
      action: 'Planifier remplacement turbo dans les 15 prochains jours.',
      confidence: 78,
      repairCost: 28000,
      failureCost: 95000,
      signals: ['Turbo RUL 15%', 'Charge moteur élevée'],
      status: 'pending',
    },
    {
      id: 'rec-004',
      vehicleIds: ['NL-037'],
      action: 'Inspection pompe à eau + turbo. Maintenance préventive recommandée.',
      confidence: 82,
      repairCost: 35000,
      failureCost: 120000,
      signals: ['Pompe à eau RUL 13%', 'Turbo RUL 14%'],
      status: 'pending',
    },
    {
      id: 'rec-005',
      vehicleIds: ['NL-014', 'NL-022'],
      action: 'Maintenance groupée — optimisation coût main-d\'œuvre.',
      confidence: 72,
      repairCost: 55000,
      failureCost: 210000,
      signals: ['NL-014 risque >70%', 'NL-022 risque >65%', 'Même dépôt'],
      status: 'pending',
    },
    {
      id: 'rec-006',
      vehicleIds: ['NL-014'],
      action: 'Réparer NL-014 + Coaching Conducteur D-047',
      confidence: 89,
      repairCost: 48000,
      failureCost: 195000,
      signals: ['OBD P0442', 'Freinage brusque D-047', 'Route C-3'],
      crossDomain: 'Maintenance + Formation',
      status: 'pending',
    },
  ];
}

export const fleetKPIs = {
  healthAvg: 69,
  availability: 94,
  criticals: 3,
  alerts: 13,
  urgentParts: 6,
};

export const dgKPIs = {
  totalFleetCost: 2450000,
  totalFleetBudget: 2300000,
  tcoPerVehicle: 380000,
  tcoTrend: 2.4,
  costPerKm: 42,
  downtimeRate: 6,
  availabilityRate: 94,
  savingsGenerated: 340000,
  highRiskPercent: 14,
};

export const controllingKPIs = {
  maintenanceCostPerKm: 18.5,
  maintenanceCostPerKmBudget: 17.2,
  plannedPercent: 72,
  unplannedPercent: 28,
  unplannedTarget: 30,
  budgetVariance: 4.2,
  fuelCostByRoute: [
    { route: 'Route A-1', cost: 180000 },
    { route: 'Route B-2', cost: 210000 },
    { route: 'Route C-3', cost: 290000 },
    { route: 'Route D-4', cost: 165000 },
    { route: 'Route E-5', cost: 195000 },
  ],
  labourCost: { drivers: 850000, mechanics: 420000, overtime: 95000 },
  roiMaintenance: 3.2,
};

export const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: `Jour ${i + 1}`,
  cost: 75000 + Math.sin(i / 5) * 15000 + Math.random() * 8000,
  availability: 92 + Math.sin(i / 7) * 3 + Math.random() * 2,
  downtime: 4 + Math.sin(i / 4) * 2 + Math.random(),
  health: 67 + Math.sin(i / 6) * 4 + Math.random() * 3,
}));
