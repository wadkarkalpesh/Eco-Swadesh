import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Badge from './ui/Badge';

const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBackground = (COLORS && COLORS.background) || '#F4F7F4';
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';

const COMMODITY_SERIES = [
  {
    id: 'wheat',
    name: 'Organic Sharbati Wheat',
    currentRate: '₹42,000 / Ton',
    change: '+8.4%',
    months: ['Aug', 'Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Jul'],
    dataPoints: [38, 39, 40, 41, 40, 41.5, 42],
  },
  {
    id: 'npk',
    name: 'Bio-NPK Liquid Fertilizer',
    currentRate: '₹4,200 / 20L',
    change: '-3.1%',
    months: ['Aug', 'Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Jul'],
    dataPoints: [4.5, 4.4, 4.3, 4.3, 4.2, 4.2, 4.2],
  },
  {
    id: 'rice',
    name: 'Basmati Paddy (Organic)',
    currentRate: '₹68,500 / Ton',
    change: '+12.1%',
    months: ['Aug', 'Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Jul'],
    dataPoints: [58, 60, 62, 64, 65, 67, 68.5],
  },
];

export default function CommodityTrendChart() {
  const { t } = useApp();
  const [selectedSeries, setSelectedSeries] = useState(COMMODITY_SERIES[0]);

  const maxVal = Math.max(...selectedSeries.dataPoints);
  const minVal = Math.min(...selectedSeries.dataPoints);

  return (
    <Card style={styles.card} elevation="medium">
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="trending-up-outline" size={22} color={safePrimary} />
          <Text style={styles.title}>{t('trendTitle')}</Text>
        </View>
        <Badge label={t('historicalIndex')} variant="trust" size="sm" />
      </View>

      {/* Commodity Selector Chips */}
      <View style={styles.chipRow}>
        {COMMODITY_SERIES.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSelectedSeries(s)}
            style={[styles.chip, selectedSeries.id === s.id && styles.selectedChip]}
          >
            <Text style={[styles.chipText, selectedSeries.id === s.id && styles.selectedChipText]}>
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rate Overview Row */}
      <View style={styles.rateRow}>
        <View>
          <Text style={styles.rateLabel}>{t('currentRate')}</Text>
          <Text style={styles.rateVal}>{selectedSeries.currentRate}</Text>
        </View>
        <View style={styles.changeBadge}>
          <Ionicons name="arrow-up" size={14} color={safeSuccess} />
          <Text style={styles.changeText}>{selectedSeries.change}</Text>
        </View>
      </View>

      {/* Simulated SVG/Bar Trend Graph */}
      <View style={styles.graphBox}>
        {selectedSeries.dataPoints.map((val, idx) => {
          const heightPct = Math.max(25, ((val - minVal + 1) / (maxVal - minVal + 2)) * 100);
          return (
            <View key={idx} style={styles.barCol}>
              <Text style={styles.barValText}>{val}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${heightPct}%` }]} />
              </View>
              <Text style={styles.monthText}>{selectedSeries.months[idx]}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.footerNote}>{t('indexFootnote')}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: safeSpacingSm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: safeSpacingXs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: safeTextPrimary,
    marginLeft: 6,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: safeSpacingXs,
  },
  chip: {
    paddingHorizontal: safeSpacingSm + 2,
    paddingVertical: 5,
    borderRadius: safeRadiusFull,
    backgroundColor: safeBackground,
    borderWidth: 1,
    borderColor: safeBorder,
  },
  selectedChip: {
    backgroundColor: safePrimary,
    borderColor: safePrimary,
  },
  chipText: {
    fontSize: 11,
    color: safeTextPrimary,
  },
  selectedChipText: {
    color: safeTextLight,
    fontWeight: '700',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: safeSpacingXs,
    paddingBottom: safeSpacingXs,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  rateLabel: {
    fontSize: 11,
    color: safeTextMuted,
  },
  rateVal: {
    fontSize: 18,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: safeSpacingSm,
    paddingVertical: 4,
    borderRadius: safeRadiusFull,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '800',
    color: safeSuccess,
    marginLeft: 2,
  },
  graphBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: safeSpacingSm,
    marginTop: safeSpacingXs,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    fontSize: 9,
    fontWeight: '600',
    color: safeTextMuted,
    marginBottom: 2,
  },
  barTrack: {
    width: 14,
    height: 70,
    backgroundColor: safeBackground,
    borderRadius: safeRadiusFull,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: safePrimary,
    borderRadius: safeRadiusFull,
  },
  monthText: {
    fontSize: 10,
    color: safeTextSecondary,
    marginTop: 4,
  },
  footerNote: {
    fontSize: 10,
    color: safeTextMuted,
    marginTop: safeSpacingSm,
    fontStyle: 'italic',
  },
});
