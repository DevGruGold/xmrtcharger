import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBattery } from '@/hooks/useBattery';
import { BatteryStatusDisplay } from './battery/BatteryStatus';
import { BatteryHealthScore } from './battery/BatteryHealthScore';
import { ChargingModeSelector } from './battery/ChargingModeSelector';
import { OptimizationCoach } from './battery/OptimizationCoach';
import { BatteryDiagnostics } from './battery/BatteryDiagnostics';
import { BatteryVisualization } from './battery/BatteryVisualization';
import { ChargingGraph } from './battery/ChargingGraph';
import { DiagnosticScanner } from './battery/DiagnosticScanner';
import { IssueDetectionPanel } from './battery/IssueDetectionPanel';
import { HealthReportCard } from './battery/HealthReportCard';
import { TemperatureGauge } from './battery/TemperatureGauge';
import { PortQualityIndicator } from './battery/PortQualityIndicator';
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

export const BatteryMonitorEnhanced = () => {
  const { batteryStatus, error } = useBattery();
  const [selectedMode, setSelectedMode] = useState<ChargingMode>('turbo');
  const [tasks, setTasks] = useState<OptimizationTask[]>([]);
  const [health, setHealth] = useState<BatteryHealthMetrics | null>(null);
  const [isScanning, setIsScanning] = useState(true);
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

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    );
  }

  if (!batteryStatus || !health) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center">Loading battery information...</div>
      </Card>
    );
  }

  if (isScanning) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <DiagnosticScanner onComplete={() => setIsScanning(false)} />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="visualize">Visualize</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-6">
          <BatteryStatusDisplay batteryStatus={batteryStatus} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TemperatureGauge temperatureImpact={health.temperatureImpact} />
            <PortQualityIndicator portQuality={health.portQuality} />
          </div>
        </TabsContent>

        <TabsContent value="visualize" className="space-y-6">
          <BatteryVisualization batteryStatus={batteryStatus} />
          <ChargingGraph />
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
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

        <TabsContent value="health" className="space-y-6">
          <HealthReportCard health={health} showTrend />
          <IssueDetectionPanel issues={issues} />
          <BatteryDiagnostics health={health} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
