import { BatteryMonitor } from "@/components/BatteryMonitor";
import { AppSelector } from "@/components/AppSelector";
import { ContactFooter } from "@/components/ContactFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto pt-8 pb-24">
        <BatteryMonitor />
        <div className="mt-8">
          <AppSelector />
        </div>
      </div>
      <ContactFooter />
    </div>
  );
};

export default Index;