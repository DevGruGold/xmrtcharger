import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBatteryOptimizer } from '@/hooks/useBatteryOptimizer';
import { BatteryStatus } from '@/types/battery';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Lightbulb,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIOptimizationInsightsProps {
  batteryStatus: BatteryStatus | null;
  deviceId: string | null;
  sessionId: string | null;
}

export const AIOptimizationInsights = ({
  batteryStatus,
  deviceId,
  sessionId,
}: AIOptimizationInsightsProps) => {
  const { analyzeBattery, optimization, isAnalyzing, error, lastAnalyzed } = useBatteryOptimizer({
    deviceId,
    sessionId,
  });

  const [autoAnalyze, setAutoAnalyze] = useState(false);

  // Auto-analyze on mount and when battery status changes significantly
  useEffect(() => {
    if (!batteryStatus || !deviceId || !autoAnalyze) return;

    const shouldAnalyze = !lastAnalyzed || 
      (Date.now() - lastAnalyzed.getTime() > 5 * 60 * 1000); // 5 minutes

    if (shouldAnalyze) {
      analyzeBuffer();
    }
  }, [batteryStatus?.level, batteryStatus?.charging, autoAnalyze]);

  const handleAnalyze = () => {
    if (batteryStatus) {
      analyzeBuffer();
    }
  };

  const analyzeBuffer = () => {
    if (batteryStatus) {
      analyzeBattery(batteryStatus, 'health-check');
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (!batteryStatus || !deviceId) {
    return null;
  }

  return (
    <Card className="p-6 space-y-6 border-primary/20 bg-card/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Battery Insights</h3>
            <p className="text-sm text-muted-foreground">
              Powered by advanced AI analysis
            </p>
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          size="sm"
          variant="outline"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze Now
            </>
          )}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Optimization Results */}
      {optimization && (
        <div className="space-y-6">
          {/* Health Score */}
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="text-5xl font-bold mb-2">
              <span className={getHealthColor(optimization.status)}>
                {optimization.healthScore}
              </span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <Badge variant="outline" className={`${getHealthColor(optimization.status)} border-current`}>
              {optimization.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Overall Battery Health
            </p>
          </div>

          {/* Immediate Actions */}
          {optimization.immediateActions && optimization.immediateActions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Immediate Actions Required
              </h4>
              <div className="space-y-2">
                {optimization.immediateActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 flex items-start gap-3"
                  >
                    <span className="text-xl">{getImpactIcon(action.impact)}</span>
                    <div className="flex-1">
                      <p className="font-medium">{action.action}</p>
                      <p className="text-sm text-muted-foreground">{action.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Short-term Optimizations */}
          {optimization.shortTermOptimizations && optimization.shortTermOptimizations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Short-term Improvements
              </h4>
              <div className="space-y-2">
                {optimization.shortTermOptimizations.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20"
                  >
                    <p className="font-medium">{opt.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>⏱️ {opt.timeframe}</span>
                      <span>•</span>
                      <span>📈 {opt.expectedImprovement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Long-term Recommendations */}
          {optimization.longTermRecommendations && optimization.longTermRecommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Long-term Best Practices
              </h4>
              <div className="space-y-2">
                {optimization.longTermRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                  >
                    <p className="font-medium">{rec.action}</p>
                    <p className="text-sm text-muted-foreground mt-1">✅ {rec.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {optimization.riskAssessment && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Risk Assessment
              </h4>
              <div className={`p-4 rounded-lg border ${getRiskColor(optimization.riskAssessment.level)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Risk Level</span>
                  <Badge variant="outline" className="border-current">
                    {optimization.riskAssessment.level.toUpperCase()}
                  </Badge>
                </div>
                {optimization.riskAssessment.concerns.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {optimization.riskAssessment.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span>•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {optimization.insights && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <p className="text-sm leading-relaxed">{optimization.insights}</p>
            </div>
          )}

          {/* Last Analyzed */}
          {lastAnalyzed && (
            <p className="text-xs text-center text-muted-foreground">
              Last analyzed: {lastAnalyzed.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {!optimization && !isAnalyzing && !error && (
        <div className="text-center py-8">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-4">
            Get personalized battery optimization insights powered by AI
          </p>
          <Button onClick={handleAnalyze} variant="outline">
            Run AI Analysis
          </Button>
        </div>
      )}
    </Card>
  );
};
