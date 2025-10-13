import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Cpu, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DataFlowMetrics {
  batteryReadings: number;
  activityLogs: number;
  optimizations: number;
  lastUpdate: Date;
}

interface RealTimeDataFlowProps {
  deviceId: string;
  sessionId: string | null;
}

export const RealTimeDataFlow = ({ deviceId, sessionId }: RealTimeDataFlowProps) => {
  const [metrics, setMetrics] = useState<DataFlowMetrics>({
    batteryReadings: 0,
    activityLogs: 0,
    optimizations: 0,
    lastUpdate: new Date(),
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!deviceId) return;

    const fetchMetrics = async () => {
      try {
        // Count recent battery readings
        const { count: readingCount } = await supabase
          .from('battery_readings')
          .select('*', { count: 'exact', head: true })
          .eq('device_id', deviceId)
          .gte('timestamp', new Date(Date.now() - 3600000).toISOString());

        // Count recent activity logs
        const { count: activityCount } = await supabase
          .from('device_activity_log')
          .select('*', { count: 'exact', head: true })
          .eq('device_id', deviceId)
          .gte('occurred_at', new Date(Date.now() - 3600000).toISOString());

        // Count AI optimizations
        const { count: optimizationCount } = await supabase
          .from('device_activity_log')
          .select('*', { count: 'exact', head: true })
          .eq('device_id', deviceId)
          .eq('activity_type', 'ai_optimization')
          .gte('occurred_at', new Date(Date.now() - 3600000).toISOString());

        setMetrics({
          batteryReadings: readingCount || 0,
          activityLogs: activityCount || 0,
          optimizations: optimizationCount || 0,
          lastUpdate: new Date(),
        });

        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setIsConnected(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Real-Time Data Flow
        </h4>
        <Badge variant={isConnected ? 'default' : 'secondary'} className="gap-1">
          <Wifi className="w-3 h-3" />
          {isConnected ? 'Connected' : 'Offline'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Database className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <div className="text-2xl font-bold text-blue-500">{metrics.batteryReadings}</div>
          <div className="text-xs text-muted-foreground">Battery Readings</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <Activity className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <div className="text-2xl font-bold text-green-500">{metrics.activityLogs}</div>
          <div className="text-xs text-muted-foreground">Activity Logs</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Cpu className="w-5 h-5 mx-auto mb-1 text-purple-500" />
          <div className="text-2xl font-bold text-purple-500">{metrics.optimizations}</div>
          <div className="text-xs text-muted-foreground">AI Analyses</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-center text-muted-foreground">
        Last updated: {metrics.lastUpdate.toLocaleTimeString()}
      </div>
    </Card>
  );
};