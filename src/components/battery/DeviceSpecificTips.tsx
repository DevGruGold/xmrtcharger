import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { OptimizationTip } from '@/utils/deviceOptimization';
import { Zap, Eye, Wifi, Smartphone, Cpu } from 'lucide-react';

interface DeviceSpecificTipsProps {
  tips: OptimizationTip[];
  title?: string;
  description?: string;
}

export const DeviceSpecificTips = ({
  tips,
  title = 'Optimization Tips',
  description = 'Recommended actions for your device',
}: DeviceSpecificTipsProps) => {
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set());

  const toggleTip = (index: number) => {
    setCompletedTips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (category: OptimizationTip['category']) => {
    switch (category) {
      case 'power':
        return <Zap className="w-4 h-4" />;
      case 'display':
        return <Eye className="w-4 h-4" />;
      case 'connectivity':
        return <Wifi className="w-4 h-4" />;
      case 'apps':
        return <Smartphone className="w-4 h-4" />;
      case 'hardware':
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: OptimizationTip['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const completedCount = completedTips.size;
  const totalCount = tips.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {completedCount}/{totalCount} Done
          </Badge>
        </div>
        {totalCount > 0 && (
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              completedTips.has(index)
                ? 'bg-muted/50 opacity-60'
                : 'bg-card hover:bg-accent/50'
            }`}
          >
            <Checkbox
              id={`tip-${index}`}
              checked={completedTips.has(index)}
              onCheckedChange={() => toggleTip(index)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground">
                  {getCategoryIcon(tip.category)}
                </div>
                <label
                  htmlFor={`tip-${index}`}
                  className="font-medium text-sm cursor-pointer"
                >
                  {tip.title}
                </label>
                <Badge
                  variant="outline"
                  className={`text-xs ${getImpactColor(tip.impact)}`}
                >
                  {tip.impact}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
