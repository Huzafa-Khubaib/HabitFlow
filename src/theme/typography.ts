import { TextStyle } from 'react-native';

/** Inter via @expo-google-fonts/inter — fall back to system */
const family = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const typography = {
  display: {
    fontFamily: family.bold,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.68,
  } as TextStyle,
  hero: {
    fontFamily: family.bold,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.68,
  } as TextStyle,
  h1: {
    fontFamily: family.bold,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.39,
  } as TextStyle,
  h2: {
    fontFamily: family.semiBold,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.2,
  } as TextStyle,
  h3: {
    fontFamily: family.semiBold,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.085,
  } as TextStyle,
  body: {
    fontFamily: family.regular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  bodyBold: {
    fontFamily: family.medium,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  } as TextStyle,
  bodyMd: {
    fontFamily: family.regular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontFamily: family.semiBold,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  } as TextStyle,
  labelMd: {
    fontFamily: family.semiBold,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.24,
  } as TextStyle,
  labelSm: {
    fontFamily: family.bold,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 0.44,
  } as TextStyle,
  small: {
    fontFamily: family.regular,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,
  button: {
    fontFamily: family.semiBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,
};

export { family as fontFamilies };
