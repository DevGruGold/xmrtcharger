import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommandRequest {
  deviceId?: string;
  targetAll?: boolean;
  commandType: string;
  commandPayload: Record<string, unknown>;
  priority?: number;
  expiresInMinutes?: number;
  issuedBy?: string;
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

    const request: CommandRequest = await req.json();
    console.log('🎯 Issuing engagement command:', request.commandType);

    // Validate command
    if (!request.targetAll && !request.deviceId) {
      throw new Error('Must specify either deviceId or targetAll=true');
    }

    // Calculate expiration
    let expiresAt = null;
    if (request.expiresInMinutes && request.expiresInMinutes > 0) {
      expiresAt = new Date(Date.now() + request.expiresInMinutes * 60 * 1000).toISOString();
    }

    // Get session ID if targeting specific device
    let sessionId = null;
    if (request.deviceId) {
      const { data: session } = await supabaseClient
        .from('device_connection_sessions')
        .select('id')
        .eq('device_id', request.deviceId)
        .eq('is_active', true)
        .single();
      
      sessionId = session?.id || null;
    }

    // Insert command
    const { data: command, error: commandError } = await supabaseClient
      .from('engagement_commands')
      .insert({
        device_id: request.deviceId || null,
        session_id: sessionId,
        target_all: request.targetAll || false,
        command_type: request.commandType,
        command_payload: request.commandPayload,
        priority: request.priority || 5,
        expires_at: expiresAt,
        issued_by: request.issuedBy || 'eliza',
        status: 'pending',
      })
      .select()
      .single();

    if (commandError) throw commandError;

    // Log activity
    await supabaseClient
      .from('device_activity_log')
      .insert({
        device_id: request.deviceId || null,
        session_id: sessionId,
        category: 'system_event',
        activity_type: 'command_issued',
        severity: 'info',
        description: `Engagement command issued: ${request.commandType}`,
        details: {
          command_id: command.id,
          command_type: request.commandType,
          priority: request.priority,
          target_all: request.targetAll,
        },
      });

    // Update session command counter
    if (sessionId) {
      await supabaseClient.rpc('increment', {
        table_name: 'device_connection_sessions',
        row_id: sessionId,
        column_name: 'commands_received'
      }).catch(() => {
        // Fallback if rpc doesn't exist
        supabaseClient
          .from('device_connection_sessions')
          .update({ 
            commands_received: supabaseClient.rpc('coalesce', { 
              value: 'commands_received', 
              default_val: 0 
            }) 
          })
          .eq('id', sessionId);
      });
    }

    console.log('✅ Command issued:', command.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        commandId: command.id,
        message: `Command ${request.commandType} issued successfully`,
        expiresAt: expiresAt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error issuing command:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
