import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('📊 Aggregating device metrics...');

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();

    // Get active devices count
    const { count: activeDevicesCount } = await supabaseClient
      .from('device_connection_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get today's connections
    const { count: todayConnections } = await supabaseClient
      .from('device_connection_sessions')
      .select('id', { count: 'exact', head: true })
      .gte('connected_at', `${today}T00:00:00Z`);

    // Get today's charging sessions
    const { count: todayChargingSessions } = await supabaseClient
      .from('charging_sessions')
      .select('id', { count: 'exact', head: true })
      .gte('started_at', `${today}T00:00:00Z`);

    // Get today's PoP points
    const { data: popData } = await supabaseClient
      .from('pop_events_ledger')
      .select('pop_points')
      .gte('event_timestamp', `${today}T00:00:00Z`);

    const totalPopPoints = popData?.reduce((sum, e) => sum + Number(e.pop_points), 0) || 0;

    // Calculate average session duration
    const { data: completedSessions } = await supabaseClient
      .from('device_connection_sessions')
      .select('total_duration_seconds')
      .eq('is_active', false)
      .gte('connected_at', `${today}T00:00:00Z`)
      .not('total_duration_seconds', 'is', null);

    const avgDuration = completedSessions?.length 
      ? completedSessions.reduce((sum, s) => sum + (s.total_duration_seconds || 0), 0) / completedSessions.length
      : null;

    // Calculate average charging efficiency
    const { data: chargingSessions } = await supabaseClient
      .from('charging_sessions')
      .select('efficiency_score')
      .gte('started_at', `${today}T00:00:00Z`)
      .not('efficiency_score', 'is', null);

    const avgEfficiency = chargingSessions?.length
      ? chargingSessions.reduce((sum, s) => sum + (s.efficiency_score || 0), 0) / chargingSessions.length
      : null;

    // Get anomalies count
    const { count: anomaliesCount } = await supabaseClient
      .from('device_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('is_anomaly', true)
      .gte('occurred_at', `${today}T00:00:00Z`);

    // Get commands stats
    const { count: commandsIssued } = await supabaseClient
      .from('engagement_commands')
      .select('id', { count: 'exact', head: true })
      .gte('issued_at', `${today}T00:00:00Z`);

    const { count: commandsExecuted } = await supabaseClient
      .from('engagement_commands')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'executed')
      .gte('issued_at', `${today}T00:00:00Z`);

    // Get top devices
    const { data: topDevices } = await supabaseClient
      .from('device_connection_sessions')
      .select('device_id')
      .gte('connected_at', `${today}T00:00:00Z`)
      .order('total_duration_seconds', { ascending: false })
      .limit(10);

    const topDeviceIds = topDevices?.map(d => d.device_id) || [];

    // Get top event types
    const { data: topEvents } = await supabaseClient
      .from('device_activity_log')
      .select('activity_type')
      .gte('occurred_at', `${today}T00:00:00Z`)
      .order('occurred_at', { ascending: false })
      .limit(100);

    const eventCounts = topEvents?.reduce((acc, e) => {
      acc[e.activity_type] = (acc[e.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const topEventTypes = Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);

    // Upsert metrics summary
    const { error: upsertError } = await supabaseClient
      .from('device_metrics_summary')
      .upsert({
        summary_date: today,
        summary_hour: currentHour,
        active_devices_count: activeDevicesCount || 0,
        total_connections: todayConnections || 0,
        total_charging_sessions: todayChargingSessions || 0,
        total_pop_points_earned: totalPopPoints,
        avg_session_duration_seconds: avgDuration,
        avg_charging_efficiency: avgEfficiency,
        total_anomalies_detected: anomaliesCount || 0,
        total_commands_issued: commandsIssued || 0,
        total_commands_executed: commandsExecuted || 0,
        top_device_ids: topDeviceIds,
        top_event_types: topEventTypes,
        detailed_metrics: {
          timestamp: now.toISOString(),
          event_type_distribution: eventCounts,
        },
        updated_at: now.toISOString(),
      }, {
        onConflict: 'summary_date,summary_hour'
      });

    if (upsertError) throw upsertError;

    console.log('✅ Metrics aggregated successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        metrics: {
          activeDevices: activeDevicesCount,
          todayConnections: todayConnections,
          todayChargingSessions: todayChargingSessions,
          totalPopPoints: totalPopPoints,
          avgSessionDuration: avgDuration ? Math.round(avgDuration) : null,
          avgChargingEfficiency: avgEfficiency ? Math.round(avgEfficiency) : null,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error aggregating metrics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
