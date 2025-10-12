import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getChargingHistory } from '@/utils/batteryHistory';
import { format } from 'date-fns';

export const ChargingGraph = () => {
  const data = useMemo(() => {
    const history = getChargingHistory();
    
    return history.slice(-20).map((session) => ({
      time: format(new Date(session.timestamp), 'HH:mm'),
      level: session.endLevel,
      efficiency: session.efficiency,
      duration: Math.round(session.duration / 60), // Convert to minutes
    }));
  }, []);

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No charging history available yet. Start charging to see your data!
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Charging History</h3>
        <p className="text-sm text-muted-foreground">Real-time charging performance over your last 20 sessions</p>
      </div>

      {/* Battery Level Over Time */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--charging-normal))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--charging-normal))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: 'Battery %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="hsl(var(--charging-normal))" 
              fill="url(#levelGradient)"
              strokeWidth={2}
              name="Battery Level %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charging Efficiency */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="hsl(var(--charging-fast))" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Charging Efficiency %"
            />
            <Line 
              type="monotone" 
              dataKey="duration" 
              stroke="hsl(var(--charging-super))" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Duration (min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
