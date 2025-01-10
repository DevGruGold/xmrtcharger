import { X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface DischargeWarningProps {
  show: boolean;
}

export const DischargeWarning = ({ show }: DischargeWarningProps) => {
  if (!show) return null;

  return (
    <Alert variant="destructive" className="animate-fade-in">
      <X className="h-4 w-4" />
      <AlertTitle>High Battery Drain Detected</AlertTitle>
      <AlertDescription>
        Consider closing these types of apps:
        <ul className="list-disc list-inside mt-2">
          <li>Video streaming apps</li>
          <li>Gaming apps</li>
          <li>GPS navigation</li>
          <li>Video conferencing apps</li>
          <li>Apps using camera or flashlight</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};