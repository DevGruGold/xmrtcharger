import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConnectionEvent {
  deviceId: string;
  sessionKey: string;
  eventType: 'connect' | 'disconnect' | 'heartbeat';
  deviceInfo?: {
    ipAddress?: string;
    userAgent?: string;
    appVersion?: string;
    batteryLevel?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const event: ConnectionEvent = await req.json();
    console.log('📡 Connection event:', event.eventType, 'for device:', event.deviceId);

    if (event.eventType === 'connect') {
      // Check for existing active session
      const { data: existingSessions } = await supabaseClient
        .from('device_connection_sessions')
        .select('id')
        .eq('device_id', event.deviceId)
        .eq('is_active', true)
        .limit(1);

      // Close any existing active sessions for this device
      if (existingSessions && existingSessions.length > 0) {
        await supabaseClient
          .from('device_connection_sessions')
          .update({
            is_active: false,
            disconnected_at: new Date().toISOString(),
            metadata: { disconnect_reason: 'new_session_started' }
          })
          .eq('device_id', event.deviceId)
          .eq('is_active', true);
      }

      // Create new connection session
      const { data: newSession, error: sessionError } = await supabaseClient
        .from('device_connection_sessions')
        .insert({
          device_id: event.deviceId,
          session_key: event.sessionKey,
          ip_address: event.deviceInfo?.ipAddress,
          user_agent: event.deviceInfo?.userAgent,
          app_version: event.deviceInfo?.appVersion || '1.0.0',
          battery_level_start: event.deviceInfo?.batteryLevel,
          is_active: true,
          last_heartbeat: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Log connection activity
      await supabaseClient
        .from('device_activity_log')
        .insert({
          device_id: event.deviceId,
          session_id: newSession.id,
          category: 'connection',
          activity_type: 'device_connected',
          severity: 'info',
          description: 'Device connected to XMRT-Charger',
          details: {
            app_version: event.deviceInfo?.appVersion,
            battery_level: event.deviceInfo?.batteryLevel,
            ip_address: event.deviceInfo?.ipAddress,
          },
        });

      console.log('✅ New session created:', newSession.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          sessionId: newSession.id,
          message: 'Device connected successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    
    else if (event.eventType === 'disconnect') {
      // Find active session
      const { data: session } = await supabaseClient
        .from('device_connection_sessions')
        .select('*')
        .eq('device_id', event.deviceId)
        .eq('session_key', event.sessionKey)
        .eq('is_active', true)
        .single();

      if (session) {
        // Calculate session duration
        const connectedAt = new Date(session.connected_at);
        const now = new Date();
        const durationSeconds = Math.floor((now.getTime() - connectedAt.getTime()) / 1000);

        // Update session as disconnected
        await supabaseClient
          .from('device_connection_sessions')
          .update({
            is_active: false,
            disconnected_at: now.toISOString(),
            total_duration_seconds: durationSeconds,
            battery_level_end: event.deviceInfo?.batteryLevel,
          })
          .eq('id', session.id);

        // Log disconnection
        await supabaseClient
          .from('device_activity_log')
          .insert({
            device_id: event.deviceId,
            session_id: session.id,
            category: 'connection',
            activity_type: 'device_disconnected',
            severity: 'info',
            description: `Device disconnected after ${Math.floor(durationSeconds / 60)} minutes`,
            details: {
              duration_seconds: durationSeconds,
              battery_level_end: event.deviceInfo?.batteryLevel,
              charging_sessions: session.charging_sessions_count,
            },
          });

        console.log('✅ Session closed:', session.id, `(${durationSeconds}s)`);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Device disconnected' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    
    else if (event.eventType === 'heartbeat') {
      // Update heartbeat timestamp
      const { error: heartbeatError } = await supabaseClient
        .from('device_connection_sessions')
        .update({
          last_heartbeat: new Date().toISOString(),
        })
        .eq('device_id', event.deviceId)
        .eq('session_key', event.sessionKey)
        .eq('is_active', true);

      if (heartbeatError) {
        console.warn('⚠️ Heartbeat update failed:', heartbeatError.message);
      }

      // Auto-disconnect stale sessions (no heartbeat for 5+ minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      await supabaseClient
        .from('device_connection_sessions')
        .update({
          is_active: false,
          disconnected_at: new Date().toISOString(),
          metadata: { disconnect_reason: 'stale_heartbeat' }
        })
        .eq('is_active', true)
        .lt('last_heartbeat', fiveMinutesAgo);

      return new Response(
        JSON.stringify({ success: true, message: 'Heartbeat recorded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid event type' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in monitor-device-connections:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
