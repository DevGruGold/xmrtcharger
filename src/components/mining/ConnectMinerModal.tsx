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
  const [workerId, setWorkerId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const handleConnect = async () => {
    if (!deviceId) {
      toast.error('Device ID not available');
      return;
    }

    if (!workerId && !walletAddress) {
      toast.error('Please provide either a Worker ID or Wallet Address');
      return;
    }

    setIsConnecting(true);

    try {
      const { data, error } = await supabase.functions.invoke('associate-device-miner', {
        body: {
          deviceId,
          worker_id: workerId || null,
          wallet_address: walletAddress || null,
          mining_while_charging: true,
        }
      });

      if (error) throw error;

      if (data?.success) {
        setConnectionSuccess(true);
        toast.success(`✅ Connected to mining worker: ${data.worker.worker_id}`, {
          description: `Pool: ${data.worker.pool}`,
        });
        
        setTimeout(() => {
          onSuccess?.();
          onOpenChange(false);
          setConnectionSuccess(false);
          setWorkerId('');
          setWalletAddress('');
        }, 2000);
      } else {
        throw new Error(data?.error || 'Failed to connect miner');
      }
    } catch (error: any) {
      console.error('Error connecting miner:', error);
      toast.error('Failed to connect mining worker', {
        description: error.message || 'Please check your Worker ID or Wallet Address',
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
              <Label htmlFor="worker-id">Worker ID (from supportxmr-proxy)</Label>
              <Input
                id="worker-id"
                placeholder="e.g., worker_12345"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                disabled={isConnecting}
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Monero Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="4..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={isConnecting}
                className="font-mono text-xs"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
              <p className="font-medium">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your XMR mining activity is tracked in real-time</li>
                <li>XMR mined while charging converts to bonus XMRT</li>
                <li>Get +50% XMRT multiplier for active mining</li>
                <li>Your wallet address is stored securely</li>
              </ul>
            </div>
          </div>
        )}

        {!connectionSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConnecting}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={isConnecting || (!workerId && !walletAddress)}>
              {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Miner
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
