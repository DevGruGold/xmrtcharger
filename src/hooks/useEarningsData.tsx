import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EarningsTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  reason: string;
  multiplier: number | null;
  created_at: string;
  metadata: {
    elapsed_seconds?: number;
    base_amount?: number;
    bonuses?: string[];
    is_charging?: boolean;
    battery_level?: number;
    max_mode_enabled?: boolean;
    device_count?: number;
    xmr_contribution?: {
      xmr_mined: number;
      xmrt_from_xmr: number;
      conversion_rate: number;
      worker_id: string;
    };
  };
  device_id?: string;
  session_id?: string;
}

export interface EarningsSummary {
  totalXmrt: number;
  totalSessions: number;
  averagePerSession: number;
  totalChargingTime: number;
  baseRewards: number;
  bonusMultipliers: number;
  miningBonus: number;
  multiDeviceBonus: number;
  maxModeBonus: number;
}

export const useEarningsData = (dateRange: 'all' | '7d' | '30d' = 'all') => {
  const [transactions, setTransactions] = useState<EarningsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Failed to get IP address:', error);
      }
    };
    getIpAddress();
  }, []);

  useEffect(() => {
    if (!ipAddress) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Get user profile ID from IP
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('ip_address', ipAddress)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setTransactions([]);
          setIsLoading(false);
          return;
        }

        if (!profile) {
          console.log('No profile found for IP:', ipAddress);
          setTransactions([]);
          setIsLoading(false);
          return;
        }

        console.log('Fetching transactions for profile:', profile.id);

        // Calculate date filter
        let dateFilter = new Date(0); // Beginning of time
        if (dateRange === '7d') {
          dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        } else if (dateRange === '30d') {
          dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }

        // Fetch transactions
        const { data, error } = await supabase
          .from('xmrt_transactions')
          .select('*')
          .eq('user_profile_id', profile.id)
          .gte('created_at', dateFilter.toISOString())
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }

        console.log('Fetched transactions:', data?.length || 0);
        setTransactions((data || []) as EarningsTransaction[]);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [ipAddress, dateRange]);

  const summary: EarningsSummary = useMemo(() => {
    const totalXmrt = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalSessions = transactions.length;
    const averagePerSession = totalSessions > 0 ? totalXmrt / totalSessions : 0;
    
    const totalChargingTime = transactions.reduce((sum, tx) => {
      return sum + (tx.metadata?.elapsed_seconds || 0);
    }, 0);

    const baseRewards = transactions.reduce((sum, tx) => {
      return sum + (tx.metadata?.base_amount || 0);
    }, 0);

    const bonusMultipliers = totalXmrt - baseRewards;

    const miningBonus = transactions.reduce((sum, tx) => {
      return sum + (tx.metadata?.xmr_contribution?.xmrt_from_xmr || 0);
    }, 0);

    // Approximate other bonuses (this is simplified)
    const multiDeviceBonus = transactions.reduce((sum, tx) => {
      const deviceCount = tx.metadata?.device_count || 1;
      if (deviceCount > 1) {
        return sum + (tx.amount * 0.1); // Rough estimate
      }
      return sum;
    }, 0);

    const maxModeBonus = transactions.reduce((sum, tx) => {
      if (tx.metadata?.max_mode_enabled) {
        return sum + (tx.amount * 0.2); // Rough estimate
      }
      return sum;
    }, 0);

    return {
      totalXmrt,
      totalSessions,
      averagePerSession,
      totalChargingTime,
      baseRewards,
      bonusMultipliers,
      miningBonus,
      multiDeviceBonus,
      maxModeBonus,
    };
  }, [transactions]);

  return {
    transactions,
    summary,
    isLoading,
  };
};
