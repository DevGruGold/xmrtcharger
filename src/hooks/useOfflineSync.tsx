import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '@/utils/offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  queueCount: number;
  lastSyncAt: number | null;
  syncError: string | null;
}

export const useOfflineSync = () => {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    queueCount: 0,
    lastSyncAt: null,
    syncError: null,
  });

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      toast.success('Back online - syncing data...');
      syncAll();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
      toast.info('Offline mode - data will sync when reconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update queue count
  const updateQueueCount = useCallback(async () => {
    try {
      const queue = await offlineStorage.getSyncQueue();
      setStatus(prev => ({ ...prev, queueCount: queue.length }));
    } catch (error) {
      console.error('Error updating queue count:', error);
    }
  }, []);

  // Sync battery readings
  const syncBatteryReadings = async (): Promise<boolean> => {
    try {
      const queue = await offlineStorage.getSyncQueue();
      const batteryItems = queue.filter(item => item.type === 'battery');

      for (const item of batteryItems) {
        if (item.retries >= 3) {
          await offlineStorage.removeSyncQueueItem(item.id);
          continue;
        }

        try {
          const { error } = await supabase.functions.invoke('record-battery-data', {
            body: item.data
          });

          if (error) throw error;
          await offlineStorage.removeSyncQueueItem(item.id);
        } catch (error) {
          await offlineStorage.incrementSyncRetry(item.id);
          console.error('Failed to sync battery reading:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error syncing battery readings:', error);
      return false;
    }
  };

  // Sync reward claims
  const syncRewardClaims = async (): Promise<boolean> => {
    try {
      const pendingClaims = await offlineStorage.getPendingRewardClaims();

      for (const claim of pendingClaims) {
        try {
          const { error } = await supabase.functions.invoke('award-xmrt-tokens', {
            body: {
              deviceId: claim.deviceId,
              amount: claim.estimatedAmount,
              timestamp: claim.timestamp,
            }
          });

          if (error) throw error;
          await offlineStorage.markRewardClaimSynced(claim.id);
        } catch (error) {
          console.error('Failed to sync reward claim:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error syncing reward claims:', error);
      return false;
    }
  };

  // Sync all queued items
  const syncAll = useCallback(async () => {
    if (!navigator.onLine) {
      toast.error('Cannot sync while offline');
      return;
    }

    setStatus(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      await syncBatteryReadings();
      await syncRewardClaims();
      
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: Date.now(),
      }));

      await updateQueueCount();
      toast.success('Data synced successfully');
    } catch (error: any) {
      console.error('Sync failed:', error);
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: error.message || 'Sync failed',
      }));
      toast.error('Sync failed - will retry later');
    }
  }, [updateQueueCount]);

  // Initialize and check queue on mount
  useEffect(() => {
    updateQueueCount();
  }, [updateQueueCount]);

  return {
    ...status,
    syncAll,
    updateQueueCount,
  };
};
