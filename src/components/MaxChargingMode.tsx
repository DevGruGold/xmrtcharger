import { useState } from 'react';
import { Zap, WifiHigh, AppWindow } from 'lucide-react';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface MaxChargingModeProps {
  onModeChange?: (enabled: boolean) => void;
}

export const MaxChargingMode = ({ onModeChange }: MaxChargingModeProps) => {
  const [isMaxCharging, setIsMaxCharging] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsMaxCharging(checked);
    onModeChange?.(checked);

    if (checked) {
      toast.success('Maximum Charging Mode Activated', {
        description: 'Wi-Fi remains active. Close background apps manually for best results.',
        duration: 5000,
      });
      
      // Request wake lock to prevent screen sleep (keeps connection active)
      if ('wakeLock' in navigator) {
        (navigator as any).wakeLock.request('screen').catch((err: Error) => {
          console.warn('Wake lock failed:', err);
        });
      }
    } else {
      toast.info('Maximum Charging Mode Deactivated', {
        description: 'Normal operation resumed.',
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-background border-2 border-primary/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Maximum Charging Mode</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Optimize for fastest charging while maintaining internet connectivity
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <WifiHigh className="w-4 h-4 text-green-500" />
              <span>Wi-Fi stays connected</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AppWindow className="w-4 h-4 text-orange-500" />
              <span>Close background apps manually for best results</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Switch
            checked={isMaxCharging}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary scale-125"
          />
          <span className="text-xs font-medium text-muted-foreground">
            {isMaxCharging ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {isMaxCharging && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong className="text-primary">Active:</strong> For maximum speed, manually close all unused apps, 
            enable airplane mode (then re-enable Wi-Fi), and reduce screen brightness.
          </p>
        </div>
      )}
    </Card>
  );
};
