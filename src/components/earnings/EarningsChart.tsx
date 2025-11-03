import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EarningsTransaction } from '@/hooks/useEarningsData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

interface EarningsChartProps {
  transactions: EarningsTransaction[];
}

export const EarningsChart = ({ transactions }: EarningsChartProps) => {
  // Prepare timeline data
  const timelineData = transactions
    .slice()
    .reverse()
    .map((tx, index) => ({
      date: format(new Date(tx.created_at), 'MMM d'),
      xmrt: tx.amount,
      cumulative: transactions
        .slice(0, transactions.length - index)
        .reduce((sum, t) => sum + t.amount, 0),
    }));

  // Prepare bonus breakdown data
  const totalMining = transactions.reduce((sum, tx) => 
    sum + (tx.metadata?.xmr_contribution?.xmrt_from_xmr || 0), 0
  );
  const totalBase = transactions.reduce((sum, tx) => 
    sum + (tx.metadata?.base_amount || 0), 0
  );
  const totalBonus = transactions.reduce((sum, tx) => sum + tx.amount, 0) - totalBase;

  const bonusData = [
    { name: 'Base Rewards', value: totalBase, color: 'hsl(var(--battery-high))' },
    { name: 'Bonus Multipliers', value: totalBonus - totalMining, color: 'hsl(var(--primary))' },
    { name: 'Mining Bonus', value: totalMining, color: 'hsl(var(--xmr-orange))' },
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="corporate-shadow">
        <CardHeader>
          <CardTitle className="text-base">Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="corporate-shadow">
        <CardHeader>
          <CardTitle className="text-base">Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bonusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bonusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => value.toFixed(4) + ' XMRT'}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
