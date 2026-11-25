import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Button } from './Button';

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = 'leaf-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}: Props) {
  const { colors, typography, radius } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        shadows.card,
        { backgroundColor: colors.surface, borderRadius: radius.xl },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={[typography.h3, { color: colors.text, marginTop: 16, textAlign: 'center' }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={{ marginTop: 24, minWidth: 180 }}
          iconRight="arrow-forward"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
