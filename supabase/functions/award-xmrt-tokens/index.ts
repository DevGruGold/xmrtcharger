import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reward configuration
const REWARD_CONFIG = {
  BASE_XMRT_PER_MINUTE: 0.2, // 1 XMRT per 5 minutes
  MAX_MODE_MULTIPLIER: 1.2, // +20% bonus for max charging mode
  CHARGING_MULTIPLIER: 1.5, // +50% bonus for active charging
  REWARD_CHECK_INTERVAL_SECONDS: 60, // Check every 60 seconds
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

    const { ipAddress, deviceId, sessionId, isCharging, maxModeEnabled } = await req.json();

    if (!ipAddress) {
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create user profile
    let { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('ip_address', ipAddress)
      .single();

    if (!profile) {
      const { data: newProfile, error: createError } = await supabaseClient
        .from('user_profiles')
        .insert({ 
          ip_address: ipAddress,
          device_ids: deviceId ? [deviceId] : []
        })
        .select()
        .single();

      if (createError) throw createError;
      profile = newProfile;
    } else if (deviceId && !profile.device_ids.includes(deviceId)) {
      // Add device to profile if not already there
      await supabaseClient
        .from('user_profiles')
        .update({ 
          device_ids: [...profile.device_ids, deviceId] 
        })
        .eq('id', profile.id);
    }

    const now = new Date();
    const lastReward = profile.last_reward_at ? new Date(profile.last_reward_at) : null;
    
    // Calculate time elapsed since last reward
    const elapsedSeconds = lastReward 
      ? (now.getTime() - lastReward.getTime()) / 1000
      : REWARD_CONFIG.REWARD_CHECK_INTERVAL_SECONDS;

    // Only award if enough time has passed
    if (elapsedSeconds < REWARD_CONFIG.REWARD_CHECK_INTERVAL_SECONDS) {
      return new Response(
        JSON.stringify({ 
          awarded: false,
          message: 'Not enough time elapsed',
          nextRewardIn: Math.ceil(REWARD_CONFIG.REWARD_CHECK_INTERVAL_SECONDS - elapsedSeconds)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate XMRT amount
    const baseAmount = (elapsedSeconds / 60) * REWARD_CONFIG.BASE_XMRT_PER_MINUTE;
    let multiplier = 1.0;
    const bonuses = [];

    if (maxModeEnabled) {
      multiplier *= REWARD_CONFIG.MAX_MODE_MULTIPLIER;
      bonuses.push('Maximum Charging Mode');
    }

    if (isCharging) {
      multiplier *= REWARD_CONFIG.CHARGING_MULTIPLIER;
      bonuses.push('Active Charging');
    }

    const finalAmount = baseAmount * multiplier;

    // Update user profile
    const { error: updateError } = await supabaseClient
      .from('user_profiles')
      .update({
        total_xmrt_earned: profile.total_xmrt_earned + finalAmount,
        total_time_online_seconds: profile.total_time_online_seconds + Math.floor(elapsedSeconds),
        last_reward_at: now.toISOString(),
      })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { error: txError } = await supabaseClient
      .from('xmrt_transactions')
      .insert({
        user_profile_id: profile.id,
        device_id: deviceId,
        session_id: sessionId,
        amount: finalAmount,
        transaction_type: 'time_reward',
        reason: bonuses.length > 0 
          ? `Time reward with bonuses: ${bonuses.join(', ')}`
          : 'Time reward',
        multiplier,
        metadata: {
          elapsed_seconds: Math.floor(elapsedSeconds),
          base_amount: baseAmount,
          bonuses,
          is_charging: isCharging,
          max_mode_enabled: maxModeEnabled,
        }
      });

    if (txError) throw txError;

    console.log(`✅ Awarded ${finalAmount.toFixed(2)} XMRT to user ${profile.id}`);

    return new Response(
      JSON.stringify({
        awarded: true,
        amount: parseFloat(finalAmount.toFixed(2)),
        newTotal: parseFloat((profile.total_xmrt_earned + finalAmount).toFixed(2)),
        multiplier,
        bonuses,
        elapsedSeconds: Math.floor(elapsedSeconds),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error awarding XMRT:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
