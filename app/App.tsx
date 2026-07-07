import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFlow } from './src/AppFlow';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { Toast } from './src/components';
import { Bong } from './src/mascot/Bong';
import { AppProvider, Route, useApp } from './src/navigation/AppContext';
import { Paywall } from './src/screens/me';
import { QuickLogSheet, SoothingSheet } from './src/screens/sheets';
import { BabyProvider, useBaby } from './src/state/BabyContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { ThemeMode } from './src/theme/tokens';
import { useAppFonts } from './src/theme/useAppFonts';

/** Keeps ctx.intensity in sync with the intensity derived from the baby's DOB. */
function IntensitySync() {
  const ctx = useApp();
  const { state } = useBaby();
  useEffect(() => {
    ctx.setIntensity(state.todayIntensity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.todayIntensity]);
  return null;
}

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
      <IntensitySync />
      <QuickLogSheet open={ctx.sheet === 'quicklog'} />
      <SoothingSheet open={ctx.sheet === 'soothing'} />
      <Paywall />
      <Toast toast={ctx.toastVal} topInset={insets.top} />
    </View>
  );
}

function Splash() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9F4', alignItems: 'center', justifyContent: 'center' }}>
      <Bong emotion="happy" onesie="orange" size={140} float />
    </View>
  );
}

/** Waits for the persisted session + baby profile, then routes:
 *  signed-in + baby → app · signed-in only → onboarding · else → welcome. */
function Gate({ mode, setThemeMode }: { mode: ThemeMode; setThemeMode: (m: ThemeMode) => void }) {
  const auth = useAuth();
  const babyApi = useBaby();
  if (!auth.ready || (auth.session && !babyApi.ready)) return <Splash />;

  const initialRoute: Route = auth.session
    ? babyApi.baby
      ? { flow: 'app', tab: 'today', stack: null }
      : { flow: 'onboard', tab: 'today', stack: null, obStep: 'ob1' }
    : { flow: 'auth', tab: 'today', stack: null, authStep: 'A1' };

  return (
    <AppProvider themeMode={mode} setThemeMode={setThemeMode} initialRoute={initialRoute}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Shell />
    </AppProvider>
  );
}

function Root() {
  const [mode, setMode] = useState<ThemeMode>('light');
  return (
    <ThemeProvider mode={mode}>
      <AuthProvider>
        <BabyProvider>
          <Gate mode={mode} setThemeMode={setMode} />
        </BabyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) {
    // Keep the canvas color while fonts load to avoid a white flash.
    return <View style={{ flex: 1, backgroundColor: '#FFF9F4' }} />;
  }
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}
