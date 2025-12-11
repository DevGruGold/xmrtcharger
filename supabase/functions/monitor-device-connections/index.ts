import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConnectionEvent {
  deviceId: string;
  sessionKey: string;
  action?: 'connect' | 'disconnect' | 'heartbeat';
  eventType?: 'connect' | 'disconnect' | 'heartbeat';
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

    const body = await req.json();
    // Support both 'action' and 'eventType' for backwards compatibility
    const event: ConnectionEvent = {
      ...body,
      action: body.action || body.eventType,
    };
    
    const eventType = event.action || event.eventType;
    
    if (!eventType) {
      return new Response(
        JSON.stringify({ error: 'Missing action parameter', valid_actions: ['connect', 'disconnect', 'heartbeat'] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('📡 Connection event:', eventType, 'for device:', event.deviceId, 'session:', event.sessionKey);

    if (eventType === 'connect') {
      // Check for existing active session with SAME session key (reconnection)
      const { data: existingSession } = await supabaseClient
        .from('device_connection_sessions')
        .select('id, connected_at')
        .eq('device_id', event.deviceId)
        .eq('session_key', event.sessionKey)
        .eq('is_active', true)
        .single();

      // If session exists with same key, just update heartbeat and return
      if (existingSession) {
        console.log('♻️ Reconnecting to existing session:', existingSession.id);
        
        await supabaseClient
          .from('device_connection_sessions')
          .update({
            last_heartbeat: new Date().toISOString(),
          })
          .eq('id', existingSession.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            sessionId: existingSession.id,
            message: 'Reconnected to existing session',
            connected_at: existingSession.connected_at,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Close other active sessions for this device (different session keys)
      const { data: otherSessions } = await supabaseClient
        .from('device_connection_sessions')
        .select('id, connected_at')
        .eq('device_id', event.deviceId)
        .eq('is_active', true)
        .neq('session_key', event.sessionKey);

      if (otherSessions && otherSessions.length > 0) {
        console.log(`🔄 Closing ${otherSessions.length} old sessions for device`);
        
        const now = new Date();
        for (const session of otherSessions) {
          const connectedAt = new Date(session.connected_at);
          const durationSeconds = Math.floor((now.getTime() - connectedAt.getTime()) / 1000);
          
          await supabaseClient
            .from('device_connection_sessions')
            .update({
              is_active: false,
              disconnected_at: now.toISOString(),
              total_duration_seconds: durationSeconds,
              metadata: { disconnect_reason: 'new_session_started' }
            })
            .eq('id', session.id);
        }
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
          connected_at: new Date().toISOString(),
          last_heartbeat: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) {
        console.error('❌ Session creation error:', sessionError);
        throw sessionError;
      }

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
          message: 'Device connected successfully',
          connected_at: newSession.connected_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    
    else if (eventType === 'disconnect') {
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

        console.log(`⏱️ Session duration: ${durationSeconds}s (connected: ${session.connected_at}, now: ${now.toISOString()})`);

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
      } else {
        console.log('⚠️ No active session found for disconnect event');
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Device disconnected' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    
    else if (eventType === 'heartbeat') {
      // Update heartbeat timestamp
      const { data: updatedSession, error: heartbeatError } = await supabaseClient
        .from('device_connection_sessions')
        .update({
          last_heartbeat: new Date().toISOString(),
        })
        .eq('device_id', event.deviceId)
        .eq('session_key', event.sessionKey)
        .eq('is_active', true)
        .select('id')
        .single();

      if (heartbeatError) {
        console.warn('⚠️ Heartbeat update failed:', heartbeatError.message);
      } else {
        console.log('💓 Heartbeat recorded for session:', updatedSession?.id);
      }

      // Auto-disconnect stale sessions (no heartbeat for 5+ minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: staleSessions } = await supabaseClient
        .from('device_connection_sessions')
        .select('id, connected_at')
        .eq('is_active', true)
        .lt('last_heartbeat', fiveMinutesAgo);

      if (staleSessions && staleSessions.length > 0) {
        console.log(`🧹 Cleaning up ${staleSessions.length} stale sessions`);
        
        const now = new Date();
        for (const stale of staleSessions) {
          const connectedAt = new Date(stale.connected_at);
          const durationSeconds = Math.floor((now.getTime() - connectedAt.getTime()) / 1000);
          
          await supabaseClient
            .from('device_connection_sessions')
            .update({
              is_active: false,
              disconnected_at: now.toISOString(),
              total_duration_seconds: durationSeconds,
              metadata: { disconnect_reason: 'stale_heartbeat' }
            })
            .eq('id', stale.id);
        }
      }

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
