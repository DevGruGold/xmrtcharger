import { ChargingSession } from '@/types/battery';

const STORAGE_KEY = 'xmrt_charging_history';
const MAX_SESSIONS = 50;

export const saveChargingSession = (session: ChargingSession): void => {
  const history = getChargingHistory();
  history.push(session);
  
  // Keep only the most recent sessions
  const trimmedHistory = history.slice(-MAX_SESSIONS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
};

export const getChargingHistory = (): ChargingSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading charging history:', error);
    return [];
  }
};

export const clearChargingHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getRecentSessions = (count: number = 10): ChargingSession[] => {
  const history = getChargingHistory();
  return history.slice(-count);
};

export const calculateTotalChargingSessions = (): number => {
  return getChargingHistory().length;
};

export const getChargingStreak = (): number => {
  const history = getChargingHistory();
  if (history.length === 0) return 0;
  
  let streak = 0;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  for (let i = history.length - 1; i >= 0; i--) {
    const daysDiff = Math.floor((now - history[i].timestamp) / oneDayMs);
    if (daysDiff <= streak + 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
