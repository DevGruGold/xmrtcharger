import { DrainAnalysis } from '@/types/batteryDrain';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Pause, 
  Settings, 
  X, 
  Cpu, 
  Archive, 
  Download, 
  Battery, 
  Sun,
  Info
} from 'lucide-react';
import { useState } from 'react';

interface IntelligentDischargeWarningProps {
  drainAnalysis: DrainAnalysis | null;
  currentDischargeRate: number;
}

const iconMap: Record<string, any> = {
  Pause,
  Settings,
  X,
  Cpu,
  Archive,
  Download,
  Battery,
  Sun,
};

const causeLabels: Record<string, string> = {
  high_cpu_usage: 'High CPU Usage',
  video_playing: 'Video Playback',
  multiple_tabs: 'Multiple Tabs Open',
  active_downloads: 'Active Downloads',
  gpu_intensive: 'GPU-Intensive Activity',
  background_sync: 'Background Sync',
  screen_brightness: 'High Screen Brightness',
  unknown: 'Unknown Cause',
};

const causeMessages: Record<string, string> = {
  high_cpu_usage: 'High CPU activity is draining your battery rapidly. This is often caused by background processes or heavy web applications.',
  video_playing: 'Video playback is consuming significant power. Consider pausing videos or reducing quality.',
  multiple_tabs: 'Having many tabs open is consuming excessive memory and CPU resources.',
  active_downloads: 'Active downloads and network activity are draining battery faster than normal.',
  gpu_intensive: 'GPU-intensive content (high-quality video, games, or graphics) is consuming significant power.',
  background_sync: 'Background synchronization and updates are consuming power.',
  screen_brightness: 'Screen brightness may be contributing to rapid battery drain.',
  unknown: 'Battery is draining rapidly, but we couldn\'t identify a specific cause.',
};

export const IntelligentDischargeWarning = ({ 
  drainAnalysis, 
  currentDischargeRate 
}: IntelligentDischargeWarningProps) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!drainAnalysis) return null;

  const { primaryCause, secondaryCauses, confidence, specificDetails, recommendations } = drainAnalysis;

  const handleRecommendationClick = (action: string) => {
    // Provide guidance for each action
    const guidance: Record<string, string> = {
      pause_videos: 'Look for any playing videos on this page or other tabs and pause them.',
      reduce_quality: 'Click the settings icon in video players and select 480p or lower quality.',
      close_tabs: 'Close browser tabs you\'re not currently using. Right-click tabs and select "Close Other Tabs".',
      hardware_accel: 'In browser settings, search for "hardware acceleration" and ensure it\'s enabled.',
      suspend_tabs: 'Use a tab suspender extension or close tabs you don\'t need right now.',
      pause_downloads: 'Check your downloads and pause any that aren\'t urgent.',
      battery_saver: 'Enable battery saver mode in your device settings for immediate power savings.',
      reduce_brightness: 'Lower your screen brightness using function keys or system settings.',
    };

    alert(guidance[action] || 'Apply this recommendation to reduce battery drain.');
  };

  const confidenceColor = {
    high: 'bg-red-500/10 text-red-700 dark:text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  }[confidence];

  return (
    <Alert variant="destructive" className="animate-fade-in border-destructive/50">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2 flex-wrap">
        Rapid Discharge: {causeLabels[primaryCause]}
        <Badge variant="outline" className={confidenceColor}>
          {confidence} confidence
        </Badge>
        <span className="text-sm font-normal text-muted-foreground">
          ({currentDischargeRate.toFixed(1)}% per minute)
        </span>
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-3 mt-2">
          <p className="text-sm">{causeMessages[primaryCause]}</p>
          
          {/* Specific detected details */}
          {(specificDetails.playingVideos || specificDetails.cpuPressure || specificDetails.longTasks || 
            specificDetails.estimatedTabCount || specificDetails.activeDownloads) && (
            <div className="bg-destructive/10 p-3 rounded-md space-y-1">
              <div className="flex items-center gap-2 font-semibold mb-2 text-sm">
                <Info className="h-4 w-4" />
                Detected Issues:
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {specificDetails.playingVideos && (
                  <li>{specificDetails.playingVideos} video(s) currently playing</li>
                )}
                {specificDetails.cpuPressure && specificDetails.cpuPressure !== 'nominal' && (
                  <li>CPU pressure: <strong>{specificDetails.cpuPressure}</strong></li>
                )}
                {specificDetails.longTasks && specificDetails.longTasks > 10 && (
                  <li>{specificDetails.longTasks} long-running tasks detected</li>
                )}
                {specificDetails.estimatedTabCount && specificDetails.estimatedTabCount > 10 && (
                  <li>Estimated ~{specificDetails.estimatedTabCount} tabs open</li>
                )}
                {specificDetails.memoryUsageMB && (
                  <li>{specificDetails.memoryUsageMB}MB memory in use</li>
                )}
                {specificDetails.activeDownloads && specificDetails.activeDownloads > 3 && (
                  <li>{specificDetails.activeDownloads} active network requests</li>
                )}
              </ul>
              
              {secondaryCauses.length > 0 && (
                <div className="mt-2 pt-2 border-t border-destructive/20">
                  <p className="text-xs text-muted-foreground">
                    Additional factors: {secondaryCauses.map(c => causeLabels[c]).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Actionable recommendations */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recommended Actions:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec) => {
                const Icon = iconMap[rec.icon] || AlertTriangle;
                return (
                  <Button 
                    key={rec.id}
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRecommendationClick(rec.action)}
                    className="text-xs"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {rec.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Detection method info */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? '▼' : '▶'} Detection method: {drainAnalysis.detectionMethod}
          </button>
          
          {showDetails && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              This analysis uses browser APIs to detect specific causes of battery drain in real-time. 
              Detection accuracy improves with browser support for performance monitoring APIs.
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
