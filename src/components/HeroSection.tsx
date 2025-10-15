import { Card } from '@/components/ui/card';
import { BatteryVisualization } from './battery/BatteryVisualization';
import { AIOptimizationPanel } from './battery/AIOptimizationPanel';
import { BatteryStatus } from '@/types/battery';

interface HeroSectionProps {
  batteryStatus: BatteryStatus;
  deviceId: string | null;
  sessionId: string | null;
}

export const HeroSection = ({ batteryStatus, deviceId, sessionId }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <Card className="relative backdrop-blur-sm bg-card/80 border-primary/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left: Battery Animation */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">
                Real-Time Battery Status
              </h2>
              <p className="text-sm text-muted-foreground">
                Live monitoring with intelligent optimization
              </p>
            </div>
            <BatteryVisualization batteryStatus={batteryStatus} />
          </div>

          {/* Right: AI Optimization */}
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent mb-2">
                AI-Powered Insights
              </h2>
              <p className="text-sm text-muted-foreground">
                Streaming real-time optimization feedback
              </p>
            </div>
            {deviceId && (
              <AIOptimizationPanel
                deviceId={deviceId}
                sessionId={sessionId}
                batteryStatus={batteryStatus}
                autoRefresh={true}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
