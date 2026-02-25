/** Timer hook - Zustand store for the rest timer countdown with auto-start. */
import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import * as timerService from '@backend/services/timerService';

interface TimerState {
  isActive: boolean;
  endTime: number | null;
  totalSeconds: number;
  remaining: number;
  notificationId: string | null;
  startTimer: (seconds: number) => Promise<void>;
  skipTimer: () => Promise<void>;
  adjustTimer: (deltaSec: number) => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isActive: false,
  endTime: null,
  totalSeconds: 0,
  remaining: 0,
  notificationId: null,

  startTimer: async (seconds) => {
    const endTime = Date.now() + seconds * 1000;
    let notificationId: string | null = null;
    try {
      notificationId = await timerService.scheduleRestTimer(seconds);
    } catch {
      // notifications may not be permitted — timer still works in-app
    }
    set({ isActive: true, endTime, totalSeconds: seconds, remaining: seconds, notificationId });
  },

  skipTimer: async () => {
    const { notificationId } = get();
    if (notificationId) {
      try { await timerService.cancelRestTimer(notificationId); } catch {}
    }
    set({ isActive: false, endTime: null, totalSeconds: 0, remaining: 0, notificationId: null });
  },

  adjustTimer: (deltaSec) => {
    const { endTime, isActive } = get();
    if (!isActive || !endTime) return;
    const newEnd = endTime + deltaSec * 1000;
    const newRemaining = Math.max(0, Math.floor((newEnd - Date.now()) / 1000));
    set({ endTime: newEnd, remaining: newRemaining });
  },

  tick: () => {
    const { endTime, isActive } = get();
    if (!isActive || !endTime) return;
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    if (remaining <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      set({ isActive: false, endTime: null, remaining: 0, notificationId: null });
    } else {
      set({ remaining });
    }
  },
}));
