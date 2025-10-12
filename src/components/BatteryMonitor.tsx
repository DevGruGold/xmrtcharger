import React from 'react';
import { Card } from '@/components/ui/card';
import { useBattery } from '@/hooks/useBattery';
import { BatteryStatusDisplay } from './battery/BatteryStatus';
import { IntelligentDischargeWarning } from './battery/IntelligentDischargeWarning';
import { ChargingTips } from './battery/ChargingTips';

export const BatteryMonitor = () => {
  const { batteryStatus, error, drainAnalysis } = useBattery();

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

  const dischargeRate = batteryStatus.isRapidDischarge && drainAnalysis 
    ? (drainAnalysis.specificDetails.longTasks || 0) / 30 // Rough estimate
    : 0;

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <BatteryStatusDisplay batteryStatus={batteryStatus} />
      {batteryStatus.isRapidDischarge && (
        <IntelligentDischargeWarning 
          drainAnalysis={drainAnalysis}
          currentDischargeRate={dischargeRate || 2}
        />
      )}
      <ChargingTips show={batteryStatus.charging} />
    </Card>
  );
};