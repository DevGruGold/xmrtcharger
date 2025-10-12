import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ScanStep {
  id: string;
  label: string;
  duration: number;
  status: 'pending' | 'scanning' | 'complete';
}

interface DiagnosticScannerProps {
  onComplete: () => void;
}

export const DiagnosticScanner = ({ onComplete }: DiagnosticScannerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<ScanStep[]>([
    { id: 'capacity', label: 'Battery capacity detection', duration: 500, status: 'pending' },
    { id: 'speed', label: 'Charging speed analysis', duration: 700, status: 'pending' },
    { id: 'port', label: 'Port quality assessment', duration: 600, status: 'pending' },
    { id: 'temperature', label: 'Temperature impact calculation', duration: 500, status: 'pending' },
    { id: 'history', label: 'Historical pattern analysis', duration: 800, status: 'pending' },
  ]);

  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const currentStepData = steps[currentStep];
    
    // Mark current step as scanning
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === currentStep ? 'scanning' : idx < currentStep ? 'complete' : 'pending'
    })));

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, currentStepData.duration / 50);

    // Move to next step
    const stepTimeout = setTimeout(() => {
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === currentStep ? 'complete' : step.status
      })));
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }, currentStepData.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [currentStep, steps, onComplete]);

  const overallProgress = ((currentStep / steps.length) * 100);

  return (
    <Card className="p-8 space-y-6 bg-gradient-to-br from-card via-card to-accent/5">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Running Battery Diagnostics</h2>
        <p className="text-muted-foreground">Analyzing your device's charging capabilities...</p>
      </div>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-semibold">{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Scan Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              step.status === 'scanning' ? 'bg-primary/10 border border-primary/20' : 
              step.status === 'complete' ? 'bg-muted/50' : 'opacity-50'
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === 'complete' && (
                <CheckCircle2 className="w-5 h-5 text-charging" />
              )}
              {step.status === 'scanning' && (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
              {step.status === 'pending' && (
                <div className="w-5 h-5 rounded-full border-2 border-muted" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  step.status === 'pending' ? 'text-muted-foreground' : ''
                }`}>
                  {step.label}
                </span>
                {step.status === 'scanning' && (
                  <span className="text-xs text-primary font-medium">{progress}%</span>
                )}
              </div>
              {step.status === 'scanning' && (
                <Progress value={progress} className="h-1 mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scanning Line Effect */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
      </div>
    </Card>
  );
};
