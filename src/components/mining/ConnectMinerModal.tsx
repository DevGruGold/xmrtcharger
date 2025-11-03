import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Info } from "lucide-react";

interface ConnectMinerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
  onSuccess: () => void;
}

export function ConnectMinerModal({ open, onOpenChange, deviceId, onSuccess }: ConnectMinerModalProps) {
  const [xmrigApiUrl, setXmrigApiUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [detectedWallet, setDetectedWallet] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setConnectionSuccess(false);
      setDetectedWallet(null);
      setXmrigApiUrl("");
    }
  }, [open]);

  const handleConnect = async () => {
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
          onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Your XMRig Miner</DialogTitle>
          <DialogDescription>
            Connect your XMRig HTTP API to verify your mining contribution
          </DialogDescription>
        </DialogHeader>

        {connectionSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="text-lg font-semibold">Successfully Connected!</p>
            {detectedWallet && (
              <div className="text-sm text-muted-foreground text-center space-y-1">
                <p className="font-medium">Detected Wallet:</p>
                <p className="font-mono text-xs break-all">{detectedWallet}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              Your mining worker is now connected and you'll start earning XMRT tokens
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You must be mining to the <strong>XMRT DAO pool wallet</strong> to earn XMRT tokens.
                Your XMRig instance must be running and have HTTP API enabled.
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
                onClick={handleConnect}
                disabled={isConnecting || !xmrigApiUrl.trim()}
              >
                {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect Miner
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
