import { useState, useEffect, useRef } from 'react';
import { getNetworkStatus, onNetworkChange, NetworkStatus } from '@/utils/networkDetection';

interface NetworkStatusState extends NetworkStatus {
  airplaneModeDuration: number; // seconds in airplane mode while charging
  lastAirplaneModeStart: number | null;
}

interface UseNetworkStatusOptions {
  isCharging: boolean;
}

export const useNetworkStatus = ({ isCharging }: UseNetworkStatusOptions) => {
  const [status, setStatus] = useState<NetworkStatusState>(() => ({
    ...getNetworkStatus(),
    airplaneModeDuration: 0,
    lastAirplaneModeStart: null,
  }));

  const airplaneModeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track airplane mode duration while charging
  useEffect(() => {
    const currentStatus = getNetworkStatus();
    
    // Start tracking when entering airplane mode while charging
    if (currentStatus.isAirplaneMode && isCharging && !status.lastAirplaneModeStart) {
      setStatus(prev => ({
        ...prev,
        ...currentStatus,
        lastAirplaneModeStart: Date.now(),
      }));
      
      // Update duration every second
      airplaneModeTimerRef.current = setInterval(() => {
        setStatus(prev => {
          if (!prev.lastAirplaneModeStart) return prev;
          const elapsed = Math.floor((Date.now() - prev.lastAirplaneModeStart) / 1000);
          return {
            ...prev,
            airplaneModeDuration: elapsed,
          };
        });
      }, 1000);
    }
    
    // Stop tracking when exiting airplane mode or not charging
    if ((!currentStatus.isAirplaneMode || !isCharging) && status.lastAirplaneModeStart) {
      if (airplaneModeTimerRef.current) {
        clearInterval(airplaneModeTimerRef.current);
        airplaneModeTimerRef.current = null;
      }
      setStatus(prev => ({
        ...prev,
        ...currentStatus,
        lastAirplaneModeStart: null,
        airplaneModeDuration: 0,
      }));
    }

    return () => {
      if (airplaneModeTimerRef.current) {
        clearInterval(airplaneModeTimerRef.current);
      }
    };
  }, [status.lastAirplaneModeStart, isCharging, status.isAirplaneMode]);

  // Listen for network changes
  useEffect(() => {
    const cleanup = onNetworkChange((networkStatus) => {
      setStatus(prev => ({
        ...prev,
        ...networkStatus,
      }));
    });

    return cleanup;
  }, []);

  return status;
};
