import {
  Chokepoint,
  SupplierWellhead,
  Refinery,
  StrategicReserveSPR,
  AISVessel
} from '../types';

export const CHOKEPOINTS: Chokepoint[] = [
  {
    id: 'HORMUZ',
    name: 'Strait of Hormuz',
    coordinates: { lat: 26.5667, lng: 56.25 },
    dailyVolumeBpd: 21000000,
    cviScore: 78,
    status: 'CRITICAL_ALERT',
    description: '40-45% of Indian imported crude transits here. High military tension & threat of drone strikes.'
  },
  {
    id: 'BAB_EL_MANDEB',
    name: 'Bab-el-Mandeb Strait',
    coordinates: { lat: 12.5833, lng: 43.3333 },
    dailyVolumeBpd: 6200000,
    cviScore: 84,
    status: 'CRITICAL_ALERT',
    description: 'Houthi missile attacks on Red Sea tanker lanes causing Cape rerouting delays.'
  },
  {
    id: 'MALACCA',
    name: 'Strait of Malacca',
    coordinates: { lat: 2.5, lng: 101.5 },
    dailyVolumeBpd: 16000000,
    cviScore: 22,
    status: 'OPTIMAL',
    description: 'Primary sea lane connecting Indian Ocean with East Asian importers.'
  },
  {
    id: 'SUEZ',
    name: 'Suez Canal',
    coordinates: { lat: 30.705, lng: 32.344 },
    dailyVolumeBpd: 5500000,
    cviScore: 68,
    status: 'ELEVATED_RISK',
    description: 'Congestion & security spillover from Red Sea maritime alerts.'
  }
];

export const SUPPLIERS: SupplierWellhead[] = [
  {
    id: 'BASRA_IRAQ',
    name: 'Basra Oil Terminal (Iraq)',
    country: 'Iraq',
    crudeGrade: 'Medium Sour',
    apiGravity: 30.5,
    sulfurContent: 2.4,
    spotPriceUsd: 81.50,
    coordinates: { lat: 29.7, lng: 48.8 }
  },
  {
    id: 'RAS_TANURA_SAUDI',
    name: 'Ras Tanura (Saudi Arabia)',
    country: 'Saudi Arabia',
    crudeGrade: 'Heavy Sour',
    apiGravity: 28.0,
    sulfurContent: 2.8,
    spotPriceUsd: 83.20,
    coordinates: { lat: 26.64, lng: 50.16 }
  },
  {
    id: 'BONNY_NIGERIA',
    name: 'Bonny Offshore (Nigeria)',
    country: 'Nigeria',
    crudeGrade: 'Light Sweet',
    apiGravity: 35.4,
    sulfurContent: 0.14,
    spotPriceUsd: 86.80,
    coordinates: { lat: 4.43, lng: 7.16 }
  },
  {
    id: 'SANTOS_BRAZIL',
    name: 'Santos Basin (Brazil)',
    country: 'Brazil',
    crudeGrade: 'Medium Sour',
    apiGravity: 29.1,
    sulfurContent: 0.6,
    spotPriceUsd: 84.10,
    coordinates: { lat: -23.96, lng: -46.33 }
  }
];

export const REFINERIES: Refinery[] = [
  {
    id: 'JAMNAGAR',
    name: 'Reliance Jamnagar Mega Refinery',
    locationName: 'Gujarat, West Coast India',
    capacityBpd: 1240000,
    currentRunRatePercent: 88,
    preferredCrude: 'Heavy Sour',
    maxSulfurTolerancePercent: 3.2,
    coordinates: { lat: 22.47, lng: 69.83 }
  },
  {
    id: 'MANGALORE',
    name: 'MRPL Mangalore Refinery',
    locationName: 'Karnataka, South West India',
    capacityBpd: 300000,
    currentRunRatePercent: 82,
    preferredCrude: 'Medium Sour',
    maxSulfurTolerancePercent: 2.5,
    coordinates: { lat: 12.96, lng: 74.82 }
  },
  {
    id: 'VISAKHAPATNAM',
    name: 'HPCL Visakhapatnam Refinery',
    locationName: 'Andhra Pradesh, East Coast India',
    capacityBpd: 300000,
    currentRunRatePercent: 94,
    preferredCrude: 'Light Sweet',
    maxSulfurTolerancePercent: 1.2,
    coordinates: { lat: 17.68, lng: 83.21 }
  },
  {
    id: 'PARADIP',
    name: 'IOCL Paradip Refinery',
    locationName: 'Odisha, East Coast India',
    capacityBpd: 300000,
    currentRunRatePercent: 90,
    preferredCrude: 'Medium Sour',
    maxSulfurTolerancePercent: 2.2,
    coordinates: { lat: 20.27, lng: 86.67 }
  }
];

export const SPR_FACILITIES: StrategicReserveSPR[] = [
  {
    id: 'PADUR',
    name: 'Padur SPR Underground Cavern',
    capacityMillionBarrels: 18.3, // ~2.5 Million Metric Tonnes
    currentLevelMillionBarrels: 15.2,
    maxDrawdownBpd: 400000,
    coordinates: { lat: 13.24, lng: 74.78 }
  },
  {
    id: 'MANGALORE_SPR',
    name: 'Mangalore SPR Facility',
    capacityMillionBarrels: 11.0, // ~1.5 MMT
    currentLevelMillionBarrels: 9.8,
    maxDrawdownBpd: 300000,
    coordinates: { lat: 12.91, lng: 74.85 }
  },
  {
    id: 'VISAKHAPATNAM_SPR',
    name: 'Visakhapatnam Rock Cavern SPR',
    capacityMillionBarrels: 9.7, // ~1.33 MMT
    currentLevelMillionBarrels: 8.5,
    maxDrawdownBpd: 250000,
    coordinates: { lat: 17.71, lng: 83.28 }
  }
];

export const INITIAL_VESSELS: AISVessel[] = [
  {
    mmsi: '931245001',
    vesselName: 'MT Desh Vishal (VLCC)',
    capacityBbls: 2000000,
    currentPayload: 'Medium Sour',
    origin: 'Basra Oil Terminal (Iraq)',
    destination: 'Jamnagar Mega Refinery',
    coordinates: { lat: 24.2, lng: 58.5 }, // Near Gulf of Oman
    heading: 120,
    speedKnots: 11.4,
    status: 'UNDERWAY',
    currentChokepointId: 'HORMUZ'
  },
  {
    mmsi: '942881002',
    vesselName: 'MT Swarna Samridhi (Suezmax)',
    capacityBbls: 1000000,
    currentPayload: 'Heavy Sour',
    origin: 'Ras Tanura (Saudi Arabia)',
    destination: 'MRPL Mangalore Refinery',
    coordinates: { lat: 26.1, lng: 55.4 }, // In Strait of Hormuz
    heading: 105,
    speedKnots: 8.2,
    status: 'DELAYED',
    currentChokepointId: 'HORMUZ'
  },
  {
    mmsi: '951009003',
    vesselName: 'MT Ratna Shalini (VLCC)',
    capacityBbls: 2000000,
    currentPayload: 'Light Sweet',
    origin: 'Bonny Offshore (Nigeria)',
    destination: 'HPCL Visakhapatnam Refinery',
    coordinates: { lat: -34.2, lng: 18.4 }, // Rounding Cape of Good Hope
    heading: 90,
    speedKnots: 14.1,
    status: 'REROUTED'
  },
  {
    mmsi: '963452004',
    vesselName: 'MT Jag Leela (Suezmax)',
    capacityBbls: 1000000,
    currentPayload: 'Medium Sour',
    origin: 'Santos Basin (Brazil)',
    destination: 'IOCL Paradip Refinery',
    coordinates: { lat: -10.5, lng: 65.2 }, // Indian Ocean
    heading: 45,
    speedKnots: 13.5,
    status: 'UNDERWAY'
  }
];
