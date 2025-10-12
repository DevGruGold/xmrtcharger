import { Card } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';
import { BatteryHealthMetrics } from '@/types/battery';

interface TemperatureGaugeProps {
  temperatureImpact: BatteryHealthMetrics['temperatureImpact'];
}

export const TemperatureGauge = ({ temperatureImpact }: TemperatureGaugeProps) => {
  const getTemperatureData = () => {
    switch (temperatureImpact) {
      case 'optimal':
        return { 
          level: 33, 
          color: 'hsl(var(--battery-full))', 
          label: 'Optimal',
          description: 'Perfect temperature for charging'
        };
      case 'warm':
        return { 
          level: 66, 
          color: 'hsl(var(--battery-medium))', 
          label: 'Warm',
          description: 'Slightly elevated, but acceptable'
        };
      case 'hot':
        return { 
          level: 90, 
          color: 'hsl(var(--battery-critical))', 
          label: 'Hot',
          description: 'Temperature affecting charging efficiency'
        };
    }
  };

  const tempData = getTemperatureData();

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {/* Thermometer Visualization */}
        <div className="relative w-16 h-48 flex-shrink-0">
          {/* Bulb */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-border bg-card">
            <div 
              className="absolute inset-2 rounded-full transition-all duration-1000"
              style={{ backgroundColor: tempData.color }}
            />
          </div>

          {/* Tube */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-36 bg-card border-4 border-border rounded-t-full overflow-hidden">
            {/* Mercury */}
            <div 
              className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
              style={{ 
                height: `${tempData.level}%`,
                backgroundColor: tempData.color
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>

            {/* Scale marks */}
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-border" />
              ))}
            </div>
          </div>

          {/* Heat waves for hot state */}
          {temperatureImpact === 'hot' && (
            <div className="absolute -right-6 top-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="text-2xl opacity-70 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  🔥
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Temperature Status</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${tempData.color}15`,
                  color: tempData.color
                }}
              >
                {tempData.label}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {tempData.description}
            </p>
          </div>

          {/* Temperature zones */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-medium text-muted-foreground">TEMPERATURE ZONES</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--battery-full))' }} />
                <span className="text-muted-foreground">15°C - 25°C (Optimal)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--battery-medium))' }} />
                <span className="text-muted-foreground">25°C - 35°C (Warm)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--battery-critical))' }} />
                <span className="text-muted-foreground">&gt;35°C (Hot)</span>
              </div>
            </div>
          </div>

          {temperatureImpact !== 'optimal' && (
            <div className="pt-2 text-xs text-muted-foreground">
              💡 Tip: Remove phone case and place in cooler area for better charging efficiency
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
