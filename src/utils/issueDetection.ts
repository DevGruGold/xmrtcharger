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
      type: 'critical',
      category: 'port',
      title: 'Charging Port Needs Cleaning',
      description: 'Port contamination detected affecting connection quality and charging speed.',
      impact: 'Reduced charging speed by 30-50%, inconsistent connection, potential damage over time',
      solution: 'Clean port with compressed air and soft brush. Avoid liquids and metal objects.'
    });
  } else if (health.portQuality === 'good') {
    issues.push({
      id: 'port-maintenance',
      type: 'info',
      category: 'port',
      title: 'Regular Port Maintenance Recommended',
      description: 'Your port is functioning well but could benefit from preventive maintenance.',
      impact: 'Minor efficiency improvements possible',
      solution: 'Periodic cleaning every 2-3 months to prevent buildup'
    });
  }

  // Temperature Issues
  if (health.temperatureImpact === 'hot') {
    issues.push({
      id: 'temp-hot',
      type: 'critical',
      category: 'temperature',
      title: 'High Temperature Detected',
      description: 'Device temperature is significantly affecting charging performance.',
      impact: 'Reduced charging speed, accelerated battery degradation, potential safety concerns',
      solution: 'Remove phone case, place in cooler area, avoid charging while using intensive apps'
    });
  } else if (health.temperatureImpact === 'warm') {
    issues.push({
      id: 'temp-warm',
      type: 'warning',
      category: 'temperature',
      title: 'Elevated Temperature',
      description: 'Temperature is slightly higher than optimal for charging.',
      impact: 'Moderate reduction in charging efficiency (10-15%)',
      solution: 'Improve ventilation, avoid direct sunlight, consider removing case during charging'
    });
  }

  // Charging Speed Issues
  if (health.averageChargingSpeed === 'slow') {
    issues.push({
      id: 'speed-slow',
      type: 'warning',
      category: 'speed',
      title: 'Consistently Slow Charging',
      description: 'Your device is charging significantly slower than its capability.',
      impact: 'Extended charging times, reduced convenience',
      solution: 'Use original charger, enable airplane mode, close background apps, check cable quality'
    });
  }

  // Efficiency Issues
  if (health.chargingEfficiency < 60) {
    issues.push({
      id: 'efficiency-low',
      type: 'critical',
      category: 'efficiency',
      title: 'Low Charging Efficiency',
      description: 'Power conversion efficiency is significantly below expected levels.',
      impact: 'Wasted energy, increased heat generation, longer charging times',
      solution: 'Replace charging cable, use certified charger, clean charging port, check for software issues'
    });
  } else if (health.chargingEfficiency < 75) {
    issues.push({
      id: 'efficiency-moderate',
      type: 'warning',
      category: 'efficiency',
      title: 'Moderate Charging Efficiency',
      description: 'Charging efficiency could be improved for optimal performance.',
      impact: 'Some power waste, slightly longer charging times',
      solution: 'Verify charger specifications, ensure good port connection, minimize device usage while charging'
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
      solution: 'Consider battery replacement, use Battery Health mode, avoid extreme charge levels (keep 20-80%)'
    });
  } else if (health.degradationLevel === 'fair') {
    issues.push({
      id: 'degradation-fair',
      type: 'warning',
      category: 'degradation',
      title: 'Moderate Battery Degradation',
      description: 'Battery is showing signs of wear that may worsen over time.',
      impact: 'Gradually declining capacity, may need more frequent charging',
      solution: 'Adopt better charging habits, avoid overnight charging, use optimization modes'
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
        solution: 'Review charging habits, inspect hardware for damage, consider professional inspection'
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
      solution: 'Immediate action required: clean port, optimize charging environment, consider battery service'
    });
  }

  return issues;
};
