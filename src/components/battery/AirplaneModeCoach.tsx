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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="p-6 border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="flex-shrink-0"
            >
              <div className="p-3 rounded-full bg-accent/20 border border-accent/40">
                <Plane className="h-6 w-6 text-accent" />
              </div>
            </motion.div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-accent">
                  Airplane Mode Active! 
                </h3>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Zap className="h-5 w-5 text-accent" />
                </motion.div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Perfect! You're charging optimally. Benefits:
              </p>
              
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span><strong className="text-accent">+30% bonus XMRT</strong> per reward</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span>Faster charging speed</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-accent/30" />
                  <span>Better battery health</span>
                </li>
              </ul>
              
              {airplaneModeDuration > 0 && (
                <div className="mt-3 pt-3 border-t border-accent/20">
                  <p className="text-xs text-accent font-medium">
                    🎯 Optimal charging for {Math.floor(airplaneModeDuration / 60)}m {airplaneModeDuration % 60}s
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Show educational tip when NOT in airplane mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-full bg-primary/20 border border-primary/40">
              <Plane className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              💡 Pro Tip: Enable Airplane Mode
            </h3>
            
            <p className="text-sm text-muted-foreground">
              While charging, activate Airplane Mode to:
            </p>
            
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Charge <strong className="text-foreground">faster</strong> (fewer background processes)</span>
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
            
            <div className="mt-3 pt-3 border-t border-primary/20">
              <p className="text-xs text-muted-foreground">
                Your reward system will continue working offline. Enable it now to boost your earnings!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
