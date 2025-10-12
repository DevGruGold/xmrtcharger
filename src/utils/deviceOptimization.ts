import { DeviceType } from './deviceDetection';

export interface OptimizationTip {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'power' | 'display' | 'connectivity' | 'apps' | 'hardware';
}

export const getDeviceSpecificTips = (deviceType: DeviceType): OptimizationTip[] => {
  const tips: Record<DeviceType, OptimizationTip[]> = {
    pc: [
      {
        title: 'Enable Battery Saver Mode',
        description: 'Activate Windows Battery Saver or macOS Low Power Mode to reduce background activity and extend battery life.',
        impact: 'high',
        category: 'power',
      },
      {
        title: 'Adjust Power Plan',
        description: 'Switch to "Balanced" or "Power Saver" mode in system settings for better battery efficiency.',
        impact: 'high',
        category: 'power',
      },
      {
        title: 'Optimize Screen Brightness',
        description: 'Reduce brightness to 50-70% for optimal battery life without compromising visibility.',
        impact: 'high',
        category: 'display',
      },
      {
        title: 'Close Unused Applications',
        description: 'Close browser tabs, apps, and background processes you\'re not actively using.',
        impact: 'medium',
        category: 'apps',
      },
      {
        title: 'Disconnect USB Devices',
        description: 'Remove external USB devices, mice, keyboards, or drives that draw power when not needed.',
        impact: 'medium',
        category: 'hardware',
      },
      {
        title: 'Use Dark Mode',
        description: 'Enable dark mode on OLED/AMOLED screens to reduce power consumption.',
        impact: 'low',
        category: 'display',
      },
      {
        title: 'Disable Keyboard Backlight',
        description: 'Turn off keyboard backlighting when you don\'t need it.',
        impact: 'low',
        category: 'hardware',
      },
    ],
    tablet: [
      {
        title: 'Enable Airplane Mode',
        description: 'Turn on airplane mode when not browsing to stop cellular and WiFi scanning.',
        impact: 'high',
        category: 'connectivity',
      },
      {
        title: 'Reduce Screen Brightness',
        description: 'Lower brightness to 40-60% and reduce screen timeout to 30 seconds.',
        impact: 'high',
        category: 'display',
      },
      {
        title: 'Disable Auto-Sync',
        description: 'Turn off automatic syncing for email, photos, and cloud services.',
        impact: 'medium',
        category: 'apps',
      },
      {
        title: 'Use WiFi Over Mobile Data',
        description: 'WiFi uses less power than cellular data. Connect to WiFi when available.',
        impact: 'medium',
        category: 'connectivity',
      },
      {
        title: 'Close Background Apps',
        description: 'Swipe away apps running in the background that you\'re not using.',
        impact: 'medium',
        category: 'apps',
      },
      {
        title: 'Disable Location Services',
        description: 'Turn off GPS and location services when not needed.',
        impact: 'low',
        category: 'connectivity',
      },
    ],
    phone: [
      {
        title: 'Switch to 4G/LTE',
        description: '5G drains battery faster. Use 4G when high speed isn\'t necessary.',
        impact: 'high',
        category: 'connectivity',
      },
      {
        title: 'Enable Battery Saver Mode',
        description: 'Activate adaptive battery or low power mode to limit background activity.',
        impact: 'high',
        category: 'power',
      },
      {
        title: 'Reduce Screen Brightness',
        description: 'Lower brightness and enable auto-brightness for optimal battery life.',
        impact: 'high',
        category: 'display',
      },
      {
        title: 'Limit Location Services',
        description: 'Only allow location access when apps are in use, not always.',
        impact: 'medium',
        category: 'connectivity',
      },
      {
        title: 'Disable Haptic Feedback',
        description: 'Turn off vibration for keyboard, notifications, and touch feedback.',
        impact: 'low',
        category: 'hardware',
      },
      {
        title: 'Use Dark Mode on OLED',
        description: 'OLED screens save power with dark pixels. Enable dark theme.',
        impact: 'medium',
        category: 'display',
      },
      {
        title: 'Close Background Apps',
        description: 'Force close apps running in the background.',
        impact: 'medium',
        category: 'apps',
      },
    ],
    unknown: [
      {
        title: 'Reduce Screen Brightness',
        description: 'Lower your screen brightness to save battery power.',
        impact: 'high',
        category: 'display',
      },
      {
        title: 'Close Unused Apps',
        description: 'Exit applications you\'re not actively using.',
        impact: 'medium',
        category: 'apps',
      },
      {
        title: 'Enable Power Saving Mode',
        description: 'Use your device\'s built-in power saving features.',
        impact: 'high',
        category: 'power',
      },
    ],
  };
  
  return tips[deviceType] || tips.unknown;
};

export const getChargingOptimizationTips = (deviceType: DeviceType): OptimizationTip[] => {
  const chargingTips: Record<DeviceType, OptimizationTip[]> = {
    pc: [
      {
        title: 'Use Original AC Adapter',
        description: 'Use the manufacturer\'s charger for optimal charging speed and safety.',
        impact: 'high',
        category: 'hardware',
      },
      {
        title: 'Close Resource-Intensive Apps',
        description: 'Exit games, video editors, and heavy software while charging.',
        impact: 'medium',
        category: 'apps',
      },
      {
        title: 'Enable Airplane Mode',
        description: 'Turn off WiFi and Bluetooth to speed up charging.',
        impact: 'medium',
        category: 'connectivity',
      },
    ],
    tablet: [
      {
        title: 'Use High-Wattage Charger',
        description: 'Use a 12W or higher USB charger for faster charging.',
        impact: 'high',
        category: 'hardware',
      },
      {
        title: 'Enable Airplane Mode',
        description: 'Disable all wireless connections during charging.',
        impact: 'high',
        category: 'connectivity',
      },
      {
        title: 'Reduce Screen Brightness',
        description: 'Lower brightness to minimum while charging.',
        impact: 'low',
        category: 'display',
      },
    ],
    phone: [
      {
        title: 'Use Fast Charger',
        description: 'Use USB-C PD or Quick Charge compatible adapter.',
        impact: 'high',
        category: 'hardware',
      },
      {
        title: 'Enable Airplane Mode',
        description: 'Turn off cellular and WiFi for 20-30% faster charging.',
        impact: 'high',
        category: 'connectivity',
      },
      {
        title: 'Turn Off Screen',
        description: 'Lock your phone and avoid using it while charging.',
        impact: 'medium',
        category: 'display',
      },
      {
        title: 'Remove Phone Case',
        description: 'Cases can trap heat and slow down charging. Remove during fast charging.',
        impact: 'low',
        category: 'hardware',
      },
    ],
    unknown: [
      {
        title: 'Enable Airplane Mode',
        description: 'Disable wireless connections to charge faster.',
        impact: 'high',
        category: 'connectivity',
      },
      {
        title: 'Close All Apps',
        description: 'Exit apps to reduce power consumption during charging.',
        impact: 'medium',
        category: 'apps',
      },
    ],
  };
  
  return chargingTips[deviceType] || chargingTips.unknown;
};
