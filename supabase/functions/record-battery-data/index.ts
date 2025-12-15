import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { 
      deviceId, 
      sessionId, 
      batteryLevel, 
      isCharging, 
      chargingTimeRemaining,
      dischargingTimeRemaining,
      chargingSpeed,
      temperatureImpact,
      metadata 
    } = await req.json();

    console.log('📋 record-battery-data payload:', {
      deviceId,
      sessionId,
      sessionIdType: typeof sessionId,
      batteryLevel,
      isCharging,
    });

    // Validate UUIDs
    if (!isValidUUID(deviceId)) {
      console.error('Invalid deviceId format:', deviceId);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid deviceId format. Must be a valid UUID.',
          received: deviceId 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (sessionId && !isValidUUID(sessionId)) {
      console.error('Invalid sessionId format:', sessionId);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid sessionId format. Must be a valid UUID or null.',
          received: sessionId 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize / validate sessionId (clients may send a stale connection session UUID)
    let safeSessionId: string | null = null;

    if (sessionId === undefined || sessionId === null || sessionId === '') {
      safeSessionId = null;
    } else if (typeof sessionId === 'string' && isValidUUID(sessionId)) {
      const { data: sessionRow, error: sessionLookupError } = await supabaseClient
        .from('battery_sessions')
        .select('id')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionLookupError) {
        console.error('Error looking up battery_session:', sessionLookupError);
        // Fail open to null so we can still record the reading
        safeSessionId = null;
      } else if (sessionRow?.id) {
        safeSessionId = sessionId;
      } else {
        console.warn('Dropping unknown session_id (no matching battery_sessions row):', sessionId);
        safeSessionId = null;
      }
    }

    // Record battery reading
    const { error: readingError } = await supabaseClient
      .from('battery_readings')
      .insert({
        device_id: deviceId,
        session_id: safeSessionId,
        battery_level: batteryLevel,
        is_charging: isCharging,
        charging_time_remaining: chargingTimeRemaining,
        discharging_time_remaining: dischargingTimeRemaining,
        charging_speed: chargingSpeed,
        temperature_impact: temperatureImpact,
        metadata: metadata || {}
      });

    if (readingError) {
      console.error('Error inserting battery reading:', readingError);
      throw readingError;
    }

    // Calculate health metrics from recent sessions
    const { data: recentReadings } = await supabaseClient
      .from('battery_readings')
      .select('*')
      .eq('device_id', deviceId)
      .eq('is_charging', true)
      .order('timestamp', { ascending: false })
      .limit(20);

    const { data: sessions } = await supabaseClient
      .from('charging_sessions')
      .select('*')
      .eq('device_id', deviceId)
      .order('started_at', { ascending: false })
      .limit(10);

    const sessionCount = sessions?.length || 0;
    const confidence = sessionCount < 5 ? 'low' : sessionCount < 20 ? 'medium' : 'high';

    // Calculate average efficiency
    let avgEfficiency = 85;
    if (sessions && sessions.length > 0) {
      avgEfficiency = sessions.reduce((sum, s) => sum + (s.efficiency_score || 85), 0) / sessions.length;
    }

    console.log('✅ Battery reading recorded successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        healthMetrics: {
          sessionCount,
          confidence,
          avgEfficiency: Math.round(avgEfficiency),
          dataQuality: confidence === 'high' ? 'Sufficient data' : 
                      confidence === 'medium' ? 'Moderate data' : 'Limited data'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error recording battery data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
