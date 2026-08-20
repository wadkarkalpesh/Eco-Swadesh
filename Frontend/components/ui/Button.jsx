import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingLg = (SPACING && SPACING.lg) || 24;
const safeSpacingXl = (SPACING && SPACING.xl) || 32;

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'terracotta'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) {
  const getBackgroundColor = () => {
    if (disabled) return '#C5D0C5';
    switch (variant) {
      case 'primary':
        return (COLORS && COLORS.primary) || '#1E4D2B';
      case 'secondary':
        return (COLORS && COLORS.primaryLight) || '#2E7D32';
      case 'terracotta':
        return (COLORS && COLORS.terracotta) || '#D84315';
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return (COLORS && COLORS.danger) || '#D32F2F';
      default:
        return (COLORS && COLORS.primary) || '#1E4D2B';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#7A8E7C';
    switch (variant) {
      case 'outline':
        return (COLORS && COLORS.primary) || '#1E4D2B';
      case 'ghost':
        return (COLORS && COLORS.primaryDark) || '#12361C';
      default:
        return (COLORS && COLORS.textLight) || '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: safeSpacingXs + 2, paddingHorizontal: safeSpacingMd };
      case 'lg':
        return { paddingVertical: safeSpacingMd, paddingHorizontal: safeSpacingXl };
      default:
        return { paddingVertical: safeSpacingSm + 4, paddingHorizontal: safeSpacingLg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 13;
      case 'lg':
        return 16;
      default:
        return 14;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        getPadding(),
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && { borderWidth: 1.5, borderColor: (COLORS && COLORS.primary) || '#1E4D2B' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getFontSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: safeRadiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: safeSpacingXs + 2,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
