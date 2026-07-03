import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import type { Toast as ToastData } from '../navigation/AppContext';

/** Top-anchored pill toast (3s). Rendered as an overlay by the app root. */
export function Toast({ toast, topInset = 0 }: { toast: ToastData | null; topInset?: number }) {
  const { colors, shadows } = useTheme();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (toast) {
      v.setValue(0);
      Animated.timing(v, { toValue: 1, duration: 300, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }).start();
    }
  }, [toast, v]);
  if (!toast) return null;
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: topInset + 10,
          alignSelf: 'center',
          maxWidth: '88%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 11,
          paddingHorizontal: 18,
          backgroundColor: colors.textPrimary,
          borderRadius: 999,
          opacity: v,
          transform: [{ translateY }],
          zIndex: 100,
        },
        shadows[4],
      ]}
    >
      <Txt style={{ fontSize: 14.5, fontWeight: '600', color: colors.bgCanvas }}>{toast.text}</Txt>
    </Animated.View>
  );
}
