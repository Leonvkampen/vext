import React from 'react';
import { View } from 'react-native';
import { config } from './config';

type GluestackUIProviderProps = {
  mode?: 'dark' | 'light';
  children: React.ReactNode;
};

export function GluestackUIProvider({ mode = 'dark', children }: GluestackUIProviderProps) {
  return (
    <View style={[{ flex: 1 }, config[mode]]} className={mode === 'dark' ? 'dark' : ''}>
      {children}
    </View>
  );
}
