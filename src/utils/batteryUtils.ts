import { ChargingSpeed } from '@/types/battery';

export const determineChargingSpeed = (chargingTime: number): ChargingSpeed => {
  if (chargingTime === Infinity) return 'normal';
  if (chargingTime <= 3000) return 'supercharge';
  if (chargingTime <= 5000) return 'fast';
  if (chargingTime <= 7000) return 'normal';
  return 'slow';
};

export const checkRapidDischarge = (currentLevel: number, previousLevel: number | null): boolean => {
  if (previousLevel === null) return false;
  const dischargeRate = previousLevel - currentLevel;
  return dischargeRate >= 2;
};