import { BatteryMonitorEnhanced } from "@/components/BatteryMonitorEnhanced";
import { ContactFooter } from "@/components/ContactFooter";
import { Web3Donation } from "@/components/Web3Donation";
import { ProductXMRT } from "@/components/ProductXMRT";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto pt-8 pb-24">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            XMRT Charger
          </h1>
          <p className="text-muted-foreground">
            Professional Grade Charging Solutions
          </p>
        </div>
        <BatteryMonitorEnhanced />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <ProductXMRT />
          <Web3Donation />
        </div>
      </div>
      <ContactFooter />
    </div>
  );
};

export default Index;
