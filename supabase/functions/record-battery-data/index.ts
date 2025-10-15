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

    // Record battery reading
    const { error: readingError } = await supabaseClient
      .from('battery_readings')
      .insert({
        device_id: deviceId,
        session_id: sessionId || null,
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
