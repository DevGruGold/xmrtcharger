import { useState } from "react";
import { BatteryMonitorEnhanced } from "@/components/BatteryMonitorEnhanced";
import { ContactFooter } from "@/components/ContactFooter";
import { Web3Donation } from "@/components/Web3Donation";
import { ProductXMRT } from "@/components/ProductXMRT";
import { MaxChargingMode } from "@/components/MaxChargingMode";
import { HeroSection } from "@/components/HeroSection";
import { AIOptimizationInsights } from "@/components/battery/AIOptimizationInsights";
import { useDeviceConnection } from "@/hooks/useDeviceConnection";
import { useBattery } from "@/hooks/useBattery";

const Index = () => {
  const [maxModeEnabled, setMaxModeEnabled] = useState(false);
  const connection = useDeviceConnection();
  const { batteryStatus, deviceInfo } = useBattery({
    deviceId: connection.deviceId,
    sessionId: connection.sessionId || undefined,
    logActivity: connection.logActivity,
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow-primary">
                  XMRT Charger
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground/90">
                by <span className="text-foreground font-medium">Grounded Batteries, LLC</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground/70 tracking-wide uppercase">
                Professional Grade Charging Solutions
              </p>
            </div>
          </div>
        </header>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Hero Section with Reward System */}
          <HeroSection 
            batteryStatus={batteryStatus}
            deviceId={connection.deviceId}
            sessionId={connection.sessionId}
            maxModeEnabled={maxModeEnabled}
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
            <Web3Donation />
          </div>
        </div>

        <ContactFooter />
      </div>
    </div>
  );
};

export default Index;
