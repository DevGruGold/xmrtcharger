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
    (navigator as any).deviceMemory || 0,
  ];
  
  const fingerprint = components.join('|');
  
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `device_${Math.abs(hash).toString(36)}`;
};

/**
 * Register or get device UUID from fingerprint
 */
const registerDevice = async (fingerprint: string, deviceInfo: any): Promise<string | null> => {
  try {
    // Check if device exists
    const { data: existingDevice } = await supabase
      .from('devices')
      .select('id')
      .eq('device_fingerprint', fingerprint)
      .single();

    if (existingDevice) {
      return existingDevice.id;
    }

    // Create new device
    const { data: newDevice, error } = await supabase
      .from('devices')
      .insert({
        device_fingerprint: fingerprint,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to register device:', error);
      return null;
    }

    return newDevice.id;
  } catch (error) {
    console.error('Error registering device:', error);
    return null;
  }
};

/**
 * Hook to manage device connection lifecycle with XMRT-Charger monitoring system
 */
export const useDeviceConnection = () => {
  const [connectionInfo, setConnectionInfo] = useState<DeviceConnectionInfo>({
    deviceId: '',
    sessionKey: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionId: null,
    isConnected: false,
  });

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const deviceInitializedRef = useRef(false);

  /**
   * Send connect event to monitoring system
   */
  const sendConnectEvent = async () => {
    if (isConnectingRef.current || deviceInitializedRef.current) return;
    isConnectingRef.current = true;

    try {
      const deviceInfo = getDeviceInfo();
      const fingerprint = generateDeviceFingerprint();
      
      // Register device and get UUID
      const deviceUUID = await registerDevice(fingerprint, deviceInfo);
      
      if (!deviceUUID) {
        console.error('❌ Failed to register device');
        return;
      }

      // Update connection info with real device UUID
      setConnectionInfo(prev => ({
        ...prev,
        deviceId: deviceUUID,
      }));
      
      const { data, error } = await supabase.functions.invoke('monitor-device-connections', {
        body: {
          deviceId: deviceUUID,
          sessionKey: connectionInfo.sessionKey,
          eventType: 'connect',
          deviceInfo: {
            ipAddress: null,
            userAgent: navigator.userAgent,
            appVersion: '1.0.0',
            batteryLevel: null,
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
          deviceId: deviceUUID,
          sessionId: data.sessionId,
          isConnected: true,
        }));
        deviceInitializedRef.current = true;
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
