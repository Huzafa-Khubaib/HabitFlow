import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
};

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  color,
  label,
}: Props) {
  const { colors, typography } = useTheme();
  const ringColor = color ?? colors.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.progressTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[typography.h3, { color: colors.text, fontSize: size > 80 ? 20 : 14 }]}>
        {clamped}%
      </Text>
      {label ? (
        <Text style={[typography.labelSm, { color: colors.textSecondary }]}>{label}</Text>
      ) : null}
    </View>
  );
}
