import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBatteryOptimizer } from '@/hooks/useBatteryOptimizer';
import { BatteryStatus } from '@/types/battery';
import { Brain, Sparkles, AlertTriangle, CheckCircle, TrendingUp, Zap, Target, Lightbulb, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const getHealthBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
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
    <Card className="border border-border bg-card corporate-shadow-lg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                AI Battery Optimizer
              </h2>
              <p className="text-sm text-muted-foreground">
                Intelligent analysis & personalized recommendations
              </p>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !batteryStatus}
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Battery...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Battery Health
              </>
            )}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Optimization Results */}
        {optimization && (
          <div className="space-y-4">
            {/* Health Score Card */}
            <Card className="p-6 bg-muted border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Battery Health Score</h3>
                    <p className="text-xs text-muted-foreground">AI-powered analysis</p>
                  </div>
                </div>
                <Badge 
                  variant={getHealthBadgeVariant(optimization.healthScore)}
                  className="text-lg px-4 py-2"
                >
                  {optimization.healthScore}/100
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{optimization.status}</p>
            </Card>

            {/* Immediate Actions */}
            {optimization.immediateActions && optimization.immediateActions.length > 0 && (
              <Card className="p-5 bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground">Immediate Actions Required</h3>
                </div>
                <ul className="space-y-3">
                  {optimization.immediateActions.map((action: any, idx: number) => (
                    <li 
                      key={idx}
                      className="text-sm flex items-start gap-3 p-3 rounded-lg bg-background border border-border"
                    >
                      <Zap className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{action.action || action}</p>
                        {action.reason && <p className="text-xs text-muted-foreground mt-1">{action.reason}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Short-term Optimizations */}
            {optimization.shortTermOptimizations && optimization.shortTermOptimizations.length > 0 && (
              <Card className="p-5 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground">Quick Wins</h3>
                </div>
                <ul className="space-y-3">
                  {optimization.shortTermOptimizations.map((opt: any, idx: number) => (
                    <li 
                      key={idx}
                      className="text-sm flex items-start gap-3"
                    >
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{opt.action || opt}</p>
                        {opt.timeframe && <p className="text-xs text-muted-foreground mt-1">⏱️ {opt.timeframe}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Long-term Recommendations */}
            {optimization.longTermRecommendations && optimization.longTermRecommendations.length > 0 && (
              <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base">Long-term Strategy</h3>
                </div>
                <ul className="space-y-3">
                  {optimization.longTermRecommendations.map((rec: any, idx: number) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm flex items-start gap-3"
                    >
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{rec.action || rec}</p>
                        {rec.benefit && <p className="text-xs text-muted-foreground mt-1">✅ {rec.benefit}</p>}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            )}

            {/* AI Insights */}
            {optimization.insights && (
              <Card className="p-5 bg-muted border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground">AI Analysis Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{optimization.insights}</p>
              </Card>
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
      </div>
    </Card>
  );
};
