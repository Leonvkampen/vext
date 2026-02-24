import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as progressService from '@backend/services/progressService';
import * as workoutService from '@backend/services/workoutService';
import { useDatabase } from '@frontend/hooks/useDatabase';
import { WorkoutCard } from '@frontend/components/workout/WorkoutCard';
import { useSettingsStore } from '@backend/store/settingsStore';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const db = useDatabase();
  const router = useRouter();
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

  const { data: recentWorkouts } = useQuery({
    queryKey: ['recentWorkouts'],
    queryFn: () => workoutService.getWorkoutSummaries(db, 3, 0),
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

        {/* Recent workouts */}
        <View className="px-4 mt-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-foreground-muted">Recent Workouts</Text>
            {(recentWorkouts?.length ?? 0) > 0 && (
              <Pressable onPress={() => router.push('/(tabs)/workouts')}>
                <Text className="text-xs text-primary">See all</Text>
              </Pressable>
            )}
          </View>

          {recentWorkouts && recentWorkouts.length > 0 ? (
            recentWorkouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} onPress={() => router.push('/(tabs)/workouts')} />
            ))
          ) : (
            <View className="rounded-xl bg-background-50 p-6 items-center">
              <Ionicons name="fitness-outline" size={40} color="rgb(115, 115, 115)" />
              <Text className="mt-3 text-base font-semibold text-foreground">Ready to start?</Text>
              <Text className="mt-1 text-sm text-foreground-muted text-center">
                Tap the + button below to begin your first workout
              </Text>
              <Pressable
                onPress={() => router.push('/workout/new')}
                className="mt-4 rounded-lg bg-primary px-6 py-3"
              >
                <Text className="font-semibold text-background">Start Workout</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
