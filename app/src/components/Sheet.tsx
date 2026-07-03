import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Easing,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { Ic } from './Icon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Bottom sheet: dim backdrop + slide-up panel with grab handle. */
export function Sheet({
  open,
  onClose,
  height = '65%',
  children,
  title,
  sub,
}: {
  open: boolean;
  onClose?: () => void;
  height?: DimensionValue;
  children?: React.ReactNode;
  title?: string;
  sub?: string;
}) {
  const { colors, radii, shadows } = useTheme();
  const ty = useRef(new Animated.Value(1200)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const heightRef = useRef(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ty, {
        toValue: open ? 0 : heightRef.current || 1200,
        duration: 340,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, { toValue: open ? 1 : 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [open, ty, backdrop]);

  const onLayout = (e: LayoutChangeEvent) => {
    heightRef.current = e.nativeEvent.layout.height;
    if (!open) ty.setValue(heightRef.current);
  };

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
      <AnimatedPressable
        onPress={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,12,8,0.42)', opacity: backdrop }}
      />
      <Animated.View
        onLayout={onLayout}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height,
            maxHeight: '92%',
            backgroundColor: colors.bgElevated,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            transform: [{ translateY: ty }],
          },
          shadows[4],
        ]}
      >
        <View style={{ paddingTop: 12, paddingBottom: 4, alignItems: 'center' }}>
          <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: colors.borderDefault }} />
        </View>
        {title ? (
          <View style={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Txt serif style={{ fontSize: 21, fontWeight: '600', color: colors.textPrimary }}>{title}</Txt>
              {sub ? <Txt style={{ fontSize: 13.5, color: colors.textSecondary, marginTop: 3 }}>{sub}</Txt> : null}
            </View>
            <Pressable
              onPress={onClose}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgSunken, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ic name="close" size={18} sw={2} color={colors.textSecondary} />
            </Pressable>
          </View>
        ) : null}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
