import { Ward, AQICategory, PollutantBreakdown, WeatherData } from '../types';

// Expanded Metadata for Pan-India Coverage
const CITIES_METADATA = [
  // DELHI NCR
  { name: 'Connaught Place', city: 'New Delhi', zone: 'North' },
  { name: 'Rohini', city: 'Delhi', zone: 'North West' },
  { name: 'Dwarka', city: 'Delhi', zone: 'South West' },
  { name: 'Okhla Ind. Area', city: 'Delhi', zone: 'South East' },
  { name: 'Shahdara', city: 'Delhi', zone: 'East' },
  
  // MUMBAI
  { name: 'Andheri West', city: 'Mumbai', zone: 'Western Suburbs' },
  { name: 'Bandra Kurla', city: 'Mumbai', zone: 'Central' },
  { name: 'Colaba', city: 'Mumbai', zone: 'South' },
  { name: 'Dadar', city: 'Mumbai', zone: 'Central' },
  { name: 'Powai', city: 'Mumbai', zone: 'North East' },

  // BANGALORE
  { name: 'Indiranagar', city: 'Bangalore', zone: 'East' },
  { name: 'Koramangala', city: 'Bangalore', zone: 'South' },
  { name: 'Whitefield', city: 'Bangalore', zone: 'IT Corridor' },
  { name: 'Malleshwaram', city: 'Bangalore', zone: 'North' },

  // CHENNAI
  { name: 'T. Nagar', city: 'Chennai', zone: 'Central' },
  { name: 'Adyar', city: 'Chennai', zone: 'South' },
  
  // HYDERABAD
  { name: 'Banjara Hills', city: 'Hyderabad', zone: 'Central' },
  { name: 'Hitech City', city: 'Hyderabad', zone: 'West' },

  // KOLKATA
  { name: 'Salt Lake', city: 'Kolkata', zone: 'East' },
  { name: 'Park Street', city: 'Kolkata', zone: 'Central' },
  
  // PUNE
  { name: 'Koregaon Park', city: 'Pune', zone: 'East' },
  { name: 'Hinjewadi', city: 'Pune', zone: 'West' }
];

const getCategory = (aqi: number): AQICategory => {
  if (aqi <= 50) return AQICategory.GOOD;
  if (aqi <= 100) return AQICategory.MODERATE;
  if (aqi <= 200) return AQICategory.POOR;
  return AQICategory.SEVERE;
};

const generateRandomTrend = (base: number, length: number): number[] => {
  return Array.from({ length }, () => Math.max(0, Math.round(base + (Math.random() * 40 - 20))));
};

// Helper to generate a grid-based SVG path
// This allows us to map ANY number of wards to a visual dashboard grid
const generateGridPath = (index: number, total: number) => {
    const cols = 5; // 5 columns in the grid
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Grid settings
    const size = 60; // Size of each cell
    const gap = 8;   // Gap between cells
    const offsetX = 20;
    const offsetY = 20;

    const x = offsetX + col * (size + gap);
    const y = offsetY + row * (size + gap);

    // Create a slightly irregular polygon to look like a map ward, not just a square
    // using a deterministic pseudo-random based on index
    const r = (n: number) => (Math.sin(index * n) * 5); 
    
    const p1 = `${x + r(1)},${y + r(2)}`;
    const p2 = `${x + size + r(3)},${y + r(4)}`;
    const p3 = `${x + size + r(5)},${y + size + r(6)}`;
    const p4 = `${x + r(7)},${y + size + r(8)}`;

    return {
        path: `M${p1} L${p2} L${p3} L${p4} Z`,
        center: [x + size/2, y + size/2] as [number, number]
    };
};

export const generateInitialWards = (): Ward[] => {
  return CITIES_METADATA.map((meta, index) => {
    // Generate Simulation Data
    let baseAqi = 100;
    let trafficBase = 50;
    let sources = ['Traffic'];

    // City profiles
    if (meta.city === 'Delhi') { baseAqi = 250; sources = ['Vehicular', 'Stubble Burning']; }
    if (meta.city === 'Mumbai') { baseAqi = 140; sources = ['Construction', 'Traffic']; }
    if (meta.city === 'Bangalore') { baseAqi = 90; sources = ['Traffic', 'Dust']; }
    if (meta.city === 'Kolkata') { baseAqi = 180; sources = ['Industrial', 'Bio-mass']; }
    if (meta.name.includes('Ind') || meta.name.includes('Tech')) { baseAqi += 50; trafficBase += 30; }

    const currentAqi = Math.max(20, Math.round(baseAqi + (Math.random() * 60 - 30)));
    const gridLayout = generateGridPath(index, CITIES_METADATA.length);

    return {
      id: `${meta.city.substring(0,3).toUpperCase()}-${index+10}`,
      name: `${meta.name}, ${meta.city}`,
      zone: meta.zone,
      population: Math.floor(Math.random() * 500000) + 50000,
      primarySources: sources,
      pois: [meta.zone, 'City Center', 'Main Market'],
      aqi: currentAqi,
      category: getCategory(currentAqi),
      pollutants: {
        pm25: Math.round(currentAqi * 0.55),
        pm10: Math.round(currentAqi * 0.8),
        no2: Math.round(currentAqi * 0.3),
        co: Number((Math.random() * 2).toFixed(1)),
        o3: Math.round(Math.random() * 50),
      },
      weather: {
        temperature: 28 + Math.random() * 5,
        humidity: 60 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 10,
        direction: 'NW',
      },
      trafficIndex: Math.min(100, Math.round(trafficBase + Math.random() * 20)),
      activeConstructionSites: Math.floor(Math.random() * 5),
      trend: generateRandomTrend(currentAqi, 24),
      forecast: generateRandomTrend(currentAqi, 24),
      path: gridLayout.path,
      center: gridLayout.center
    };
  });
};

export const simulateLiveUpdate = (wards: Ward[]): Ward[] => {
  return wards.map(ward => {
    const variance = Math.random() * 10 - 5; 
    const newAqi = Math.max(20, Math.round(ward.aqi + variance));
    
    // Shift trend
    const newTrend = [...ward.trend.slice(1), newAqi];

    return {
      ...ward,
      aqi: newAqi,
      category: getCategory(newAqi),
      trend: newTrend,
      trafficIndex: Math.min(100, Math.max(0, ward.trafficIndex + (Math.random() * 6 - 3))),
      pollutants: {
        ...ward.pollutants,
        pm25: Math.round(newAqi * 0.55),
        pm10: Math.round(newAqi * 0.8),
      }
    };
  });
};