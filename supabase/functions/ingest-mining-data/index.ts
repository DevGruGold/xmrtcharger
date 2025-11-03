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

    const { worker_id, wallet_address, pool, hashrate, shares_found, xmr_earned, timestamp } = await req.json();

    console.log('⛏️ Mining Data Received:', { worker_id, hashrate, shares_found, xmr_earned });

    if (!worker_id || !wallet_address) {
      return new Response(
        JSON.stringify({ error: 'worker_id and wallet_address are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert XMR worker
    const { data: worker, error: workerError } = await supabaseClient
      .from('xmr_workers')
      .upsert({
        worker_id,
        wallet_address,
        pool_address: pool || 'supportxmr.com',
        is_active: true,
        last_seen_at: timestamp || new Date().toISOString(),
        metadata: {
          last_hashrate: hashrate,
          total_shares: shares_found,
        }
      }, {
        onConflict: 'worker_id'
      })
      .select()
      .single();

    if (workerError) {
      console.error('Worker upsert error:', workerError);
      throw workerError;
    }

    console.log('✅ Worker updated:', worker.id);

    // Insert mining update
    const { data: miningUpdate, error: updateError } = await supabaseClient
      .from('mining_updates')
      .insert({
        miner_id: worker.id,
        metric_type: 'hashrate',
        metric: {
          hashrate,
          shares_found,
          xmr_earned,
          timestamp: timestamp || new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (updateError) {
      console.error('Mining update error:', updateError);
      throw updateError;
    }

    console.log('✅ Mining update recorded:', miningUpdate.id);

    return new Response(
      JSON.stringify({
        success: true,
        worker_id: worker.worker_id,
        miner_id: worker.id,
        update_id: miningUpdate.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error ingesting mining data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
