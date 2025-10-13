import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBattery } from '@/hooks/useBattery';
import { useDeviceConnection } from '@/hooks/useDeviceConnection';
import { BatteryStatusDisplay } from './battery/BatteryStatus';
import { BatteryHealthScore } from './battery/BatteryHealthScore';
import { ChargingModeSelector } from './battery/ChargingModeSelector';
import { OptimizationCoach } from './battery/OptimizationCoach';
import { BatteryDiagnostics } from './battery/BatteryDiagnostics';
import { BatteryVisualization } from './battery/BatteryVisualization';
import { ChargingGraph } from './battery/ChargingGraph';
import { IssueDetectionPanel } from './battery/IssueDetectionPanel';
import { HealthReportCard } from './battery/HealthReportCard';
import { ChargingEfficiency } from './battery/ChargingEfficiency';
import { PortQualityIndicator } from './battery/PortQualityIndicator';
import { DeviceDetector } from './battery/DeviceDetector';
import { BrowserCompatibilityChecker } from './battery/BrowserCompatibilityChecker';
import { DeviceSpecificTips } from './battery/DeviceSpecificTips';
import { ChargingMode, OptimizationTask, BatteryHealthMetrics } from '@/types/battery';
import { getChargingHistory } from '@/utils/batteryHistory';
import {
  calculateHealthScore,
  getDegradationLevel,
  getAverageChargingSpeed,
  detectPortQuality,
  analyzeTemperatureImpact,
} from '@/utils/batteryHealth';
import { detectBatteryIssues } from '@/utils/issueDetection';
import { getDeviceSpecificTips, getChargingOptimizationTips } from '@/utils/deviceOptimization';

export const BatteryMonitorEnhanced = () => {
  const connection = useDeviceConnection();
  const { batteryStatus, deviceInfo, error } = useBattery({
    deviceId: connection.deviceId,
    sessionId: connection.sessionId || undefined,
    logActivity: connection.logActivity,
  });
  const [selectedMode, setSelectedMode] = useState<ChargingMode>('turbo');
  const [tasks, setTasks] = useState<OptimizationTask[]>([]);
  const [health, setHealth] = useState<BatteryHealthMetrics | null>(null);
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    // Calculate health metrics from history
    const history = getChargingHistory();
    const healthScore = calculateHealthScore(history);
    const avgSpeed = getAverageChargingSpeed(history);
    const efficiency = history.length > 0 
      ? history.slice(-5).reduce((sum, s) => sum + s.efficiency, 0) / Math.min(5, history.length)
      : 75;

    const healthMetrics = {
      healthScore,
      degradationLevel: getDegradationLevel(healthScore),
      averageChargingSpeed: avgSpeed,
      chargingEfficiency: Math.round(efficiency),
      temperatureImpact: analyzeTemperatureImpact(efficiency),
      portQuality: detectPortQuality(history),
    };

    setHealth(healthMetrics);
    
    // Detect issues
    const detectedIssues = detectBatteryIssues(healthMetrics, history);
    setIssues(detectedIssues);
  }, [batteryStatus]);

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Show device info and browser compatibility first
  if (!deviceInfo) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center text-sm sm:text-base">Detecting device...</div>
      </Card>
    );
  }

  // If battery API not supported, show compatibility info and educational content
  if (error || !deviceInfo.batterySupported) {
    const deviceTips = getDeviceSpecificTips(deviceInfo.deviceType);
    const chargingTips = getChargingOptimizationTips(deviceInfo.deviceType);
    
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <DeviceDetector
              deviceType={deviceInfo.deviceType}
              os={deviceInfo.os}
              browser={deviceInfo.browser}
            />
            <BrowserCompatibilityChecker
              browser={deviceInfo.browser}
              supported={deviceInfo.batterySupported}
              message={deviceInfo.browserInfo.message}
              recommendation={deviceInfo.browserInfo.recommendation}
            />
          </div>
        </Card>
        <DeviceSpecificTips
          tips={deviceTips}
          title="Battery Optimization Tips"
          description={`Recommended for your ${deviceInfo.deviceType === 'pc' ? 'laptop/desktop' : deviceInfo.deviceType}`}
        />
        <DeviceSpecificTips
          tips={chargingTips}
          title="Charging Optimization Tips"
          description="Best practices when charging your device"
        />
      </div>
    );
  }

  if (!batteryStatus || !health) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center text-sm sm:text-base">Loading battery information...</div>
      </Card>
    );
  }

  const deviceTips = getDeviceSpecificTips(deviceInfo.deviceType);
  const chargingTips = getChargingOptimizationTips(deviceInfo.deviceType);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <Card className="p-4 sm:p-6">
        <DeviceDetector
          deviceType={deviceInfo.deviceType}
          os={deviceInfo.os}
          browser={deviceInfo.browser}
        />
      </Card>
      
      <Card className="p-3 sm:p-4 md:p-6">
        <Tabs defaultValue="monitor" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="monitor" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Monitor</TabsTrigger>
            <TabsTrigger value="visualize" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Visual</TabsTrigger>
            <TabsTrigger value="optimize" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Optimize</TabsTrigger>
            <TabsTrigger value="device" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Tips</TabsTrigger>
            <TabsTrigger value="health" className="text-xs sm:text-sm px-1 sm:px-3 py-2">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-4 sm:space-y-6">
            <BatteryStatusDisplay batteryStatus={batteryStatus} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <ChargingEfficiency 
                temperatureImpact={health.temperatureImpact}
                chargingEfficiency={health.chargingEfficiency}
                sessionCount={getChargingHistory().length}
              />
              <PortQualityIndicator portQuality={health.portQuality} />
            </div>
          </TabsContent>

        <TabsContent value="visualize" className="space-y-4 sm:space-y-6">
          <BatteryVisualization batteryStatus={batteryStatus} />
          <ChargingGraph />
        </TabsContent>

          <TabsContent value="optimize" className="space-y-4 sm:space-y-6">
            <ChargingModeSelector
              selectedMode={selectedMode}
              onModeSelect={setSelectedMode}
            />
            <OptimizationCoach
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              mode={selectedMode}
            />
          </TabsContent>

          <TabsContent value="device" className="space-y-4 sm:space-y-6">
            <DeviceSpecificTips
              tips={deviceTips}
              title="Battery Optimization Tips"
              description={`Tailored for your ${deviceInfo.deviceType === 'pc' ? 'laptop/desktop' : deviceInfo.deviceType}`}
            />
            {batteryStatus.charging && (
              <DeviceSpecificTips
                tips={chargingTips}
                title="Charging Optimization Tips"
                description="Speed up charging and protect battery health"
              />
            )}
          </TabsContent>

          <TabsContent value="health" className="space-y-4 sm:space-y-6">
            <HealthReportCard 
              health={health} 
              showTrend 
              sessionCount={getChargingHistory().length}
            />
            <IssueDetectionPanel issues={issues} />
            <BatteryDiagnostics health={health} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
