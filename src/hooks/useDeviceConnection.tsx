import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceInfo } from '@/utils/deviceDetection';
import { offlineStorage } from '@/utils/offlineStorage';

export interface DeviceConnectionInfo {
  deviceId: string;
  sessionKey: string;
  sessionId: string | null;
  isConnected: boolean;
  sessionStartTime: number | null;
}

const STORAGE_KEY = 'xmrt_session_key';
const DEVICE_ID_KEY = 'xmrt_device_id';

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
 * Get or create a persistent session key
 */
const getOrCreateSessionKey = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch (e) {
    console.warn('localStorage not available');
  }
  
  const newKey = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    localStorage.setItem(STORAGE_KEY, newKey);
  } catch (e) {
    console.warn('Could not persist session key');
  }
  
  return newKey;
};

/**
 * Get cached device ID
 */
const getCachedDeviceId = (): string | null => {
  try {
    return localStorage.getItem(DEVICE_ID_KEY);
  } catch (e) {
    return null;
  }
};

/**
 * Cache device ID
 */
const cacheDeviceId = (deviceId: string) => {
  try {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  } catch (e) {
    console.warn('Could not cache device ID');
  }
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
      cacheDeviceId(existingDevice.id);
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

    cacheDeviceId(newDevice.id);
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
  const [connectionInfo, setConnectionInfo] = useState<DeviceConnectionInfo>(() => ({
    deviceId: getCachedDeviceId() || '',
    sessionKey: getOrCreateSessionKey(),
    sessionId: null,
    isConnected: false,
    sessionStartTime: null,
  }));

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const deviceInitializedRef = useRef(false);

  /**
   * Check for existing active session
   */
  const checkExistingSession = async (deviceId: string, sessionKey: string): Promise<{
    sessionId: string;
    connectedAt: string;
  } | null> => {
    try {
      const { data, error } = await supabase
        .from('device_connection_sessions')
        .select('id, connected_at, last_heartbeat')
        .eq('device_id', deviceId)
        .eq('session_key', sessionKey)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      // Check if session is still valid (heartbeat within 5 minutes)
      const lastHeartbeat = new Date(data.last_heartbeat).getTime();
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      
      if (lastHeartbeat < fiveMinutesAgo) {
        console.log('🕐 Session stale, will create new one');
        return null;
      }

      return {
        sessionId: data.id,
        connectedAt: data.connected_at,
      };
    } catch (error) {
      console.error('Error checking existing session:', error);
      return null;
    }
  };

  /**
   * Send connect event to monitoring system
   */
  const sendConnectEvent = useCallback(async () => {
    if (isConnectingRef.current || deviceInitializedRef.current) return;
    isConnectingRef.current = true;

    try {
      const deviceInfo = getDeviceInfo();
      const fingerprint = generateDeviceFingerprint();
      const sessionKey = getOrCreateSessionKey();
      
      // Try to load cached device state if offline
      if (!navigator.onLine) {
        const cachedState = await offlineStorage.getDeviceState(fingerprint);
        if (cachedState) {
          setConnectionInfo({
            deviceId: cachedState.deviceId,
            sessionId: cachedState.sessionId,
            sessionKey: cachedState.sessionKey,
            isConnected: false,
            sessionStartTime: Date.now(),
          });
          deviceInitializedRef.current = true;
          console.log('📱 Loaded cached device state (offline)');
          return;
        }
      }
      
      // Register device and get UUID
      const deviceUUID = await registerDevice(fingerprint, deviceInfo);
      
      if (!deviceUUID) {
        console.error('❌ Failed to register device');
        isConnectingRef.current = false;
        return;
      }

      // Check for existing active session with same session key
      const existingSession = await checkExistingSession(deviceUUID, sessionKey);
      
      if (existingSession) {
        console.log('♻️ Reconnecting to existing session:', existingSession.sessionId);
        
        const connectedAt = new Date(existingSession.connectedAt).getTime();
        
        setConnectionInfo({
          deviceId: deviceUUID,
          sessionId: existingSession.sessionId,
          sessionKey,
          isConnected: true,
          sessionStartTime: connectedAt,
        });
        
        deviceInitializedRef.current = true;
        isConnectingRef.current = false;
        return;
      }
      
      // Create new session
      const { data, error } = await supabase.functions.invoke('monitor-device-connections', {
        body: {
          deviceId: deviceUUID,
          sessionKey,
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
        isConnectingRef.current = false;
        return;
      }

      if (data?.sessionId) {
        const now = Date.now();
        const newConnectionInfo: DeviceConnectionInfo = {
          deviceId: deviceUUID,
          sessionId: data.sessionId,
          sessionKey,
          isConnected: true,
          sessionStartTime: now,
        };
        
        setConnectionInfo(newConnectionInfo);
        
        // Save to offline storage
        await offlineStorage.saveDeviceState({
          ...newConnectionInfo,
          fingerprint,
          lastSync: now,
        });
        
        deviceInitializedRef.current = true;
        console.log('✅ Device connected successfully:', data.sessionId);
      }
    } catch (error) {
      console.error('❌ Error connecting device:', error);
    } finally {
      isConnectingRef.current = false;
    }
  }, []);

  /**
   * Send heartbeat to keep connection alive
   */
  const sendHeartbeat = useCallback(async () => {
    if (!connectionInfo.isConnected || !connectionInfo.deviceId) return;

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
  }, [connectionInfo.isConnected, connectionInfo.deviceId, connectionInfo.sessionKey]);

  /**
   * Send disconnect event
   */
  const sendDisconnectEvent = useCallback(async () => {
    if (!connectionInfo.isConnected || !connectionInfo.deviceId) return;

    try {
      await supabase.functions.invoke('monitor-device-connections', {
        body: {
          deviceId: connectionInfo.deviceId,
          sessionKey: connectionInfo.sessionKey,
          eventType: 'disconnect',
        }
      });
      
      // Clear session key to force new session on next visit
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // Ignore
      }
      
      console.log('👋 Device disconnected');
    } catch (error) {
      console.error('❌ Disconnect failed:', error);
    }
  }, [connectionInfo.isConnected, connectionInfo.deviceId, connectionInfo.sessionKey]);

  /**
   * Log device activity
   */
  const logActivity = useCallback(async (
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
  }, [connectionInfo.sessionId, connectionInfo.deviceId]);

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
  }, [sendConnectEvent, sendHeartbeat, sendDisconnectEvent]);

  return {
    ...connectionInfo,
    logActivity,
  };
};
