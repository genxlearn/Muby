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
  size = 'md',
}: {
  emotion?: Emotion;
  onesie?: Onesie;
  heading: string;
  helper?: string;
  action?: React.ReactNode;
  /** 'sm' — compact variant for use inside cards/sections. */
  size?: 'md' | 'sm';
}) {
  const { colors } = useTheme();
  const sm = size === 'sm';
  return (
    <View style={{ alignItems: 'center', paddingVertical: sm ? 18 : 40, paddingHorizontal: sm ? 16 : 24, gap: 6 }}>
      <Bong emotion={emotion} onesie={onesie} size={sm ? 96 : 160} float={!sm} />
      <Txt serif style={{ fontSize: sm ? 17 : 22, fontWeight: '600', color: colors.textPrimary, marginTop: 8, textAlign: 'center' }}>
        {heading}
      </Txt>
      {helper ? (
        <Txt style={{ fontSize: sm ? 13.5 : 14.5, color: colors.textSecondary, maxWidth: 260, lineHeight: sm ? 20 : 22, textAlign: 'center' }}>
          {helper}
        </Txt>
      ) : null}
      {action ? <View style={{ marginTop: sm ? 10 : 14, width: '100%' }}>{action}</View> : null}
    </View>
  );
}
