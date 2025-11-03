import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EarningsSummary as EarningsSummaryType } from '@/hooks/useEarningsData';
import { Coins, TrendingUp, Zap, Users, Battery } from 'lucide-react';

interface EarningsSummaryProps {
  summary: EarningsSummaryType;
}

export const EarningsSummary = ({ summary }: EarningsSummaryProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const summaryCards = [
    {
      title: 'Total XMRT Earned',
      value: summary.totalXmrt.toFixed(4),
      icon: Coins,
      color: 'text-primary',
    },
    {
      title: 'Base Rewards',
      value: summary.baseRewards.toFixed(4),
      icon: Battery,
      color: 'text-battery-high',
    },
    {
      title: 'Bonus Multipliers',
      value: summary.bonusMultipliers.toFixed(4),
      icon: TrendingUp,
      color: 'text-charging-fast',
    },
    {
      title: 'Mining Bonus',
      value: summary.miningBonus.toFixed(4),
      icon: Zap,
      color: 'text-xmr-orange',
    },
  ];

  const statsCards = [
    {
      title: 'Total Sessions',
      value: summary.totalSessions.toString(),
      subtitle: `Avg ${summary.averagePerSession.toFixed(2)} per session`,
    },
    {
      title: 'Charging Time',
      value: formatTime(summary.totalChargingTime),
      subtitle: 'Time rewarded',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="corporate-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <card.icon className={`h-4 w-4 ${card.color}`} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statsCards.map((card) => (
          <Card key={card.title} className="corporate-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
