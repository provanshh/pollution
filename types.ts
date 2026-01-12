export enum AQICategory {
  GOOD = 'Good',
  MODERATE = 'Moderate',
  POOR = 'Poor',
  SEVERE = 'Severe'
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  direction: string;
}

export interface PollutantBreakdown {
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  o3: number;
}

export interface Ward {
  id: string;
  name: string;
  zone: string;
  population: number;
  primarySources: string[];
  pois: string[]; // Added Points of Interest
  aqi: number;
  category: AQICategory;
  pollutants: PollutantBreakdown;
  weather: WeatherData;
  trafficIndex: number; // 0-100 scale
  activeConstructionSites: number;
  trend: number[]; // Last 24 hours trend
  forecast: number[]; // Next 24 hours forecast
  path: string; // SVG path for map
  center: [number, number]; // Center coordinate for labels
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Implemented';
  targetWardId?: string;
}

export interface CitizenReport {
  id: string;
  type: 'Garbage Burning' | 'Construction Dust' | 'Industrial Smoke' | 'Vehicle Emission' | 'Other';
  description: string;
  timestamp: number;
  status: 'Received' | 'Investigating' | 'Resolved';
  location: string;
}

export interface GovAction {
  id: string;
  title: string;
  status: 'Ongoing' | 'Planned' | 'Completed';
  department: string;
  lastUpdated: string;
}

export enum ViewMode {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  TRENDS = 'TRENDS',
  ADMIN = 'ADMIN',
  CITIZEN = 'CITIZEN'
}