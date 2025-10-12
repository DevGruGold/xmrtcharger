import { useState, useEffect, useCallback } from 'react';
import { BatteryStatus, ChargingSession, ChargingSpeed, DeviceInfo } from '@/types/battery';
import { useToast } from '@/components/ui/use-toast';
import { determineChargingSpeed, checkRapidDischarge } from '@/utils/batteryUtils';
import { saveChargingSession } from '@/utils/batteryHistory';
import { calculateChargingEfficiency } from '@/utils/batteryHealth';
import { getDeviceInfo } from '@/utils/deviceDetection';

export const useBattery = () => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastLevel, setLastLevel] = useState<number | null>(null);
  const [chargingStartTime, setChargingStartTime] = useState<number | null>(null);
  const [chargingStartLevel, setChargingStartLevel] = useState<number | null>(null);
  const { toast } = useToast();

  // Detect device info on mount
  useEffect(() => {
    const info = getDeviceInfo();
    setDeviceInfo(info);
  }, []);

  const saveSession = useCallback((currentLevel: number, speed: ChargingSpeed) => {
    if (chargingStartTime && chargingStartLevel !== null) {
      const duration = (Date.now() - chargingStartTime) / 1000; // seconds
      const efficiency = calculateChargingEfficiency(chargingStartLevel, currentLevel, duration, speed);
      
      const session: ChargingSession = {
        timestamp: chargingStartTime,
        startLevel: chargingStartLevel,
        endLevel: currentLevel,
        duration,
        speed,
        efficiency,
      };
      
      saveChargingSession(session);
    }
  }, [chargingStartTime, chargingStartLevel]);

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

          // Track charging session start
          if (battery.charging && !chargingStartTime) {
            setChargingStartTime(Date.now());
            setChargingStartLevel(currentLevel);
            
            toast({
              title: `${chargingSpeed?.charAt(0).toUpperCase()}${chargingSpeed?.slice(1)} charging detected!`,
              description: "Consider enabling airplane mode or battery saver for even faster charging.",
              duration: 5000,
            });
          }
          
          // Save session when charging stops
          if (!battery.charging && chargingStartTime && chargingSpeed) {
            saveSession(currentLevel, chargingSpeed);
            setChargingStartTime(null);
            setChargingStartLevel(null);
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
  }, [toast, lastLevel, chargingStartTime, saveSession]);

  return { batteryStatus, deviceInfo, error };
};