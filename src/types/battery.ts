export type ChargingSpeed = 'slow' | 'normal' | 'fast' | 'supercharge';
export type DeviceType = 'pc' | 'tablet' | 'phone' | 'unknown';
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';

export interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  chargingSpeed?: ChargingSpeed;
  isRapidDischarge?: boolean;
}

export interface BrowserCompatibility {
  supported: boolean;
  message: string;
  recommendation: string | null;
}

export interface DeviceInfo {
  deviceType: DeviceType;
  browser: BrowserType;
  os: string;
  batterySupported: boolean;
  browserInfo: BrowserCompatibility;
}

export interface BatteryHealthMetrics {
  healthScore: number; // 0-100
  degradationLevel: 'excellent' | 'good' | 'fair' | 'poor';
  averageChargingSpeed: ChargingSpeed;
  chargingEfficiency: number; // 0-100
  temperatureImpact: 'optimal' | 'warm' | 'hot';
  portQuality: 'excellent' | 'good' | 'needs-cleaning';
}

export interface ChargingSession {
  timestamp: number;
  startLevel: number;
  endLevel: number;
  duration: number;
  speed: ChargingSpeed;
  efficiency: number;
}

export interface OptimizationTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  impact: 'high' | 'medium' | 'low';
  category: 'preparation' | 'during' | 'maintenance';
}

export type ChargingMode = 'turbo' | 'health' | 'emergency' | 'calibration' | 'standard';

export interface ChargingModeConfig {
  name: string;
  description: string;
  icon: string;
  tasks: OptimizationTask[];
  expectedImprovement: string;
}
