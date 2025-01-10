import { useState, useEffect } from 'react';
import { BatteryStatus } from '@/types/battery';
import { useToast } from '@/components/ui/use-toast';
import { determineChargingSpeed, checkRapidDischarge } from '@/utils/batteryUtils';

export const useBattery = () => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastLevel, setLastLevel] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getBattery = async () => {
      try {
        // @ts-ignore - Navigator.getBattery() is experimental
        const battery = await navigator.getBattery();
        
        const updateBatteryStatus = () => {
          const chargingSpeed = battery.charging ? determineChargingSpeed(battery.chargingTime) : undefined;
          const currentLevel = battery.level * 100;
          
          if (!battery.charging && checkRapidDischarge(currentLevel, lastLevel)) {
            toast({
              title: "Rapid Battery Discharge Detected!",
              description: "Consider closing high-power apps like games, video streaming, or GPS navigation to preserve battery life.",
              duration: 8000,
            });
          }

          setLastLevel(currentLevel);
          
          setBatteryStatus({
            charging: battery.charging,
            level: currentLevel,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            chargingSpeed,
            isRapidDischarge: !battery.charging && checkRapidDischarge(currentLevel, lastLevel)
          });

          if (battery.charging) {
            toast({
              title: `${chargingSpeed?.charAt(0).toUpperCase()}${chargingSpeed?.slice(1)} charging detected!`,
              description: "Consider enabling airplane mode or battery saver for even faster charging.",
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

        // Set up periodic discharge rate check (every minute)
        const intervalId = setInterval(updateBatteryStatus, 60000);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingtimechange', updateBatteryStatus);
          battery.removeEventListener('dischargingtimechange', updateBatteryStatus);
          clearInterval(intervalId);
        };
      } catch (err) {
        setError('Battery API not supported in this browser');
        console.error('Battery API error:', err);
      }
    };

    getBattery();
  }, [toast, lastLevel]);

  return { batteryStatus, error };
};