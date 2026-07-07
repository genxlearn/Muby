/* ============================================================
   APP FLOW — router (Muby App Final).
   Tabs: today · leap · growth · market (floating pill nav overlays content).
   Me is a stack screen reached from the Today avatar.
   ============================================================ */
import React from 'react';
import { View } from 'react-native';
import { AppBar, BottomNav } from './components';
import { useApp } from './navigation/AppContext';
import { AuthFlow, OnboardFlow } from './screens/auth';
import { GrowthScreen, HistoryScreen, LibraryScreen, MeasureScreen } from './screens/growth';
import { LeapDetailScreen, LeapScreen } from './screens/leap';
import { MarketScreen, MeScreen, NotificationsScreen } from './screens/me';
import { EasyScreen, TodayScreen } from './screens/Today';
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
      easy: <EasyScreen />,
      me: (
        <View style={{ flex: 1 }}>
          <AppBar title="" onBack={ctx.back} />
          <MeScreen />
        </View>
      ),
      designsystem: <DesignSystemScreen />,
    };
    return <View style={{ flex: 1 }}>{stacks[route.stack] ?? <TodayScreen />}</View>;
  }

  const tabs: Record<string, React.ReactNode> = {
    today: <TodayScreen />,
    leap: <LeapScreen />,
    growth: <GrowthScreen />,
    market: <MarketScreen />,
  };
  return (
    <View style={{ flex: 1 }}>
      {tabs[route.tab] ?? <TodayScreen />}
      <BottomNav active={route.tab} onNav={(t) => ctx.setTab(t)} />
    </View>
  );
}
