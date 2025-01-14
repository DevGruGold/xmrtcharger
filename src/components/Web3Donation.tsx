import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Web3Donation = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });

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
      // For demonstration, we'll just show a success message
      // In a real app, you would implement the actual donation transaction here
      toast.success("Thank you for supporting a free web3!");
    } catch (error) {
      toast.error("Failed to process donation");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Support Free Web3</CardTitle>
        <CardDescription>Connect your wallet and contribute to the future of decentralization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            {balance && (
              <div className="text-sm text-muted-foreground">
                Balance: {parseFloat(balance?.formatted).toFixed(4)} {balance?.symbol}
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={handleDonate} className="flex-1">
                Donate
              </Button>
              <Button onClick={() => disconnect()} variant="outline" className="flex-1">
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleConnect} className="w-full">
            Connect Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
};