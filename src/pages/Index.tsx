import { useState } from "react";
import { BatteryMonitorEnhanced } from "@/components/BatteryMonitorEnhanced";
import { ContactFooter } from "@/components/ContactFooter";
import { Web3Donation } from "@/components/Web3Donation";
import { MaxChargingMode } from "@/components/MaxChargingMode";
import { HeroSection } from "@/components/HeroSection";
import { AIOptimizationInsights } from "@/components/battery/AIOptimizationInsights";
import { AirplaneModeCoach } from "@/components/battery/AirplaneModeCoach";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ProductHero } from "@/components/ProductHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShoppingCart } from "@/components/shop/ShoppingCart";
import { useDeviceConnection } from "@/hooks/useDeviceConnection";
import { useBattery } from "@/hooks/useBattery";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { PRODUCTS } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [maxModeEnabled, setMaxModeEnabled] = useState(false);
  const connection = useDeviceConnection();
  const { batteryStatus, deviceInfo } = useBattery({
    deviceId: connection.deviceId,
    logActivity: connection.logActivity,
  });

  const networkStatus = useNetworkStatus({
    isCharging: batteryStatus?.charging || false,
  });

  const scrollToMonitoring = () => {
    document.getElementById('monitoring-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        <header className="border-b border-border bg-card corporate-shadow sticky top-0 z-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  XMRT Charger
                </h1>
                <p className="text-xs text-muted-foreground">
                  by <span className="text-foreground font-semibold">Grounded Batteries, LLC</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate('/earnings')}
                  variant="ghost"
                  size="sm"
                  className="gap-2 hidden sm:flex"
                >
                  <History className="h-4 w-4" />
                  Earnings
                </Button>
                <ShoppingCart />
              </div>
            </div>
          </div>
        </header>

        {/* Product Hero Section */}
        <ProductHero />

        {/* Shop Section */}
        <section id="shop-section" className="py-16 bg-secondary/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Shop XMRT Products
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your XMRT Charger and accessories. Start mining Monero while you charge.
              </p>
            </div>

            {/* Pre-release Pricing Banner */}
            <div className="mb-8 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
                <CardContent className="p-6 text-center">
                  <Badge variant="destructive" className="mb-3 text-sm font-bold">
                    LIMITED TIME PRE-RELEASE OFFER
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    50% Off All Products
                  </h3>
                  <p className="text-muted-foreground">
                    Get early access to XMRT Charger technology at half the shelf price. 
                    Pre-release pricing ends when we launch!
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Continue to Monitoring */}
            <div className="text-center mt-12">
              <Button 
                variant="ghost" 
                onClick={scrollToMonitoring}
                className="gap-2"
              >
                View Live Monitoring
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </Button>
            </div>
          </div>
        </section>

        {/* Live Monitoring Section */}
        <section id="monitoring-section" className="py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Live Battery Monitoring
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real-time battery analytics and XMRT token rewards
              </p>
            </div>

            {/* Hero Section with Reward System */}
            <HeroSection
              batteryStatus={batteryStatus}
              deviceId={connection.deviceId}
              sessionId={connection.sessionId}
              maxModeEnabled={maxModeEnabled}
              sessionStartTime={connection.sessionStartTime}
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

            {/* Max Charging Mode */}
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
            
            {/* Web3 Donation */}
            <div className="max-w-2xl mx-auto">
              <Web3Donation deviceId={connection.deviceId} />
            </div>
          </div>
        </section>

        <ContactFooter />
      </div>
    </div>
  );
};

export default Index;
