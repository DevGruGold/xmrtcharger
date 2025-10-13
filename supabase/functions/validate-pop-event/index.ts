import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PopEventRequest {
  deviceId: string;
  sessionId?: string;
  eventType: string;
  eventData: Record<string, unknown>;
  walletAddress?: string;
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

    const event: PopEventRequest = await req.json();
    console.log('🎖️ Validating PoP event:', event.eventType);

    // Get device and wallet info
    const { data: device } = await supabaseClient
      .from('devices')
      .select('wallet_address, worker_id')
      .eq('id', event.deviceId)
      .single();

    if (!device) {
      throw new Error('Device not found');
    }

    const walletAddress = event.walletAddress || device.wallet_address;
    if (!walletAddress) {
      throw new Error('Wallet address not available for PoP attribution');
    }

    // Calculate PoP points based on event type
    let popPoints = 0;
    let confidenceScore = 1.0;
    let eventDescription = '';
    let validationMethod = 'automated';

    switch (event.eventType) {
      case 'charging_session_completed':
        const duration = event.eventData.durationMinutes as number || 0;
        const efficiency = event.eventData.efficiency as number || 85;
        
        // Use database function for calculation
        const { data: calculatedPoints } = await supabaseClient.rpc(
          'calculate_charging_pop_points',
          {
            p_duration_minutes: duration,
            p_efficiency: efficiency,
            p_battery_contribution: 0
          }
        );
        
        popPoints = calculatedPoints || 0;
        eventDescription = `Completed ${duration}min charging session at ${efficiency}% efficiency`;
        confidenceScore = duration >= 30 ? 1.0 : 0.7;
        break;

      case 'calibration_performed':
        popPoints = 5.0;
        eventDescription = 'Device calibration performed successfully';
        confidenceScore = 1.0;
        break;

      case 'battery_health_contribution':
        popPoints = 3.0;
        eventDescription = 'Contributed battery health data';
        confidenceScore = 0.9;
        break;

      case 'thermal_data_collection':
        const dataPoints = event.eventData.dataPoints as number || 0;
        popPoints = Math.min(10, dataPoints / 10);
        eventDescription = `Collected ${dataPoints} thermal data points`;
        confidenceScore = 0.95;
        break;

      case 'sustained_connection':
        const connectionHours = event.eventData.hours as number || 0;
        popPoints = Math.min(15, connectionHours * 0.5);
        eventDescription = `Maintained connection for ${connectionHours} hours`;
        confidenceScore = 1.0;
        break;

      case 'diagnostic_report_submitted':
        popPoints = 8.0;
        eventDescription = 'Submitted diagnostic report';
        confidenceScore = 1.0;
        break;

      default:
        throw new Error(`Unknown event type: ${event.eventType}`);
    }

    // Check for duplicate events (prevent gaming)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentEvents } = await supabaseClient
      .from('pop_events_ledger')
      .select('id')
      .eq('device_id', event.deviceId)
      .eq('event_type', event.eventType)
      .gt('event_timestamp', oneHourAgo)
      .limit(1);

    if (recentEvents && recentEvents.length > 0) {
      console.warn('⚠️ Duplicate event detected, reducing confidence');
      confidenceScore *= 0.5;
      validationMethod = 'automated_with_duplicate_flag';
    }

    // Record PoP event
    const { data: popEvent, error: popError } = await supabaseClient
      .from('pop_events_ledger')
      .insert({
        device_id: event.deviceId,
        session_id: event.sessionId,
        wallet_address: walletAddress,
        event_type: event.eventType,
        event_description: eventDescription,
        pop_points: popPoints,
        confidence_score: confidenceScore,
        validation_method: validationMethod,
        event_data: event.eventData,
        is_validated: true,
        is_paid_out: false,
      })
      .select()
      .single();

    if (popError) throw popError;

    // Log activity
    await supabaseClient
      .from('device_activity_log')
      .insert({
        device_id: event.deviceId,
        session_id: event.sessionId,
        category: 'system_event',
        activity_type: 'pop_event_validated',
        severity: 'info',
        description: `PoP event validated: ${eventDescription}`,
        wallet_address: walletAddress,
        is_pop_eligible: true,
        pop_points: popPoints,
        details: {
          pop_event_id: popEvent.id,
          confidence_score: confidenceScore,
          event_type: event.eventType,
        },
      });

    console.log('✅ PoP event validated:', popEvent.id, `(${popPoints} points)`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        popEventId: popEvent.id,
        popPoints: popPoints,
        confidenceScore: confidenceScore,
        eventDescription: eventDescription,
        message: 'PoP event validated and recorded'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error validating PoP event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
