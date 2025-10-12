export type DeviceType = 'pc' | 'tablet' | 'phone' | 'unknown';
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';

export const detectDeviceType = (): DeviceType => {
  const ua = navigator.userAgent;
  
  // Check for tablets first (more specific)
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  // Check for mobile devices
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'phone';
  }
  
  // Desktop/laptop
  if (/Windows|Macintosh|Linux|X11/i.test(ua)) {
    return 'pc';
  }
  
  return 'unknown';
};

export const detectBrowser = (): BrowserType => {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox') && !ua.includes('Seamonkey')) {
    return 'firefox';
  }
  
  if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Chromium')) {
    return 'safari';
  }
  
  if (ua.includes('Edg')) {
    return 'edge';
  }
  
  if (ua.includes('OPR') || ua.includes('Opera')) {
    return 'opera';
  }
  
  if (ua.includes('Chrome') || ua.includes('Chromium')) {
    return 'chrome';
  }
  
  return 'unknown';
};

export const detectOS = (): string => {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows NT 10.0')) return 'Windows 10/11';
  if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (ua.includes('Windows NT 6.2')) return 'Windows 8';
  if (ua.includes('Windows NT 6.1')) return 'Windows 7';
  if (ua.includes('Windows')) return 'Windows';
  
  if (ua.includes('Mac OS X')) {
    const version = ua.match(/Mac OS X (\d+_\d+)/)?.[1]?.replace('_', '.');
    return version ? `macOS ${version}` : 'macOS';
  }
  
  if (ua.includes('Android')) {
    const version = ua.match(/Android (\d+\.?\d*)/)?.[1];
    return version ? `Android ${version}` : 'Android';
  }
  
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    const version = ua.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.');
    return version ? `iOS ${version}` : 'iOS';
  }
  
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('CrOS')) return 'Chrome OS';
  
  return 'Unknown OS';
};

export const isBatteryAPISupported = (): boolean => {
  return 'getBattery' in navigator;
};

export const getBrowserCompatibilityInfo = (browser: BrowserType) => {
  const compatibility = {
    chrome: {
      supported: true,
      message: 'Fully supported! Chrome has excellent Battery API support.',
      recommendation: null,
    },
    edge: {
      supported: true,
      message: 'Fully supported! Edge (Chromium) has excellent Battery API support.',
      recommendation: null,
    },
    opera: {
      supported: true,
      message: 'Supported! Opera has good Battery API support.',
      recommendation: null,
    },
    firefox: {
      supported: false,
      message: 'Not supported. Firefox removed Battery API support for privacy reasons.',
      recommendation: 'Switch to Chrome, Edge, or Opera for battery monitoring features.',
    },
    safari: {
      supported: false,
      message: 'Not supported. Safari does not implement the Battery API.',
      recommendation: 'Switch to Chrome, Edge, or Opera for battery monitoring features.',
    },
    unknown: {
      supported: false,
      message: 'Battery API support unknown for this browser.',
      recommendation: 'Try using Chrome, Edge, or Opera for best results.',
    },
  };
  
  return compatibility[browser];
};

export const getDeviceInfo = () => {
  const deviceType = detectDeviceType();
  const browser = detectBrowser();
  const os = detectOS();
  const batterySupported = isBatteryAPISupported();
  const browserInfo = getBrowserCompatibilityInfo(browser);
  
  return {
    deviceType,
    browser,
    os,
    batterySupported,
    browserInfo,
  };
};
