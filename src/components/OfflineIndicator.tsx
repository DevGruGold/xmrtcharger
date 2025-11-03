import { WifiOff, RefreshCw, Check } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';

export const OfflineIndicator = () => {
  const { isOnline, isSyncing, queueCount, lastSyncAt, syncAll } = useOfflineSync();

  if (isOnline && queueCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className={`
        backdrop-blur-lg border rounded-lg p-3 shadow-lg transition-colors
        ${!isOnline 
          ? 'bg-yellow-500/10 border-yellow-500/50' 
          : 'bg-primary/10 border-primary/50'
        }
      `}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            {!isOnline ? (
              <WifiOff className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            ) : isSyncing ? (
              <RefreshCw className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {!isOnline 
                  ? 'Offline Mode' 
                  : isSyncing 
                    ? 'Syncing...' 
                    : 'Synced'
                }
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {!isOnline && queueCount > 0 && (
                  `${queueCount} item${queueCount !== 1 ? 's' : ''} queued for sync`
                )}
                {isOnline && isSyncing && queueCount > 0 && (
                  `${queueCount} item${queueCount !== 1 ? 's' : ''} remaining`
                )}
                {isOnline && !isSyncing && lastSyncAt && (
                  `Last synced ${formatDistanceToNow(lastSyncAt, { addSuffix: true })}`
                )}
              </p>
            </div>
          </div>

          {isOnline && queueCount > 0 && !isSyncing && (
            <Button
              size="sm"
              variant="outline"
              onClick={syncAll}
              className="flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Sync Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
