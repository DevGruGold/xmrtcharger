import { ChargingSpeed } from '@/types/battery';

export const getChargingSpeedAnimation = (speed?: string) => {
  switch (speed) {
    case 'supercharge':
      return 'animate-[pulse_0.5s_ease-in-out_infinite]';
    case 'fast':
      return 'animate-[pulse_1s_ease-in-out_infinite]';
    case 'normal':
      return 'animate-[pulse_2s_ease-in-out_infinite]';
    case 'slow':
      return 'animate-[pulse_3s_ease-in-out_infinite]';
    default:
      return '';
  }
};

export const getChargingSpeedColor = (speed?: ChargingSpeed) => {
  switch (speed) {
    case 'supercharge':
      return 'text-purple-500';
    case 'fast':
      return 'text-blue-500';
    case 'normal':
      return 'text-charging';
    case 'slow':
      return 'text-yellow-500';
    default:
      return 'text-discharging';
  }
};