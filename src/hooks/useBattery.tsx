import { useState, useEffect } from 'react';
import { BatteryStatus, ChargingSpeed } from '@/types/battery';
import { useToast } from '@/components/ui/use-toast';

export const useBattery = () => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastLevel, setLastLevel] = useState<number | null>(null);
  const { toast } = useToast();

  const determineChargingSpeed = (chargingTime: number): ChargingSpeed => {
    // These thresholds are estimates and may need adjustment
    // Lower charging time means faster charging
    if (chargingTime === Infinity) return 'normal';
    if (chargingTime <= 3000) return 'supercharge';
    if (chargingTime <= 5000) return 'fast';
    if (chargingTime <= 7000) return 'normal';
    return 'slow';
  };

  const checkRapidDischarge = (currentLevel: number, previousLevel: number | null) => {
    if (previousLevel === null) return false;
    // Consider it rapid discharge if battery drops more than 2% in a minute
    const dischargeRate = previousLevel - currentLevel;
    return dischargeRate >= 2;
  };

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