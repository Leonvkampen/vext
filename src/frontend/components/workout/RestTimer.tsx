import React, { useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useTimerStore } from '@frontend/hooks/useTimer';
import { formatTimerDisplay } from '@shared/utils/formatting';

export function RestTimer() {
  const { isActive, remaining, totalSeconds, skipTimer, adjustTimer, tick } = useTimerStore();

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isActive, tick]);

  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;

  return (
    <Modal visible={isActive} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/70">
        <View className="w-72 rounded-2xl bg-background-50 p-6 items-center">
          <Text className="text-sm font-medium text-foreground-muted mb-4">Rest Timer</Text>

          {/* Countdown display */}
          <View
            className="w-36 h-36 rounded-full border-4 border-background-100 items-center justify-center mb-4"
            style={{ borderColor: `rgba(52, 211, 153, ${0.2 + progress * 0.8})` }}
          >
            <Text className="text-4xl font-bold text-foreground">
              {formatTimerDisplay(remaining)}
            </Text>
          </View>

          {/* Adjust buttons */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={() => adjustTimer(-30)}
              className="rounded-lg border border-background-100 px-4 py-2"
            >
              <Text className="text-sm text-foreground-muted">-30s</Text>
            </Pressable>
            <Pressable
              onPress={() => adjustTimer(30)}
              className="rounded-lg border border-background-100 px-4 py-2"
            >
              <Text className="text-sm text-foreground-muted">+30s</Text>
            </Pressable>
          </View>

          {/* Skip button */}
          <Pressable
            onPress={skipTimer}
            className="rounded-xl bg-primary px-8 py-3"
          >
            <Text className="text-sm font-semibold text-background">Skip Rest</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
