import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Zap, Clock, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BatteryStatus } from '@/types/battery';

interface AIOptimization {
  healthScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  immediateActions: Array<{
    action: string;
    impact: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  shortTermOptimizations: Array<{
    action: string;
    timeframe: string;
    expectedImprovement: string;
  }>;
  longTermRecommendations: Array<{
    action: string;
    benefit: string;
  }>;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    concerns: string[];
  };
  insights: string;
}

interface AIOptimizationPanelProps {
  deviceId: string;
  sessionId: string | null;
  batteryStatus: BatteryStatus;
  autoRefresh?: boolean;
}

export const AIOptimizationPanel = ({ 
  deviceId, 
  sessionId, 
  batteryStatus,
  autoRefresh = true 
}: AIOptimizationPanelProps) => {
  const [optimization, setOptimization] = useState<AIOptimization | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runOptimization = async () => {
    if (!deviceId || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-battery-optimizer', {
        body: {
          deviceId,
          sessionId,
          batteryStatus: {
            level: batteryStatus.level,
            charging: batteryStatus.charging,
            chargingSpeed: batteryStatus.chargingSpeed,
          },
          context: 'real-time',
        },
      });

      if (fnError) throw fnError;

      setOptimization(data.optimization);
      setLastAnalyzed(new Date());
    } catch (err) {
      console.error('AI Optimization failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (deviceId && autoRefresh) {
      runOptimization();
      const interval = setInterval(runOptimization, 120000); // Every 2 minutes
      return () => clearInterval(interval);
    }
  }, [deviceId, autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <Card className="p-4 border-destructive/50">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">AI Analysis unavailable: {error}</span>
        </div>
      </Card>
    );
  }

  if (isAnalyzing && !optimization) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-6 h-6 animate-pulse text-primary" />
          <div className="text-center">
            <p className="font-medium">AI Analyzing Battery Data...</p>
            <p className="text-xs text-muted-foreground mt-1">Processing {deviceId.substring(0, 8)}...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!optimization) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Battery Optimization</h3>
              <p className="text-xs text-muted-foreground">
                {lastAnalyzed ? `Analyzed ${Math.floor((Date.now() - lastAnalyzed.getTime()) / 1000)}s ago` : 'Real-time analysis'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{optimization.healthScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <Badge className={getStatusColor(optimization.status)}>
              {optimization.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Immediate Actions */}
      {optimization.immediateActions.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Immediate Actions
          </h4>
          <div className="space-y-2">
            {optimization.immediateActions.map((action, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                {getImpactIcon(action.impact)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.action}</p>
                  <p className="text-xs text-muted-foreground">{action.reason}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {action.impact}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Short-term Optimizations */}
      {optimization.shortTermOptimizations.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Short-term Optimizations
          </h4>
          <div className="space-y-2">
            {optimization.shortTermOptimizations.map((opt, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm">{opt.action}</p>
                  <Badge variant="secondary" className="text-xs">
                    {opt.timeframe}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{opt.expectedImprovement}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Risk Assessment */}
      {optimization.riskAssessment.level !== 'low' && (
        <Card className="p-4 border-orange-500/50">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Risk Assessment
          </h4>
          <Badge className="mb-2" variant={
            optimization.riskAssessment.level === 'high' ? 'destructive' : 'default'
          }>
            {optimization.riskAssessment.level.toUpperCase()} RISK
          </Badge>
          {optimization.riskAssessment.concerns.length > 0 && (
            <ul className="space-y-1 mt-2">
              {optimization.riskAssessment.concerns.map((concern, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {concern}</li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* AI Insights */}
      {optimization.insights && (
        <Card className="p-4 bg-primary/5">
          <p className="text-sm text-muted-foreground italic">
            💡 {optimization.insights}
          </p>
        </Card>
      )}
    </div>
  );
};