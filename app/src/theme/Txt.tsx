import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { fontFamily } from './tokens';
import { useTheme } from './ThemeContext';

export interface TxtProps extends TextProps {
  /** Fraunces display serif - Peachy titles (always Regular weight). */
  serif?: boolean;
  /** Fraunces italic - Bống's voice in "Bống nhận thấy" cards. */
  italic?: boolean;
  style?: TextStyle | TextStyle[];
}

/**
 * Text wrapper that resolves the correct custom font family from a numeric
 * `fontWeight` (+ `serif`/`italic` flags), because RN can't synthesize weights
 * on a custom font - each weight is a distinct loaded family. Defaults color to
 * the themed primary text so nothing renders pure black.
 */
export function Txt({ style, serif, italic, ...rest }: TxtProps) {
  const theme = useTheme();
  const flat = (StyleSheet.flatten(style) || {}) as TextStyle;
  const { fontWeight, fontStyle, ...restStyle } = flat;
  const family = fontFamily(fontWeight, serif || italic, italic || fontStyle === 'italic');
  return (
    <Text
      {...rest}
      style={[{ color: theme.colors.textPrimary }, restStyle, { fontFamily: family }]}
    />
  );
}
