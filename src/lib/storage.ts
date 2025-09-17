// src/lib/storage.ts
// Small helper around AsyncStorage for stamps, queue, and simple processQueue() stub.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location } from './locations';

const STAMPS_KEY = '@mysuru:stamps'; // saved array of location ids the user collected
const QUEUE_KEY = '@mysuru:queue';   // queued check-ins {locationId, token, timestamp, status}

export type QueuedCheckin = {
  id: string; // uuid or generated - using timestamp-based key for prototype
  locationId: string;
  token?: string;
  ts: number;
  status: 'queued' | 'synced' | 'failed';
};

export async function getCollectedStamps(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STAMPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('getCollectedStamps err', err);
    return [];
  }
}

export async function addCollectedStamp(locationId: string): Promise<void> {
  const stamps = await getCollectedStamps();
  if (!stamps.includes(locationId)) {
    stamps.push(locationId);
    await AsyncStorage.setItem(STAMPS_KEY, JSON.stringify(stamps));
  }
}

export async function hasStamp(locationId: string): Promise<boolean> {
  const stamps = await getCollectedStamps();
  return stamps.includes(locationId);
}

export async function getQueue(): Promise<QueuedCheckin[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('getQueue err', err);
    return [];
  }
}

export async function enqueueCheckin(locationId: string, token?: string): Promise<QueuedCheckin> {
  const queue = await getQueue();
  const item: QueuedCheckin = {
    id: `q_${Date.now()}`,
    locationId,
    token,
    ts: Date.now(),
    status: 'queued',
  };
  queue.push(item);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return item;
}

export async function updateQueueItemStatus(id: string, status: 'queued' | 'synced' | 'failed'): Promise<void> {
  const queue = await getQueue();
  const idx = queue.findIndex((q) => q.id === id);
  if (idx >= 0) {
    queue[idx].status = status;
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}

// Simple processQueue: in a real app, call server endpoints and handle failures / auth.
// For prototype we simply mark items as synced after a tiny wait to simulate network.
export async function processQueue(): Promise<{ success: number; failed: number }> {
  const queue = await getQueue();
  let success = 0;
  let failed = 0;
  for (const item of queue) {
    if (item.status === 'synced') {
      continue;
    }
    try {
      // Simulate API call:
      await new Promise((res) => setTimeout(res, 500));
      // Mark as synced
      await updateQueueItemStatus(item.id, 'synced');
      success++;
    } catch (err) {
      console.warn('processQueue item failed', err);
      await updateQueueItemStatus(item.id, 'failed');
      failed++;
    }
  }
  return { success, failed };
}
