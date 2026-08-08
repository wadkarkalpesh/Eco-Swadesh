import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

const safeRadiusLg = (RADIUS && RADIUS.lg) || 20;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeBorderColor = (COLORS && COLORS.border) || '#E2E8E2';

export default function Card({
  children,
  onPress,
  style,
  elevation = 'small', // 'none' | 'small' | 'medium' | 'large'
  bordered = true,
  bg = (COLORS && COLORS.card) || '#FFFFFF',
}) {
  const CardContainer = onPress ? TouchableOpacity : View;
  const shadowStyle = (elevation && elevation !== 'none' && SHADOWS && SHADOWS[elevation]) ? SHADOWS[elevation] : null;

  return (
    <CardContainer
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[
        styles.card,
        { backgroundColor: bg },
        bordered && styles.border,
        shadowStyle,
        style,
      ]}
    >
      {children}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: safeRadiusLg,
    padding: safeSpacingMd,
    marginVertical: safeSpacingXs,
  },
  border: {
    borderWidth: 1,
    borderColor: safeBorderColor,
  },
});
