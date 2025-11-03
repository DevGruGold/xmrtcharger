import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Bitcoin, CheckCircle2 } from 'lucide-react';

interface ConnectMinerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
  onSuccess?: () => void;
}

export const ConnectMinerModal = ({ open, onOpenChange, deviceId, onSuccess }: ConnectMinerModalProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const handleConnect = async () => {
    if (!deviceId) {
      toast.error('Device ID not available');
      return;
    }

    if (!walletAddress) {
      toast.error('Please provide a Monero wallet address');
      return;
    }

    setIsConnecting(true);

    try {
      const { data: proxyData, error: proxyError } = await supabase.functions.invoke('supportxmr-proxy', {
        body: {
          wallet_address: walletAddress,
          deviceId,
          action: 'connect',
        }
      });

      if (proxyError) throw proxyError;

      if (!proxyData?.success) {
        throw new Error(proxyData?.error || 'Failed to fetch mining stats');
      }

      setConnectionSuccess(true);
      toast.success(`✅ Connected to SupportXMR`, {
        description: `Hashrate: ${(proxyData.stats.hashrate / 1000).toFixed(2)} KH/s | Shares: ${proxyData.stats.shares}`,
      });
      
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setConnectionSuccess(false);
        setWalletAddress('');
      }, 2000);

    } catch (error: any) {
      console.error('Error connecting miner:', error);
      toast.error('Failed to connect to SupportXMR', {
        description: error.message || 'Please check your wallet address and ensure you are actively mining',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-[hsl(var(--xmr-orange))]" />
            Connect XMR Mining Worker
          </DialogTitle>
          <DialogDescription>
            Link your Monero mining worker to earn bonus XMRT while charging. 1 XMR mined = 1000 XMRT bonus + 50% charging boost.
          </DialogDescription>
        </DialogHeader>

        {connectionSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-300" />
            <p className="text-lg font-semibold text-foreground">Successfully Connected!</p>
            <p className="text-sm text-muted-foreground">Your mining rewards are now linked</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Monero Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="4... (your SupportXMR wallet)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={isConnecting}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Enter your Monero wallet address that you're mining to on SupportXMR
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
              <p className="font-medium">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>We fetch your real-time stats from SupportXMR's public API</li>
                <li>XMR mined while charging converts to bonus XMRT (1:1000 ratio)</li>
                <li>Get +50% XMRT multiplier for active mining</li>
                <li>Stats update every 10 seconds automatically</li>
              </ul>
            </div>
          </div>
        )}

        {!connectionSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConnecting}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isConnecting || !walletAddress}>
              {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Miner
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
