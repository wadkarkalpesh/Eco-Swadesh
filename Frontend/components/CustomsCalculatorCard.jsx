import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const safeEarth = (COLORS && COLORS.earth) || '#5D4037';
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';

const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingMd = (SPACING && SPACING.md) || 16;

const MARKETS = [
  { id: 'us', name: 'North America (USDA)', dutyPct: 0, containerFreight: 3800, phytosanitaryFee: 150 },
  { id: 'eu', name: 'European Union (EU Organic)', dutyPct: 2.5, containerFreight: 4200, phytosanitaryFee: 200 },
  { id: 'me', name: 'Middle East (GCC Norms)', dutyPct: 0, containerFreight: 2100, phytosanitaryFee: 100 },
  { id: 'aus', name: 'Australia (DAFF Organic)', dutyPct: 3.0, containerFreight: 4500, phytosanitaryFee: 250 },
];

export default function CustomsCalculatorCard() {
  const { t } = useApp();
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);

  const cargoValueUSD = 25000;
  const dutyCostUSD = (cargoValueUSD * selectedMarket.dutyPct) / 100;
  const totalExportCostUSD = cargoValueUSD + dutyCostUSD + selectedMarket.containerFreight + selectedMarket.phytosanitaryFee;

  return (
    <Card bg="#FFF8E1" style={styles.card} elevation="medium">
      <View style={styles.header}>
        <Ionicons name="airplane-outline" size={24} color={safeGovGold} />
        <View style={{ marginLeft: safeSpacingXs, flex: 1 }}>
          <Text style={styles.title}>{t('customsTitle')}</Text>
          <Text style={styles.sub}>{t('customsSub')}</Text>
        </View>
        <Badge label="EXPORT PASS" variant="gov" size="sm" />
      </View>

      {/* Target Market Selector */}
      <Text style={styles.label}>{t('selectTargetMarket')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {MARKETS.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelectedMarket(m)}
            style={[styles.chip, selectedMarket.id === m.id && styles.selectedChip]}
          >
            <Text style={[styles.chipText, selectedMarket.id === m.id && styles.selectedChipText]}>
              {m.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Calculations Breakdown Box */}
      <View style={styles.calcBox}>
        <Text style={styles.calcHeading}>Estimated Export Line Items (20 Ton Container):</Text>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>{t('baseHarvestVal')}</Text>
          <Text style={styles.calcVal}>${cargoValueUSD.toLocaleString()}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>{t('phytosanitarySeal')}</Text>
          <Text style={styles.calcVal}>${selectedMarket.phytosanitaryFee}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>{t('oceanFreight')}</Text>
          <Text style={styles.calcVal}>${selectedMarket.containerFreight.toLocaleString()}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>{t('destTariffDuty')} ({selectedMarket.dutyPct}%):</Text>
          <Text style={styles.calcVal}>${dutyCostUSD.toLocaleString()}</Text>
        </View>

        <View style={[styles.calcRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>{t('landedTotal')}</Text>
          <Text style={styles.totalVal}>${totalExportCostUSD.toLocaleString()}</Text>
        </View>

        <Button
          title={t('generateCustomsDec')}
          variant="terracotta"
          size="sm"
          onPress={() => {}}
          style={{ marginTop: safeSpacingSm }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#FFE082',
    marginVertical: safeSpacingSm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: safeSpacingXs,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: safeEarth,
  },
  sub: {
    fontSize: 11,
    color: safeTextSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextSecondary,
    marginTop: safeSpacingXs,
    marginBottom: 4,
  },
  chipScroll: {
    marginBottom: safeSpacingXs,
  },
  chip: {
    paddingHorizontal: safeSpacingSm + 2,
    paddingVertical: 6,
    borderRadius: safeRadiusFull,
    backgroundColor: safeCard,
    borderWidth: 1,
    borderColor: safeBorder,
    marginRight: 6,
  },
  selectedChip: {
    backgroundColor: safeGovGold,
    borderColor: safeGovGold,
  },
  chipText: {
    fontSize: 12,
    color: safeTextPrimary,
  },
  selectedChipText: {
    color: safeTextLight,
    fontWeight: '700',
  },
  calcBox: {
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd,
    marginTop: safeSpacingXs,
    borderWidth: 1,
    borderColor: safeBorder,
  },
  calcHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: safeEarth,
    marginBottom: safeSpacingXs,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  calcLabel: {
    fontSize: 11,
    color: safeTextSecondary,
  },
  calcVal: {
    fontSize: 11,
    fontWeight: '600',
    color: safeTextPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: safeBorder,
    paddingTop: 6,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTerracotta,
  },
});
