import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { offlineStorage } from '@/utils/offlineStorage';

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
  isOffline?: boolean;
  onRewardEarned?: (data: RewardData) => void;
}

export const useRewardSystem = ({
  deviceId,
  sessionId,
  isCharging,
  batteryLevel,
  maxModeEnabled,
  isOffline = false,
  onRewardEarned,
}: UseRewardSystemOptions) => {
  const [state, setState] = useState<RewardSystemState>({
    totalXmrt: 0,
    isChecking: false,
    lastReward: null,
    timeUntilNextReward: 60,
  });

  // Use refs to prevent infinite loops
  const ipAddressRef = useRef<string | null>(null);
  const initialLoadDoneRef = useRef(false);
  const checkingRef = useRef(false);
  const onRewardEarnedRef = useRef(onRewardEarned);

  // Keep callback ref updated
  useEffect(() => {
    onRewardEarnedRef.current = onRewardEarned;
  }, [onRewardEarned]);

  // Get user's IP address (memoized)
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

  // Load user profile - only runs once on mount
  useEffect(() => {
    if (initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;

    const loadProfile = async () => {
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
          setState(prev => {
            if (prev.totalXmrt === data.total_xmrt_earned) return prev;
            return { ...prev, totalXmrt: data.total_xmrt_earned };
          });

          // Calculate time until next reward
          if (data.last_reward_at) {
            const lastRewardTime = new Date(data.last_reward_at).getTime();
            const now = Date.now();
            const elapsed = (now - lastRewardTime) / 1000;
            const remaining = Math.max(0, 60 - elapsed);
            setState(prev => {
              if (prev.timeUntilNextReward === Math.ceil(remaining)) return prev;
              return { ...prev, timeUntilNextReward: Math.ceil(remaining) };
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [getIpAddress]);

  // Check for rewards - uses refs to avoid stale closures
  const checkRewards = useCallback(async () => {
    if (!deviceId || checkingRef.current) return;

    // Don't check if not charging - XMRT only awarded when charging
    if (!isCharging) {
      console.log('⚠️ Not charging - rewards paused');
      setState(prev => {
        if (prev.timeUntilNextReward === 0) return prev;
        return { ...prev, timeUntilNextReward: 0 };
      });
      return;
    }

    // Don't check if battery is at 100%
    if (batteryLevel >= 100) {
      console.log('⚠️ Battery at 100% - rewards paused');
      setState(prev => {
        if (prev.timeUntilNextReward === 0) return prev;
        return { ...prev, timeUntilNextReward: 0 };
      });
      return;
    }

    const ip = await getIpAddress();
    if (!ip) return;

    checkingRef.current = true;
    setState(prev => ({ ...prev, isChecking: true }));

    try {
      // Check if online
      if (!navigator.onLine) {
        // Calculate estimated reward offline
        const estimatedReward = maxModeEnabled ? 1.5 : 1.0;
        
        // Queue for sync
        await offlineStorage.queueRewardClaim({
          deviceId,
          timestamp: Date.now(),
          estimatedAmount: estimatedReward,
        });
        
        // Update UI optimistically
        setState(prev => ({
          ...prev,
          totalXmrt: prev.totalXmrt + estimatedReward,
          lastReward: {
            amount: estimatedReward,
            newTotal: prev.totalXmrt + estimatedReward,
            awarded: true,
          },
          timeUntilNextReward: 60,
          isChecking: false,
        }));
        
        console.log('📱 Queued offline reward:', estimatedReward);
        return;
      }

      const { data, error } = await supabase.functions.invoke('award-xmrt-tokens', {
        body: {
          ipAddress: ip,
          deviceId,
          sessionId,
          isCharging,
          batteryLevel,
          maxModeEnabled,
          isOffline,
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
        if (onRewardEarnedRef.current) {
          onRewardEarnedRef.current(data);
        }

        console.log('🎉 Earned XMRT:', data.amount);
      } else if (data.nextRewardIn !== undefined) {
        setState(prev => {
          if (prev.timeUntilNextReward === data.nextRewardIn) return prev;
          return { ...prev, timeUntilNextReward: data.nextRewardIn };
        });
      }
    } catch (error) {
      console.error('Error checking rewards:', error);
    } finally {
      checkingRef.current = false;
      setState(prev => ({ ...prev, isChecking: false }));
    }
  }, [deviceId, sessionId, isCharging, batteryLevel, maxModeEnabled, isOffline, getIpAddress]);

  // Set up polling - separate from initial load to avoid loops
  useEffect(() => {
    if (!deviceId) return;

    // Initial check after a short delay
    const initialTimeout = setTimeout(() => {
      checkRewards();
    }, 1000);

    // Check for rewards every 60 seconds (matching reward interval)
    const intervalId = setInterval(() => {
      checkRewards();
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [deviceId, checkRewards]);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        const newTime = Math.max(0, prev.timeUntilNextReward - 1);
        if (newTime === prev.timeUntilNextReward) return prev;
        return { ...prev, timeUntilNextReward: newTime };
      });
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
