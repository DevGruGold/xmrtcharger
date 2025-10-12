import { BatteryHealthMetrics, ChargingSession } from '@/types/battery';
import { BatteryIssue } from '@/components/battery/IssueDetectionPanel';

export const detectBatteryIssues = (
  health: BatteryHealthMetrics,
  sessions: ChargingSession[]
): BatteryIssue[] => {
  const issues: BatteryIssue[] = [];

  // Port Quality Issues
  if (health.portQuality === 'needs-cleaning') {
    issues.push({
      id: 'port-dirty',
      type: 'warning',
      category: 'port',
      title: 'Possible Connection Issue Detected',
      description: 'Charging patterns suggest a potential port, cable, or charger issue.',
      impact: 'May affect charging speed and connection stability',
      solution: 'Try: 1) Different charging cable 2) Original charger 3) Clean port gently with compressed air 4) Remove phone case',
      confidence: sessions.length < 5 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  } else if (health.portQuality === 'good') {
    issues.push({
      id: 'port-maintenance',
      type: 'info',
      category: 'port',
      title: 'Connection Quality Good',
      description: 'Your port is functioning well. Regular maintenance can help maintain performance.',
      impact: 'None detected - preventive measure',
      solution: 'Optional: Periodic gentle cleaning every 2-3 months to prevent buildup',
      confidence: sessions.length < 10 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  }

  // Temperature Issues
  if (health.temperatureImpact === 'hot') {
    issues.push({
      id: 'temp-hot',
      type: 'warning',
      category: 'temperature',
      title: 'Low Charging Efficiency Detected',
      description: 'Charging patterns show lower than expected efficiency. Possible causes: temperature, cable quality, or port condition.',
      impact: 'Slower charging and potential energy waste',
      solution: 'Try: Cool environment, airplane mode, original charger, close background apps',
      confidence: sessions.length < 10 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  } else if (health.temperatureImpact === 'warm') {
    issues.push({
      id: 'temp-warm',
      type: 'info',
      category: 'temperature',
      title: 'Moderate Charging Efficiency',
      description: 'Charging efficiency is acceptable but could be improved. Multiple factors may contribute.',
      impact: 'Slightly longer charging times',
      solution: 'Consider: Removing phone case, closing background apps, using airplane mode',
      confidence: sessions.length < 10 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  }

  // Charging Speed Issues
  if (health.averageChargingSpeed === 'slow') {
    issues.push({
      id: 'speed-slow',
      type: 'warning',
      category: 'speed',
      title: 'Consistently Slow Charging Pattern',
      description: 'Your charging sessions show slower than typical speeds. This may be due to several factors.',
      impact: 'Extended charging times',
      solution: 'Check: Original charger, enable airplane mode, close background apps, cable quality',
      confidence: sessions.length < 5 ? 'low' : sessions.length < 15 ? 'medium' : 'high',
      dataPoints: sessions.length
    });
  }

  // Efficiency Issues
  if (health.chargingEfficiency < 60) {
    issues.push({
      id: 'efficiency-low',
      type: 'warning',
      category: 'efficiency',
      title: 'Lower Charging Efficiency Pattern',
      description: 'Charging patterns indicate below-expected efficiency. May be related to multiple factors.',
      impact: 'Longer charging times, possible energy waste',
      solution: 'Try: Replace charging cable, use certified charger, clean charging port, check for software issues',
      confidence: sessions.length < 10 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  } else if (health.chargingEfficiency < 75) {
    issues.push({
      id: 'efficiency-moderate',
      type: 'info',
      category: 'efficiency',
      title: 'Room for Efficiency Improvement',
      description: 'Charging efficiency could be optimized for better performance.',
      impact: 'Slightly longer charging times',
      solution: 'Tips: Verify charger specifications, ensure good port connection, minimize device usage while charging',
      confidence: sessions.length < 10 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  }

  // Battery Degradation Issues
  if (health.degradationLevel === 'poor') {
    issues.push({
      id: 'degradation-poor',
      type: 'critical',
      category: 'degradation',
      title: 'Significant Battery Degradation',
      description: 'Battery health has declined substantially, indicating advanced wear.',
      impact: 'Reduced capacity, unpredictable performance, frequent charging needed',
      solution: 'Consider battery replacement, use Battery Health mode, avoid extreme charge levels (keep 20-80%)',
      confidence: sessions.length < 20 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  } else if (health.degradationLevel === 'fair') {
    issues.push({
      id: 'degradation-fair',
      type: 'warning',
      category: 'degradation',
      title: 'Moderate Battery Degradation',
      description: 'Battery is showing signs of wear that may worsen over time.',
      impact: 'Gradually declining capacity, may need more frequent charging',
      solution: 'Adopt better charging habits, avoid overnight charging, use optimization modes',
      confidence: sessions.length < 15 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  }

  // Pattern-based Issues
  if (sessions.length >= 5) {
    const recentSessions = sessions.slice(-5);
    const avgEfficiency = recentSessions.reduce((sum, s) => sum + s.efficiency, 0) / 5;
    const efficiencyTrend = recentSessions.map(s => s.efficiency);
    const isDecreasing = efficiencyTrend.every((val, i) => i === 0 || val <= efficiencyTrend[i - 1]);

    if (isDecreasing && avgEfficiency < 70) {
      issues.push({
        id: 'trend-declining',
        type: 'warning',
        category: 'efficiency',
        title: 'Declining Performance Trend',
        description: 'Charging efficiency has been consistently decreasing over recent sessions.',
        impact: 'Progressive performance deterioration, potential hardware issues',
        solution: 'Review charging habits, inspect hardware for damage, consider professional inspection',
        confidence: 'medium',
        dataPoints: sessions.length
      });
    }
  }

  // Health Score Based Issues
  if (health.healthScore < 50) {
    issues.push({
      id: 'overall-critical',
      type: 'critical',
      category: 'degradation',
      title: 'Critical Battery Health',
      description: 'Overall battery health is in critical condition requiring immediate attention.',
      impact: 'Severely compromised performance, unreliable operation',
      solution: 'Immediate action required: clean port, optimize charging environment, consider battery service',
      confidence: sessions.length < 20 ? 'low' : 'medium',
      dataPoints: sessions.length
    });
  }

  return issues;
};
