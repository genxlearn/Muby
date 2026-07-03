import React from 'react';
import { View } from 'react-native';
import { Bong, Emotion, Onesie } from '../mascot/Bong';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

export function EmptyState({
  emotion = 'snug',
  onesie = 'cream',
  heading,
  helper,
  action,
}: {
  emotion?: Emotion;
  onesie?: Onesie;
  heading: string;
  helper?: string;
  action?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 6 }}>
      <Bong emotion={emotion} onesie={onesie} size={160} float />
      <Txt serif style={{ fontSize: 22, fontWeight: '600', color: colors.textPrimary, marginTop: 8, textAlign: 'center' }}>
        {heading}
      </Txt>
      {helper ? (
        <Txt style={{ fontSize: 14.5, color: colors.textSecondary, maxWidth: 240, lineHeight: 22, textAlign: 'center' }}>
          {helper}
        </Txt>
      ) : null}
      {action ? <View style={{ marginTop: 14, width: '100%' }}>{action}</View> : null}
    </View>
  );
}
