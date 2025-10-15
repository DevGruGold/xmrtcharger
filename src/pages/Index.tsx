import { BatteryMonitorEnhanced } from "@/components/BatteryMonitorEnhanced";
import { ContactFooter } from "@/components/ContactFooter";
import { Web3Donation } from "@/components/Web3Donation";
import { ProductXMRT } from "@/components/ProductXMRT";
import { AppSelector } from "@/components/AppSelector";
import { MaxChargingMode } from "@/components/MaxChargingMode";
import { HeroSection } from "@/components/HeroSection";
import { useDeviceConnection } from "@/hooks/useDeviceConnection";
import { useBattery } from "@/hooks/useBattery";

const Index = () => {
  const connection = useDeviceConnection();
  const { batteryStatus, deviceInfo } = useBattery({
    deviceId: connection.deviceId,
    sessionId: connection.sessionId || undefined,
    logActivity: connection.logActivity,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8 space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            XMRT Charger
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            by Grounded Batteries, LLC
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/80">
            Professional Grade Charging Solutions
          </p>
        </div>
        
        <div className="mb-6">
          <MaxChargingMode 
            onModeChange={(enabled) => {
              if (connection.logActivity) {
                connection.logActivity(
                  'max_charging_mode',
                  'user_action',
                  `Maximum Charging Mode ${enabled ? 'activated' : 'deactivated'}`,
                  { mode_enabled: enabled },
                  'info'
                );
              }
            }}
          />
        </div>

        {batteryStatus && deviceInfo?.batterySupported && (
          <div className="mb-6">
            <HeroSection 
              batteryStatus={batteryStatus}
              deviceId={connection.deviceId}
              sessionId={connection.sessionId}
            />
          </div>
        )}

        <BatteryMonitorEnhanced />
        
        <div className="mt-6">
          <AppSelector />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
          <ProductXMRT />
          <Web3Donation />
        </div>
      </div>
      <ContactFooter />
    </div>
  );
};

export default Index;
