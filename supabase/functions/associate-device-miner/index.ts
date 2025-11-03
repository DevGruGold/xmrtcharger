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

    const { deviceId, worker_id, wallet_address, mining_while_charging } = await req.json();

    console.log('🔗 Associate Device-Miner Request:', { deviceId, worker_id, mining_while_charging });

    if (!deviceId || (!worker_id && !wallet_address)) {
      return new Response(
        JSON.stringify({ error: 'deviceId and (worker_id or wallet_address) are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the XMR worker
    let query = supabaseClient
      .from('xmr_workers')
      .select('*');

    if (worker_id) {
      query = query.eq('worker_id', worker_id);
    } else {
      query = query.eq('wallet_address', wallet_address);
    }

    const { data: worker, error: workerError } = await query.single();

    if (workerError || !worker) {
      console.error('Worker not found:', workerError);
      return new Response(
        JSON.stringify({ 
          error: 'Worker not found. Please ensure the worker is actively mining.',
          details: workerError?.message 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Worker found:', worker.worker_id);

    // Create or update association
    const { data: association, error: associationError } = await supabaseClient
      .from('device_miner_associations')
      .upsert({
        device_id: deviceId,
        miner_id: worker.id,
        mining_while_charging: mining_while_charging ?? true,
        is_active: true,
        associated_at: new Date().toISOString(),
      }, {
        onConflict: 'device_id,miner_id'
      })
      .select(`
        *,
        xmr_workers (
          worker_id,
          wallet_address,
          pool_address
        )
      `)
      .single();

    if (associationError) {
      console.error('Association error:', associationError);
      throw associationError;
    }

    console.log('✅ Association created:', association.id);

    return new Response(
      JSON.stringify({
        success: true,
        association_id: association.id,
        worker: {
          worker_id: association.xmr_workers.worker_id,
          wallet_address: association.xmr_workers.wallet_address,
          pool: association.xmr_workers.pool_address,
        },
        mining_while_charging: association.mining_while_charging,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error associating device-miner:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
