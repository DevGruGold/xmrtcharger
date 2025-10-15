import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BatteryVisualization } from './battery/BatteryVisualization';
import { BatteryStatus } from '@/types/battery';
import { useRewardSystem } from '@/hooks/useRewardSystem';
import { RewardParticleSystem } from './hero/RewardParticleSystem';
import { TokenEarnedAnimation } from './hero/TokenEarnedAnimation';
import { SoundManager } from './hero/SoundManager';
import { Zap, Clock, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  batteryStatus: BatteryStatus | null;
  deviceId: string | null;
  sessionId: string | null;
  maxModeEnabled: boolean;
}

export const HeroSection = ({ 
  batteryStatus, 
  deviceId, 
  sessionId,
  maxModeEnabled 
}: HeroSectionProps) => {
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  const { 
    totalXmrt, 
    timeUntilNextReward, 
    lastReward 
  } = useRewardSystem({
    deviceId,
    sessionId,
    isCharging: batteryStatus?.charging || false,
    maxModeEnabled,
    onRewardEarned: (data) => {
      setRewardAmount(data.amount || 0);
      setShowReward(true);
      setShowParticles(true);
      
      // Hide animations after duration
      setTimeout(() => {
        setShowReward(false);
      }, 3000);
    },
  });

  // Calculate session duration
  const [sessionDuration, setSessionDuration] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      {/* Sound Manager */}
      <SoundManager onRewardEarned={showReward} />

      {/* Reward Animations */}
      <RewardParticleSystem 
        isActive={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />
      
      <TokenEarnedAnimation 
        amount={rewardAmount} 
        isVisible={showReward}
        onComplete={() => setShowReward(false)}
      />

      {/* Main Hero Card */}
      <div className="relative">
        <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-xl glow-primary">
          {/* Animated background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
          
          <div className="relative p-6 lg:p-8 space-y-8">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              {/* Time Online */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatTime(sessionDuration)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Time Online</div>
              </div>

              {/* XMRT Earned */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 glow-secondary">
                <TrendingUp className="h-5 w-5 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {totalXmrt.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">XMRT Earned</div>
              </div>

              {/* Next Reward */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <Zap className="h-5 w-5 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {formatTime(timeUntilNextReward)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Next Reward</div>
              </div>
            </div>

            {/* Battery Visualization */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-medium text-primary tracking-wider uppercase">
                  Live Monitoring
                </span>
              </div>
              
              <h2 className="text-4xl font-bold text-center">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Battery Status
                </span>
              </h2>
              
              <BatteryVisualization batteryStatus={batteryStatus} />
              
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Your device is being monitored in real-time. Keep charging to earn more XMRT tokens!
              </p>
            </div>

            {/* Bonus Indicators */}
            {(maxModeEnabled || batteryStatus?.charging) && (
              <div className="flex justify-center gap-3 flex-wrap">
                {maxModeEnabled && (
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">+20% Max Mode Bonus</span>
                  </div>
                )}
                {batteryStatus?.charging && (
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium text-secondary">+50% Charging Bonus</span>
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
