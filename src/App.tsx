import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { useEffect } from 'react';
import { offlineStorage } from '@/utils/offlineStorage';
import Index from "./pages/Index";
import Earnings from "./pages/Earnings";

const queryClient = new QueryClient();

// Configure Web3Modal
const projectId = 'c7d929435fc16c0e4bd0363b29708dd2';

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const App = () => {
  // Initialize offline storage on app start
  useEffect(() => {
    offlineStorage.init().then(() => {
      console.log('📱 Offline storage initialized');
    }).catch((error) => {
      console.error('Failed to initialize offline storage:', error);
    });
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/earnings" element={<Earnings />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="light"
      />
    </WagmiConfig>
  );
};

export default App;