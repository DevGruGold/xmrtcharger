import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plug, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BatteryHealthMetrics } from '@/types/battery';

interface PortQualityIndicatorProps {
  portQuality: BatteryHealthMetrics['portQuality'];
}

export const PortQualityIndicator = ({ portQuality }: PortQualityIndicatorProps) => {
  const getQualityData = () => {
    switch (portQuality) {
      case 'excellent':
        return {
          score: 100,
          color: 'hsl(var(--battery-full))',
          icon: CheckCircle2,
          label: 'Excellent',
          status: 'Perfect connection detected',
          description: 'Your charging port is clean and making optimal contact.',
          bars: 5
        };
      case 'good':
        return {
          score: 75,
          color: 'hsl(var(--battery-high))',
          icon: CheckCircle2,
          label: 'Good',
          status: 'Good connection quality',
          description: 'Port is functioning well. Minor cleaning may improve performance.',
          bars: 4
        };
      case 'needs-cleaning':
        return {
          score: 40,
          color: 'hsl(var(--battery-low))',
          icon: AlertCircle,
          label: 'Needs Cleaning',
          status: 'Connection issues detected',
          description: 'Port contamination is affecting charging speed. Cleaning recommended.',
          bars: 2
        };
    }
  };

  const qualityData = getQualityData();
  const IconComponent = qualityData.icon;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${qualityData.color}15` }}
          >
            <Plug className="w-6 h-6" style={{ color: qualityData.color }} />
          </div>
          <div>
            <h3 className="font-semibold">Port Quality</h3>
            <p className="text-sm text-muted-foreground">{qualityData.status}</p>
          </div>
        </div>
        
        <Badge 
          variant={portQuality === 'excellent' || portQuality === 'good' ? 'default' : 'destructive'}
          className="flex items-center gap-1"
        >
          <IconComponent className="w-3 h-3" />
          {qualityData.label}
        </Badge>
      </div>

      {/* Connection Strength Bars */}
      <div className="flex items-center gap-4">
        <div className="flex items-end gap-1 h-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-4 rounded-t transition-all duration-500`}
              style={{
                height: `${(i + 1) * 20}%`,
                backgroundColor: i < qualityData.bars ? qualityData.color : 'hsl(var(--muted))',
                opacity: i < qualityData.bars ? 1 : 0.3
              }}
            />
          ))}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Connection Quality</span>
            <span className="text-muted-foreground">{qualityData.score}%</span>
          </div>
          <Progress value={qualityData.score} className="h-2" />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        {qualityData.description}
      </p>

      {/* Cleaning Recommendation */}
      {portQuality === 'needs-cleaning' && (
        <div className="pt-3 border-t space-y-3">
          <div className="text-sm font-medium">Cleaning Guide:</div>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Power off your device completely</li>
            <li>Use compressed air to blow out debris</li>
            <li>Gently clean with a soft, dry brush</li>
            <li>Avoid liquids and metal objects</li>
            <li>Test charging after cleaning</li>
          </ol>
          
          {/* Dirt particles animation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 h-1 rounded-full bg-yellow-500/50"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span>Debris detected in port</span>
          </div>
        </div>
      )}
    </Card>
  );
};
