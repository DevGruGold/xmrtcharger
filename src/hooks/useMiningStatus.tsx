import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Using any type for XMR-related tables until they exist in database schema
type MiningData = any;

interface MiningStats {
  xmrMined: number;
  xmrtFromMining: number;
  hashrate: number;
  shares: number;
  workerId: string | null;
  isActive: boolean;
}

interface UseMiningStatusOptions {
  deviceId: string | null;
  sessionId: string | null;
  enabled?: boolean;
}

export const useMiningStatus = ({ deviceId, sessionId, enabled = true }: UseMiningStatusOptions) => {
  const [miningStats, setMiningStats] = useState<MiningStats>({
    xmrMined: 0,
    xmrtFromMining: 0,
    hashrate: 0,
    shares: 0,
    workerId: null,
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMiningStats = async () => {
    if (!deviceId || !enabled) {
      setIsLoading(false);
      return;
    }

    try {
      // Get device-miner association
      const { data: associationData, error: assocError } = await supabase
        .from('device_miner_associations' as any)
        .select(`
          *,
          xmr_workers (
            id,
            worker_id,
            wallet_address,
            is_active,
            metadata
          )
        `)
        .eq('device_id', deviceId)
        .eq('is_active', true)
        .single();

      const association: MiningData = associationData;

      if (assocError || !association || !association.xmr_workers) {
        setMiningStats({
          xmrMined: 0,
          xmrtFromMining: 0,
          hashrate: 0,
          shares: 0,
          workerId: null,
          isActive: false,
        });
        setIsLoading(false);
        return;
      }

      // Try to fetch fresh stats from SupportXMR via proxy
      if (association.xmr_workers.wallet_address) {
        try {
          const { data: proxyData } = await supabase.functions.invoke('supportxmr-proxy', {
            body: {
              wallet_address: association.xmr_workers.wallet_address,
              action: 'fetch_stats',
            }
          });

          if (proxyData?.success) {
            setMiningStats({
              xmrMined: proxyData.stats.xmr_earned,
              xmrtFromMining: proxyData.stats.xmrt_bonus,
              hashrate: proxyData.stats.hashrate,
              shares: proxyData.stats.shares,
              workerId: proxyData.worker.worker_id,
              isActive: proxyData.worker.is_active,
            });
            setIsLoading(false);
            return;
          }
        } catch (proxyError) {
          console.warn('SupportXMR proxy failed, falling back to database:', proxyError);
        }
      }

      // Fallback to database records
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: updatesData } = await supabase
        .from('mining_updates' as any)
        .select('metric, created_at')
        .eq('miner_id', association.xmr_workers.id)
        .gte('created_at', tenMinutesAgo)
        .order('created_at', { ascending: false });

      const miningUpdates: MiningData[] = updatesData || [];

      if (miningUpdates && miningUpdates.length > 0) {
        const latestUpdate = miningUpdates[0];
        const totalXmr = miningUpdates.reduce((sum, update) => {
          return sum + (update.metric?.xmr_earned || 0);
        }, 0);

        setMiningStats({
          xmrMined: totalXmr,
          xmrtFromMining: totalXmr * 1000,
          hashrate: latestUpdate.metric?.hashrate || 0,
          shares: latestUpdate.metric?.shares_found || 0,
          workerId: association.xmr_workers.worker_id,
          isActive: true,
        });
      } else {
        setMiningStats({
          xmrMined: 0,
          xmrtFromMining: 0,
          hashrate: association.xmr_workers.metadata?.last_hashrate || 0,
          shares: association.xmr_workers.metadata?.total_shares || 0,
          workerId: association.xmr_workers.worker_id,
          isActive: association.xmr_workers.is_active,
        });
      }
    } catch (error) {
      console.error('Error fetching mining stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMiningStats();

    if (!enabled) return;

    // Poll every 10 seconds for updates
    const interval = setInterval(fetchMiningStats, 10000);

    // Subscribe to real-time mining updates
    const channel = supabase
      .channel('mining-updates')
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mining_updates',
        },
        () => {
          fetchMiningStats();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [deviceId, sessionId, enabled]);

  return {
    miningStats,
    isLoading,
    refresh: fetchMiningStats,
  };
};
