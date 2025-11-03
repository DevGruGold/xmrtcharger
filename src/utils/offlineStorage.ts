/**
 * Offline Storage Manager using IndexedDB
 * Provides persistent local storage for offline functionality
 */

import { ChargingSession } from '@/types/battery';

const DB_NAME = 'xmrt_offline_db';
const DB_VERSION = 1;

interface BatteryReading {
  id: string;
  deviceId: string;
  sessionId: string;
  timestamp: number;
  level: number;
  charging: boolean;
  chargingSpeed?: string;
  metadata?: any;
}

interface DeviceState {
  deviceId: string;
  sessionId: string;
  sessionKey: string;
  fingerprint: string;
  lastSync: number;
  isConnected: boolean;
}

interface RewardClaim {
  id: string;
  deviceId: string;
  timestamp: number;
  estimatedAmount: number;
  synced: boolean;
}

interface MiningStats {
  workerId: string;
  hashrate: number;
  shares: number;
  lastUpdate: number;
}

interface SyncQueueItem {
  id: string;
  type: 'battery' | 'reward' | 'session' | 'activity';
  data: any;
  timestamp: number;
  retries: number;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Battery readings store
        if (!db.objectStoreNames.contains('batteryReadings')) {
          const batteryStore = db.createObjectStore('batteryReadings', { keyPath: 'id' });
          batteryStore.createIndex('timestamp', 'timestamp', { unique: false });
          batteryStore.createIndex('deviceId', 'deviceId', { unique: false });
        }

        // Charging sessions store
        if (!db.objectStoreNames.contains('chargingSessions')) {
          const sessionsStore = db.createObjectStore('chargingSessions', { keyPath: 'id' });
          sessionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Device state store
        if (!db.objectStoreNames.contains('deviceState')) {
          db.createObjectStore('deviceState', { keyPath: 'deviceId' });
        }

        // Reward claims store
        if (!db.objectStoreNames.contains('rewardClaims')) {
          const rewardsStore = db.createObjectStore('rewardClaims', { keyPath: 'id' });
          rewardsStore.createIndex('synced', 'synced', { unique: false });
        }

        // Mining stats store
        if (!db.objectStoreNames.contains('miningStats')) {
          db.createObjectStore('miningStats', { keyPath: 'workerId' });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  // Battery Readings
  async saveBatteryReading(reading: Omit<BatteryReading, 'id'>): Promise<void> {
    const db = this.ensureDB();
    const id = `${reading.deviceId}-${reading.timestamp}`;
    const transaction = db.transaction(['batteryReadings'], 'readwrite');
    const store = transaction.objectStore('batteryReadings');
    await store.put({ ...reading, id });
  }

  async getBatteryReadings(deviceId: string, limit = 50): Promise<BatteryReading[]> {
    const db = this.ensureDB();
    const transaction = db.transaction(['batteryReadings'], 'readonly');
    const store = transaction.objectStore('batteryReadings');
    const index = store.index('deviceId');
    const readings: BatteryReading[] = [];

    return new Promise((resolve) => {
      const request = index.openCursor(IDBKeyRange.only(deviceId), 'prev');
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && readings.length < limit) {
          readings.push(cursor.value);
          cursor.continue();
        } else {
          resolve(readings);
        }
      };
    });
  }

  // Charging Sessions
  async saveChargingSession(session: ChargingSession & { id: string }): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['chargingSessions'], 'readwrite');
    const store = transaction.objectStore('chargingSessions');
    await store.put(session);
  }

  async getChargingSessions(limit = 30): Promise<ChargingSession[]> {
    const db = this.ensureDB();
    const transaction = db.transaction(['chargingSessions'], 'readonly');
    const store = transaction.objectStore('chargingSessions');
    const index = store.index('timestamp');
    const sessions: ChargingSession[] = [];

    return new Promise((resolve) => {
      const request = index.openCursor(null, 'prev');
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && sessions.length < limit) {
          sessions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(sessions);
        }
      };
    });
  }

  // Device State
  async saveDeviceState(state: DeviceState): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['deviceState'], 'readwrite');
    const store = transaction.objectStore('deviceState');
    await store.put(state);
  }

  async getDeviceState(deviceId: string): Promise<DeviceState | null> {
    const db = this.ensureDB();
    const transaction = db.transaction(['deviceState'], 'readonly');
    const store = transaction.objectStore('deviceState');
    return new Promise((resolve) => {
      const request = store.get(deviceId);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  // Reward Claims
  async queueRewardClaim(claim: Omit<RewardClaim, 'id' | 'synced'>): Promise<void> {
    const db = this.ensureDB();
    const id = `reward-${claim.deviceId}-${claim.timestamp}`;
    const transaction = db.transaction(['rewardClaims'], 'readwrite');
    const store = transaction.objectStore('rewardClaims');
    await store.put({ ...claim, id, synced: false });
  }

  async getPendingRewardClaims(): Promise<RewardClaim[]> {
    const db = this.ensureDB();
    const transaction = db.transaction(['rewardClaims'], 'readonly');
    const store = transaction.objectStore('rewardClaims');
    const index = store.index('synced');
    const claims: RewardClaim[] = [];

    return new Promise((resolve) => {
      const request = index.openCursor(IDBKeyRange.only(false));
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          claims.push(cursor.value);
          cursor.continue();
        } else {
          resolve(claims);
        }
      };
    });
  }

  async markRewardClaimSynced(id: string): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['rewardClaims'], 'readwrite');
    const store = transaction.objectStore('rewardClaims');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const claim = request.result;
        if (claim) {
          claim.synced = true;
          const putRequest = store.put(claim);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Mining Stats
  async saveMiningStats(stats: MiningStats): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['miningStats'], 'readwrite');
    const store = transaction.objectStore('miningStats');
    await store.put(stats);
  }

  async getMiningStats(workerId: string): Promise<MiningStats | null> {
    const db = this.ensureDB();
    const transaction = db.transaction(['miningStats'], 'readonly');
    const store = transaction.objectStore('miningStats');
    return new Promise((resolve) => {
      const request = store.get(workerId);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  // Sync Queue
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    const db = this.ensureDB();
    const id = `sync-${item.type}-${Date.now()}-${Math.random()}`;
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.put({ ...item, id, timestamp: Date.now(), retries: 0 });
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const db = this.ensureDB();
    const transaction = db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const index = store.index('timestamp');
    const items: SyncQueueItem[] = [];

    return new Promise((resolve) => {
      const request = index.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          resolve(items);
        }
      };
    });
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.delete(id);
  }

  async incrementSyncRetry(id: string): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          item.retries += 1;
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Cleanup old data
  async pruneOldData(daysToKeep = 30): Promise<void> {
    const db = this.ensureDB();
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    // Clean old battery readings
    const batteryTx = db.transaction(['batteryReadings'], 'readwrite');
    const batteryStore = batteryTx.objectStore('batteryReadings');
    const batteryIndex = batteryStore.index('timestamp');
    const batteryRange = IDBKeyRange.upperBound(cutoffTime);
    
    return new Promise((resolve, reject) => {
      const request = batteryIndex.openCursor(batteryRange);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorage();
