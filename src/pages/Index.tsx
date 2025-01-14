import { BatteryMonitor } from "@/components/BatteryMonitor";
import { AppSelector } from "@/components/AppSelector";
import { ContactFooter } from "@/components/ContactFooter";
import { Web3Donation } from "@/components/Web3Donation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto pt-8 pb-24">
        <BatteryMonitor />
        <Web3Donation />
        <div className="mt-8">
          <AppSelector />
        </div>
      </div>
      <ContactFooter />
    </div>
  );
};

export default Index;