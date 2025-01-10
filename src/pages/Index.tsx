import { BatteryMonitor } from "@/components/BatteryMonitor";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <BatteryMonitor />
    </div>
  );
};

export default Index;