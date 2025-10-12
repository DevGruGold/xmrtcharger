import { DischargeCause, DrainAnalysis, BrowserCapabilities, Recommendation } from '@/types/batteryDrain';

export class BatteryDrainAnalyzer {
  private capabilities: BrowserCapabilities;
  private cpuPressure: string = 'nominal';
  private pressureObserver: any = null;

  constructor() {
    this.capabilities = this.detectBrowserCapabilities();
    this.initializePressureObserver();
  }

  private detectBrowserCapabilities(): BrowserCapabilities {
    const capabilities = {
      computePressure: 'PressureObserver' in window,
      performanceMemory: 'memory' in performance,
      mediaSession: 'mediaSession' in navigator,
      performanceObserver: 'PerformanceObserver' in window,
      detectionLevel: 1 as 1 | 2 | 3,
    };

    // Determine detection level
    if (capabilities.computePressure && capabilities.performanceMemory) {
      capabilities.detectionLevel = 3;
    } else if (capabilities.performanceObserver && capabilities.mediaSession) {
      capabilities.detectionLevel = 2;
    }

    return capabilities;
  }

  private initializePressureObserver() {
    if (this.capabilities.computePressure) {
      try {
        // @ts-ignore - PressureObserver is experimental
        this.pressureObserver = new PressureObserver((records) => {
          const lastRecord = records[records.length - 1];
          this.cpuPressure = lastRecord.state;
        });
        // @ts-ignore
        this.pressureObserver.observe('cpu');
      } catch (error) {
        console.log('PressureObserver not available:', error);
      }
    }
  }

  public async analyzeDrain(dischargeRate: number): Promise<DrainAnalysis> {
    const causes: { cause: DischargeCause; score: number }[] = [];
    const specificDetails: DrainAnalysis['specificDetails'] = {};

    // 1. Check for playing videos
    const videoData = this.detectPlayingVideos();
    if (videoData.count > 0) {
      causes.push({ cause: 'video_playing', score: videoData.count * 0.3 });
      specificDetails.playingVideos = videoData.count;
    }

    // 2. Check CPU pressure
    if (this.capabilities.computePressure) {
      const cpuScore = this.analyzeCPUPressure();
      if (cpuScore > 0) {
        causes.push({ cause: 'high_cpu_usage', score: cpuScore });
        specificDetails.cpuPressure = this.cpuPressure as any;
      }
    }

    // 3. Check for long tasks
    const longTasksData = await this.detectLongTasks();
    if (longTasksData.count > 10) {
      causes.push({ cause: 'high_cpu_usage', score: Math.min(longTasksData.count / 100, 0.5) });
      specificDetails.longTasks = longTasksData.count;
    }

    // 4. Check memory usage (Chrome only)
    if (this.capabilities.performanceMemory) {
      const memoryData = this.analyzeMemoryUsage();
      if (memoryData.isHigh) {
        causes.push({ cause: 'multiple_tabs', score: 0.3 });
        specificDetails.memoryUsageMB = memoryData.usedMB;
        specificDetails.estimatedTabCount = memoryData.estimatedTabs;
      }
    }

    // 5. Check for active downloads/network activity
    const networkData = this.detectNetworkActivity();
    if (networkData.activeRequests > 5) {
      causes.push({ cause: 'active_downloads', score: 0.25 });
      specificDetails.activeDownloads = networkData.activeRequests;
    }

    // 6. GPU-intensive detection (inferred from high discharge + video)
    if (dischargeRate > 3 && videoData.count > 0) {
      causes.push({ cause: 'gpu_intensive', score: 0.2 });
    }

    // Determine primary and secondary causes
    causes.sort((a, b) => b.score - a.score);
    
    const primaryCause = causes.length > 0 ? causes[0].cause : 'unknown';
    const secondaryCauses = causes.slice(1, 3).map(c => c.cause);

    // Calculate confidence
    const confidence = this.calculateConfidence(causes, dischargeRate);

    // Generate recommendations
    const recommendations = this.generateRecommendations(primaryCause, secondaryCauses, specificDetails);

    return {
      primaryCause,
      secondaryCauses,
      confidence,
      detectionMethod: `Level ${this.capabilities.detectionLevel}`,
      specificDetails,
      recommendations,
      timestamp: Date.now(),
    };
  }

  private detectPlayingVideos(): { count: number; elements: HTMLMediaElement[] } {
    const videos = Array.from(document.querySelectorAll('video, audio')) as HTMLMediaElement[];
    const playing = videos.filter(v => !v.paused && !v.ended);
    return { count: playing.length, elements: playing };
  }

  private analyzeCPUPressure(): number {
    switch (this.cpuPressure) {
      case 'critical': return 0.8;
      case 'serious': return 0.6;
      case 'fair': return 0.3;
      default: return 0;
    }
  }

  private async detectLongTasks(): Promise<{ count: number }> {
    return new Promise((resolve) => {
      if (!this.capabilities.performanceObserver) {
        resolve({ count: 0 });
        return;
      }

      try {
        const longTasks: PerformanceEntry[] = [];
        const observer = new PerformanceObserver((list) => {
          longTasks.push(...list.getEntries());
        });
        
        observer.observe({ entryTypes: ['longtask'] });

        // Collect for 2 seconds then resolve
        setTimeout(() => {
          observer.disconnect();
          resolve({ count: longTasks.length });
        }, 2000);
      } catch (error) {
        resolve({ count: 0 });
      }
    });
  }

  private analyzeMemoryUsage(): { isHigh: boolean; usedMB: number; estimatedTabs: number } {
    // @ts-ignore
    const memory = performance.memory;
    if (!memory) return { isHigh: false, usedMB: 0, estimatedTabs: 0 };

    const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
    const totalMB = Math.round(memory.jsHeapSizeLimit / 1048576);
    const percentUsed = (usedMB / totalMB) * 100;

    // Rough estimation: each tab uses ~50-100MB
    const estimatedTabs = Math.ceil(usedMB / 75);

    return {
      isHigh: percentUsed > 70 || estimatedTabs > 10,
      usedMB,
      estimatedTabs,
    };
  }

  private detectNetworkActivity(): { activeRequests: number } {
    try {
      const resources = performance.getEntriesByType('resource');
      const recentResources = resources.filter(r => 
        r.startTime > performance.now() - 5000 && r.duration > 1000
      );
      return { activeRequests: recentResources.length };
    } catch (error) {
      return { activeRequests: 0 };
    }
  }

  private calculateConfidence(causes: { cause: DischargeCause; score: number }[], dischargeRate: number): 'low' | 'medium' | 'high' {
    if (causes.length === 0) return 'low';

    const topScore = causes[0].score;
    const hasMultipleCauses = causes.length > 2;
    const isExtremeDischarge = dischargeRate > 4;

    if (topScore > 0.5 && this.capabilities.detectionLevel >= 2) return 'high';
    if (topScore > 0.3 || hasMultipleCauses || isExtremeDischarge) return 'medium';
    return 'low';
  }

  private generateRecommendations(
    primaryCause: DischargeCause,
    secondaryCauses: DischargeCause[],
    details: DrainAnalysis['specificDetails']
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (primaryCause === 'video_playing' || secondaryCauses.includes('video_playing')) {
      recommendations.push({
        id: 'pause_video',
        label: 'Pause videos',
        action: 'pause_videos',
        impact: 'high',
        icon: 'Pause',
      });
      recommendations.push({
        id: 'reduce_quality',
        label: 'Reduce video quality to 480p',
        action: 'reduce_quality',
        impact: 'medium',
        icon: 'Settings',
      });
    }

    if (primaryCause === 'high_cpu_usage' || details.cpuPressure === 'critical' || details.cpuPressure === 'serious') {
      recommendations.push({
        id: 'close_tabs',
        label: `Close background tabs${details.estimatedTabCount ? ` (~${details.estimatedTabCount} detected)` : ''}`,
        action: 'close_tabs',
        impact: 'high',
        icon: 'X',
      });
      recommendations.push({
        id: 'hardware_accel',
        label: 'Check hardware acceleration',
        action: 'hardware_accel',
        impact: 'medium',
        icon: 'Cpu',
      });
    }

    if (primaryCause === 'multiple_tabs' || details.estimatedTabCount && details.estimatedTabCount > 10) {
      recommendations.push({
        id: 'suspend_tabs',
        label: 'Suspend inactive tabs',
        action: 'suspend_tabs',
        impact: 'high',
        icon: 'Archive',
      });
    }

    if (primaryCause === 'active_downloads' || details.activeDownloads && details.activeDownloads > 3) {
      recommendations.push({
        id: 'pause_downloads',
        label: 'Pause active downloads',
        action: 'pause_downloads',
        impact: 'high',
        icon: 'Download',
      });
    }

    // Universal recommendations
    recommendations.push({
      id: 'battery_saver',
      label: 'Enable battery saver mode',
      action: 'battery_saver',
      impact: 'medium',
      icon: 'Battery',
    });

    recommendations.push({
      id: 'reduce_brightness',
      label: 'Reduce screen brightness',
      action: 'reduce_brightness',
      impact: 'medium',
      icon: 'Sun',
    });

    return recommendations.slice(0, 4); // Return top 4 recommendations
  }

  public cleanup() {
    if (this.pressureObserver) {
      try {
        this.pressureObserver.disconnect();
      } catch (error) {
        console.log('Error disconnecting PressureObserver:', error);
      }
    }
  }
}

// Singleton instance
let analyzerInstance: BatteryDrainAnalyzer | null = null;

export const getBatteryDrainAnalyzer = (): BatteryDrainAnalyzer => {
  if (!analyzerInstance) {
    analyzerInstance = new BatteryDrainAnalyzer();
  }
  return analyzerInstance;
};
