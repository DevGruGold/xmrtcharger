
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useSendTransaction, usePrepareSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Cable, Plug, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRODUCT_PRICE = '0.1'; // Price in ETH
const SELLER_ADDRESS = "0xda6b8FbB45616F6F3b96C033De705b2b8cb8Cb08";

export const ProductXMRT = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  const { config } = usePrepareSendTransaction({
    to: SELLER_ADDRESS,
    value: parseEther(PRODUCT_PRICE),
  });

  const { sendTransaction } = useSendTransaction(config);

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  const handlePurchase = async () => {
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
      toast.success("Purchase successful! We'll contact you for shipping details.");
    } catch (error) {
      toast.error("Failed to process purchase");
      console.error(error);
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl border-2 transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Package className="w-8 h-8 text-purple-600" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            XMRT Power Pack
          </CardTitle>
        </div>
        <CardDescription className="text-center text-base">
          Professional Grade 100W Charging Solution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/30">
            <Cable className="w-5 h-5 text-purple-600" />
            <span className="text-sm">100W Supercharger Cable</span>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/30">
            <Plug className="w-5 h-5 text-purple-600" />
            <span className="text-sm">Premium Charging Head</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price:</span>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-mono font-bold">{PRODUCT_PRICE} ETH</span>
            </div>
          </div>
        </div>

        {isConnected ? (
          <Button 
            onClick={handlePurchase}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Package className="w-4 h-4 mr-2 animate-pulse" />
            Purchase Now
          </Button>
        ) : (
          <Button
            onClick={handleConnect}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            Connect Wallet to Purchase
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
