import { BatteryStatus } from '@/types/battery';
import { Battery, Zap } from 'lucide-react';
import { getChargingSpeedColor } from './BatteryAnimation';

interface BatteryVisualizationProps {
  batteryStatus: BatteryStatus;
}

export const BatteryVisualization = ({ batteryStatus }: BatteryVisualizationProps) => {
  const { level, charging, chargingSpeed } = batteryStatus;

  const getBatteryColor = () => {
    if (level <= 20) return 'hsl(var(--battery-critical))';
    if (level <= 40) return 'hsl(var(--battery-low))';
    if (level <= 60) return 'hsl(var(--battery-medium))';
    if (level <= 80) return 'hsl(var(--battery-high))';
    return 'hsl(var(--battery-full))';
  };

  const getChargingColor = () => {
    switch (chargingSpeed) {
      case 'supercharge': return 'hsl(var(--charging-super))';
      case 'fast': return 'hsl(var(--charging-fast))';
      case 'normal': return 'hsl(var(--charging-normal))';
      case 'slow': return 'hsl(var(--charging-slow))';
      default: return getBatteryColor();
    }
  };

  const getAnimationSpeed = () => {
    switch (chargingSpeed) {
      case 'supercharge': return '0.3s';
      case 'fast': return '0.7s';
      case 'normal': return '1.5s';
      case 'slow': return '3s';
      default: return '2s';
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-8">
      {/* 3D Battery Container */}
      <div className="relative w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72">
        {/* Battery Shell */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-border bg-card overflow-hidden shadow-2xl">
          {/* Battery Terminal */}
          <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 w-10 h-2 sm:w-16 sm:h-4 bg-border rounded-t-lg" />
          
          {/* Liquid Fill with Gradient */}
          <div 
            className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out animate-liquid-fill"
            style={{ 
              height: `${level}%`,
              background: `linear-gradient(180deg, ${getChargingColor()}, ${getBatteryColor()})`,
            }}
          >
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite'
              }}
            />
            
            {/* Wave Effect */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/20 to-transparent" />
          </div>

          {/* Segmented Cells Overlay */}
          <div className="absolute inset-0 flex flex-col-reverse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="flex-1 border-t border-border/30"
                style={{ opacity: i * 10 < level ? 0.3 : 0.1 }}
              />
            ))}
          </div>

          {/* Percentage Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mix-blend-difference">
              {level}%
            </span>
          </div>
        </div>

        {/* Glow Effect when Charging */}
        {charging && (
          <div 
            className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none"
            style={{ color: getChargingColor() }}
          />
        )}
      </div>

      {/* Floating Particles when Charging */}
      {charging && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full animate-particle-float"
              style={{
                backgroundColor: getChargingColor(),
                animationDelay: `${i * 0.3}s`,
                left: `${40 + i * 7}%`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning Bolts Animation */}
      {charging && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Zap 
            className={`${getChargingSpeedColor(chargingSpeed)} animate-lightning-strike w-6 h-6 sm:w-8 sm:h-8`}
            style={{ animationDuration: getAnimationSpeed() }}
            fill="currentColor"
          />
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            {chargingSpeed === 'supercharge' && 'Supercharging'}
            {chargingSpeed === 'fast' && 'Fast Charging'}
            {chargingSpeed === 'normal' && 'Charging'}
            {chargingSpeed === 'slow' && 'Slow Charging'}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
        <Battery className={`${charging ? 'text-charging' : 'text-muted-foreground'} w-4 h-4 sm:w-5 sm:h-5`} />
        <span className="text-muted-foreground">
          {charging ? 'Connected to power' : 'On battery'}
        </span>
      </div>
    </div>
  );
};
