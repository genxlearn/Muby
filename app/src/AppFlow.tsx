/* ============================================================
   APP FLOW - router (Muby v3).
   Tabs: today · leap · growth · community, Ghi nhanh FAB on the right (MVP v2.1).
   Mama opens as a stack screen from the avatar on each tab.
   ============================================================ */
import React from 'react';
import { View } from 'react-native';
import { AppBar, BottomNav } from './components';
import { useApp } from './navigation/AppContext';
import { AuthFlow, OnboardFlow } from './screens/auth';
import { GrowthScreen, HistoryScreen, LibraryScreen, MeasureScreen } from './screens/growth';
import { LeapDetailScreen, LeapScreen } from './screens/leap';
import { MeScreen, NotificationsScreen } from './screens/me';
import { EasyScreen, TodayScreen } from './screens/Today';
import { DesignSystemScreen } from './screens/DesignSystem';
import { FeedTimerScreen, SleepTimerScreen } from './screens/care';
import { CommunityScreen } from './screens/community';

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
      feedtimer: <FeedTimerScreen />,
      sleeptimer: <SleepTimerScreen />,
    };
    return <View style={{ flex: 1 }}>{stacks[route.stack] ?? <TodayScreen />}</View>;
  }

  const tabs: Record<string, React.ReactNode> = {
    today: <TodayScreen />,
    leap: <LeapScreen />,
    growth: <GrowthScreen />,
    community: <CommunityScreen />,
  };
  return (
    <View style={{ flex: 1 }}>
      {tabs[route.tab] ?? <TodayScreen />}
      <BottomNav active={route.tab} onNav={(t) => ctx.setTab(t)} onFab={() => ctx.openSheet('quicklog')} />
    </View>
  );
}
