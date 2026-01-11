import { Ward, AQICategory, PollutantBreakdown, WeatherData } from '../types';

// Real Delhi Ward Representation (Abstracted Grid for Map)
// We map these to relative SVG coordinates for the dashboard map
export const WARDS_METADATA = [
  { 
    id: 'DL-N01', 
    name: 'Rohini / North West', 
    zone: 'North Delhi', 
    pois: ['Adventure Island', 'Japanese Park', 'Metro Walk'],
    path: 'M10,10 L110,10 L110,110 L10,110 Z', 
    center: [60, 60] 
  },
  { 
    id: 'DL-N02', 
    name: 'Civil Lines / University', 
    zone: 'North Delhi', 
    pois: ['Delhi University', 'Majnu ka Tila', 'Vidhan Sabha'],
    path: 'M120,10 L220,10 L220,110 L120,110 Z', 
    center: [170, 60] 
  },
  { 
    id: 'DL-E01', 
    name: 'Shahdara / North East', 
    zone: 'East Delhi', 
    pois: ['Cross River Mall', 'Yamuna Sports Complex', 'Dilshad Garden'],
    path: 'M230,10 L330,10 L330,110 L230,110 Z', 
    center: [280, 60] 
  },
  { 
    id: 'DL-W01', 
    name: 'Dwarka / West Delhi', 
    zone: 'West Delhi', 
    pois: ['IGI Airport', 'Vegas Mall', 'NSUT'],
    path: 'M10,120 L110,120 L110,220 L10,220 Z', 
    center: [60, 170] 
  },
  { 
    id: 'DL-C01', 
    name: 'Connaught Place / Central', 
    zone: 'New Delhi', 
    pois: ['Rajiv Chowk', 'India Gate', 'Jantar Mantar', 'Bangla Sahib'],
    path: 'M120,120 L220,120 L220,220 L120,220 Z', 
    center: [170, 170] 
  },
  { 
    id: 'DL-E02', 
    name: 'Mayur Vihar / Laxmi Nagar', 
    zone: 'East Delhi', 
    pois: ['Akshardham Temple', 'V3S Mall', 'Nirman Vihar'],
    path: 'M230,120 L330,120 L330,220 L230,220 Z', 
    center: [280, 170] 
  },
  { 
    id: 'DL-S01', 
    name: 'Vasant Kunj / Mahipalpur', 
    zone: 'South West', 
    pois: ['Ambience Mall', 'JNU Campus', 'DLF Promenade'],
    path: 'M10,230 L110,230 L110,330 L10,330 Z', 
    center: [60, 280] 
  },
  { 
    id: 'DL-S02', 
    name: 'Hauz Khas / Greater Kailash', 
    zone: 'South Delhi', 
    pois: ['Hauz Khas Fort', 'Lotus Temple', 'Siri Fort'],
    path: 'M120,230 L220,230 L220,330 L120,330 Z', 
    center: [170, 280] 
  },
  { 
    id: 'DL-SE1', 
    name: 'Okhla / Sarita Vihar', 
    zone: 'South East', 
    pois: ['Jamia Millia Islamia', 'Kalindi Kunj', 'Apollo Hospital'],
    path: 'M230,230 L330,230 L330,330 L230,330 Z', 
    center: [280, 280] 
  },
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

export const generateInitialWards = (): Ward[] => {
  return WARDS_METADATA.map((meta, index) => {
    // Determine baseline based on real Delhi characteristics
    let baseAqi = 180; // Delhi average baseline is generally poor
    let sources = ['Vehicular Emissions'];
    let trafficBase = 60;
    let constructionCount = 2;
    
    if (meta.name.includes('Okhla') || meta.name.includes('Industrial')) {
      baseAqi = 320; // Severe
      sources = ['Industrial Exhaust', 'Waste Burning', 'Dust'];
      trafficBase = 85;
      constructionCount = 8;
    } else if (meta.name.includes('Dwarka') || meta.name.includes('Vasant')) {
      baseAqi = 150; // Moderate/Poor
      sources = ['Dust', 'Construction', 'Aircraft Emissions'];
      trafficBase = 45;
      constructionCount = 4;
    } else if (meta.name.includes('Connaught') || meta.name.includes('Hauz Khas')) {
      baseAqi = 210; // Poor
      sources = ['Heavy Traffic', 'Restaurant Emissions'];
      trafficBase = 95;
      constructionCount = 1;
    } else if (meta.name.includes('Shahdara')) {
      baseAqi = 280; // Very Poor
      sources = ['Congestion', 'Biomass Burning', 'Local Industry'];
      trafficBase = 90;
      constructionCount = 5;
    }

    // Add some random variance
    const currentAqi = Math.max(0, Math.round(baseAqi + (Math.random() * 60 - 30)));

    return {
      id: meta.id,
      name: meta.name,
      zone: meta.zone,
      pois: meta.pois,
      path: meta.path,
      center: meta.center as [number, number],
      population: Math.floor(Math.random() * 500000) + 100000,
      primarySources: sources,
      aqi: currentAqi,
      category: getCategory(currentAqi),
      pollutants: {
        pm25: Math.round(currentAqi * 0.6),
        pm10: Math.round(currentAqi * 0.85),
        no2: Math.round(currentAqi * 0.25),
        co: Number((Math.random() * 3).toFixed(1)),
        o3: Math.round(Math.random() * 60),
      },
      weather: {
        temperature: 32 + Math.random() * 3,
        humidity: 45 + Math.random() * 10,
        windSpeed: 8 + Math.random() * 5,
        direction: 'NW',
      },
      trafficIndex: Math.min(100, Math.round(trafficBase + (Math.random() * 15 - 5))),
      activeConstructionSites: constructionCount,
      trend: generateRandomTrend(currentAqi, 24),
      forecast: generateRandomTrend(currentAqi, 24),
    };
  });
};

export const simulateLiveUpdate = (wards: Ward[]): Ward[] => {
  return wards.map(ward => {
    // Delhi specific volatility
    const variance = Math.random() * 12 - 6; 
    const newAqi = Math.max(0, Math.round(ward.aqi + variance));
    const newTraffic = Math.min(100, Math.max(0, ward.trafficIndex + (Math.random() * 8 - 4)));
    
    // Shift trend
    const newTrend = [...ward.trend.slice(1), newAqi];

    // Jitter forecast 
    const newForecast = ward.forecast.map(val => {
        const change = Math.random() * 4 - 2;
        return Math.max(0, Math.round(val + change));
    });

    return {
      ...ward,
      aqi: newAqi,
      trafficIndex: Math.round(newTraffic),
      category: getCategory(newAqi),
      trend: newTrend,
      forecast: newForecast,
      pollutants: {
        ...ward.pollutants,
        pm25: Math.round(newAqi * 0.6),
        pm10: Math.round(newAqi * 0.85),
      }
    };
  });
};