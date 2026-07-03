import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

/** Gentle vertical bob — RN equivalent of the `@keyframes bongFloat` CSS loop. */
export function Floating({
  active = true,
  distance = 6,
  duration = 2000,
  style,
  children,
}: {
  active?: boolean;
  distance?: number;
  duration?: number;
  style?: ViewStyle;
  children: React.ReactNode;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) {
      v.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, duration, v]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] });
  return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** One-shot hop — RN equivalent of `@keyframes hop`. */
export function Hop({ active = true, children, style }: { active?: boolean; children: React.ReactNode; style?: ViewStyle }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    Animated.sequence([
      Animated.timing(v, { toValue: -14, duration: 270, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: -7, duration: 135, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 135, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [active, v]);
  return <Animated.View style={[style, { transform: [{ translateY: v }] }]}>{children}</Animated.View>;
}
