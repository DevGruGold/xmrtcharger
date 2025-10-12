import { Battery } from 'lucide-react';
import { BatteryStatus as BatteryStatusType } from '@/types/battery';
import { getChargingSpeedAnimation, getChargingSpeedColor } from './BatteryAnimation';
import { cn } from '@/lib/utils';

interface BatteryStatusProps {
  batteryStatus: BatteryStatusType;
}

export const BatteryStatusDisplay = ({ batteryStatus }: BatteryStatusProps) => {
  const { charging, level, chargingSpeed } = batteryStatus;

  return (
    <>
      <div className="flex items-center justify-center space-x-3 sm:space-x-4">
        <Battery className={cn(
          "w-10 h-10 sm:w-12 sm:h-12",
          charging ? getChargingSpeedColor(chargingSpeed) : "text-discharging",
          charging && getChargingSpeedAnimation(chargingSpeed)
        )} />
        <div className="text-xl sm:text-2xl md:text-3xl font-bold">
          {level.toFixed(1)}%
        </div>
      </div>

      <div className="text-center text-base sm:text-lg font-medium">
        Status: {charging ? (
          <span className={getChargingSpeedColor(chargingSpeed)}>
            {chargingSpeed?.charAt(0).toUpperCase()}{chargingSpeed?.slice(1)} Charging
          </span>
        ) : (
          <span className="text-discharging">Discharging</span>
        )}
      </div>
    </>
  );
};