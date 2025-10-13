import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceInfo } from '@/utils/deviceDetection';

export interface DeviceConnectionInfo {
  deviceId: string;
  sessionKey: string;
  sessionId: string | null;
  isConnected: boolean;
}

/**
 * Generates a stable device fingerprint based on available device characteristics
 */
const generateDeviceFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    (navigator as any).deviceMemory || 0, // Non-standard API
  ];
  
  const fingerprint = components.join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `device_${Math.abs(hash).toString(36)}`;
};

/**
 * Hook to manage device connection lifecycle with XMRT-Charger monitoring system
 */
export const useDeviceConnection = () => {
  const [connectionInfo, setConnectionInfo] = useState<DeviceConnectionInfo>({
    deviceId: generateDeviceFingerprint(),
    sessionKey: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionId: null,
    isConnected: false,
  });

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  /**
   * Send connect event to monitoring system
   */
  const sendConnectEvent = async () => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    try {
      const deviceInfo = getDeviceInfo();
      
      const { data, error } = await supabase.functions.invoke('monitor-device-connections', {
        body: {
          deviceId: connectionInfo.deviceId,
          sessionKey: connectionInfo.sessionKey,
          eventType: 'connect',
          deviceInfo: {
            ipAddress: null, // Will be captured server-side
            userAgent: navigator.userAgent,
            appVersion: '1.0.0',
            batteryLevel: null, // Will be updated with first battery reading
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
          }
        }
      });

      if (error) {
        console.error('❌ Device connection failed:', error);
        return;
      }

      if (data?.sessionId) {
        setConnectionInfo(prev => ({
          ...prev,
          sessionId: data.sessionId,
          isConnected: true,
        }));
        console.log('✅ Device connected successfully:', data.sessionId);
      }
    } catch (error) {
      console.error('❌ Error connecting device:', error);
    } finally {
      isConnectingRef.current = false;
    }
  };

  /**
   * Send heartbeat to keep connection alive
   */
  const sendHeartbeat = async () => {
    if (!connectionInfo.isConnected) return;

    try {
      await supabase.functions.invoke('monitor-device-connections', {
        body: {
          deviceId: connectionInfo.deviceId,
          sessionKey: connectionInfo.sessionKey,
          eventType: 'heartbeat',
        }
      });
      
      console.log('💓 Heartbeat sent');
    } catch (error) {
      console.error('❌ Heartbeat failed:', error);
    }
  };

  /**
   * Send disconnect event
   */
  const sendDisconnectEvent = async () => {
    if (!connectionInfo.isConnected) return;

    try {
      await supabase.functions.invoke('monitor-device-connections', {
        body: {
          deviceId: connectionInfo.deviceId,
          sessionKey: connectionInfo.sessionKey,
          eventType: 'disconnect',
        }
      });
      
      console.log('👋 Device disconnected');
    } catch (error) {
      console.error('❌ Disconnect failed:', error);
    }
  };

  /**
   * Log device activity
   */
  const logActivity = async (
    activityType: string,
    category: 'connection' | 'charging' | 'calibration' | 'battery_health' | 'system_event' | 'user_action' | 'anomaly',
    description: string,
    details?: any,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ) => {
    if (!connectionInfo.sessionId) return;

    try {
      await supabase.from('device_activity_log').insert({
        device_id: connectionInfo.deviceId,
        session_id: connectionInfo.sessionId,
        activity_type: activityType,
        category,
        severity,
        description,
        details: details || {},
      });
    } catch (error) {
      console.error('❌ Failed to log activity:', error);
    }
  };

  /**
   * Initialize connection on mount
   */
  useEffect(() => {
    sendConnectEvent();

    // Setup heartbeat (every 30 seconds)
    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat();
    }, 30000);

    // Disconnect on unmount
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      sendDisconnectEvent();
    };
  }, []);

  return {
    ...connectionInfo,
    logActivity,
  };
};
