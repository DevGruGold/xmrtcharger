import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Info, Smartphone, Monitor, ExternalLink } from "lucide-react";

interface ConnectMinerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
  onSuccess: () => void;
}

export function ConnectMinerModal({ open, onOpenChange, deviceId, onSuccess }: ConnectMinerModalProps) {
  const [xmrigApiUrl, setXmrigApiUrl] = useState("");
  const [workerIdInput, setWorkerIdInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [detectedWallet, setDetectedWallet] = useState<string | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<'xmrig' | 'mobilemonero'>('mobilemonero');

  useEffect(() => {
    if (open) {
      setConnectionSuccess(false);
      setDetectedWallet(null);
      setXmrigApiUrl("");
      setWorkerIdInput("");
    }
  }, [open]);

  const handleXmrigConnect = async () => {
    if (!deviceId) {
      toast.error("Device ID is required");
      return;
    }

    if (!xmrigApiUrl.trim()) {
      toast.error("Please enter your XMRig HTTP API URL");
      return;
    }

    setIsConnecting(true);

    try {
      const { data, error } = await supabase.functions.invoke('xmrig-direct-proxy', {
        body: {
          xmrig_api_url: xmrigApiUrl.trim(),
          device_id: deviceId,
          action: 'connect'
        }
      });

      if (error) throw error;

      if (data?.success) {
        setConnectionSuccess(true);
        setDetectedWallet(data.detected_wallet);
        toast.success("Mining worker connected successfully!");
        
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        throw new Error(data?.error || "Failed to connect mining worker");
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(error.message || "Failed to connect mining worker");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMobileMoneroConnect = async () => {
    if (!deviceId) {
      toast.error("Device ID is required");
      return;
    }

    const workerId = workerIdInput.trim().toUpperCase();
    
    if (!workerId || workerId.length !== 8) {
      toast.error("Please enter a valid 8-character Worker ID");
      return;
    }

    // Validate format (should be hex characters)
    if (!/^[0-9A-F]{8}$/.test(workerId)) {
      toast.error("Worker ID should be 8 hexadecimal characters (0-9, A-F)");
      return;
    }

    setIsConnecting(true);

    try {
      const { data, error } = await supabase.functions.invoke('supportxmr-proxy', {
        body: {
          action: 'link_worker_by_id',
          worker_id: workerId,
          device_id: deviceId,
        }
      });

      if (error) throw error;

      if (data?.success) {
        setConnectionSuccess(true);
        setDetectedWallet(data.wallet_address);
        toast.success("MobileMonero worker linked successfully!");
        
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        throw new Error(data?.error || "Failed to link worker. Make sure your miner is active.");
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(error.message || "Failed to link MobileMonero worker");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Your Mining Worker</DialogTitle>
          <DialogDescription>
            Link your Monero miner to earn XMRT bonuses while charging
          </DialogDescription>
        </DialogHeader>

        {connectionSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="text-lg font-semibold">Successfully Connected!</p>
            {detectedWallet && (
              <div className="text-sm text-muted-foreground text-center space-y-1">
                <p className="font-medium">Mining to DAO Wallet:</p>
                <p className="font-mono text-xs break-all">{detectedWallet.substring(0, 20)}...{detectedWallet.substring(detectedWallet.length - 8)}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              Your mining worker is now linked and you'll earn XMRT bonuses!
            </p>
          </div>
        ) : (
          <Tabs value={connectionMethod} onValueChange={(v) => setConnectionMethod(v as 'xmrig' | 'mobilemonero')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mobilemonero" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                MobileMonero
              </TabsTrigger>
              <TabsTrigger value="xmrig" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                XMRig API
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobilemonero" className="space-y-4 mt-4">
              <Alert className="border-[hsl(var(--xmr-orange))]/30 bg-[hsl(var(--xmr-orange))]/5">
                <Smartphone className="h-4 w-4 text-[hsl(var(--xmr-orange))]" />
                <AlertDescription className="text-sm">
                  Mining with <strong>MobileMonero</strong> on Termux? Enter your 8-character Worker ID from the setup script output.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="worker-id">Your Worker ID</Label>
                <Input
                  id="worker-id"
                  placeholder="e.g., A3F9B2C1"
                  value={workerIdInput}
                  onChange={(e) => setWorkerIdInput(e.target.value.toUpperCase())}
                  disabled={isConnecting}
                  maxLength={8}
                  className="font-mono uppercase tracking-wider"
                />
                <p className="text-xs text-muted-foreground">
                  Find your Worker ID in the Termux output after running the setup script
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Don't have MobileMonero?</p>
                <a 
                  href="https://mobilemonero.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Visit mobilemonero.com for setup
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleMobileMoneroConnect}
                  disabled={isConnecting || workerIdInput.length !== 8}
                  className="bg-[hsl(var(--xmr-orange))] hover:bg-[hsl(var(--xmr-orange))]/90"
                >
                  {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Link Worker
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="xmrig" className="space-y-4 mt-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Connect via XMRig HTTP API. Your miner must be running and have the HTTP API enabled.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="xmrig-api">XMRig HTTP API URL</Label>
                <Input
                  id="xmrig-api"
                  placeholder="http://localhost:8080"
                  value={xmrigApiUrl}
                  onChange={(e) => setXmrigApiUrl(e.target.value)}
                  disabled={isConnecting}
                />
                <p className="text-xs text-muted-foreground">
                  The HTTP API endpoint of your XMRig miner (e.g., http://192.168.1.100:8080)
                </p>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleXmrigConnect}
                  disabled={isConnecting || !xmrigApiUrl.trim()}
                >
                  {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Connect Miner
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
