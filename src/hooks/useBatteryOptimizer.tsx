import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BatteryStatus } from '@/types/battery';

interface OptimizationResult {
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

interface UseBatteryOptimizerOptions {
  deviceId: string | null;
  sessionId: string | null;
  autoOptimize?: boolean;
}

export const useBatteryOptimizer = ({
  deviceId,
  sessionId,
  autoOptimize = false,
}: UseBatteryOptimizerOptions) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  const analyzeBattery = useCallback(async (
    batteryStatus: BatteryStatus,
    context: 'real-time' | 'health-check' | 'diagnostics' = 'real-time'
  ): Promise<OptimizationResult | null> => {
    if (!deviceId) {
      console.warn('Cannot analyze: deviceId is required');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🔍 Starting AI battery analysis...', { deviceId, context });

      const { data, error: functionError } = await supabase.functions.invoke('ai-battery-optimizer', {
        body: {
          deviceId,
          sessionId,
          batteryStatus: {
            level: batteryStatus.level,
            charging: batteryStatus.charging,
            chargingSpeed: batteryStatus.chargingSpeed,
          },
          context,
        }
      });

      if (functionError) {
        console.error('AI Optimizer Error:', functionError);
        setError(functionError.message || 'Failed to analyze battery');
        return null;
      }

      if (!data || !data.optimization) {
        setError('Invalid response from optimizer');
        return null;
      }

      console.log('✅ AI Analysis Complete:', {
        healthScore: data.optimization.healthScore,
        status: data.optimization.status,
        actions: data.optimization.immediateActions?.length || 0,
      });

      setOptimization(data.optimization);
      setLastAnalyzed(new Date());
      return data.optimization;

    } catch (err) {
      console.error('Error analyzing battery:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [deviceId, sessionId]);

  return {
    analyzeBattery,
    optimization,
    isAnalyzing,
    error,
    lastAnalyzed,
  };
};
