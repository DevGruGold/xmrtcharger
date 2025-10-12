import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { BatteryHealthMetrics } from '@/types/battery';

interface HealthReportCardProps {
  health: BatteryHealthMetrics;
  showTrend?: boolean;
  sessionCount?: number;
}

export const HealthReportCard = ({ health, showTrend = false, sessionCount = 0 }: HealthReportCardProps) => {
  const getGrade = (score: number): string => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    return 'D';
  };

  const confidence = sessionCount < 5 ? 'Limited' : sessionCount < 20 ? 'Moderate' : 'Sufficient';

  const getGradeColor = (score: number): string => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'hsl(var(--battery-full))';
    if (score >= 70) return 'hsl(var(--battery-high))';
    if (score >= 50) return 'hsl(var(--battery-medium))';
    return 'hsl(var(--battery-critical))';
  };

  const components = [
    { label: 'Port Quality', value: health.portQuality === 'excellent' ? 100 : health.portQuality === 'good' ? 75 : 40 },
    { label: 'Temperature', value: health.temperatureImpact === 'optimal' ? 100 : health.temperatureImpact === 'warm' ? 70 : 40 },
    { label: 'Efficiency', value: health.chargingEfficiency },
    { label: 'Degradation', value: health.degradationLevel === 'excellent' ? 100 : health.degradationLevel === 'good' ? 75 : health.degradationLevel === 'fair' ? 50 : 25 },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Charging Pattern Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Based on {sessionCount} session{sessionCount !== 1 ? 's' : ''}
            </p>
          </div>
          {showTrend && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Improving</span>
            </div>
          )}
        </div>
        
        {/* Data Quality Badge */}
        <Alert className="py-2">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>{confidence} Data:</strong> Based on charging behavior patterns, not direct battery measurements. 
            {sessionCount < 20 && ` Collect ${20 - sessionCount} more session${20 - sessionCount !== 1 ? 's' : ''} for higher confidence.`}
          </AlertDescription>
        </Alert>
      </div>

      {/* Overall Score */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold" style={{ color: getScoreColor(health.healthScore) }}>
                {health.healthScore}
              </span>
              <span className={`text-3xl font-bold ${getGradeColor(health.healthScore)}`}>
                {getGrade(health.healthScore)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Overall Health Score</div>
          </div>
          
          <div className="text-right">
            <Badge 
              variant={
                health.degradationLevel === 'excellent' ? 'default' : 
                health.degradationLevel === 'good' ? 'secondary' : 
                health.degradationLevel === 'fair' ? 'outline' : 
                'destructive'
              }
              className="text-sm"
            >
              {health.degradationLevel.toUpperCase()}
            </Badge>
          </div>
        </div>

        <Progress 
          value={health.healthScore} 
          className="h-3"
          style={{
            // @ts-ignore
            '--progress-background': getScoreColor(health.healthScore)
          }}
        />
      </div>

      {/* Component Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">COMPONENT BREAKDOWN</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map((component) => (
            <div key={component.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{component.label}</span>
                <span className="text-muted-foreground">{component.value}%</span>
              </div>
              <Progress value={component.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{health.chargingEfficiency}%</div>
          <div className="text-xs text-muted-foreground">Charging Efficiency</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold capitalize">{health.averageChargingSpeed}</div>
          <div className="text-xs text-muted-foreground">Average Speed</div>
        </div>
      </div>
    </Card>
  );
};
