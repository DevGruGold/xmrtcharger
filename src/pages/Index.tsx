import { useState } from "react";
import { BatteryMonitorEnhanced } from "@/components/BatteryMonitorEnhanced";
import { ContactFooter } from "@/components/ContactFooter";
import { Web3Donation } from "@/components/Web3Donation";
import { ProductXMRT } from "@/components/ProductXMRT";
import { MaxChargingMode } from "@/components/MaxChargingMode";
import { HeroSection } from "@/components/HeroSection";
import { AIOptimizationInsights } from "@/components/battery/AIOptimizationInsights";
import { AirplaneModeCoach } from "@/components/battery/AirplaneModeCoach";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useDeviceConnection } from "@/hooks/useDeviceConnection";
import { useBattery } from "@/hooks/useBattery";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const Index = () => {
  const [maxModeEnabled, setMaxModeEnabled] = useState(false);
  const connection = useDeviceConnection();
  const { batteryStatus, deviceInfo } = useBattery({
    deviceId: connection.deviceId,
    sessionId: connection.sessionId || undefined,
    logActivity: connection.logActivity,
  });

  const networkStatus = useNetworkStatus({
    isCharging: batteryStatus?.charging || false,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Offline indicator */}
      <OfflineIndicator />
      
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card corporate-shadow">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                XMRT Charger
              </h1>
              <p className="text-sm text-muted-foreground">
                by <span className="text-foreground font-semibold">Grounded Batteries, LLC</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Professional Battery Management Solutions
              </p>
            </div>
          </div>
        </header>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-20 space-y-8">
          {/* Hero Section with Reward System */}
          <HeroSection 
            batteryStatus={batteryStatus}
            deviceId={connection.deviceId}
            sessionId={connection.sessionId}
            maxModeEnabled={maxModeEnabled}
          />

          {/* Airplane Mode Coach */}
          <AirplaneModeCoach
            isCharging={batteryStatus?.charging || false}
            isAirplaneMode={networkStatus.isAirplaneMode}
            airplaneModeDuration={networkStatus.airplaneModeDuration}
            batteryLevel={batteryStatus?.level || 0}
          />

          {/* AI Battery Optimization Insights */}
          <AIOptimizationInsights 
            batteryStatus={batteryStatus}
            deviceId={connection.deviceId}
            sessionId={connection.sessionId}
          />

          {/* Max Charging Mode - Moved to settings area */}
          <div className="max-w-2xl mx-auto">
            <MaxChargingMode 
              onModeChange={(enabled) => {
                setMaxModeEnabled(enabled);
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

          {/* Battery Monitor */}
          <BatteryMonitorEnhanced />
          
          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <ProductXMRT />
            <Web3Donation deviceId={connection.deviceId} />
          </div>
        </div>

        <ContactFooter />
      </div>
    </div>
  );
};

export default Index;
