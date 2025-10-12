import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Thermometer, 
  Plug, 
  Zap,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';

export interface BatteryIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'port' | 'temperature' | 'speed' | 'efficiency' | 'degradation' | 'general';
  title: string;
  description: string;
  impact: string;
  solution: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
}

interface IssueDetectionPanelProps {
  issues: BatteryIssue[];
}

export const IssueDetectionPanel = ({ issues }: IssueDetectionPanelProps) => {
  const getIssueIcon = (category: BatteryIssue['category']) => {
    switch (category) {
      case 'port': return Plug;
      case 'temperature': return Thermometer;
      case 'speed': return Zap;
      case 'degradation': return TrendingDown;
      case 'efficiency': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeIcon = (type: BatteryIssue['type']) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
    }
  };

  const getTypeColor = (type: BatteryIssue['type']) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
    }
  };

  const criticalIssues = issues.filter(i => i.type === 'critical');
  const warningIssues = issues.filter(i => i.type === 'warning');
  const infoIssues = issues.filter(i => i.type === 'info');

  if (issues.length === 0) {
    return (
      <Card className="p-6">
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertDescription className="text-base ml-2">
            <div className="font-semibold mb-1">Excellent! No Issues Detected</div>
            <div className="text-sm text-muted-foreground">
              Your battery is performing optimally. Keep up the good charging habits!
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Issues Detected</h3>
          <p className="text-sm text-muted-foreground">
            {issues.length} issue{issues.length !== 1 ? 's' : ''} found that may affect charging performance
          </p>
        </div>
        <div className="flex gap-2">
          {criticalIssues.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {criticalIssues.length} Critical
            </Badge>
          )}
          {warningIssues.length > 0 && (
            <Badge variant="default">
              {warningIssues.length} Warning{warningIssues.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {infoIssues.length > 0 && (
            <Badge variant="secondary">
              {infoIssues.length} Info
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => {
          const IconComponent = getIssueIcon(issue.category);
          const TypeIcon = getTypeIcon(issue.type);
          
          return (
            <Alert 
              key={issue.id}
              className={`${
                issue.type === 'critical' 
                  ? 'border-destructive/50 bg-destructive/5 animate-pulse-slow' 
                  : issue.type === 'warning'
                  ? 'border-yellow-500/50 bg-yellow-500/5'
                  : 'border-blue-500/50 bg-blue-500/5'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <IconComponent className={`h-6 w-6 ${
                    issue.type === 'critical' ? 'text-destructive' :
                    issue.type === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{issue.title}</h4>
                        <Badge variant={getTypeColor(issue.type)} className="text-xs">
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {issue.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-16">Impact:</span>
                      <span className="text-muted-foreground">{issue.impact}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-16">Solution:</span>
                      <span className="text-muted-foreground">{issue.solution}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="mt-2">
                    View Fix Guide
                  </Button>
                </div>
              </div>
            </Alert>
          );
        })}
      </div>
    </Card>
  );
};
