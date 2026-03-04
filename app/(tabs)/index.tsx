/** Home screen - dashboard with today's stats, streaks, and weekly summary. */
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as progressService from '@backend/services/progressService';
import { useDatabase } from '@frontend/hooks/useDatabase';
import { useSettingsStore } from '@backend/store/settingsStore';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const db = useDatabase();
  const units = useSettingsStore((s) => s.units);

  const { data: todayStats } = useQuery({
    queryKey: ['todayStats'],
    queryFn: () => progressService.getTodayStats(db),
    staleTime: 30 * 1000,
  });

  const { data: streak } = useQuery({
    queryKey: ['currentStreak'],
    queryFn: () => progressService.getCurrentStreak(db),
    staleTime: 60 * 1000,
  });

  const { data: weeklyStats } = useQuery({
    queryKey: ['weeklyStats'],
    queryFn: () => progressService.getWeeklyStats(db),
    staleTime: 60 * 1000,
  });

  const volumeUnit = units === 'metric' ? 'kg' : 'lb';

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="pb-[100px]">
        {/* Greeting */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">{getGreeting()}</Text>
          <Text className="mt-1 text-sm text-foreground-muted">Let's crush it today</Text>
        </View>

        {/* Streak + Today Stats row */}
        <View className="flex-row px-4 mt-2 gap-3">
          {/* Streak */}
          <View className="flex-1 rounded-xl bg-background-50 p-4 items-center">
            <Ionicons name="flame" size={24} color="rgb(251, 146, 60)" />
            <Text className="mt-1 text-2xl font-bold text-foreground">{streak ?? 0}</Text>
            <Text className="text-xs text-foreground-muted">Day streak</Text>
          </View>

          {/* Today */}
          <View className="flex-1 rounded-xl bg-background-50 p-4 items-center">
            <Ionicons name="today-outline" size={24} color="rgb(52, 211, 153)" />
            <Text className="mt-1 text-2xl font-bold text-foreground">{todayStats?.workoutsToday ?? 0}</Text>
            <Text className="text-xs text-foreground-muted">Workouts today</Text>
          </View>

          {/* Volume today */}
          <View className="flex-1 rounded-xl bg-background-50 p-4 items-center">
            <Ionicons name="trending-up" size={24} color="rgb(52, 211, 153)" />
            <Text className="mt-1 text-lg font-bold text-foreground">
              {todayStats?.volumeToday ? Math.round(todayStats.volumeToday) : 0}
            </Text>
            <Text className="text-xs text-foreground-muted">{volumeUnit} today</Text>
          </View>
        </View>

        {/* This week stats */}
        <View className="mx-4 mt-4 rounded-xl bg-background-50 p-4">
          <Text className="text-sm font-medium text-foreground-muted mb-3">This Week</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">{weeklyStats?.workoutsThisWeek ?? 0}</Text>
              <Text className="text-xs text-foreground-muted">Workouts</Text>
            </View>
            <View className="w-px bg-background-100" />
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">
                {weeklyStats?.volumeThisWeek ? Math.round(weeklyStats.volumeThisWeek).toLocaleString() : '0'}
              </Text>
              <Text className="text-xs text-foreground-muted">Volume ({volumeUnit})</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
