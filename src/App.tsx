import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Configure Web3Modal
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'; // You'll need to get this from WalletConnect

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

const App = () => (
  <WagmiConfig config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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

export default App;