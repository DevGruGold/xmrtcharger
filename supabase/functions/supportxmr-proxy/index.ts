import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPPORTXMR_API = 'https://supportxmr.com/api/miner';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { wallet_address, deviceId, action = 'fetch_stats' } = await req.json();

    // Handle get_default_wallet action
    if (action === 'get_default_wallet') {
      const defaultWallet = Deno.env.get('MINER_WALLET_ADDRESS') || '';
      return new Response(
        JSON.stringify({
          success: true,
          wallet_address: defaultWallet,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!wallet_address || !wallet_address.startsWith('4')) {
      return new Response(
        JSON.stringify({ error: 'Valid Monero wallet address required (starts with 4)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📡 Fetching SupportXMR stats for: ${wallet_address.substring(0, 8)}...`);

    const response = await fetch(`${SUPPORTXMR_API}/${wallet_address}/stats`);
    
    if (!response.ok) {
      throw new Error(`SupportXMR API error: ${response.status} ${response.statusText}`);
    }

    const stats = await response.json();
    console.log('📊 Received stats:', JSON.stringify(stats, null, 2));

    const hashrate = stats.hash || stats.hashrate || 0;
    const shares = stats.validShares || stats.shares || 0;
    const xmr_earned = (stats.amtDue || stats.balance || 0) / 1e12;
    const workers = stats.identifiers || [];

    const { data: worker, error: workerError } = await supabaseClient
      .from('xmr_workers')
      .upsert({
        wallet_address,
        worker_id: workers[0] || wallet_address.substring(0, 12),
        is_active: hashrate > 0,
        metadata: {
          last_hashrate: hashrate,
          total_shares: shares,
          workers_count: workers.length,
          last_fetch: new Date().toISOString(),
        }
      }, {
        onConflict: 'wallet_address',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (workerError) {
      console.error('Worker upsert error:', workerError);
      throw workerError;
    }

    console.log(`✅ Worker upserted: ${worker.worker_id}`);

    const { error: updateError } = await supabaseClient
      .from('mining_updates')
      .insert({
        miner_id: worker.id,
        metric: {
          hashrate,
          shares_found: shares,
          xmr_earned,
          workers_active: workers.length,
        },
        update_source: 'supportxmr_api',
      });

    if (updateError) {
      console.warn('Mining update insert error:', updateError);
    }

    if (deviceId && action === 'connect') {
      const { error: assocError } = await supabaseClient
        .from('device_miner_associations')
        .upsert({
          device_id: deviceId,
          miner_id: worker.id,
          mining_while_charging: true,
          is_active: true,
          associated_at: new Date().toISOString(),
        }, {
          onConflict: 'device_id,miner_id'
        });

      if (assocError) {
        console.warn('Association error:', assocError);
      } else {
        console.log(`🔗 Associated device ${deviceId} with miner ${worker.id}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        worker: {
          worker_id: worker.worker_id,
          wallet_address: worker.wallet_address,
          pool: 'SupportXMR',
          is_active: worker.is_active,
        },
        stats: {
          hashrate,
          shares,
          xmr_earned,
          xmrt_bonus: xmr_earned * 1000,
          workers_count: workers.length,
        },
        last_updated: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ SupportXMR Proxy Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        hint: 'Ensure the wallet address is correct and actively mining on SupportXMR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
