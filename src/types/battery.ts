export type ChargingSpeed = 'slow' | 'normal' | 'fast' | 'supercharge';

export interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  chargingSpeed?: ChargingSpeed;
}