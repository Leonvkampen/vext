/** Tabs layout - defines the bottom tab navigation structure and tab icons. */
import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@frontend/navigation/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'History',
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
