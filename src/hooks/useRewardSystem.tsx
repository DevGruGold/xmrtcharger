import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RewardData {
  awarded: boolean;
  amount?: number;
  newTotal?: number;
  multiplier?: number;
  bonuses?: string[];
  elapsedSeconds?: number;
  nextRewardIn?: number;
}

interface RewardSystemState {
  totalXmrt: number;
  isChecking: boolean;
  lastReward: RewardData | null;
  timeUntilNextReward: number;
}

interface UseRewardSystemOptions {
  deviceId: string | null;
  sessionId: string | null;
  isCharging: boolean;
  batteryLevel: number;
  maxModeEnabled: boolean;
  onRewardEarned?: (data: RewardData) => void;
}

export const useRewardSystem = ({
  deviceId,
  sessionId,
  isCharging,
  batteryLevel,
  maxModeEnabled,
  onRewardEarned,
}: UseRewardSystemOptions) => {
  const [state, setState] = useState<RewardSystemState>({
    totalXmrt: 0,
    isChecking: false,
    lastReward: null,
    timeUntilNextReward: 60,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ipAddressRef = useRef<string | null>(null);

  // Get user's IP address
  const getIpAddress = useCallback(async () => {
    if (ipAddressRef.current) return ipAddressRef.current;
    
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddressRef.current = data.ip;
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
      return null;
    }
  }, []);

  // Load user profile
  const loadProfile = useCallback(async () => {
    const ip = await getIpAddress();
    if (!ip) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('total_xmrt_earned, last_reward_at')
        .eq('ip_address', ip)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setState(prev => ({ ...prev, totalXmrt: data.total_xmrt_earned }));

        // Calculate time until next reward
        if (data.last_reward_at) {
          const lastRewardTime = new Date(data.last_reward_at).getTime();
          const now = Date.now();
          const elapsed = (now - lastRewardTime) / 1000;
          const remaining = Math.max(0, 60 - elapsed);
          setState(prev => ({ ...prev, timeUntilNextReward: Math.ceil(remaining) }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [getIpAddress]);

  // Check for rewards
  const checkRewards = useCallback(async () => {
    if (!deviceId || state.isChecking) return;

    const ip = await getIpAddress();
    if (!ip) return;

    setState(prev => ({ ...prev, isChecking: true }));

    try {
      const { data, error } = await supabase.functions.invoke('award-xmrt-tokens', {
        body: {
          ipAddress: ip,
          deviceId,
          sessionId,
          isCharging,
          batteryLevel,
          maxModeEnabled,
        }
      });

      if (error) throw error;

      if (data.awarded) {
        setState(prev => ({
          ...prev,
          totalXmrt: data.newTotal,
          lastReward: data,
          timeUntilNextReward: 60,
        }));

        // Trigger reward animation callback
        if (onRewardEarned) {
          onRewardEarned(data);
        }

        console.log('🎉 Earned XMRT:', data.amount);
      } else if (data.nextRewardIn) {
        setState(prev => ({
          ...prev,
          timeUntilNextReward: data.nextRewardIn,
        }));
      }
    } catch (error) {
      console.error('Error checking rewards:', error);
    } finally {
      setState(prev => ({ ...prev, isChecking: false }));
    }
  }, [deviceId, sessionId, isCharging, batteryLevel, maxModeEnabled, state.isChecking, getIpAddress, onRewardEarned]);

  // Initialize and set up polling
  useEffect(() => {
    loadProfile();

    // Check for rewards every 30 seconds
    intervalRef.current = setInterval(() => {
      checkRewards();
    }, 30000);

    // Also check immediately
    checkRewards();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadProfile, checkRewards]);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeUntilNextReward: Math.max(0, prev.timeUntilNextReward - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    totalXmrt: state.totalXmrt,
    lastReward: state.lastReward,
    timeUntilNextReward: state.timeUntilNextReward,
    isChecking: state.isChecking,
    manualCheck: checkRewards,
  };
};
