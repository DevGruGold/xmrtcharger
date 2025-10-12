import { ChargingMode } from '@/types/battery';
import { Card } from '@/components/ui/card';
import { Zap, Heart, AlertCircle, RefreshCw, Battery } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChargingModeSelectorProps {
  selectedMode: ChargingMode;
  onModeSelect: (mode: ChargingMode) => void;
}

const modes = [
  {
    id: 'turbo' as ChargingMode,
    name: 'Turbo Charge',
    description: 'Maximum speed optimization',
    icon: Zap,
    color: 'text-purple-500',
    bgColor: 'hover:bg-purple-500/10 border-purple-500/20',
    expectedImprovement: '+30% faster',
  },
  {
    id: 'health' as ChargingMode,
    name: 'Battery Health',
    description: 'Balanced speed & longevity',
    icon: Heart,
    color: 'text-green-500',
    bgColor: 'hover:bg-green-500/10 border-green-500/20',
    expectedImprovement: 'Extended lifespan',
  },
  {
    id: 'emergency' as ChargingMode,
    name: 'Emergency',
    description: 'Quick charge for urgent needs',
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'hover:bg-red-500/10 border-red-500/20',
    expectedImprovement: '20% in 10min',
  },
  {
    id: 'calibration' as ChargingMode,
    name: 'Calibration',
    description: 'Restore accurate readings',
    icon: RefreshCw,
    color: 'text-blue-500',
    bgColor: 'hover:bg-blue-500/10 border-blue-500/20',
    expectedImprovement: 'Restore accuracy',
  },
];

export const ChargingModeSelector = ({ selectedMode, onModeSelect }: ChargingModeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Battery className="w-5 h-5" />
        <h3 className="font-semibold">Charging Mode</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <Card
              key={mode.id}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 border-2',
                mode.bgColor,
                isSelected && 'ring-2 ring-primary shadow-lg scale-105'
              )}
              onClick={() => onModeSelect(mode.id)}
            >
              <div className="space-y-2">
                <Icon className={cn('w-6 h-6', mode.color)} />
                <div>
                  <div className="font-semibold text-sm">{mode.name}</div>
                  <div className="text-xs text-muted-foreground">{mode.description}</div>
                </div>
                <div className={cn('text-xs font-medium', mode.color)}>
                  {mode.expectedImprovement}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
