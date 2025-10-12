export type DischargeCause = 
  | 'high_cpu_usage'
  | 'video_playing'
  | 'multiple_tabs'
  | 'active_downloads'
  | 'gpu_intensive'
  | 'background_sync'
  | 'screen_brightness'
  | 'unknown';

export interface DrainAnalysis {
  primaryCause: DischargeCause;
  secondaryCauses: DischargeCause[];
  confidence: 'low' | 'medium' | 'high';
  detectionMethod: string;
  specificDetails: {
    playingVideos?: number;
    longTasks?: number;
    cpuPressure?: 'nominal' | 'fair' | 'serious' | 'critical';
    memoryUsageMB?: number;
    activeDownloads?: number;
    estimatedTabCount?: number;
  };
  recommendations: Recommendation[];
  timestamp: number;
}

export interface Recommendation {
  id: string;
  label: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}

export interface BrowserCapabilities {
  computePressure: boolean;
  performanceMemory: boolean;
  mediaSession: boolean;
  performanceObserver: boolean;
  detectionLevel: 1 | 2 | 3;
}
