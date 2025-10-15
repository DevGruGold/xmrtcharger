import { Card } from '@/components/ui/card';
import { BatteryVisualization } from './battery/BatteryVisualization';
import { AIOptimizationPanel } from './battery/AIOptimizationPanel';
import { BatteryStatus } from '@/types/battery';

interface HeroSectionProps {
  batteryStatus: BatteryStatus | null;
  deviceId: string | null;
  sessionId: string | null;
}

export const HeroSection = ({ batteryStatus, deviceId, sessionId }: HeroSectionProps) => {
  return (
    <div className="relative">
      <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-xl glow-primary">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
          {/* Left: Battery Animation */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <span className="text-xs font-medium text-primary tracking-wider uppercase">Live Monitoring</span>
              </div>
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Battery Status
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time intelligent optimization
              </p>
            </div>
            <BatteryVisualization batteryStatus={batteryStatus} />
          </div>

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {/* Right: AI Optimization */}
          <div className="flex flex-col space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-2">
                <span className="text-xs font-medium text-secondary tracking-wider uppercase">AI Powered</span>
              </div>
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Smart Insights
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Streaming optimization feedback
              </p>
            </div>
            <AIOptimizationPanel
              deviceId={deviceId}
              sessionId={sessionId}
              batteryStatus={batteryStatus}
              autoRefresh={true}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
