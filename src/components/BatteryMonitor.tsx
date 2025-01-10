import React from 'react';
import { Battery, Plane, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBattery } from '@/hooks/useBattery';
import { cn } from '@/lib/utils';

const getChargingSpeedAnimation = (speed?: string) => {
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

const getChargingSpeedColor = (speed?: string) => {
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

export const BatteryMonitor = () => {
  const { batteryStatus, error } = useBattery();

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!batteryStatus) {
    return (
      <div className="p-4 text-center">
        Loading battery information...
      </div>
    );
  }

  const { charging, level, chargingSpeed } = batteryStatus;

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="flex items-center justify-center space-x-4">
        <Battery className={cn(
          "w-12 h-12",
          charging ? getChargingSpeedColor(chargingSpeed) : "text-discharging",
          charging && getChargingSpeedAnimation(chargingSpeed)
        )} />
        <div className="text-2xl font-bold">
          {level.toFixed(1)}%
        </div>
      </div>

      <div className="text-center text-lg font-medium">
        Status: {charging ? (
          <span className={getChargingSpeedColor(chargingSpeed)}>
            {chargingSpeed?.charAt(0).toUpperCase()}{chargingSpeed?.slice(1)} Charging
          </span>
        ) : (
          <span className="text-discharging">Discharging</span>
        )}
      </div>

      {charging && (
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            To optimize charging speed, consider enabling:
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
              onClick={() => window.open('https://support.apple.com/en-us/HT201974')}
            >
              <Plane className="w-4 h-4" />
              <span>Airplane Mode</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
              onClick={() => window.open('https://support.apple.com/en-us/HT205234')}
            >
              <Zap className="w-4 h-4" />
              <span>Battery Saver</span>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            (Links to instructions for enabling these modes)
          </div>
        </div>
      )}
    </Card>
  );
};