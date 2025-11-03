import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMiningStatus } from '@/hooks/useMiningStatus';
import { ConnectMinerModal } from './ConnectMinerModal';
import { useState } from 'react';
import { Bitcoin, Zap, TrendingUp, Clock, Link2 } from 'lucide-react';

interface MiningProfileProps {
  deviceId: string | null;
  sessionId: string | null;
}

export const MiningProfile = ({ deviceId, sessionId }: MiningProfileProps) => {
  const { miningStats, isLoading, refresh } = useMiningStatus({ deviceId, sessionId });
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectSuccess = () => {
    setIsConnecting(true);
    refresh();
    
    // Reset connecting state after 30 seconds if stats don't load
    setTimeout(() => {
      setIsConnecting(false);
    }, 30000);
  };

  // Reset connecting state once mining becomes active
  if (isConnecting && miningStats.isActive) {
    setIsConnecting(false);
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  // Show connecting state while waiting for miner to activate
  if (isConnecting && !miningStats.isActive) {
    return (
      <>
        <Card className="p-6 border-[hsl(var(--xmr-orange))]/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-[hsl(var(--xmr-orange))] animate-pulse" />
              <h3 className="text-lg font-semibold text-foreground">Connecting to Miner...</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fetching your mining stats. This may take a few moments.
            </p>
            <div className="flex gap-1 justify-center py-4">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--xmr-orange))] animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--xmr-orange))] animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--xmr-orange))] animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </Card>
        <ConnectMinerModal
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
          deviceId={deviceId}
          onSuccess={handleConnectSuccess}
        />
      </>
    );
  }

  if (!miningStats.isActive) {
    return (
      <>
        <Card className="p-6 border-dashed">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-[hsl(var(--xmr-orange))]/10">
                <Bitcoin className="h-8 w-8 text-[hsl(var(--xmr-orange))]" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect XMR Mining Worker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Link your Monero mining to earn bonus XMRT while charging your device
              </p>
            </div>
            <Button onClick={() => setShowConnectModal(true)}>
              <Link2 className="mr-2 h-4 w-4" />
              Connect Mining Worker
            </Button>
          </div>
        </Card>
        <ConnectMinerModal
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
          deviceId={deviceId}
          onSuccess={handleConnectSuccess}
        />
      </>
    );
  }

  return (
    <>
      <Card className="p-6 border-[hsl(var(--xmr-orange))]/30 bg-gradient-to-br from-card to-[hsl(var(--xmr-orange))]/5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-[hsl(var(--xmr-orange))]" />
              <h3 className="text-lg font-semibold text-foreground">Mining Profile</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>

          {/* Worker Info */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-1">
            <div className="text-xs text-muted-foreground">Worker ID</div>
            <div className="text-sm font-mono text-foreground">{miningStats.workerId}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bitcoin className="h-3 w-3" />
                <span>XMR Mined</span>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--xmr-orange))]">
                {miningStats.xmrMined.toFixed(8)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>XMRT Bonus</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {miningStats.xmrtFromMining.toFixed(2)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Hashrate</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {(miningStats.hashrate / 1000).toFixed(1)} KH/s
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Shares</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {miningStats.shares.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs">
            <p className="text-foreground">
              <span className="font-semibold text-primary">+50% Charging Bonus:</span> You earn extra XMRT while mining and charging simultaneously
            </p>
          </div>
        </div>
      </Card>
      <ConnectMinerModal
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
        deviceId={deviceId}
        onSuccess={handleConnectSuccess}
      />
    </>
  );
};
