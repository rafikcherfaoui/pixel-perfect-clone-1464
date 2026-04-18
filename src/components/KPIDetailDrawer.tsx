import { X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { fleetKPIs, dgKPIs, controllingKPIs, trendData } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

export default function KPIDetailDrawer() {
  const { kpiDrawer, setKpiDrawer, vehicles, recommendations } = useApp();

  if (!kpiDrawer) return null;

  const content = getDrawerContent(kpiDrawer.id, kpiDrawer.role, vehicles, recommendations);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-[520px] z-50 overflow-y-auto shadow-2xl border-l border-border"
        style={{ backgroundColor: '#1c2333' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border p-4 flex items-center justify-between" style={{ backgroundColor: '#1c2333' }}>
          <div>
            <h2 className="text-base font-bold text-foreground">{kpiDrawer.title}</h2>
            <p className="text-lg font-bold text-primary">{kpiDrawer.value}</p>
          </div>
          <button onClick={() => setKpiDrawer(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* POURQUOI section */}
          {content.why && (
            <div className="border-l-2 border-primary rounded-r-lg p-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">POURQUOI CE CHIFFRE ?</h3>
              <p className="text-xs text-foreground/80 leading-relaxed">{content.why}</p>
            </div>
          )}

          {/* Trend chart */}
          {content.trendKey && (
            <div className="rounded-xl p-4 border border-border" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3">Tendance 30 jours</h4>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="kpi-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={content.color || '#f59e0b'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={content.color || '#f59e0b'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 18%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 9, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} width={35} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c2333', border: '1px solid hsl(240 12% 18%)', borderRadius: '8px', fontSize: '11px' }}
                    labelStyle={{ color: 'hsl(220 20% 90%)' }}
                  />
                  <Area type="monotone" dataKey={content.trendKey} stroke={content.color || '#f59e0b'} fill="url(#kpi-grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top contributors */}
          {content.contributors && content.contributors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Top Contributeurs</h4>
              <div className="space-y-1.5">
                {content.contributors.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg p-3 border border-border" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{i + 1}</span>
                      <div>
                        <p className="text-xs text-foreground font-medium">{c.label}</p>
                        {c.detail && <p className="text-[10px] text-muted-foreground">{c.detail}</p>}
                      </div>
                    </div>
                    <span className={cn("text-xs font-bold", c.variant === 'critical' ? 'text-critical' : c.variant === 'warning' ? 'text-warning' : 'text-foreground')}>
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related alerts */}
          {content.alerts && content.alerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Alertes Liées</h4>
              {content.alerts.map((a, i) => (
                <div key={i} className="bg-critical/10 border border-critical/30 rounded-lg p-3 text-xs text-foreground/80">
                  {a}
                </div>
              ))}
            </div>
          )}

          {/* Extra table */}
          {content.table && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{content.table.title}</h4>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {content.table.headers.map(h => (
                        <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {content.table.rows.map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-3 text-foreground">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface Contributor { label: string; value: string; detail?: string; variant?: 'critical' | 'warning' | 'default' }
interface DrawerContent {
  why: string;
  trendKey?: string;
  color?: string;
  contributors?: Contributor[];
  alerts?: string[];
  table?: { title: string; headers: string[]; rows: string[][] };
}

function getDrawerContent(id: string, role: string, vehicles: any[], recommendations: any[]): DrawerContent {
  // FLEET MANAGER KPIs
  if (id === 'fleet-health') {
    const lowVehicles = vehicles.filter(v => v.active).sort((a, b) => a.healthScore - b.healthScore).slice(0, 5);
    return {
      why: `La santé moyenne de la flotte est à ${fleetKPIs.healthAvg}%. Les véhicules NL-007 (18%), NL-024 (55%), NL-037 (48%) sont les principaux contributeurs à la baisse de la moyenne. NL-007 présente un état critique avec freins à 11% et pompe à eau à 13%.`,
      trendKey: 'health',
      color: '#f59e0b',
      contributors: lowVehicles.map(v => ({
        label: v.id,
        value: `${v.healthScore}%`,
        detail: `${v.type} — ${v.route}`,
        variant: v.healthScore < 30 ? 'critical' as const : 'warning' as const,
      })),
      alerts: ['NL-007: Freins RUL 11% — Remplacement immédiat requis', 'NL-037: Pompe à eau 13% + Turbo 14% — Maintenance préventive recommandée'],
    };
  }

  if (id === 'fleet-availability') {
    const unavailable = vehicles.filter(v => !v.active || v.healthScore < 30).slice(0, 5);
    return {
      why: `Disponibilité à ${fleetKPIs.availability}% (cible 95%). ${unavailable.length} véhicules indisponibles aujourd'hui. Causes: maintenance planifiée (1), panne critique (2). Récupération estimée sous 48h pour NL-045, 72h pour NL-007.`,
      trendKey: 'availability',
      color: '#22c55e',
      contributors: unavailable.map(v => ({
        label: v.id,
        value: v.active ? 'Maintenance' : 'Inactif',
        detail: v.active ? `Santé: ${v.healthScore}%` : 'Hors service',
        variant: 'critical' as const,
      })),
      alerts: ['NL-007: Panne prédite sous 12 jours — Retrait immédiat recommandé'],
    };
  }

  if (id === 'fleet-criticals') {
    const crits = vehicles.filter(v => v.healthScore < 30 && v.active).slice(0, 5);
    return {
      why: `${fleetKPIs.criticals} véhicules critiques détectés avec panne prédite sous 30 jours. Composants défaillants principaux: freins, pompe à eau, turbo.`,
      trendKey: 'health',
      color: '#ef4444',
      contributors: crits.map(v => {
        const worstComp = v.components.sort((a: any, b: any) => a.rulPercent - b.rulPercent)[0];
        return {
          label: v.id,
          value: `${v.healthScore}%`,
          detail: `${worstComp.name}: ${worstComp.rulPercent}% — ${worstComp.daysRemaining}j restants`,
          variant: 'critical' as const,
        };
      }),
      table: {
        title: 'Coût Réparation vs Panne',
        headers: ['Véhicule', 'Réparation', 'Coût Panne', 'Économie'],
        rows: crits.map(v => {
          const rec = recommendations.find(r => r.vehicleIds.includes(v.id));
          return [v.id, `${(rec?.repairCost || 40000).toLocaleString()} DZD`, `${(rec?.failureCost || 150000).toLocaleString()} DZD`, `${((rec?.failureCost || 150000) - (rec?.repairCost || 40000)).toLocaleString()} DZD`];
        }),
      },
    };
  }

  if (id === 'fleet-alerts') {
    const alertVehicles = vehicles.filter(v => v.healthScore < 60 && v.active).sort((a, b) => a.healthScore - b.healthScore);
    return {
      why: `${fleetKPIs.alerts} alertes actives. Principales causes: RUL composants bas, codes défaut OBD actifs, comportement conducteur anormal.`,
      trendKey: 'health',
      color: '#f59e0b',
      contributors: alertVehicles.slice(0, 8).map(v => ({
        label: v.id,
        value: `${v.healthScore}%`,
        detail: v.obd.faultCodes.length > 0 ? `Codes: ${v.obd.faultCodes.join(', ')}` : v.components.filter((c: any) => c.rulPercent < 30).map((c: any) => c.name).join(', '),
        variant: v.healthScore < 30 ? 'critical' as const : 'warning' as const,
      })),
    };
  }

  if (id === 'fleet-parts') {
    const parts = [
      { part: 'Plaquettes de frein', vehicle: 'NL-007', stock: 0, impact: 'Réparation freins bloquée' },
      { part: 'Pompe à eau', vehicle: 'NL-007', stock: 0, impact: 'Remplacement impossible' },
      { part: 'Kit turbo', vehicle: 'NL-024', stock: 0, impact: 'Maintenance turbo en attente' },
      { part: 'Joints injecteurs', vehicle: 'NL-037', stock: 0, impact: 'Réparation différée' },
      { part: 'Filtre à huile', vehicle: 'NL-014', stock: 0, impact: 'Maintenance préventive bloquée' },
      { part: 'Courroie alternateur', vehicle: 'NL-022', stock: 0, impact: 'Risque panne électrique' },
    ];
    return {
      why: `${fleetKPIs.urgentParts} pièces à stock ≤ 0. Ces ruptures bloquent ${parts.length} réparations actives et augmentent le risque de panne non planifiée.`,
      color: '#f59e0b',
      contributors: parts.map(p => ({
        label: p.part,
        value: `Stock: ${p.stock}`,
        detail: `${p.vehicle} — ${p.impact}`,
        variant: 'critical' as const,
      })),
      alerts: ['Commande urgente requise: plaquettes frein + pompe à eau pour NL-007'],
    };
  }

  // DG KPIs
  if (id === 'dg-total-cost') {
    return {
      why: `Coût total flotte ce mois: ${(dgKPIs.totalFleetCost / 1000).toFixed(0)}K DZD vs budget ${(dgKPIs.totalFleetBudget / 1000).toFixed(0)}K DZD (+${(((dgKPIs.totalFleetCost - dgKPIs.totalFleetBudget) / dgKPIs.totalFleetBudget) * 100).toFixed(1)}%). Dépassement causé par maintenance non planifiée (+340% sur Route C-3) et 3 interventions d'urgence.`,
      trendKey: 'cost',
      color: '#ef4444',
      contributors: [
        { label: 'Carburant', value: `${Math.round(dgKPIs.totalFleetCost * 0.4 / 1000)}K DZD`, detail: '40% du coût total', variant: 'default' as const },
        { label: 'Maintenance', value: `${Math.round(dgKPIs.totalFleetCost * 0.35 / 1000)}K DZD`, detail: '+18% vs budget — dépassement', variant: 'critical' as const },
        { label: 'Main d\'œuvre', value: `${Math.round(dgKPIs.totalFleetCost * 0.15 / 1000)}K DZD`, detail: 'Heures sup. +12%', variant: 'warning' as const },
        { label: 'Indisponibilité', value: `${Math.round(dgKPIs.totalFleetCost * 0.1 / 1000)}K DZD`, detail: '3 véhicules critiques', variant: 'critical' as const },
      ],
      alerts: ['Route C-3: Maintenance non planifiée +340% vs plan', 'NL-007, NL-014, NL-022: coûts de réparation urgente'],
    };
  }

  if (id === 'dg-tco') {
    const topTCO = vehicles.sort((a, b) => b.tco - a.tco).slice(0, 5);
    return {
      why: `TCO moyen par véhicule: ${(dgKPIs.tcoPerVehicle / 1000).toFixed(0)}K DZD (+${dgKPIs.tcoTrend}% vs mois précédent). Les 5 véhicules les plus coûteux représentent 35% du TCO total.`,
      trendKey: 'cost',
      color: '#f59e0b',
      contributors: topTCO.map(v => ({
        label: v.id,
        value: `${(v.tco / 1000).toFixed(0)}K DZD`,
        detail: `Maint: ${(v.maintenanceCostYTD / 1000).toFixed(0)}K / Downtime: ${(v.downtimeCostYTD / 1000).toFixed(0)}K`,
        variant: v.tco > 600000 ? 'critical' as const : 'default' as const,
      })),
    };
  }

  if (id === 'dg-cost-km') {
    return {
      why: `Coût/km global à ${dgKPIs.costPerKm} DZD. Route C-3 est la plus chère à 58 DZD/km (+18% vs baseline). Principales causes: maintenance non planifiée et consommation carburant élevée.`,
      trendKey: 'cost',
      color: '#f59e0b',
      contributors: [
        { label: 'Route C-3', value: '58 DZD/km', detail: '+18% vs baseline', variant: 'critical' as const },
        { label: 'Route B-2', value: '42 DZD/km', detail: '+2% vs baseline', variant: 'warning' as const },
        { label: 'Route E-5', value: '37 DZD/km', detail: 'Dans le budget', variant: 'default' as const },
        { label: 'Route A-1', value: '35 DZD/km', detail: '-5% vs baseline', variant: 'default' as const },
        { label: 'Route D-4', value: '30 DZD/km', detail: '-4% vs baseline', variant: 'default' as const },
      ],
    };
  }

  if (id === 'dg-downtime') {
    return {
      why: `Taux d'indisponibilité à ${dgKPIs.downtimeRate}% (cible <5%). Impact: capacité de couverture routes réduite de 6%. Véhicules NL-007, NL-045, NL-050 principaux contributeurs.`,
      trendKey: 'downtime',
      color: '#ef4444',
      contributors: [
        { label: 'NL-007', value: '72h immobilisé', detail: 'Freins + pompe — panne critique', variant: 'critical' as const },
        { label: 'NL-045', value: 'Inactif', detail: 'Hors service', variant: 'critical' as const },
        { label: 'NL-050', value: 'Inactif', detail: 'Hors service', variant: 'critical' as const },
      ],
    };
  }

  if (id === 'dg-availability') {
    return {
      why: `Disponibilité à ${dgKPIs.availabilityRate}% (cible 95%). La baisse est due à 3 véhicules critiques immobilisés et une durée moyenne de réparation en hausse de 12%.`,
      trendKey: 'availability',
      color: '#22c55e',
      contributors: [
        { label: 'Maintenance préventive', value: '2 véhicules', detail: 'Retour prévu sous 24h', variant: 'warning' as const },
        { label: 'Panne critique', value: '3 véhicules', detail: 'NL-007, NL-045, NL-050', variant: 'critical' as const },
      ],
      alerts: ['Capacité couverture routes impactée: Route C-3 sous-desservie'],
    };
  }

  if (id === 'dg-savings') {
    const approved = recommendations.filter(r => r.status === 'approved');
    const totalSaved = approved.reduce((s, r) => s + (r.failureCost - r.repairCost), 0);
    return {
      why: `${(dgKPIs.savingsGenerated / 1000).toFixed(0)}K DZD économisés grâce aux recommandations IA acceptées. ${approved.length} recommandation(s) exécutée(s), ${recommendations.filter(r => r.status === 'pending').length} en attente.`,
      color: '#8b5cf6',
      contributors: recommendations.map(r => ({
        label: r.action.substring(0, 50) + '...',
        value: `${(r.failureCost - r.repairCost).toLocaleString()} DZD`,
        detail: `${r.vehicleIds.join(', ')} — Confiance: ${r.confidence}%`,
        variant: r.status === 'approved' ? 'default' as const : 'warning' as const,
      })),
    };
  }

  if (id === 'dg-high-risk') {
    const highRisk = vehicles.filter(v => v.riskScore > 70).sort((a, b) => b.riskScore - a.riskScore);
    return {
      why: `${dgKPIs.highRiskPercent}% de la flotte présente un risque >70%. ${highRisk.length} véhicules nécessitent une action immédiate.`,
      trendKey: 'health',
      color: '#ef4444',
      contributors: highRisk.slice(0, 6).map(v => ({
        label: v.id,
        value: `Risque: ${v.riskScore}%`,
        detail: `Santé: ${v.healthScore}% — ${v.route}`,
        variant: 'critical' as const,
      })),
      alerts: highRisk.slice(0, 3).map(v => `${v.id}: Action de maintenance en attente — risque panne sous 30j`),
    };
  }

  // CONTROLLING KPIs
  if (id === 'ctrl-maint-km') {
    const topMaint = vehicles.sort((a, b) => (b.maintenanceCostYTD / 1000) - (a.maintenanceCostYTD / 1000)).slice(0, 5);
    return {
      why: `Coût maintenance/km à ${controllingKPIs.maintenanceCostPerKm} DZD vs budget ${controllingKPIs.maintenanceCostPerKmBudget} DZD (+${((controllingKPIs.maintenanceCostPerKm / controllingKPIs.maintenanceCostPerKmBudget - 1) * 100).toFixed(1)}%). Dépassement causé par interventions non planifiées sur Route C-3.`,
      trendKey: 'cost',
      color: '#ef4444',
      contributors: topMaint.map(v => ({
        label: v.id,
        value: `${(v.maintenanceCostYTD / 1000).toFixed(0)}K DZD`,
        detail: `Coût/km: ${v.costPerKm} DZD — ${v.route}`,
        variant: v.maintenanceCostYTD > 120000 ? 'critical' as const : 'default' as const,
      })),
    };
  }

  if (id === 'ctrl-unplanned') {
    return {
      why: `Ratio non planifié: ${controllingKPIs.unplannedPercent}% (cible: <${controllingKPIs.unplannedTarget}%). ${controllingKPIs.unplannedPercent < controllingKPIs.unplannedTarget ? 'Dans la cible.' : 'Légèrement en dessous de la cible.'} Les interventions non planifiées coûtent en moyenne 2.5x plus cher.`,
      color: '#f59e0b',
      contributors: [
        { label: 'Planifié', value: `${controllingKPIs.plannedPercent}%`, detail: 'Maintenance préventive et programmée', variant: 'default' as const },
        { label: 'Non planifié', value: `${controllingKPIs.unplannedPercent}%`, detail: 'Urgences et pannes imprévues', variant: controllingKPIs.unplannedPercent > controllingKPIs.unplannedTarget ? 'critical' as const : 'warning' as const },
      ],
      table: {
        title: 'Interventions non planifiées (ce mois)',
        headers: ['Véhicule', 'Type', 'Coût', 'Cause'],
        rows: [
          ['NL-007', 'Urgence freins', '42 000 DZD', 'RUL freins 11%'],
          ['NL-014', 'Panne moteur', '28 000 DZD', 'Code P0442'],
          ['NL-022', 'Urgence turbo', '35 000 DZD', 'Charge moteur prolongée'],
        ],
      },
    };
  }

  if (id === 'ctrl-variance') {
    return {
      why: `Variance budget: +${controllingKPIs.budgetVariance}% vs budget. Décomposition: 2.1% → prolongation d'immobilisation (NL-014, NL-022) / 1.4% → inflation pièces / 0.7% → heures supplémentaires main-d'œuvre.`,
      trendKey: 'cost',
      color: '#ef4444',
      contributors: [
        { label: 'Prolongation immobilisation', value: '+2.1%', detail: 'NL-014 (+3j), NL-022 (+2j) — pièces en attente', variant: 'critical' as const },
        { label: 'Inflation coût pièces', value: '+1.4%', detail: 'Hausse prix fournisseur Q2 2025', variant: 'warning' as const },
        { label: 'Heures supplémentaires', value: '+0.7%', detail: '3 mécaniciens en overtime — urgences NL-007', variant: 'warning' as const },
      ],
      alerts: ['Événement source: NL-014 immobilisé 5 jours (vs 2 planifiés) — pièce turbo en rupture'],
    };
  }

  if (id === 'ctrl-roi') {
    return {
      why: `ROI maintenance: ${controllingKPIs.roiMaintenance}x. Chaque DZD investi en maintenance préventive évite ${controllingKPIs.roiMaintenance} DZD en coûts de panne.`,
      color: '#22c55e',
      contributors: recommendations.filter(r => r.status === 'approved' || r.status === 'pending').map(r => ({
        label: r.vehicleIds.join(', '),
        value: `ROI: ${((r.failureCost - r.repairCost) / r.repairCost * 100).toFixed(0)}%`,
        detail: `Réparation: ${r.repairCost.toLocaleString()} DZD / Panne évitée: ${r.failureCost.toLocaleString()} DZD`,
        variant: r.status === 'approved' ? 'default' as const : 'warning' as const,
      })),
    };
  }

  if (id === 'ctrl-tco') {
    return {
      why: 'TCO détaillé par véhicule. Vue complète des coûts de possession incluant maintenance, downtime et coût/km.',
      trendKey: 'cost',
      color: '#f59e0b',
      table: {
        title: 'TCO Complet (50 véhicules)',
        headers: ['Véhicule', 'TCO', 'Maintenance', 'Downtime', 'Coût/km'],
        rows: vehicles.slice(0, 15).map(v => [
          v.id,
          `${v.tco.toLocaleString()} DZD`,
          `${v.maintenanceCostYTD.toLocaleString()} DZD`,
          `${v.downtimeCostYTD.toLocaleString()} DZD`,
          `${v.costPerKm} DZD`,
        ]),
      },
    };
  }

  if (id === 'ctrl-fuel') {
    const sortedRoutes = [...controllingKPIs.fuelCostByRoute].sort((a, b) => b.cost - a.cost);
    const totalCost = sortedRoutes.reduce((s, r) => s + r.cost, 0);
    const routeMeta: Record<string, { km: number; vehicles: number; litres: number; budget: number }> = {
      'Route A-1': { km: 8400, vehicles: 6, litres: 1120, budget: 175000 },
      'Route B-2': { km: 8800, vehicles: 7, litres: 1290, budget: 200000 },
      'Route C-3': { km: 7700, vehicles: 5, litres: 1410, budget: 245000 },
      'Route D-4': { km: 8200, vehicles: 5, litres: 1040, budget: 170000 },
      'Route E-5': { km: 8000, vehicles: 6, litres: 1180, budget: 195000 },
    };
    return {
      why: `Les variations de coût carburant par route s'expliquent par : le profil de la route (urbain vs autoroute vs montagne), le comportement du conducteur assigné, la charge moyenne transportée, et l'état des véhicules utilisés sur cette route.`,
      trendKey: 'cost',
      color: '#f59e0b',
      contributors: [
        { label: 'Coût total carburant', value: `${totalCost.toLocaleString()} DZD`, detail: 'Ce mois — toutes routes', variant: 'default' as const },
        { label: 'Route la plus coûteuse', value: 'Route C-3', detail: '+18% vs budget — Conducteur D-047 freinage brutal', variant: 'critical' as const },
        { label: 'Économie estimée', value: '45 000 DZD/mois', detail: 'Réaffectation D-047 + formation', variant: 'default' as const },
      ],
      table: {
        title: 'Répartition par Route — Coût/km vs Budget',
        headers: ['Route', 'Km', 'Véh.', 'Litres', 'Coût DZD', 'Coût/km', 'vs Budget', 'Statut'],
        rows: sortedRoutes.map(r => {
          const m = routeMeta[r.route] ?? { km: 8000, vehicles: 5, litres: 1100, budget: r.cost };
          const costKm = (r.cost / m.km).toFixed(1);
          const variance = ((r.cost - m.budget) / m.budget * 100);
          const statut = variance > 10 ? '🔴 Dépassement' : variance > 0 ? '🟡 Surveillance' : '🟢 Normal';
          return [r.route, m.km.toLocaleString(), String(m.vehicles), m.litres.toString(), r.cost.toLocaleString(), `${costKm} DZD`, `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`, statut];
        }),
      },
      alerts: [
        '🎯 Route C-3 : +18% au-dessus du budget carburant. Cause principale : Conducteur D-047 (freinage brutal, +23% consommation) + profil route vallonné + 2 véhicules avec pression pneus insuffisante.',
        '💡 Recommandation : Réaffecter D-047 à une route plate jusqu\'à formation complétée. Économie estimée : 45 000 DZD/mois sur Route C-3.',
      ],
    };
  }

  if (id === 'ctrl-labour') {
    return {
      why: `Main d'œuvre totale: ${(controllingKPIs.labourCost.drivers + controllingKPIs.labourCost.mechanics + controllingKPIs.labourCost.overtime).toLocaleString()} DZD. Heures supplémentaires signalées à ${controllingKPIs.labourCost.overtime.toLocaleString()} DZD.`,
      color: '#f59e0b',
      contributors: [
        { label: 'Conducteurs', value: `${controllingKPIs.labourCost.drivers.toLocaleString()} DZD`, variant: 'default' as const },
        { label: 'Mécaniciens', value: `${controllingKPIs.labourCost.mechanics.toLocaleString()} DZD`, variant: 'default' as const },
        { label: 'Heures supplémentaires', value: `${controllingKPIs.labourCost.overtime.toLocaleString()} DZD`, detail: '⚠ Overtime lié aux urgences NL-007, NL-014', variant: 'critical' as const },
      ],
    };
  }

  // ====== PERF FLOTTE KPIs ======
  if (id === 'perf-disponibilite') {
    return {
      why: `Disponibilité flotte à ${fleetKPIs.availability}% (cible 95%). 3 véhicules critiques et 2 en maintenance planifiée réduisent la capacité. Durée moyenne de réparation en hausse de 12%.`,
      trendKey: 'availability', color: '#22c55e',
      contributors: vehicles.filter(v => !v.active || v.healthScore < 30).slice(0, 5).map(v => ({
        label: v.id, value: v.active ? `${v.healthScore}%` : 'Inactif',
        detail: `${v.type} — ${v.route}`, variant: 'critical' as const,
      })),
      alerts: ['NL-007: retrait immédiat recommandé', 'NL-045, NL-050: hors service — remplacement à évaluer'],
    };
  }
  if (id === 'perf-panne') {
    return {
      why: `Le taux de panne reflète les véhicules avec santé <50%. Causes principales: RUL composants bas, maintenance différée, conditions Route C-3.`,
      trendKey: 'health', color: '#ef4444',
      contributors: vehicles.filter(v => v.healthScore < 50 && v.active).sort((a, b) => a.healthScore - b.healthScore).slice(0, 5).map(v => ({
        label: v.id, value: `${v.healthScore}%`, detail: `${v.obd.faultCodes.length} codes défaut`, variant: 'critical' as const,
      })),
    };
  }
  if (id === 'perf-operationnels') {
    return {
      why: `${vehicles.filter(v => v.active && v.healthScore >= 30).length} véhicules opérationnels sur ${vehicles.length}. Capacité de couverture maintenue mais sous tension sur Route C-3.`,
      trendKey: 'availability', color: '#22c55e',
    };
  }
  if (id === 'perf-maintenance') {
    return {
      why: `${vehicles.filter(v => !v.active || v.healthScore < 30).length} véhicules en maintenance ou hors service. NL-007 nécessite remplacement freins + pompe. NL-045, NL-050 en fin de vie.`,
      color: '#ef4444',
      contributors: vehicles.filter(v => !v.active || v.healthScore < 30).map(v => ({
        label: v.id, value: v.active ? `Santé: ${v.healthScore}%` : 'Hors service',
        variant: 'critical' as const,
      })),
    };
  }
  if (id === 'perf-km') {
    return {
      why: `Kilométrage total calculé à partir du TCO et coût/km de chaque véhicule. Les routes les plus parcourues: Route A-1, Route B-2.`,
      trendKey: 'cost', color: '#3b82f6',
    };
  }

  // ====== ANALYSE COUTS KPIs ======
  if (id === 'ac-total') {
    return {
      why: `Coût total flotte: ${(dgKPIs.totalFleetCost / 1000).toFixed(0)}K DZD ce mois, dépassant le budget de ${(dgKPIs.totalFleetBudget / 1000).toFixed(0)}K DZD. Dépassement causé par maintenance non planifiée (+340% Route C-3).`,
      trendKey: 'cost', color: '#ef4444',
      contributors: [
        { label: 'Carburant', value: `${Math.round(dgKPIs.totalFleetCost * 0.4 / 1000)}K DZD`, detail: '40%', variant: 'default' as const },
        { label: 'Maintenance', value: `${Math.round(dgKPIs.totalFleetCost * 0.35 / 1000)}K DZD`, detail: '35% — en hausse', variant: 'critical' as const },
        { label: 'Main d\'œuvre', value: `${Math.round(dgKPIs.totalFleetCost * 0.15 / 1000)}K DZD`, detail: '15%', variant: 'default' as const },
        { label: 'Immobilisation', value: `${Math.round(dgKPIs.totalFleetCost * 0.1 / 1000)}K DZD`, detail: '10%', variant: 'warning' as const },
      ],
    };
  }
  if (id === 'ac-carburant') {
    return {
      why: `Carburant représente 40% du coût flotte. Route C-3 est la plus consommatrice avec +18% vs moyenne. Conducteur D-047 identifié en surconsommation.`,
      trendKey: 'cost', color: '#f59e0b',
      contributors: controllingKPIs.fuelCostByRoute.sort((a, b) => b.cost - a.cost).map(r => ({
        label: r.route, value: `${r.cost.toLocaleString()} DZD`,
        variant: r.route === 'Route C-3' ? 'critical' as const : 'default' as const,
      })),
    };
  }
  if (id === 'ac-maintenance') {
    return {
      why: `Maintenance représente 35% du coût total. Hausse due à 3 interventions urgence (NL-007, NL-014, NL-022). Non planifié: ${controllingKPIs.unplannedPercent}%.`,
      trendKey: 'cost', color: '#ef4444',
      contributors: vehicles.sort((a, b) => b.maintenanceCostYTD - a.maintenanceCostYTD).slice(0, 5).map(v => ({
        label: v.id, value: `${(v.maintenanceCostYTD / 1000).toFixed(0)}K DZD`, variant: v.maintenanceCostYTD > 120000 ? 'critical' as const : 'default' as const,
      })),
    };
  }
  if (id === 'ac-labour') {
    return {
      why: `Main d'œuvre: ${(controllingKPIs.labourCost.drivers + controllingKPIs.labourCost.mechanics + controllingKPIs.labourCost.overtime).toLocaleString()} DZD. Heures sup en hausse à ${controllingKPIs.labourCost.overtime.toLocaleString()} DZD dues aux urgences.`,
      color: '#3b82f6',
      contributors: [
        { label: 'Conducteurs', value: `${controllingKPIs.labourCost.drivers.toLocaleString()} DZD`, variant: 'default' as const },
        { label: 'Mécaniciens', value: `${controllingKPIs.labourCost.mechanics.toLocaleString()} DZD`, variant: 'default' as const },
        { label: 'Heures sup.', value: `${controllingKPIs.labourCost.overtime.toLocaleString()} DZD`, detail: 'Urgences NL-007, NL-014', variant: 'critical' as const },
      ],
    };
  }
  if (id === 'ac-downtime') {
    return {
      why: `Coût d'immobilisation lié à 3 véhicules hors service et 2 en maintenance longue. Impact: perte de capacité Route C-3.`,
      trendKey: 'downtime', color: '#8b5cf6',
      contributors: vehicles.filter(v => !v.active || v.healthScore < 30).map(v => ({
        label: v.id, value: `${v.downtimeCostYTD.toLocaleString()} DZD`, variant: 'critical' as const,
      })),
    };
  }

  // ====== ALERTES STRATEGIQUES KPIs ======
  if (id === 'as-critical') {
    return {
      why: `Alertes critiques: véhicules avec santé <30% et panne prédite sous 30 jours. Action immédiate requise pour éviter pannes non planifiées coûteuses.`,
      trendKey: 'health', color: '#ef4444',
      contributors: vehicles.filter(v => v.healthScore < 30 && v.active).map(v => ({
        label: v.id, value: `${v.healthScore}%`, detail: `Panne prédite sous ${Math.min(...v.components.map(c => c.daysRemaining))}j`, variant: 'critical' as const,
      })),
    };
  }
  if (id === 'as-pending') {
    return {
      why: `Alertes en attente de décision managériale. Chaque jour de retard augmente le risque de panne non planifiée et le coût associé.`,
      color: '#f59e0b',
      contributors: [
        { label: 'Alertes critiques', value: `${vehicles.filter(v => v.healthScore < 30 && v.active).length}`, variant: 'critical' as const },
        { label: 'Alertes haute priorité', value: `${vehicles.filter(v => v.riskScore > 70 && v.healthScore >= 30).length}`, variant: 'warning' as const },
      ],
    };
  }
  if (id === 'as-risk') {
    return {
      why: `Le coût total à risque représente l'impact financier cumulé si aucune action n'est prise sur les alertes actives. Inclut coûts de panne, immobilisation et cascade.`,
      trendKey: 'cost', color: '#ef4444',
      contributors: recommendations.map(r => ({
        label: r.vehicleIds.join(', '), value: `${r.failureCost.toLocaleString()} DZD`,
        detail: `Réparation: ${r.repairCost.toLocaleString()} DZD`, variant: 'critical' as const,
      })),
    };
  }
  if (id === 'as-recs') {
    return {
      why: `${recommendations.filter(r => r.status === 'pending').length} recommandations IA en attente d'approbation. Valeur protégeable: ${recommendations.filter(r => r.status === 'pending').reduce((s, r) => s + (r.failureCost - r.repairCost), 0).toLocaleString()} DZD.`,
      color: '#8b5cf6',
      contributors: recommendations.filter(r => r.status === 'pending').map(r => ({
        label: r.vehicleIds.join(', '), value: `Confiance: ${r.confidence}%`,
        detail: r.action.substring(0, 60), variant: 'warning' as const,
      })),
    };
  }

  // ====== VARIANCE COUTS KPIs ======
  if (id === 'vc-global') {
    return {
      why: `Variance globale causée par: 2.1% → immobilisation prolongée (NL-014, NL-022), 1.4% → inflation pièces détachées, 0.7% → heures supplémentaires.`,
      trendKey: 'cost', color: '#ef4444',
      contributors: [
        { label: 'Immobilisation prolongée', value: '+2.1%', detail: 'NL-014 (+3j), NL-022 (+2j)', variant: 'critical' as const },
        { label: 'Inflation pièces', value: '+1.4%', detail: 'Hausse fournisseur Q2', variant: 'warning' as const },
        { label: 'Heures supplémentaires', value: '+0.7%', detail: 'Urgences NL-007', variant: 'warning' as const },
      ],
      alerts: ['NL-014: immobilisé 5j vs 2j planifiés — pièce turbo en rupture'],
    };
  }
  if (id === 'vc-worst') {
    return {
      why: `La maintenance est la catégorie la plus déviante à cause des interventions non planifiées (+340% sur Route C-3) et des urgences sur NL-007 et NL-014.`,
      trendKey: 'cost', color: '#ef4444',
      contributors: [
        { label: 'Non planifié Route C-3', value: '+340%', variant: 'critical' as const },
        { label: 'Urgence NL-007', value: '42 000 DZD', variant: 'critical' as const },
        { label: 'Urgence NL-014', value: '28 000 DZD', variant: 'warning' as const },
      ],
    };
  }
  if (id === 'vc-amount') {
    return {
      why: `Montant hors budget décomposé: maintenance non planifiée (77K DZD), heures sup mécaniciens (25K DZD), pièces en hausse de prix (48K DZD).`,
      trendKey: 'cost', color: '#ef4444',
    };
  }
  if (id === 'vc-routes') {
    return {
      why: `Routes en dépassement: Route C-3 (+18.3%), Route A-1 (+5%), Route B-2 (+2%). Route C-3 concentre 65% du dépassement total.`,
      color: '#f59e0b',
      contributors: [
        { label: 'Route C-3', value: '+18.3%', detail: 'Maintenance +340%', variant: 'critical' as const },
        { label: 'Route A-1', value: '+5.0%', detail: 'Carburant en hausse', variant: 'warning' as const },
        { label: 'Route B-2', value: '+2.0%', detail: 'Légèrement au-dessus', variant: 'warning' as const },
      ],
    };
  }

  // ====== TCO VEHICULE KPIs ======
  if (id === 'tco-avg') {
    const avg = Math.round(vehicles.reduce((s, v) => s + v.tco, 0) / vehicles.length);
    return {
      why: `TCO moyen: ${(avg / 1000).toFixed(0)}K DZD. Composé de: acquisition (~30%), carburant (~25%), maintenance (~25%), main d'œuvre (~10%), immobilisation (~10%).`,
      trendKey: 'cost', color: '#f59e0b',
      contributors: vehicles.sort((a, b) => b.tco - a.tco).slice(0, 5).map(v => ({
        label: v.id, value: `${(v.tco / 1000).toFixed(0)}K DZD`, variant: v.tco > avg * 1.2 ? 'critical' as const : 'default' as const,
      })),
    };
  }
  if (id === 'tco-max') {
    const max = vehicles.reduce((m, v) => v.tco > m.tco ? v : m);
    return {
      why: `${max.id} est le véhicule le plus coûteux avec un TCO de ${(max.tco / 1000).toFixed(0)}K DZD. Maintenance YTD: ${(max.maintenanceCostYTD / 1000).toFixed(0)}K, Downtime: ${(max.downtimeCostYTD / 1000).toFixed(0)}K.`,
      color: '#ef4444',
      contributors: [
        { label: 'Maintenance', value: `${max.maintenanceCostYTD.toLocaleString()} DZD`, variant: 'critical' as const },
        { label: 'Downtime', value: `${max.downtimeCostYTD.toLocaleString()} DZD`, variant: 'warning' as const },
        { label: 'Coût/km', value: `${max.costPerKm} DZD`, variant: 'default' as const },
      ],
    };
  }
  if (id === 'tco-over') {
    const avg = Math.round(vehicles.reduce((s, v) => s + v.tco, 0) / vehicles.length);
    return {
      why: `${vehicles.filter(v => v.tco > avg * 1.2).length} véhicules dépassent le TCO cible (>20% au-dessus de la moyenne de ${(avg / 1000).toFixed(0)}K DZD). Remplacement ou optimisation recommandé.`,
      color: '#ef4444',
      contributors: vehicles.filter(v => v.tco > avg * 1.2).sort((a, b) => b.tco - a.tco).slice(0, 5).map(v => ({
        label: v.id, value: `${(v.tco / 1000).toFixed(0)}K DZD`, detail: `+${Math.round((v.tco / avg - 1) * 100)}% vs moyenne`, variant: 'critical' as const,
      })),
    };
  }
  if (id === 'tco-savings') {
    return {
      why: `Économies potentielles identifiées en remplaçant ou optimisant les véhicules dépassant le TCO cible. Inclut réduction maintenance, optimisation routes, remplacement fin de vie.`,
      color: '#22c55e',
    };
  }

  // ====== CARBURANT & MAIN D'OEUVRE KPIs ======
  if (id === 'cm-fuel') {
    return {
      why: `Coût carburant total basé sur la consommation par route et conducteur. Route C-3 présente la consommation la plus élevée à 18.9 L/100km (conducteur D-007).`,
      trendKey: 'cost', color: '#f59e0b',
      contributors: controllingKPIs.fuelCostByRoute.sort((a, b) => b.cost - a.cost).map(r => ({
        label: r.route, value: `${r.cost.toLocaleString()} DZD`, variant: r.route === 'Route C-3' ? 'critical' as const : 'default' as const,
      })),
    };
  }
  if (id === 'cm-costkmfuel') {
    return {
      why: `Coût/km carburant influencé par les conditions de route, style de conduite et état des véhicules. Optimisation possible via coaching conducteurs.`,
      color: '#f59e0b',
    };
  }
  if (id === 'cm-labour') {
    return {
      why: `Main d'œuvre totale: conducteurs ${controllingKPIs.labourCost.drivers.toLocaleString()} DZD + mécaniciens ${controllingKPIs.labourCost.mechanics.toLocaleString()} DZD + heures sup ${controllingKPIs.labourCost.overtime.toLocaleString()} DZD.`,
      color: '#3b82f6',
      contributors: [
        { label: 'Conducteurs', value: `${controllingKPIs.labourCost.drivers.toLocaleString()} DZD`, variant: 'default' as const },
        { label: 'Mécaniciens', value: `${controllingKPIs.labourCost.mechanics.toLocaleString()} DZD`, variant: 'default' as const },
        { label: 'Heures sup.', value: `${controllingKPIs.labourCost.overtime.toLocaleString()} DZD`, variant: 'critical' as const },
      ],
    };
  }
  if (id === 'cm-overtime') {
    return {
      why: `Heures supplémentaires en hausse dues aux urgences sur NL-007 (freins + pompe) et NL-014 (turbo). Mechanic A a accumulé 32h de sup ce mois.`,
      color: '#ef4444',
      contributors: [
        { label: 'Mechanic A', value: '32h sup', detail: 'Urgences NL-007, NL-014', variant: 'critical' as const },
        { label: 'D-007', value: '24h sup', detail: 'Remplacement conducteur NL-007', variant: 'warning' as const },
        { label: 'D-014', value: '18h sup', detail: 'Route C-3 surcharge', variant: 'warning' as const },
      ],
    };
  }
  if (id === 'cm-worstdriver') {
    return {
      why: `D-007 consomme 18.9 L/100km sur Route C-3, soit +30% au-dessus de la moyenne flotte de 14.5 L/100km. Coaching recommandé.`,
      color: '#ef4444',
      contributors: [
        { label: 'D-007 (Route C-3)', value: '18.9 L/100km', detail: '+30% vs moyenne', variant: 'critical' as const },
        { label: 'D-014 (Route C-3)', value: '17.7 L/100km', detail: '+22% vs moyenne', variant: 'critical' as const },
        { label: 'D-008 (Route B-2)', value: '15.1 L/100km', detail: '+4% vs moyenne', variant: 'warning' as const },
      ],
    };
  }

  // ====== ROI MAINTENANCE KPIs ======
  if (id === 'roi-global') {
    const approved2 = recommendations.filter(r => r.status === 'approved');
    const roi2 = approved2.length > 0 ? Math.round((approved2.reduce((s, r) => s + (r.failureCost - r.repairCost), 0) / approved2.reduce((s, r) => s + r.repairCost, 0)) * 100) : 0;
    return {
      why: `ROI global de ${roi2}%: chaque DZD investi en maintenance préventive basée sur IA évite en moyenne ${(roi2 / 100).toFixed(1)} DZD en coûts de panne.`,
      color: '#22c55e',
      contributors: recommendations.map(r => ({
        label: r.vehicleIds.join(', '), value: `${Math.round(((r.failureCost - r.repairCost) / r.repairCost) * 100)}%`,
        detail: r.action.substring(0, 50), variant: r.status === 'approved' ? 'default' as const : 'warning' as const,
      })),
    };
  }
  if (id === 'roi-saved') {
    return {
      why: `Montant économisé grâce aux recommandations approuvées. Représente la différence entre coût de panne évitée et coût de réparation préventive.`,
      color: '#22c55e',
    };
  }
  if (id === 'roi-approved') {
    return {
      why: `${recommendations.filter(r => r.status === 'approved').length} recommandations ont été approuvées et exécutées. Suivi post-action en cours pour valider l'impact.`,
      color: '#22c55e',
      contributors: recommendations.filter(r => r.status === 'approved').map(r => ({
        label: r.vehicleIds.join(', '), value: `${(r.failureCost - r.repairCost).toLocaleString()} DZD économisés`,
        variant: 'default' as const,
      })),
    };
  }
  if (id === 'roi-deferred') {
    return {
      why: `${recommendations.filter(r => r.status === 'deferred').length} recommandations différées. Risque: le coût de panne augmente avec le temps. Réévaluation recommandée sous 7 jours.`,
      color: '#f59e0b',
      contributors: recommendations.filter(r => r.status === 'deferred').map(r => ({
        label: r.vehicleIds.join(', '), value: `${r.failureCost.toLocaleString()} DZD à risque`,
        detail: r.action.substring(0, 50), variant: 'warning' as const,
      })),
    };
  }
  if (id === 'roi-avoided') {
    return {
      why: `Coût total évitable si toutes les recommandations sont acceptées. Calcul: somme des (coût panne - coût réparation) pour chaque recommandation.`,
      color: '#8b5cf6',
      contributors: recommendations.map(r => ({
        label: r.vehicleIds.join(', '), value: `${(r.failureCost - r.repairCost).toLocaleString()} DZD`,
        detail: `Confiance: ${r.confidence}%`, variant: r.status === 'pending' ? 'warning' as const : 'default' as const,
      })),
    };
  }

  // Generic drawer for detail clicks (variance detail, vehicle TCO, fuel row, labour row, alert detail, rec detail)
  if (id.startsWith('vc-detail-')) {
    const cat = id.replace('vc-detail-', '');
    return {
      why: cat === 'Maintenance' 
        ? `Variance maintenance: 2.1% → immobilisation prolongée (NL-014, NL-022) / 1.4% → inflation pièces détachées / 0.7% → heures supplémentaires mécaniciens.`
        : cat === 'Carburant'
        ? `Variance carburant: hausse prix +3%, surconsommation Route C-3 (+18%), conducteur D-047 freinage brusque.`
        : `Variance ${cat}: décomposition détaillée disponible. Principaux facteurs identifiés par l'analyse IA.`,
      trendKey: 'cost', color: '#ef4444',
    };
  }
  if (id.startsWith('tco-vehicle-')) {
    const vid = id.replace('tco-vehicle-', '');
    const veh = vehicles.find(v => v.id === vid);
    if (veh) {
      return {
        why: `TCO ${veh.id}: ${veh.tco.toLocaleString()} DZD. Maintenance: ${veh.maintenanceCostYTD.toLocaleString()} DZD, Downtime: ${veh.downtimeCostYTD.toLocaleString()} DZD, Coût/km: ${veh.costPerKm} DZD. ${veh.type}, acquis en ${veh.acquisitionDate}.`,
        trendKey: 'cost', color: '#f59e0b',
        contributors: [
          { label: 'Carburant (est.)', value: `${Math.round(veh.tco * 0.4).toLocaleString()} DZD`, variant: 'default' as const },
          { label: 'Maintenance', value: `${veh.maintenanceCostYTD.toLocaleString()} DZD`, variant: veh.maintenanceCostYTD > 120000 ? 'critical' as const : 'default' as const },
          { label: 'Downtime', value: `${veh.downtimeCostYTD.toLocaleString()} DZD`, variant: veh.downtimeCostYTD > 40000 ? 'warning' as const : 'default' as const },
        ],
      };
    }
  }
  if (id.startsWith('cm-fuelrow-')) {
    const driver = id.replace('cm-fuelrow-', '');
    return {
      why: `Consommation détaillée de ${driver}. Analyse des tendances de consommation, comparaison avec la moyenne flotte, et identification d'anomalies.`,
      trendKey: 'cost', color: '#f59e0b',
    };
  }
  if (id.startsWith('cm-labourrow-')) {
    const name = id.replace('cm-labourrow-', '');
    return {
      why: `Détail main d'œuvre pour ${name}. Heures normales, heures supplémentaires, et identification d'anomalies de coût.`,
      color: '#3b82f6',
    };
  }
  if (id.startsWith('alert-detail-')) {
    return {
      why: `Chaîne d'événements: détection anomalie OBD → validation par analyse RUL → corrélation comportement conducteur → évaluation financière. Action recommandée par le module IA avec évaluation coût/bénéfice.`,
      trendKey: 'health', color: '#ef4444',
      alerts: ['Source: module prédictif IA — confiance >80%', 'Impact cascade potentiel sur routes associées'],
    };
  }
  if (id.startsWith('roi-rec-')) {
    const recId = id.replace('roi-rec-', '');
    const rec = recommendations.find(r => r.id === recId);
    if (rec) {
      return {
        why: `Recommandation ${rec.id}: ${rec.action}. Signaux déclencheurs: ${rec.signals.join(', ')}. ROI: ${Math.round(((rec.failureCost - rec.repairCost) / rec.repairCost) * 100)}%.`,
        color: '#8b5cf6',
        contributors: rec.signals.map(s => ({
          label: s, value: 'Signal actif', variant: 'warning' as const,
        })),
      };
    }
  }

  // Default fallback
  return {
    why: 'Données détaillées pour ce KPI. Analyse approfondie disponible.',
    trendKey: 'cost',
    color: '#f59e0b',
  };
}
