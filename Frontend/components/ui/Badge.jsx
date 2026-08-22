import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;

export default function Badge({
  label,
  variant = 'primary', // 'primary' | 'trust' | 'gov' | 'bulk' | 'success' | 'warning' | 'danger' | 'info'
  icon = null,
  size = 'md', // 'sm' | 'md'
  style,
}) {
  const getBadgeColors = () => {
    const c = COLORS || {};
    switch (variant) {
      case 'trust':
        return { bg: '#E3F2FD', text: c.trustBlue || '#1976D2', border: '#90CAF9' };
      case 'gov':
        return { bg: '#FFF8E1', text: '#9C6F16', border: c.govGold || '#C5A059' };
      case 'bulk':
      case 'bulkHarvest':
        return { bg: '#FBE9E7', text: c.terracotta || '#D84315', border: '#FFAB91' };
      case 'fertilizers':
        return { bg: '#E8F5E9', text: '#1B5E20', border: '#A5D6A7' };
      case 'bioPesticides':
        return { bg: '#E0F2F1', text: '#004D40', border: '#80CBC4' };
      case 'seeds':
        return { bg: '#F1F8E9', text: '#33691E', border: '#C5E1A5' };
      case 'equipment':
        return { bg: '#ECEFF1', text: '#263238', border: '#B0BEC5' };
      case 'success':
        return { bg: c.accentLight || '#E8F5E9', text: c.success || '#2E7D32', border: '#A5D6A7' };
      case 'warning':
        return { bg: '#FFF3E0', text: c.warning || '#F57C00', border: '#FFCC80' };
      case 'danger':
        return { bg: '#FFEBEE', text: c.danger || '#D32F2F', border: '#EF9A9A' };
      case 'info':
        return { bg: '#E1F5FE', text: c.info || '#0288D1', border: '#81D4FA' };
      default:
        return { bg: c.accentLight || '#E8F5E9', text: c.primaryDark || '#12361C', border: c.border || '#E2E8E2' };
    }
  };

  const colors = getBadgeColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? safeSpacingXs + 2 : safeSpacingSm + 2,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: colors.text, fontSize: isSm ? 10 : 12 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: safeRadiusFull,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
