import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { BatteryHealthMetrics } from '@/types/battery';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChargingEfficiencyProps {
  temperatureImpact: BatteryHealthMetrics['temperatureImpact'];
  chargingEfficiency: number;
  sessionCount: number;
}

export const ChargingEfficiency = ({ 
  temperatureImpact, 
  chargingEfficiency,
  sessionCount 
}: ChargingEfficiencyProps) => {
  const getEfficiencyData = () => {
    switch (temperatureImpact) {
      case 'optimal':
        return { 
          trend: 'up',
          color: 'hsl(var(--battery-full))', 
          label: 'Excellent',
          description: 'Charging patterns indicate optimal efficiency'
        };
      case 'warm':
        return { 
          trend: 'stable',
          color: 'hsl(var(--battery-medium))', 
          label: 'Good',
          description: 'Acceptable charging efficiency with room for improvement'
        };
      case 'hot':
        return { 
          trend: 'down',
          color: 'hsl(var(--battery-critical))', 
          label: 'Below Average',
          description: 'Lower charging efficiency detected - multiple factors may be involved'
        };
    }
  };

  const effData = getEfficiencyData();
  const confidence = sessionCount < 5 ? 'Low' : sessionCount < 20 ? 'Moderate' : 'High';

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        {/* Header with Info Tooltip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm sm:text-base">Charging Efficiency Status</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Calculated from charging speed patterns, not actual temperature measurements. 
                    Based on {sessionCount} session{sessionCount !== 1 ? 's' : ''}.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {confidence} Confidence
          </div>
        </div>

        {/* Efficiency Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000"
                style={{ 
                  width: `${chargingEfficiency}%`,
                  backgroundColor: effData.color
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {effData.trend === 'up' && <TrendingUp className="w-5 h-5" style={{ color: effData.color }} />}
            {effData.trend === 'stable' && <Minus className="w-5 h-5" style={{ color: effData.color }} />}
            {effData.trend === 'down' && <TrendingDown className="w-5 h-5" style={{ color: effData.color }} />}
            <span className="text-2xl font-bold" style={{ color: effData.color }}>
              {chargingEfficiency}%
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <div 
            className="px-3 py-1.5 rounded-full text-sm font-medium inline-block"
            style={{ 
              backgroundColor: `${effData.color}15`,
              color: effData.color
            }}
          >
            {effData.label}
          </div>
          <p className="text-sm text-muted-foreground">
            {effData.description}
          </p>
        </div>

        {/* Possible Factors */}
        <div className="pt-3 border-t space-y-2">
          <div className="text-xs font-medium text-muted-foreground">POSSIBLE FACTORS</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Environment temperature</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Cable quality</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Port condition</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Background usage</span>
            </div>
          </div>
        </div>

        {sessionCount < 5 && (
          <div className="pt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            📊 Need {5 - sessionCount} more charging session{5 - sessionCount !== 1 ? 's' : ''} for reliable analysis
          </div>
        )}
      </div>
    </Card>
  );
};
