import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  icon,
  iconRight,
}: Props) {
  const { colors, typography } = useTheme();

  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.primarySoft
        : variant === 'danger'
          ? colors.dangerSoft
          : 'transparent';

  const textColor =
    variant === 'primary'
      ? '#FFFFFF'
      : variant === 'danger'
        ? colors.danger
        : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? shadows.fab : null,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          borderWidth: variant === 'ghost' ? 0 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? (
            <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 8 }} />
          ) : null}
          <Text style={[typography.button, { color: textColor }]}>{title}</Text>
          {iconRight ? (
            <Ionicons name={iconRight} size={18} color={textColor} style={{ marginLeft: 8 }} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
});
