import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
};

export function Card({ children, style, padded = true }: Props) {
  const { colors, radius } = useTheme();
  return (
    <View
      style={[
        styles.card,
        shadows.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: padded ? 16 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {},
});
