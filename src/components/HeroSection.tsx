import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BatteryVisualization } from './battery/BatteryVisualization';
import { BatteryStatus } from '@/types/battery';
import { useRewardSystem } from '@/hooks/useRewardSystem';
import { RewardParticleSystem } from './hero/RewardParticleSystem';
import { SoundManager } from './hero/SoundManager';
import { supabase } from '@/integrations/supabase/client';
import { Zap, Clock, TrendingUp, Plane } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface HeroSectionProps {
  batteryStatus: BatteryStatus | null;
  deviceId: string | null;
  sessionId: string | null;
  maxModeEnabled: boolean;
}

// Helper function to format time (defined before usage)
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m ${secs}s`;
};

export const HeroSection = ({ 
  batteryStatus, 
  deviceId, 
  sessionId,
  maxModeEnabled 
}: HeroSectionProps) => {
  const [showParticles, setShowParticles] = useState(false);
  const [realSessionDuration, setRealSessionDuration] = useState(0);

  // Network status for airplane mode detection
  const networkStatus = useNetworkStatus({ 
    isCharging: batteryStatus?.charging || false 
  });

  // Smooth animation springs for numbers
  const xmrtSpring = useSpring(0, { stiffness: 50, damping: 20 });
  const timeSpring = useSpring(0, { stiffness: 50, damping: 20 });
  const nextRewardSpring = useSpring(0, { stiffness: 50, damping: 20 });

  const { 
    totalXmrt, 
    timeUntilNextReward, 
    lastReward 
  } = useRewardSystem({
    deviceId,
    sessionId,
    isCharging: batteryStatus?.charging || false,
    batteryLevel: batteryStatus?.level || 0,
    maxModeEnabled,
    isOffline: networkStatus.isAirplaneMode,
    onRewardEarned: (data) => {
      setShowParticles(true);
    },
  });

  // Update springs when values change
  useEffect(() => {
    xmrtSpring.set(totalXmrt);
  }, [totalXmrt, xmrtSpring]);

  useEffect(() => {
    timeSpring.set(realSessionDuration);
  }, [realSessionDuration, timeSpring]);

  useEffect(() => {
    nextRewardSpring.set(timeUntilNextReward);
  }, [timeUntilNextReward, nextRewardSpring]);

  // Transform springs to formatted strings
  const displayXmrt = useTransform(xmrtSpring, (value) => value.toFixed(2));
  const displayTime = useTransform(timeSpring, (value) => formatTime(Math.floor(value)));
  const displayNextReward = useTransform(nextRewardSpring, (value) => formatTime(Math.floor(value)));

  // Fetch real session duration from Supabase
  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionDuration = async () => {
      const { data, error } = await supabase
        .from('device_connection_sessions')
        .select('connected_at')
        .eq('id', sessionId)
        .single();

      if (data && !error) {
        const connectedAt = new Date(data.connected_at).getTime();
        const now = Date.now();
        setRealSessionDuration(Math.floor((now - connectedAt) / 1000));
      }
    };

    fetchSessionDuration();
    const interval = setInterval(fetchSessionDuration, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <>
      {/* Sound Manager */}
      <SoundManager onRewardEarned={showParticles} />

      {/* Reward Animations */}
      <RewardParticleSystem 
        isActive={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />

      {/* Main Hero Card */}
      <div className="relative">
        <Card className="border border-border bg-card corporate-shadow-lg">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              {/* Time Online */}
              <div className="text-center p-4 rounded-lg bg-muted border border-border">
                <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                <motion.div className="text-2xl font-bold text-foreground">
                  {displayTime}
                </motion.div>
                <div className="text-xs text-muted-foreground mt-1">Time Online</div>
              </div>

              {/* XMRT Earned */}
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
                <motion.div className="text-2xl font-bold text-primary">
                  {displayXmrt}
                </motion.div>
                <div className="text-xs text-muted-foreground mt-1">XMRT Earned</div>
              </div>

              {/* Next Reward */}
              <div className="text-center p-4 rounded-lg bg-muted border border-border">
                <Zap className="h-5 w-5 mx-auto mb-2 text-primary" />
                <motion.div className="text-2xl font-bold text-foreground">
                  {displayNextReward}
                </motion.div>
                <div className="text-xs text-muted-foreground mt-1">Next Reward</div>
              </div>
            </div>

            {/* Battery Visualization */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-md bg-primary/10 border border-primary/20">
                <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                  Live Monitoring
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-center text-foreground">
                Battery Status
              </h2>
              
              <BatteryVisualization batteryStatus={batteryStatus} />
              
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {!batteryStatus?.charging
                  ? "⚡ Connect your charger to start earning XMRT tokens!" 
                  : batteryStatus.level && batteryStatus.level >= 100 
                    ? "⚠️ Battery at 100% - Unplug to preserve battery health and avoid overcharging" 
                    : "Your device is charging! Keep charging to earn more XMRT tokens!"}
              </p>
            </div>

            {/* Bonus Indicators */}
            {(maxModeEnabled || batteryStatus?.charging || networkStatus.isAirplaneMode) && (
              <div className="flex justify-center gap-2 flex-wrap">
                {networkStatus.isAirplaneMode && batteryStatus?.charging && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-4 py-2 rounded-md bg-primary/10 border border-primary/20 flex items-center gap-2"
                  >
                    <Plane className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">+30% Airplane Mode</span>
                  </motion.div>
                )}
                {maxModeEnabled && (
                  <div className="px-4 py-2 rounded-md bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">+20% Max Mode</span>
                  </div>
                )}
                {batteryStatus?.charging && (
                  <div className="px-4 py-2 rounded-md bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">+50% Charging</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};
