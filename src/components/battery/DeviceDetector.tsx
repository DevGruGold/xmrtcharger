import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Laptop, Tablet, Smartphone, Monitor } from 'lucide-react';
import { DeviceType } from '@/utils/deviceDetection';

interface DeviceDetectorProps {
  deviceType: DeviceType;
  os: string;
  browser: string;
}

export const DeviceDetector = ({ deviceType, os, browser }: DeviceDetectorProps) => {
  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'pc':
        return <Laptop className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'phone':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getDeviceLabel = () => {
    switch (deviceType) {
      case 'pc':
        return 'Laptop/Desktop';
      case 'tablet':
        return 'Tablet';
      case 'phone':
        return 'Smartphone';
      default:
        return 'Unknown Device';
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            {getDeviceIcon()}
          </div>
          <div>
            <div className="font-semibold text-sm">{getDeviceLabel()}</div>
            <div className="text-xs text-muted-foreground">{os}</div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {browser}
        </Badge>
      </div>
    </Card>
  );
};
