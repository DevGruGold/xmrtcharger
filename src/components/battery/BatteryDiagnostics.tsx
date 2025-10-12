import { BatteryHealthMetrics } from '@/types/battery';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { generateRecommendations } from '@/utils/batteryHealth';

interface BatteryDiagnosticsProps {
  health: BatteryHealthMetrics;
}

export const BatteryDiagnostics = ({ health }: BatteryDiagnosticsProps) => {
  const recommendations = generateRecommendations(health);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold">Smart Recommendations</h3>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <Alert key={index} className="border-l-4 border-l-primary">
              <TrendingUp className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                {rec}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      ) : (
        <Alert className="border-green-500 bg-green-500/10">
          <AlertDescription className="text-sm">
            🎉 Excellent! Your battery is performing optimally. Keep up the good charging habits!
          </AlertDescription>
        </Alert>
      )}

      <div className="pt-4 border-t">
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Pro Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Keep battery between 20-80% for optimal longevity</li>
            <li>Avoid charging in hot environments</li>
            <li>Use original or certified cables</li>
            <li>Enable airplane mode for fastest charging</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
