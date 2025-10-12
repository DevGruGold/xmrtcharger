import { ChargingSpeed, BatteryHealthMetrics, ChargingSession } from '@/types/battery';

export const calculateHealthScore = (sessions: ChargingSession[]): number => {
  if (sessions.length === 0) return 85; // Default score for new users
  
  const recentSessions = sessions.slice(-10);
  const avgEfficiency = recentSessions.reduce((sum, s) => sum + s.efficiency, 0) / recentSessions.length;
  
  // Factor in charging speed consistency
  const speedScores = recentSessions.map(s => {
    switch (s.speed) {
      case 'supercharge': return 100;
      case 'fast': return 85;
      case 'normal': return 70;
      case 'slow': return 50;
      default: return 60;
    }
  });
  const avgSpeed = speedScores.reduce((sum, s) => sum + s, 0) / speedScores.length;
  
  return Math.round((avgEfficiency * 0.6 + avgSpeed * 0.4));
};

export const getDegradationLevel = (healthScore: number): BatteryHealthMetrics['degradationLevel'] => {
  if (healthScore >= 85) return 'excellent';
  if (healthScore >= 70) return 'good';
  if (healthScore >= 50) return 'fair';
  return 'poor';
};

export const calculateChargingEfficiency = (
  startLevel: number,
  endLevel: number,
  duration: number,
  speed: ChargingSpeed
): number => {
  const chargeGain = endLevel - startLevel;
  const expectedRate = getExpectedChargingRate(speed);
  const actualRate = (chargeGain / duration) * 3600; // per hour
  
  return Math.min(100, Math.round((actualRate / expectedRate) * 100));
};

const getExpectedChargingRate = (speed: ChargingSpeed): number => {
  switch (speed) {
    case 'supercharge': return 60; // 60% per hour
    case 'fast': return 40;
    case 'normal': return 25;
    case 'slow': return 15;
    default: return 20;
  }
};

export const getAverageChargingSpeed = (sessions: ChargingSession[]): ChargingSpeed => {
  if (sessions.length === 0) return 'normal';
  
  const recentSessions = sessions.slice(-5);
  const speedCounts = recentSessions.reduce((acc, s) => {
    acc[s.speed] = (acc[s.speed] || 0) + 1;
    return acc;
  }, {} as Record<ChargingSpeed, number>);
  
  const mostCommon = Object.entries(speedCounts).sort((a, b) => b[1] - a[1])[0];
  return mostCommon ? mostCommon[0] as ChargingSpeed : 'normal';
};

export const detectPortQuality = (sessions: ChargingSession[]): BatteryHealthMetrics['portQuality'] => {
  if (sessions.length < 3) return 'good';
  
  const recentSessions = sessions.slice(-5);
  const avgEfficiency = recentSessions.reduce((sum, s) => sum + s.efficiency, 0) / recentSessions.length;
  
  if (avgEfficiency >= 85) return 'excellent';
  if (avgEfficiency >= 65) return 'good';
  return 'needs-cleaning';
};

export const analyzeTemperatureImpact = (efficiency: number): BatteryHealthMetrics['temperatureImpact'] => {
  if (efficiency >= 80) return 'optimal';
  if (efficiency >= 60) return 'warm';
  return 'hot';
};

export const generateRecommendations = (health: BatteryHealthMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (health.healthScore < 70) {
    recommendations.push('Consider battery calibration to restore optimal performance');
  }
  
  if (health.portQuality === 'needs-cleaning') {
    recommendations.push('Clean charging port with compressed air or soft brush');
  }
  
  if (health.temperatureImpact === 'hot') {
    recommendations.push('Let device cool down before charging for better efficiency');
  }
  
  if (health.averageChargingSpeed === 'slow') {
    recommendations.push('Try using airplane mode while charging for faster speeds');
    recommendations.push('Close background apps to reduce power consumption');
  }
  
  if (health.chargingEfficiency < 70) {
    recommendations.push('Use original or certified charging cables for best results');
    recommendations.push('Avoid charging in hot environments');
  }
  
  return recommendations;
};
