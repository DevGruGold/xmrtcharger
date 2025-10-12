import { BatteryHealthMetrics } from '@/types/battery';
import { Battery, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface BatteryHealthScoreProps {
  health: BatteryHealthMetrics;
}

export const BatteryHealthScore = ({ health }: BatteryHealthScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDegradationBadgeVariant = (level: BatteryHealthMetrics['degradationLevel']) => {
    switch (level) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
    }
  };

  const getTrendIcon = () => {
    if (health.healthScore >= 85) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (health.healthScore >= 70) return <Minus className="w-4 h-4 text-blue-500" />;
    return <TrendingDown className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Battery className="w-5 h-5" />
          <h3 className="font-semibold">Battery Health</h3>
        </div>
        <Badge variant={getDegradationBadgeVariant(health.degradationLevel)}>
          {health.degradationLevel.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Health Score</span>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-2xl font-bold ${getScoreColor(health.healthScore)}`}>
              {health.healthScore}
            </span>
          </div>
        </div>
        <Progress value={health.healthScore} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Avg Speed</div>
          <div className="font-medium capitalize">{health.averageChargingSpeed}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Efficiency</div>
          <div className="font-medium">{health.chargingEfficiency}%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Temperature</div>
          <div className="font-medium capitalize">{health.temperatureImpact}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Port Quality</div>
          <div className="font-medium capitalize">{health.portQuality.replace('-', ' ')}</div>
        </div>
      </div>
    </div>
  );
};
