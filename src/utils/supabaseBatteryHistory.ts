import { supabase } from '@/integrations/supabase/client';
import { ChargingSession } from '@/types/battery';

export const recordBatteryReading = async (
  deviceId: string,
  sessionId: string,
  batteryLevel: number,
  isCharging: boolean,
  chargingTimeRemaining: number | null,
  dischargingTimeRemaining: number | null,
  chargingSpeed?: string,
  temperatureImpact?: string,
  metadata?: any
) => {
  try {
    const response = await supabase.functions.invoke('record-battery-data', {
      body: {
        deviceId,
        sessionId,
        batteryLevel,
        isCharging,
        chargingTimeRemaining,
        dischargingTimeRemaining,
        chargingSpeed,
        temperatureImpact,
        metadata
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error recording battery reading:', error);
    return null;
  }
};

export const saveChargingSessionToSupabase = async (
  deviceId: string,
  sessionId: string,
  session: ChargingSession
) => {
  try {
    const { error } = await supabase
      .from('charging_sessions')
      .insert({
        device_id: deviceId,
        session_id: sessionId,
        start_level: session.startLevel,
        end_level: session.endLevel,
        duration_seconds: session.duration,
        charging_speed: session.speed,
        efficiency_score: session.efficiency,
        metadata: {
          timestamp: session.timestamp
        }
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving charging session:', error);
  }
};

export const getChargingHistoryFromSupabase = async (deviceId: string): Promise<ChargingSession[]> => {
  try {
    const { data, error } = await supabase
      .from('charging_sessions')
      .select('*')
      .eq('device_id', deviceId)
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (data || []).map(session => ({
      timestamp: new Date(session.started_at).getTime(),
      startLevel: session.start_level,
      endLevel: session.end_level,
      duration: session.duration_seconds,
      speed: session.charging_speed as any,
      efficiency: session.efficiency_score || 85
    }));
  } catch (error) {
    console.error('Error fetching charging history:', error);
    return [];
  }
};
