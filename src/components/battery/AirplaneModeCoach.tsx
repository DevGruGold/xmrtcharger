import { Plane, Zap, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface AirplaneModeCoachProps {
  isCharging: boolean;
  isAirplaneMode: boolean;
  airplaneModeDuration: number;
  batteryLevel: number;
}

export const AirplaneModeCoach = ({ 
  isCharging, 
  isAirplaneMode, 
  airplaneModeDuration,
  batteryLevel 
}: AirplaneModeCoachProps) => {
  // Only show when charging and battery not full
  if (!isCharging || batteryLevel >= 100) return null;

  // Show celebration when in airplane mode
  if (isAirplaneMode) {
    return (
      <Card className="p-6 border-primary/20 bg-primary/5 corporate-shadow">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-primary">
                Airplane Mode Active! 
              </h3>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Perfect! You're charging optimally. Benefits:
            </p>
            
            <ul className="space-y-1 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span><strong className="text-primary">+30% bonus XMRT</strong> per reward</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Faster charging speed</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary/20 border border-primary" />
                <span>Better battery health</span>
              </li>
            </ul>
            
            {airplaneModeDuration > 0 && (
              <div className="mt-3 pt-3 border-t border-primary/20">
                <p className="text-xs text-primary font-medium">
                  🎯 Optimal charging for {Math.floor(airplaneModeDuration / 60)}m {airplaneModeDuration % 60}s
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Show educational tip when NOT in airplane mode
  return (
    <Card className="p-6 border border-border bg-card corporate-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-lg bg-muted border border-border">
          <Plane className="h-6 w-6 text-foreground" />
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            💡 Pro Tip: Enable Airplane Mode
          </h3>
          
          <p className="text-sm text-muted-foreground">
            While charging, activate Airplane Mode to:
          </p>
          
          <ul className="space-y-1 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Charge <strong>faster</strong> (fewer background processes)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Reduce electromagnetic interference</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Earn <strong className="text-primary">+30% bonus XMRT</strong> tokens! 🎁</span>
            </li>
          </ul>
          
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Your reward system will continue working offline. Enable it now to boost your earnings!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
