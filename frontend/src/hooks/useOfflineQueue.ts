import { useState, useCallback } from "react";
import { ActivityFormInput } from "../types";
import { buildActivityTimestamp } from "../utils/dateTime";

const QUEUE_KEY = "ecosense_offline_queue";

export interface QueuedEntry {
  uuid: string;
  data: ActivityFormInput;
  timestamp: ReturnType<typeof buildActivityTimestamp>;
  synced: boolean;
  retryCount: number;
  queuedAt: string; // ISO string
}

function readQueue(): QueuedEntry[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedEntry[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedEntry[]>(() => readQueue());

  const pendingCount = queue.filter((q) => !q.synced).length;

  const enqueue = useCallback((data: ActivityFormInput) => {
    const entry: QueuedEntry = {
      uuid: crypto.randomUUID(),
      data,
      timestamp: buildActivityTimestamp(),
      synced: false,
      retryCount: 0,
      queuedAt: new Date().toISOString(),
    };
    const updated = [...readQueue(), entry];
    saveQueue(updated);
    setQueue(updated);
    return entry;
  }, []);

  const markSynced = useCallback((uuid: string) => {
    const updated = readQueue().map((q) =>
      q.uuid === uuid ? { ...q, synced: true } : q
    );
    saveQueue(updated);
    setQueue(updated);
  }, []);

  const incrementRetry = useCallback((uuid: string) => {
    const updated = readQueue().map((q) =>
      q.uuid === uuid ? { ...q, retryCount: q.retryCount + 1 } : q
    );
    saveQueue(updated);
    setQueue(updated);
  }, []);

  const clearSynced = useCallback(() => {
    // Keep only unsynced entries
    const updated = readQueue().filter((q) => !q.synced);
    saveQueue(updated);
    setQueue(updated);
  }, []);

  const getPending = useCallback(() => {
    return readQueue().filter((q) => !q.synced && q.retryCount < 5);
  }, []);

  return { queue, pendingCount, enqueue, markSynced, incrementRetry, clearSynced, getPending };
}
