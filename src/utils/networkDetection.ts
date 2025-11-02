/**
 * Network Detection Utility
 * Detects online/offline status and airplane mode
 */

export interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: string;
  isAirplaneMode: boolean;
}

/**
 * Get current network status
 * Detects if device is offline (potential airplane mode)
 */
export const getNetworkStatus = (): NetworkStatus => {
  const isOnline = navigator.onLine;
  
  // Try to get connection info if available
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  const effectiveType = connection?.effectiveType;
  
  // Consider airplane mode if:
  // 1. Browser reports offline
  // 2. OR connection type is 'none'
  const isAirplaneMode = !isOnline || effectiveType === 'none';
  
  return {
    isOnline,
    effectiveType,
    isAirplaneMode,
  };
};

/**
 * Listen for network status changes
 */
export const onNetworkChange = (callback: (status: NetworkStatus) => void): (() => void) => {
  const handleChange = () => {
    callback(getNetworkStatus());
  };
  
  window.addEventListener('online', handleChange);
  window.addEventListener('offline', handleChange);
  
  // Also listen to connection changes if available
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  if (connection) {
    connection.addEventListener('change', handleChange);
  }
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleChange);
    window.removeEventListener('offline', handleChange);
    if (connection) {
      connection.removeEventListener('change', handleChange);
    }
  };
};
