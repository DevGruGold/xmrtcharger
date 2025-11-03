import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Bitcoin, CheckCircle2, Cpu } from 'lucide-react';

interface ConnectMinerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
  onSuccess?: () => void;
}

export const ConnectMinerModal = ({ open, onOpenChange, deviceId, onSuccess }: ConnectMinerModalProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [xmrigApiUrl, setXmrigApiUrl] = useState('');
  const [connectionType, setConnectionType] = useState<'wallet' | 'xmrig'>('wallet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState(true);

  // Fetch default wallet address on mount
  const fetchDefaultWallet = async () => {
    try {
      const response = await fetch('https://vawouugtzwmejxqkeqqj.supabase.co/functions/v1/supportxmr-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhd291dWd0endtZWp4cWtlcXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk3MTIsImV4cCI6MjA2ODM0NTcxMn0.qtZk3zk5RMqzlPNhxCkTM6fyVQX5ULGt7nna_XOUr00',
        },
        body: JSON.stringify({ action: 'get_default_wallet' })
      });
      
      const data = await response.json();
      if (data?.success && data.wallet_address) {
        setWalletAddress(data.wallet_address);
      }
    } catch (error) {
      console.error('Error fetching default wallet:', error);
    } finally {
      setIsLoadingDefault(false);
    }
  };

  // Load default wallet when modal opens
  useEffect(() => {
    if (open && isLoadingDefault) {
      fetchDefaultWallet();
    }
  }, [open, isLoadingDefault]);

  const handleConnect = async () => {
    if (!deviceId) {
      toast.error('Device ID not available');
      return;
    }

    setIsConnecting(true);

    try {
      let proxyData;

      if (connectionType === 'xmrig') {
        if (!xmrigApiUrl.trim()) {
          toast.error('Please enter XMRig API URL');
          return;
        }

        const response = await supabase.functions.invoke('xmrig-direct-proxy', {
          body: {
            xmrig_api_url: xmrigApiUrl,
            device_id: deviceId,
            action: 'connect'
          }
        });

        proxyData = response.data;
        if (response.error) throw response.error;
      } else {
        if (!walletAddress) {
          toast.error('Please provide a Monero wallet address');
          return;
        }

        const response = await fetch('https://vawouugtzwmejxqkeqqj.supabase.co/functions/v1/supportxmr-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhd291dWd0endtZWp4cWtlcXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk3MTIsImV4cCI6MjA2ODM0NTcxMn0.qtZk3zk5RMqzlPNhxCkTM6fyVQX5ULGt7nna_XOUr00',
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
            deviceId,
            action: 'connect',
          })
        });

        proxyData = await response.json();
      }

      if (!proxyData?.success) {
        throw new Error(proxyData?.error || 'Failed to connect miner');
      }

      setConnectionSuccess(true);
      toast.success(`✅ Connected via ${connectionType === 'xmrig' ? 'XMRig API' : 'SupportXMR'}`, {
        description: `Hashrate: ${(proxyData.stats.hashrate / 1000).toFixed(2)} KH/s | Shares: ${proxyData.stats.shares}`,
      });
      
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setConnectionSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error connecting miner:', error);
      toast.error('Failed to connect miner', {
        description: error.message || 'Please check your configuration and try again',
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
          <Tabs defaultValue="wallet" className="w-full" onValueChange={(v) => setConnectionType(v as 'wallet' | 'xmrig')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wallet">
                <Bitcoin className="w-4 h-4 mr-2" />
                SupportXMR
              </TabsTrigger>
              <TabsTrigger value="xmrig">
                <Cpu className="w-4 h-4 mr-2" />
                XMRig API
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wallet" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="wallet">Monero Wallet Address</Label>
                <Input
                  id="wallet"
                  placeholder={isLoadingDefault ? "Loading default..." : "4... (your SupportXMR wallet)"}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  disabled={isConnecting || isLoadingDefault}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  {walletAddress ? '✓ Using XMRT DAO pool wallet (editable)' : 'Enter your Monero wallet address that you\'re mining to on SupportXMR'}
                </p>
              </div>

              <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
                <p className="font-medium">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Fetches stats from SupportXMR's public API</li>
                  <li>Historical data from mining pool</li>
                  <li>Updates every 10 seconds</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="xmrig" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="xmrig">XMRig HTTP API URL</Label>
                <Input
                  id="xmrig"
                  placeholder="http://192.168.1.100:8080"
                  value={xmrigApiUrl}
                  onChange={(e) => setXmrigApiUrl(e.target.value)}
                  disabled={isConnecting}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your XMRig HTTP API endpoint for real-time stats
                </p>
              </div>

              <div className="bg-muted/50 p-3 rounded-md text-xs space-y-2">
                <p className="font-medium">Setup Instructions:</p>
                <p>1. Enable HTTP API in XMRig config.json:</p>
                <code className="block bg-background p-2 rounded mt-1 text-[10px]">
                  "http": &#123; "enabled": true, "host": "0.0.0.0", "port": 8080 &#125;
                </code>
                <p className="mt-2">2. Restart XMRig and enter URL above</p>
                <p className="text-muted-foreground">✨ Get real-time hashrate directly from your miner!</p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!connectionSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConnecting}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || (connectionType === 'wallet' ? !walletAddress : !xmrigApiUrl)}
            >
              {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Miner
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
