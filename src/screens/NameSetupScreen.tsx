import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { images } from '../assets/images';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NameSetup'>;

const COMPANIONS = [
  images.companion1,
  images.companion2,
  images.companion3,
  images.companion4,
  images.companion5,
];

export function NameSetupScreen({ navigation, route }: Props) {
  const { colors, typography, spacing, radius } = useTheme();
  const { completeOnboarding } = useHabits();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(0);
  const [saving, setSaving] = useState(false);
  const goals = route.params?.goals ?? [];

  const finish = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await completeOnboarding(name.trim(), goals);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin, paddingTop: spacing.sm }}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.circleBtn, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={[styles.stepPill, { backgroundColor: colors.primaryMuted }]}>
          <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
          <Text style={[typography.labelSm, { color: colors.primary, marginLeft: 6 }]}>
            Step 2 of 2
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.readyPill, { backgroundColor: `${colors.secondary}22`, marginTop: 20 }]}>
        <Text style={{ fontSize: 14 }}>👋</Text>
        <Text style={[typography.labelMd, { color: colors.secondaryDark, marginLeft: 6 }]}>
          Almost Ready!
        </Text>
      </View>

      <Text style={[typography.h1, { color: colors.text, marginTop: 16 }]}>
        Welcome to HabitFlow!
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
        Let's personalize your daily journey. How should we call you?
      </Text>

      <View
        style={[
          styles.card,
          shadows.card,
          { backgroundColor: colors.surface, borderRadius: radius.xl, marginTop: 24 },
        ]}
      >
        <View style={styles.avatarRing}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.gradientRing}
          >
            <Image source={COMPANIONS[avatar]} style={styles.avatarInner} />
          </LinearGradient>
          <View style={[styles.camBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </View>
        <Text
          style={[
            typography.small,
            { color: colors.textMuted, textAlign: 'center', marginTop: 12 },
          ]}
        >
          Choose your companion aura
        </Text>
        <View style={styles.avatarRow}>
          {COMPANIONS.slice(0, 4).map((src, i) => (
            <Pressable
              key={i}
              onPress={() => setAvatar(i)}
              style={[
                styles.miniAvatar,
                {
                  borderColor: avatar === i ? colors.secondary : 'transparent',
                },
              ]}
            >
              <Image source={src} style={styles.miniImg} />
            </Pressable>
          ))}
          <View style={[styles.miniAvatar, { backgroundColor: colors.surfaceAlt, borderColor: 'transparent' }]}>
            <Ionicons name="add" size={20} color={colors.textMuted} />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.card,
          shadows.card,
          { backgroundColor: colors.surface, borderRadius: radius.xl, marginTop: 16, padding: 16 },
        ]}
      >
        <Text style={[typography.labelSm, { color: colors.textMuted, alignSelf: 'flex-start' }]}>
          YOUR NAME
        </Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, marginTop: 8 },
          ]}
        >
          <Ionicons name="happy-outline" size={20} color={colors.textMuted} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Alex Rivera"
            placeholderTextColor={colors.textMuted}
            style={[
              typography.bodyBold,
              { flex: 1, marginLeft: 10, color: colors.text, paddingVertical: 14 },
            ]}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={finish}
          />
          {name ? (
            <Pressable onPress={() => setName('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <LinearGradient
        colors={[`${colors.secondary}33`, colors.surface]}
        style={[styles.tip, { borderRadius: radius.lg, marginTop: 16 }]}
      >
        <View style={[styles.tipIcon, { backgroundColor: colors.secondary }]}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[typography.bodyBold, { color: colors.text }]}>
            Habit Starter Tip 🎯
          </Text>
          <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
            Start with 2 daily habits for optimal consistency. Small wins pave the path!
          </Text>
        </View>
      </LinearGradient>

      <Button
        title="Start Your Journey"
        onPress={finish}
        disabled={!name.trim()}
        loading={saving}
        iconRight="arrow-forward"
        style={{ marginTop: 28 }}
      />
      <Text
        style={[
          typography.small,
          { color: colors.textMuted, textAlign: 'center', marginTop: 12, marginBottom: 32 },
        ]}
      >
        You can fine-tune notifications & streak styles anytime.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  readyPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  card: { padding: 20, alignItems: 'center' },
  avatarRing: { position: 'relative' },
  gradientRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  camBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  miniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniImg: { width: '100%', height: '100%' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    width: '100%',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
