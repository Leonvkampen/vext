/** Root layout - wraps the app with providers (GestureHandler, QueryClient, Database, SafeArea). */
import '../global.css';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@frontend/components/ui/gluestack-ui-provider';
import { DatabaseProvider, useDatabaseStatus } from '@frontend/hooks/useDatabase';
import { queryClient } from '@frontend/lib/queryClient';
import { useSettingsStore } from '@backend/store/settingsStore';
import * as workoutService from '@backend/services/workoutService';
import { ConfirmDialog } from '@frontend/components/overlay/ConfirmDialog';
import { ErrorBoundary } from '@frontend/components/ErrorBoundary';
import { formatRelativeTime } from '@shared/utils/formatting';

function AppInitializer({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { db, isReady, error } = useDatabaseStatus();
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const isLoaded = useSettingsStore((s) => s.isLoaded);
  const router = useRouter();
  const [resumeWorkoutId, setResumeWorkoutId] = useState<string | null>(null);
  const [resumeStartedAt, setResumeStartedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !isReady) return;
    if (!isLoaded) loadSettings(db);
  }, [db, isReady, isLoaded, loadSettings]);

  useEffect(() => {
    if (!db || !isReady) return;
    workoutService.getActiveWorkout(db).then((active) => {
      if (active) {
        setResumeWorkoutId(active.id);
        setResumeStartedAt(active.startedAt);
      }
    });
  }, [db, isReady]);

  const handleResume = () => {
    if (resumeWorkoutId) {
      router.push(`/workout/${resumeWorkoutId}`);
    }
    setResumeWorkoutId(null);
  };

  const handleDiscard = async () => {
    if (db && resumeWorkoutId) {
      await workoutService.discardWorkout(db, resumeWorkoutId);
    }
    setResumeWorkoutId(null);
  };

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="rgb(52, 211, 153)" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-lg font-semibold mb-2 text-red-500">Database Error</Text>
        <Text className="text-sm text-center text-foreground-muted">{error}</Text>
      </View>
    );
  }

  return (
    <>
      {children}
      <ConfirmDialog
        visible={!!resumeWorkoutId}
        title="Resume Workout?"
        message={`You have an active workout${resumeStartedAt ? ` from ${formatRelativeTime(resumeStartedAt)}` : ''}. Would you like to resume or discard it?`}
        confirmLabel="Resume"
        cancelLabel="Discard"
        onConfirm={handleResume}
        onCancel={handleDiscard}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1">
          <QueryClientProvider client={queryClient}>
            <DatabaseProvider>
              <ErrorBoundary>
                <AppInitializer>
                  <SafeAreaView className="flex-1 bg-background">
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'rgb(10, 10, 15)' },
                        animation: 'slide_from_right',
                      }}
                    />
                  </SafeAreaView>
                </AppInitializer>
              </ErrorBoundary>
              <StatusBar style="light" />
            </DatabaseProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
