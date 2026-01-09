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

    let body: any;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    } = body;

    console.log('📋 record-battery-data payload:', {
      deviceId,
      sessionId,
      batteryLevel,
      batteryLevelType: typeof batteryLevel,
      isCharging,
    });

    // === VALIDATION ===
    
    // deviceId: required UUID
    if (!deviceId || typeof deviceId !== 'string' || !isValidUUID(deviceId)) {
      console.error('❌ Invalid deviceId:', deviceId);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid deviceId. Must be a valid UUID.',
          received: deviceId,
          receivedType: typeof deviceId
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // batteryLevel: required finite number
    if (typeof batteryLevel !== 'number' || !isFinite(batteryLevel)) {
      console.error('❌ Invalid batteryLevel:', batteryLevel, typeof batteryLevel);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid batteryLevel. Must be a finite number.',
          received: batteryLevel,
          receivedType: typeof batteryLevel
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // isCharging: required boolean
    if (typeof isCharging !== 'boolean') {
      console.error('❌ Invalid isCharging:', isCharging, typeof isCharging);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid isCharging. Must be a boolean.',
          received: isCharging,
          receivedType: typeof isCharging
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // === NORMALIZATION ===
    
    // batteryLevel: clamp to 0-100 and round
    const safeBatteryLevel = Math.round(Math.max(0, Math.min(100, batteryLevel)));

    // chargingTimeRemaining: null if not a valid positive finite number
    const safeChargingTime = (
      typeof chargingTimeRemaining === 'number' && 
      isFinite(chargingTimeRemaining) && 
      chargingTimeRemaining >= 0
    ) ? Math.round(chargingTimeRemaining) : null;

    // dischargingTimeRemaining: null if not a valid positive finite number
    const safeDischargingTime = (
      typeof dischargingTimeRemaining === 'number' && 
      isFinite(dischargingTimeRemaining) && 
      dischargingTimeRemaining >= 0
    ) ? Math.round(dischargingTimeRemaining) : null;

    // sessionId: normalize to null if empty/undefined, validate UUID if provided
    let safeSessionId: string | null = null;
    const rawSessionId = sessionId;

    if (sessionId && typeof sessionId === 'string' && sessionId.trim() !== '') {
      if (!isValidUUID(sessionId)) {
        // Non-UUID sessionId - accept but drop to null (store in metadata for debugging)
        console.warn('⚠️ Non-UUID sessionId provided, dropping to null:', sessionId);
        safeSessionId = null;
      } else {
        // Valid UUID - check if it exists in battery_sessions
        const { data: sessionRow, error: sessionLookupError } = await supabaseClient
          .from('battery_sessions')
          .select('id')
          .eq('id', sessionId)
          .maybeSingle();

        if (sessionLookupError) {
          console.error('⚠️ Error looking up battery_session:', sessionLookupError);
          safeSessionId = null;
        } else if (sessionRow?.id) {
          safeSessionId = sessionId;
        } else {
          console.warn('⚠️ Session not found in battery_sessions, dropping to null:', sessionId);
          safeSessionId = null;
        }
      }
    }

    // metadata: ensure it's a plain object
    const safeMetadata = (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) 
      ? { ...metadata, raw_session_id: rawSessionId || null }
      : { raw_session_id: rawSessionId || null };

    console.log('📊 Normalized values for insert:', {
      safeBatteryLevel,
      safeChargingTime,
      safeDischargingTime,
      safeSessionId,
    });

    const insertPayload = {
      device_id: deviceId,
      session_id: safeSessionId,
      battery_level: safeBatteryLevel,
      is_charging: isCharging,
      charging_time_remaining: safeChargingTime,
      discharging_time_remaining: safeDischargingTime,
      charging_speed: chargingSpeed || null,
      temperature_impact: temperatureImpact || null,
      metadata: safeMetadata
    };

    const { error: readingError } = await supabaseClient
      .from('battery_readings')
      .insert(insertPayload);

    if (readingError) {
      console.error('❌ Error inserting battery reading:', {
        code: readingError.code,
        message: readingError.message,
        details: readingError.details,
        hint: readingError.hint,
        payload: insertPayload
      });
      return new Response(
        JSON.stringify({ 
          error: readingError.message,
          code: readingError.code,
          details: readingError.details
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
