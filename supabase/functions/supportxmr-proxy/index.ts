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

    const body = await req.json();
    const { wallet_address, deviceId, action = 'fetch_stats', worker_id, device_id } = body;

    // Get DAO pool wallet address from environment
    const DAO_POOL_WALLET = Deno.env.get('MINER_WALLET_ADDRESS') || '';
    
    // Handle get_default_wallet action
    if (action === 'get_default_wallet') {
      return new Response(
        JSON.stringify({
          success: true,
          wallet_address: DAO_POOL_WALLET,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle link_worker_by_id action (for MobileMonero users)
    if (action === 'link_worker_by_id') {
      if (!worker_id || !device_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'worker_id and device_id are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`🔗 Linking MobileMonero worker ${worker_id} to device ${device_id}`);

      // Fetch active workers from SupportXMR for the DAO wallet
      try {
        const identifiersResponse = await fetch(`${SUPPORTXMR_API}/${DAO_POOL_WALLET}/identifiers`);
        
        if (!identifiersResponse.ok) {
          throw new Error(`SupportXMR API error: ${identifiersResponse.status}`);
        }

        const identifiersData = await identifiersResponse.json();
        console.log('👷 Available workers:', Object.keys(identifiersData));

        // Find matching worker - the worker ID format from MobileMonero is {WALLET}.{8-char-hash}
        // We need to find a worker that ends with the provided worker_id
        let matchedWorkerKey: string | null = null;
        let matchedWorkerData: any = null;

        for (const [key, data] of Object.entries(identifiersData)) {
          // Check if worker key ends with the 8-char ID (case-insensitive)
          const workerSuffix = key.split('.').pop()?.toUpperCase();
          if (workerSuffix === worker_id.toUpperCase()) {
            matchedWorkerKey = key;
            matchedWorkerData = data;
            break;
          }
          // Also check for exact match or partial match at end
          if (key.toUpperCase().endsWith(worker_id.toUpperCase())) {
            matchedWorkerKey = key;
            matchedWorkerData = data;
            break;
          }
        }

        if (!matchedWorkerKey) {
          console.log(`❌ Worker ${worker_id} not found in active workers`);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Worker ID "${worker_id}" not found. Make sure your miner is running and has submitted at least one share.`,
              available_workers: Object.keys(identifiersData).length,
            }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`✅ Found matching worker: ${matchedWorkerKey}`);

        // Create or update xmr_workers entry
        const { data: worker, error: workerError } = await supabaseClient
          .from('xmr_workers')
          .upsert({
            wallet_address: DAO_POOL_WALLET,
            worker_id: matchedWorkerKey,
            is_active: true,
            metadata: {
              last_hashrate: matchedWorkerData?.hashrate || matchedWorkerData?.hash || 0,
              connection_type: 'mobilemonero',
              linked_at: new Date().toISOString(),
              user_worker_id: worker_id,
            }
          }, {
            onConflict: 'worker_id',
            ignoreDuplicates: false,
          })
          .select()
          .single();

        if (workerError) {
          console.error('Worker upsert error:', workerError);
          throw workerError;
        }

        // Create device-miner association
        const { error: assocError } = await supabaseClient
          .from('device_miner_associations')
          .upsert({
            device_id: device_id,
            worker_id: matchedWorkerKey,
            wallet_address: DAO_POOL_WALLET,
            mining_while_charging: true,
            is_active: true,
            associated_at: new Date().toISOString(),
            metadata: {
              connection_type: 'mobilemonero',
              user_worker_id: worker_id,
              mining_pool_type: 'dao_pool',
            }
          }, {
            onConflict: 'device_id'
          });

        if (assocError) {
          console.error('Association error:', assocError);
          throw assocError;
        }

        console.log(`✅ Successfully linked worker ${matchedWorkerKey} to device ${device_id}`);

        return new Response(
          JSON.stringify({
            success: true,
            worker_id: matchedWorkerKey,
            wallet_address: DAO_POOL_WALLET,
            hashrate: matchedWorkerData?.hashrate || matchedWorkerData?.hash || 0,
            message: 'MobileMonero worker linked successfully!',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (apiError) {
        console.error('SupportXMR API error:', apiError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Could not verify worker with SupportXMR. Please ensure your miner is active.' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Standard fetch_stats flow
    if (!wallet_address || !wallet_address.startsWith('4')) {
      return new Response(
        JSON.stringify({ error: 'Valid Monero wallet address required (starts with 4)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CRITICAL: Validate that wallet matches DAO pool wallet for XMRT rewards
    const isDAOPoolWallet = wallet_address === DAO_POOL_WALLET;
    if (!isDAOPoolWallet) {
      console.warn(`⚠️ Non-DAO wallet detected: ${wallet_address.substring(0, 8)}... (won't earn XMRT)`);
    }

    console.log(`📡 Fetching SupportXMR stats for: ${wallet_address.substring(0, 8)}...`);

    const response = await fetch(`${SUPPORTXMR_API}/${wallet_address}/stats`);
    
    if (!response.ok) {
      throw new Error(`SupportXMR API error: ${response.status} ${response.statusText}`);
    }

    const stats = await response.json();
    console.log('📊 Received stats:', JSON.stringify(stats, null, 2));

    // Fetch worker-specific hashrates from identifiers endpoint
    let hashrate = 0;
    let workers = stats.identifiers || [];
    
    try {
      const identifiersResponse = await fetch(`${SUPPORTXMR_API}/${wallet_address}/identifiers`);
      if (identifiersResponse.ok) {
        const identifiersData = await identifiersResponse.json();
        console.log('👷 Received worker data:', JSON.stringify(identifiersData, null, 2));
        
        // Sum up hashrates from all active workers
        if (identifiersData && typeof identifiersData === 'object') {
          hashrate = Object.values(identifiersData).reduce((sum: number, worker: any) => {
            return sum + (worker?.hashrate || worker?.hash || 0);
          }, 0);
          workers = Object.keys(identifiersData);
        }
        console.log(`⚡ Calculated total hashrate: ${hashrate} H/s from ${workers.length} workers`);
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch worker hashrates, using stats fallback:', err);
      hashrate = stats.hash || stats.hashrate || 0;
    }

    const shares = stats.validShares || stats.shares || 0;
    
    // Get previous share count to calculate delta
    const { data: existingWorker } = await supabaseClient
      .from('xmr_workers')
      .select('metadata')
      .eq('wallet_address', wallet_address)
      .single();

    const previousShares = existingWorker?.metadata?.total_shares || 0;
    const newSharesFound = Math.max(0, shares - previousShares);

    console.log(`📊 Shares update: ${previousShares} → ${shares} (delta: +${newSharesFound})`);

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
          mining_pool_type: isDAOPoolWallet ? 'dao_pool' : 'personal',
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

    console.log(`✅ Worker upserted: ${worker.worker_id} (${isDAOPoolWallet ? 'DAO Pool' : 'Personal Mining'})`);

    // Store only INCREMENTAL shares, not cumulative balance
    const { error: updateError } = await supabaseClient
      .from('mining_updates')
      .insert({
        miner_id: worker.id,
        status: 'active',
        metric: {
          hashrate,
          shares_found: newSharesFound,
          total_shares: shares,
          workers_active: workers.length,
          is_dao_pool: isDAOPoolWallet,
        },
        update_source: 'supportxmr_api',
      });

    if (updateError) {
      console.error('❌ Mining update insert error:', updateError);
    } else {
      console.log(`✅ Mining update inserted: +${newSharesFound} new shares`);
    }

    if (deviceId && action === 'connect') {
      console.log(`🔗 Attempting to associate device ${deviceId} with miner ${worker.id}`);
      
      const { error: assocError } = await supabaseClient
        .from('device_miner_associations')
        .upsert({
          device_id: deviceId,
          worker_id: worker.worker_id,
          wallet_address: wallet_address,
          mining_while_charging: true,
          is_active: true,
          associated_at: new Date().toISOString(),
          metadata: {
            last_shares_counted: 0,
            total_shares_rewarded: 0,
            mining_pool_type: isDAOPoolWallet ? 'dao_pool' : 'personal',
          }
        }, {
          onConflict: 'device_id'
        });

      if (assocError) {
        console.error('❌ Association error:', assocError);
        console.error('Association error details:', JSON.stringify(assocError, null, 2));
      } else {
        console.log(`✅ Successfully associated device ${deviceId} with miner ${worker.id}`);
        if (!isDAOPoolWallet) {
          console.warn(`⚠️ Device mining to personal wallet - no XMRT rewards`);
        }
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
          new_shares_found: newSharesFound,
          workers_count: workers.length,
          is_dao_pool: isDAOPoolWallet,
          xmrt_eligible: isDAOPoolWallet,
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
