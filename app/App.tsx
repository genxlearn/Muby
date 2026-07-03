import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFlow } from './src/AppFlow';
import { Toast } from './src/components';
import { AppProvider, useApp } from './src/navigation/AppContext';
import { Paywall } from './src/screens/me';
import { QuickLogSheet, SoothingSheet } from './src/screens/sheets';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { ThemeMode } from './src/theme/tokens';
import { useAppFonts } from './src/theme/useAppFonts';

/** The device is the phone — no fake bezel. Safe areas frame the content;
 *  sheets, paywall and toast overlay the full screen (outside the safe area). */
function Shell() {
  const { colors } = useTheme();
  const ctx = useApp();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <AppFlow />
      </SafeAreaView>
      <QuickLogSheet open={ctx.sheet === 'quicklog'} />
      <SoothingSheet open={ctx.sheet === 'soothing'} />
      <Paywall />
      <Toast toast={ctx.toastVal} topInset={insets.top} />
    </View>
  );
}

function Root() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const setThemeMode = (m: ThemeMode) => setMode(m);
  return (
    <ThemeProvider mode={mode}>
      <AppProvider themeMode={mode} setThemeMode={setThemeMode}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <Shell />
      </AppProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) {
    // Keep the canvas color while fonts load to avoid a white flash.
    return <View style={{ flex: 1, backgroundColor: '#FAF6EE' }} />;
  }
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}
