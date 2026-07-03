/* ============================================================
   APP FLOW — router ported from app-clean.jsx AppFlow.
   Immersive: Auth → Onboarding → App (tabs + stacks + sheets).
   ============================================================ */
import React from 'react';
import { View } from 'react-native';
import { BottomNav } from './components';
import { useApp } from './navigation/AppContext';
import { AuthFlow, OnboardFlow } from './screens/auth';
import { GrowthScreen, HistoryScreen, LibraryScreen, MeasureScreen } from './screens/growth';
import { LeapDetailScreen, LeapScreen } from './screens/leap';
import { MeScreen, NotificationsScreen } from './screens/me';
import { TodayScreen } from './screens/Today';
import { DesignSystemScreen } from './screens/DesignSystem';

export function AppFlow() {
  const ctx = useApp();
  const { route } = ctx;

  if (route.flow === 'auth') return <AuthFlow />;
  if (route.flow === 'onboard') return <OnboardFlow />;

  if (route.stack) {
    const stacks: Record<string, React.ReactNode> = {
      leapdetail: <LeapDetailScreen />,
      measure: <MeasureScreen />,
      history: <HistoryScreen />,
      library: <LibraryScreen />,
      notifications: <NotificationsScreen />,
      designsystem: <DesignSystemScreen />,
    };
    return <View style={{ flex: 1 }}>{stacks[route.stack] ?? <TodayScreen />}</View>;
  }

  const tabs: Record<string, React.ReactNode> = {
    today: <TodayScreen />,
    leap: <LeapScreen />,
    growth: <GrowthScreen />,
    me: <MeScreen />,
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{tabs[route.tab] ?? <TodayScreen />}</View>
      <BottomNav active={route.tab} onNav={(t) => ctx.setTab(t)} onFab={() => ctx.openSheet('quicklog')} />
    </View>
  );
}
