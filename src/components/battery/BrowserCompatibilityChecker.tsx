import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Chrome, Globe } from 'lucide-react';
import { BrowserType } from '@/utils/deviceDetection';

interface BrowserCompatibilityCheckerProps {
  browser: BrowserType;
  supported: boolean;
  message: string;
  recommendation: string | null;
}

export const BrowserCompatibilityChecker = ({
  browser,
  supported,
  message,
  recommendation,
}: BrowserCompatibilityCheckerProps) => {
  if (supported) {
    return (
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Battery API Supported</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-destructive/50 bg-destructive/10">
      <XCircle className="h-4 w-4 text-destructive" />
      <AlertTitle>Battery API Not Supported</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        {recommendation && (
          <>
            <p className="font-semibold">{recommendation}</p>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
              >
                <Chrome className="w-4 h-4" />
                Download Chrome
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://www.microsoft.com/edge', '_blank')}
              >
                <Globe className="w-4 h-4" />
                Download Edge
              </Button>
            </div>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};
