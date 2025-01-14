import { Plane, Battery } from 'lucide-react';
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
          className="relative h-auto py-4 flex flex-col items-center justify-center space-y-2 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          onClick={() => window.open('https://support.apple.com/en-us/HT201974')}
        >
          <Plane className="w-6 h-6 text-primary" />
          <span className="text-xs font-medium">Airplane Mode</span>
        </Button>
        
        <Button
          variant="outline"
          className="relative h-auto py-4 flex flex-col items-center justify-center space-y-2 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          onClick={() => window.open('https://support.apple.com/en-us/HT205234')}
        >
          <Battery className="w-6 h-6 text-primary" />
          <span className="text-xs font-medium">Battery Saver</span>
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground italic">
        Click for instructions
      </div>
    </div>
  );
};