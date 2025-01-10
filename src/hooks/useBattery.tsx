import { useState, useEffect } from 'react';
import { BatteryStatus } from '@/types/battery';
import { useToast } from '@/components/ui/use-toast';

export const useBattery = () => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getBattery = async () => {
      try {
        // @ts-ignore - Navigator.getBattery() is experimental
        const battery = await navigator.getBattery();
        
        const updateBatteryStatus = () => {
          setBatteryStatus({
            charging: battery.charging,
            level: battery.level * 100,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });

          if (battery.charging) {
            toast({
              title: "Charging detected!",
              description: "Consider enabling airplane mode or battery saver for faster charging.",
              duration: 5000,
            });
          }
        };

        // Initial status
        updateBatteryStatus();

        // Add event listeners
        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingtimechange', updateBatteryStatus);
        battery.addEventListener('dischargingtimechange', updateBatteryStatus);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingtimechange', updateBatteryStatus);
          battery.removeEventListener('dischargingtimechange', updateBatteryStatus);
        };
      } catch (err) {
        setError('Battery API not supported in this browser');
        console.error('Battery API error:', err);
      }
    };

    getBattery();
  }, [toast]);

  return { batteryStatus, error };
};