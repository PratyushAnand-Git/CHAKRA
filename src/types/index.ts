// Project CHAKRA Core Data Schema

export type CrudeGradeType = 'Heavy Sour' | 'Medium Sour' | 'Light Sweet' | 'Extra Heavy';

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Chokepoint {
  id: string;
  name: string;
  coordinates: Location;
  dailyVolumeBpd: number; // e.g. 21,000,000 bpd for Hormuz
  cviScore: number; // Corridor Vulnerability Index 0 - 100
  status: 'OPTIMAL' | 'ELEVATED_RISK' | 'CRITICAL_ALERT' | 'PARTIAL_BLOCKADE';
  description: string;
}

export interface SupplierWellhead {
  id: string;
  name: string;
  country: string;
  crudeGrade: CrudeGradeType;
  apiGravity: number;
  sulfurContent: number; // % weight
  spotPriceUsd: number;
  coordinates: Location;
}

export interface Refinery {
  id: string;
  name: string;
  locationName: string;
  capacityBpd: number;
  currentRunRatePercent: number;
  preferredCrude: CrudeGradeType;
  maxSulfurTolerancePercent: number;
  coordinates: Location;
}

export interface StrategicReserveSPR {
  id: string;
  name: string;
  capacityMillionBarrels: number;
  currentLevelMillionBarrels: number;
  maxDrawdownBpd: number;
  coordinates: Location;
}

export interface AISVessel {
  mmsi: string;
  vesselName: string;
  capacityBbls: number;
  currentPayload: CrudeGradeType;
  origin: string;
  destination: string;
  coordinates: Location;
  heading: number;
  speedKnots: number;
  status: 'UNDERWAY' | 'REROUTED' | 'DELAYED' | 'DISCHARGING';
  currentChokepointId?: string;
}

// Multi-Agent Reasoning Types
export interface RiskIntelligenceOutput {
  timestamp: string;
  overallCvi: number;
  chokepointScores: Record<string, number>;
  activeThreatSignals: Array<{
    id: string;
    source: string;
    headline: string;
    impactDelta: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: string;
  }>;
  confidenceScore: number;
}

export interface DisruptionSimulationOutput {
  scenarioId: string;
  scenarioTitle: string;
  delayedCrudeVolumeBpd: number;
  affectedTankersCount: number;
  refineryImpacts: Array<{
    refineryId: string;
    refineryName: string;
    projectedRunRateDrop: number; // percentage drop
  }>;
  economicImpact: {
    domesticDieselPriceSpikeInr: number; // e.g. +4.50 INR/L
    powerSectorCoalOilSubstitutionStress: string;
    projectedQuarterlyGdpDipPercent: number; // e.g. -0.12%
    nationalSupplyStabilizationDays: number; // e.g. 47 days baseline vs 4 days with CHAKRA
  };
}

export interface ProcurementRecommendation {
  playbookId: string;
  timestamp: string;
  targetRefineryId: string;
  targetRefineryName: string;
  originalSupplier: string;
  recommendedSupplier: string;
  recommendedRoute: string;
  crudeGrade: CrudeGradeType;
  volumeBpd: number;
  blendingStrategy?: string; // e.g. "Blend 70% Bonny Light with 30% Latin Heavy to match sour assay"
  costPremiumUsdPerBbl: number;
  transitTimeDeltaDays: number;
  riskReductionPercent: number;
  refineryAssayMatchScore: number; // 0 - 100%
  financialImpactTotalUsdDay: number;
  status: 'PENDING_APPROVAL' | 'EXECUTED' | 'REJECTED';
}

export interface SPROptimizationOutput {
  recommendedReleaseRateBpd: number;
  bufferDaysRemaining: number;
  drawdownSchedule: Array<{
    day: number;
    releaseVolumeBpd: number;
    remainingReserveMillionBbls: number;
  }>;
  replenishmentWindowEstimateDays: number;
  policyAdvice: string;
}

export interface LiveThreatSignal {
  id: string;
  headline: string;
  source: string;          // API source name (e.g. "GDELT", "ReliefWeb", "Wikipedia")
  apiProvider: string;     // Which API returned this
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cviDelta: number;        // How much this affects Corridor Vulnerability Index
  region: string;          // Affected geographic region
  timestamp: string;
  url?: string;            // Link to original article
  energyRelevance: number; // 0-100 score of relevance to energy corridors
}

export interface AgentLogMessage {
  id: string;
  timestamp: string;
  agentName: 'Radar Agent' | 'Sandbox Modeller' | 'Action Engine' | 'SPR Shock Absorber';
  agentColor: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ACTION' | 'OPTIMIZATION';
}
