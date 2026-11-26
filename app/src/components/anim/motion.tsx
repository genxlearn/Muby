/* ============================================================
   MOTION - Muby v2.1 motion system.
   Rules: every motion has a job (feedback, state, wayfinding),
   enters in 160-320ms, never loops faster than 1.6s, and turns
   off when the system "Reduce Motion" setting is on.
   Tokens are mirrored in Figma (IA page → Motion).
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

export const MOTION = {
  /** press feedback */
  press: { scale: 0.97, in: 90, out: 160 },
  /** content entering (tab switch, first load) */
  enter: { duration: 280, distance: 10, stagger: 50 },
  /** live indicators (running timer dot, breathing ring) */
  pulse: { duration: 1600 },
  /** a check / state change that deserves a small celebration */
  easeOut: Easing.bezier(0.2, 0.8, 0.2, 1),
} as const;

/* ---- Reduce Motion ---- */
let reduceCache = false;
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(reduceCache);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => { reduceCache = v; if (alive) setReduce(v); })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => { reduceCache = v; setReduce(v); });
    return () => { alive = false; sub?.remove?.(); };
  }, []);
  return reduce;
}

/** Fade + rise on mount. `index` staggers siblings; `once` skips after the first run per key. */
const seen = new Set<string>();
export function FadeInUp({
  index = 0,
  onceKey,
  distance = MOTION.enter.distance,
  duration = MOTION.enter.duration,
  style,
  children,
}: {
  index?: number;
  onceKey?: string;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const skip = reduce || (!!onceKey && seen.has(onceKey));
  const v = useRef(new Animated.Value(skip ? 1 : 0)).current;
  useEffect(() => {
    if (skip) { v.setValue(1); return; }
    const a = Animated.timing(v, {
      toValue: 1,
      duration,
      delay: index * MOTION.enter.stagger,
      easing: MOTION.easeOut,
      useNativeDriver: true,
    });
    a.start(() => { if (onceKey) seen.add(onceKey); });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] });
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** Pressable that scales down slightly while pressed (replaces opacity flicker). */
export function PressScale({
  children,
  style,
  scaleTo = MOTION.press.scale,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & { children: React.ReactNode; style?: StyleProp<ViewStyle>; scaleTo?: number }) {
  const reduce = useReducedMotion();
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number, d: number) =>
    Animated.timing(s, { toValue: v, duration: d, easing: MOTION.easeOut, useNativeDriver: true }).start();
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => { if (!reduce) to(scaleTo, MOTION.press.in); rest.onPressIn?.(e); }}
      onPressOut={(e) => { if (!reduce) to(1, MOTION.press.out); rest.onPressOut?.(e); }}
    >
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Slow breathing loop for live state (a running timer). Static when inactive or reduced. */
export function Pulse({
  active = true,
  from = 1,
  to = 1.08,
  fade = false,
  duration = MOTION.pulse.duration,
  style,
  children,
}: {
  active?: boolean;
  from?: number;
  to?: number;
  fade?: boolean;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active || reduce) { v.setValue(0); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: duration / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: duration / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, reduce, duration, v]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
  const opacity = fade ? v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] }) : 1;
  return <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>{children}</Animated.View>;
}

/** Springs from 0.6 → 1 when `show` turns true (checkmarks, badges). */
export function PopIn({ show, style, children }: { show: boolean; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const v = useRef(new Animated.Value(show ? 1 : 0)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; v.setValue(show ? 1 : 0); return; }
    if (reduce) { v.setValue(show ? 1 : 0); return; }
    if (show) {
      v.setValue(0);
      Animated.timing(v, { toValue: 1, duration: MOTION.enter.duration, easing: MOTION.easeOut, useNativeDriver: true }).start();
    } else {
      Animated.timing(v, { toValue: 0, duration: 120, useNativeDriver: true }).start();
    }
  }, [show, reduce, v]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  return <Animated.View style={[style, { opacity: v, transform: [{ scale }] }]}>{children}</Animated.View>;
}

/** Rotates its child to `deg` when `on` (FAB "+" → "×" while the sheet is open). */
export function Rotate({ on, deg = 45, style, children }: { on: boolean; deg?: number; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const v = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) { v.setValue(on ? 1 : 0); return; }
    Animated.timing(v, { toValue: on ? 1 : 0, duration: MOTION.press.out, easing: MOTION.easeOut, useNativeDriver: true }).start();
  }, [on, reduce, v]);
  const rotate = v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${deg}deg`] });
  return <Animated.View style={[style, { transform: [{ rotate }] }]}>{children}</Animated.View>;
}
