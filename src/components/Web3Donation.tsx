import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useConnect, useDisconnect, useBalance, usePrepareSendTransaction, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Wallet, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChargingSpeedAnimation, getChargingSpeedColor } from './battery/BatteryAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const DONATION_ADDRESS = "0xda6b8FbB45616F6F3b96C033De705b2b8cb8Cb08";

interface Web3DonationProps {
  deviceId?: string | null;
}

export const Web3Donation = ({ deviceId }: Web3DonationProps = {}) => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });
  const [isPayoutWallet, setIsPayoutWallet] = useState(false);
  const [isSavingWallet, setIsSavingWallet] = useState(false);

  const { config } = usePrepareSendTransaction({
    to: DONATION_ADDRESS,
    value: parseEther('0.01'),
  });

  const { sendTransaction } = useSendTransaction(config);

  // Get user's IP address
  const getIpAddress = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
      return '0.0.0.0';
    }
  };

  // Auto-save wallet as payout address when connected
  useEffect(() => {
    if (address && isConnected && !isPayoutWallet && !isSavingWallet) {
      savePayoutWallet(address);
    }
  }, [address, isConnected]);

  const savePayoutWallet = async (walletAddress: string) => {
    setIsSavingWallet(true);
    try {
      const ipAddress = await getIpAddress();
      
      console.log('Saving payout wallet:', { deviceId, ipAddress, walletAddress });

      const { data, error } = await supabase.functions.invoke('update-payout-wallet', {
        body: {
          deviceId,
          ipAddress,
          walletAddress,
          walletType: 'ethereum'
        }
      });

      if (error) throw error;
      
      setIsPayoutWallet(true);
      toast.success("✓ Wallet saved as payout address for XMRT/XMR earnings", {
        description: "Your earnings will be sent to this wallet"
      });
      
      console.log('Payout wallet saved:', data);
    } catch (error) {
      console.error('Failed to save payout wallet:', error);
      toast.error("Could not save payout wallet", {
        description: "Please try reconnecting your wallet"
      });
    } finally {
      setIsSavingWallet(false);
    }
  };

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  const handleDonate = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      if (!sendTransaction) {
        toast.error("Transaction not ready");
        return;
      }
      
      await sendTransaction();
      toast.success("Thank you for your donation!");
    } catch (error) {
      toast.error("Failed to process donation");
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 mb-8 sm:mb-12 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl border-2 transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Battery className={cn(
            "w-8 h-8",
            isConnected ? getChargingSpeedColor('fast') : 'text-muted-foreground',
            isConnected && getChargingSpeedAnimation('fast')
          )} />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Support Free Web3
          </CardTitle>
        </div>
        <CardDescription className="text-center text-base">
          Connect your wallet and contribute to the future of decentralization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConnected ? (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connected:</span>
                <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
              {balance && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-mono">{parseFloat(balance?.formatted).toFixed(4)} {balance?.symbol}</span>
                </div>
              )}
              
              {/* Payout Wallet Indicator */}
              {isPayoutWallet && (
                <>
                  <div className="flex items-center justify-between text-sm border-t border-border/50 pt-2 mt-2">
                    <span className="text-muted-foreground">Payout Wallet:</span>
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    XMRT & XMR earnings will be sent to this address
                  </p>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleDonate}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Donate 0.01 ETH
              </Button>
              <Button
                onClick={() => disconnect()}
                variant="outline"
                className="border-2 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Wallet className="w-5 h-5 mr-2 animate-bounce" />
            Connect Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
};