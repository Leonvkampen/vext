import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutCard } from '@frontend/components/workout/WorkoutCard';
import { EmptyState } from '@frontend/components/EmptyState';
import { useWorkoutHistory } from '@frontend/hooks/useHistory';
import { useRepeatWorkout } from '@frontend/hooks/useWorkout';
import { cn } from '@frontend/lib/utils';

export default function RepeatWorkoutScreen() {
  const router = useRouter();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useWorkoutHistory();
  const repeatWorkout = useRepeatWorkout();

  const workouts = data?.pages.flatMap((page) => page) ?? [];

  const handleRepeat = async (workoutId: string) => {
    try {
      const newWorkout = await repeatWorkout.mutateAsync(workoutId);
      router.replace(`/workout/${newWorkout.id}`);
    } catch {
      // error toast handled by mutation
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={24} color="rgb(250, 250, 250)" />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Repeat Past Workout</Text>
      </View>

      <Text className="px-4 mb-3 text-sm text-foreground-muted">
        Choose a completed workout to repeat its exercises
      </Text>

      {repeatWorkout.isPending && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-background/80">
          <ActivityIndicator size="large" color="rgb(52, 211, 153)" />
          <Text className="mt-3 text-sm text-foreground-muted">Creating workout...</Text>
        </View>
      )}

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerClassName={cn(workouts.length === 0 ? 'flex-1' : 'pb-[100px]')}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="rgb(52, 211, 153)" />
            </View>
          ) : (
            <EmptyState
              icon="fitness-outline"
              title="No completed workouts"
              message="Complete a workout first to repeat it later"
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator color="rgb(52, 211, 153)" />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => handleRepeat(item.id)}
          />
        )}
      />
    </View>
  );
}
