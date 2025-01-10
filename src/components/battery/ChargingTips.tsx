import { Plane, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChargingTipsProps {
  show: boolean;
}

export const ChargingTips = ({ show }: ChargingTipsProps) => {
  if (!show) return null;

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        To optimize charging speed, consider enabling:
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-center space-x-2"
          onClick={() => window.open('https://support.apple.com/en-us/HT201974')}
        >
          <Plane className="w-4 h-4" />
          <span>Airplane Mode</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center space-x-2"
          onClick={() => window.open('https://support.apple.com/en-us/HT205234')}
        >
          <Zap className="w-4 h-4" />
          <span>Battery Saver</span>
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        (Links to instructions for enabling these modes)
      </div>
    </div>
  );
};