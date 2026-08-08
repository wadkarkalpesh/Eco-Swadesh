import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

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

const SCHEMES = [
  { id: 'pkvy', name: 'India PKVY (Paramparagat Krishi)', subsidyPct: 75, maxAmount: '₹50,000 / Hectare' },
  { id: 'eqip', name: 'US USDA EQIP Organic Grant', subsidyPct: 50, maxAmount: '$140,000 Lifetime' },
  { id: 'cap', name: 'EU CAP Organic Transition Subsidy', subsidyPct: 80, maxAmount: '€350 / Hectare' },
  { id: 'afdb', name: 'Africa AfDB Bio-Input Subsidy', subsidyPct: 60, maxAmount: '$2,500 / Farmer' },
];

export default function SubsidyFinderCard() {
  const { t } = useApp();
  const [selectedScheme, setSelectedScheme] = useState(SCHEMES[0]);

  return (
    <Card bg="#FFFDF5" style={styles.card} elevation="medium">
      <View style={styles.header}>
        <Ionicons name="ribbon-outline" size={24} color={safeGovGold} />
        <View style={{ marginLeft: safeSpacingXs, flex: 1 }}>
          <Text style={styles.title}>{t('subsidyTitle')}</Text>
          <Text style={styles.sub}>{t('subsidySub')}</Text>
        </View>
        <Badge label="GOVT SCHEME" variant="gov" size="sm" />
      </View>

      {/* Scheme Selector */}
      <Text style={styles.label}>{t('selectGovScheme')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {SCHEMES.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSelectedScheme(s)}
            style={[styles.chip, selectedScheme.id === s.id && styles.selectedChip]}
          >
            <Text style={[styles.chipText, selectedScheme.id === s.id && styles.selectedChipText]}>
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Subsidy Calculation Box */}
      <View style={styles.calcBox}>
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>{t('subsidyCoverage')}</Text>
          <Text style={styles.subsidyBadgeText}>{selectedScheme.subsidyPct}% GRANT</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>{t('maxGrant')}:</Text>
          <Text style={styles.calcVal}>{selectedScheme.maxAmount}</Text>
        </View>

        <Button
          title={t('claimSubsidy')}
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
    color: safePrimaryDark,
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
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  calcLabel: {
    fontSize: 12,
    color: safeTextSecondary,
  },
  calcVal: {
    fontSize: 13,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  subsidyBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: safeTerracotta,
  },
});
