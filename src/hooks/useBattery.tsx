import { useState, useEffect, useCallback } from 'react';
import { BatteryStatus, ChargingSession, ChargingSpeed, DeviceInfo } from '@/types/battery';
import { DrainAnalysis } from '@/types/batteryDrain';
import { useToast } from '@/components/ui/use-toast';
import { determineChargingSpeed, checkRapidDischarge } from '@/utils/batteryUtils';
import { saveChargingSession } from '@/utils/batteryHistory';
import { calculateChargingEfficiency } from '@/utils/batteryHealth';
import { getDeviceInfo } from '@/utils/deviceDetection';
import { getBatteryDrainAnalyzer } from '@/utils/batteryDrainAnalyzer';
import { recordBatteryReading } from '@/utils/supabaseBatteryHistory';
import { offlineStorage } from '@/utils/offlineStorage';

interface UseBatteryOptions {
  deviceId?: string;
  sessionId?: string;
  logActivity?: (type: string, category: string, description: string, details?: any, severity?: string) => void;
}

export const useBattery = (options?: UseBatteryOptions) => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastLevel, setLastLevel] = useState<number | null>(null);
  const [chargingStartTime, setChargingStartTime] = useState<number | null>(null);
  const [chargingStartLevel, setChargingStartLevel] = useState<number | null>(null);
  const [drainAnalysis, setDrainAnalysis] = useState<DrainAnalysis | null>(null);
  const { toast } = useToast();
  
  // Use crypto.randomUUID() as fallback to ensure we always have valid UUIDs
  const deviceId = options?.deviceId || crypto.randomUUID();
  const sessionId = options?.sessionId || crypto.randomUUID();

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
        
        const updateBatteryStatus = async () => {
          const chargingSpeed = battery.charging ? determineChargingSpeed(battery.chargingTime) : undefined;
          const currentLevel = battery.level * 100;
          
          // Analyze rapid discharge with specific cause detection
          if (!battery.charging && checkRapidDischarge(currentLevel, lastLevel)) {
            const dischargeRate = lastLevel ? lastLevel - currentLevel : 0;
            
            try {
              const analyzer = getBatteryDrainAnalyzer();
              const analysis = await analyzer.analyzeDrain(dischargeRate);
              setDrainAnalysis(analysis);

              // Record to Supabase with drain analysis
              await recordBatteryReading(
                deviceId,
                sessionId,
                currentLevel,
                battery.charging,
                battery.chargingTime === Infinity ? null : battery.chargingTime,
                battery.dischargingTime === Infinity ? null : battery.dischargingTime,
                chargingSpeed,
                undefined,
                { drain_analysis: analysis }
              );

              // Log rapid discharge activity
              if (options?.logActivity) {
                options.logActivity(
                  'rapid_discharge_detected',
                  'battery_health',
                  `Rapid discharge detected: ${analysis.primaryCause}`,
                  { analysis, dischargeRate },
                  'warning'
                );
              }

              toast({
                title: `Rapid Discharge: ${analysis.primaryCause.replace(/_/g, ' ').toUpperCase()}`,
                description: `${analysis.confidence.toUpperCase()} confidence detection. Check recommendations below.`,
                duration: 8000,
              });
            } catch (error) {
              console.error('Error analyzing battery drain:', error);
              toast({
                title: "Rapid Battery Discharge Detected!",
                description: "Unable to determine specific cause. Consider closing high-power apps.",
                duration: 8000,
              });
            }
          } else if (battery.charging || !checkRapidDischarge(currentLevel, lastLevel)) {
            // Clear drain analysis when not rapidly discharging
            setDrainAnalysis(null);
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
            
            // Log charging started
            if (options?.logActivity) {
              options.logActivity(
                'charging_started',
                'charging',
                `Charging started at ${currentLevel.toFixed(1)}% - ${chargingSpeed} speed`,
                { level: currentLevel, speed: chargingSpeed }
              );
            }
            
            toast({
              title: `${chargingSpeed?.charAt(0).toUpperCase()}${chargingSpeed?.slice(1)} charging detected!`,
              description: "Consider enabling airplane mode or battery saver for even faster charging.",
              duration: 5000,
            });
          }
          
          // Save session when charging stops
          if (!battery.charging && chargingStartTime && chargingSpeed) {
            const duration = (Date.now() - chargingStartTime) / 1000;
            saveSession(currentLevel, chargingSpeed);
            
            // Log charging completed
            if (options?.logActivity) {
              options.logActivity(
                'charging_completed',
                'charging',
                `Charging completed: ${chargingStartLevel?.toFixed(1)}% → ${currentLevel.toFixed(1)}% (${Math.floor(duration / 60)}min)`,
                { 
                  startLevel: chargingStartLevel, 
                  endLevel: currentLevel, 
                  duration,
                  speed: chargingSpeed 
                }
              );
            }
            
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

        // Set up periodic battery reading recording (every 2 minutes)
        const recordingInterval = setInterval(async () => {
          const currentLevel = battery.level * 100;
          const chargingSpeed = battery.charging ? determineChargingSpeed(battery.chargingTime) : undefined;
          
          try {
            // Try Supabase first
            await recordBatteryReading(
              deviceId,
              sessionId,
              currentLevel,
              battery.charging,
              battery.chargingTime === Infinity ? null : battery.chargingTime,
              battery.dischargingTime === Infinity ? null : battery.dischargingTime,
              chargingSpeed,
              undefined,
              { periodic_reading: true }
            );
          } catch (error) {
            // Fall back to offline storage
            console.log('📱 Saving battery reading offline');
            await offlineStorage.saveBatteryReading({
              deviceId,
              sessionId,
              timestamp: Date.now(),
              level: currentLevel,
              charging: battery.charging,
              chargingSpeed,
              metadata: { periodic_reading: true }
            });
            
            // Queue for sync
            await offlineStorage.addToSyncQueue({
              type: 'battery',
              data: {
                deviceId,
                sessionId,
                batteryLevel: currentLevel,
                isCharging: battery.charging,
                chargingTimeRemaining: battery.chargingTime === Infinity ? null : battery.chargingTime,
                dischargingTimeRemaining: battery.dischargingTime === Infinity ? null : battery.dischargingTime,
                chargingSpeed,
                metadata: { periodic_reading: true }
              }
            });
          }
          
          // Log periodic reading activity
          if (options?.logActivity) {
            options.logActivity(
              'battery_reading_recorded',
              'battery_health',
              `Battery: ${currentLevel.toFixed(1)}% | ${battery.charging ? 'Charging' : 'Discharging'}`,
              { level: currentLevel, charging: battery.charging, speed: chargingSpeed }
            );
          }
        }, 120000); // Every 2 minutes

        // Set up periodic discharge rate check (every minute)
        const intervalId = setInterval(updateBatteryStatus, 60000);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingtimechange', updateBatteryStatus);
          battery.removeEventListener('dischargingtimechange', updateBatteryStatus);
          clearInterval(intervalId);
          clearInterval(recordingInterval);
        };
      } catch (err) {
        setError('Battery API not supported in this browser');
        console.error('Battery API error:', err);
      }
    };

    getBattery();
  }, [toast, lastLevel, chargingStartTime, saveSession]);

  return { batteryStatus, deviceInfo, error, drainAnalysis };
};