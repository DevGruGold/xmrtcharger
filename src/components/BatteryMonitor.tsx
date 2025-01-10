import React from 'react';
import { Card } from '@/components/ui/card';
import { useBattery } from '@/hooks/useBattery';
import { BatteryStatusDisplay } from './battery/BatteryStatus';
import { DischargeWarning } from './battery/DischargeWarning';
import { ChargingTips } from './battery/ChargingTips';

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

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <BatteryStatusDisplay batteryStatus={batteryStatus} />
      <DischargeWarning show={batteryStatus.isRapidDischarge ?? false} />
      <ChargingTips show={batteryStatus.charging} />
    </Card>
  );
};