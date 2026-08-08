import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBackground = (COLORS && COLORS.background) || '#F4F7F4';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';

const CROPS = [
  { id: 'wheat', nameKey: 'Wheat / Grains', npkPerAcre: { n: 12, p: 8, k: 6 } },
  { id: 'rice', nameKey: 'Paddy Rice', npkPerAcre: { n: 15, p: 10, k: 10 } },
  { id: 'cotton', nameKey: 'Organic Cotton', npkPerAcre: { n: 18, p: 12, k: 14 } },
  { id: 'vegetables', nameKey: 'Tomatoes / Veggies', npkPerAcre: { n: 20, p: 15, k: 18 } },
];

export default function SoilCalculatorCard() {
  const { addToCart, products, t } = useApp();
  const [acreage, setAcreage] = useState(5);
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
  const [added, setAdded] = useState(false);

  const reqLiquidNPK = Math.round(acreage * (selectedCrop.npkPerAcre.n / 4));
  const reqVermicompostKg = Math.round(acreage * 50);

  const handleAddToCart = () => {
    const fertItem = products.find((p) => p.category === 'fertilizers') || products[0];
    addToCart(fertItem, false, reqLiquidNPK);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Card bg="#E8F5E9" style={styles.card} elevation="medium">
      <View style={styles.header}>
        <Ionicons name="calculator-outline" size={24} color={safePrimary} />
        <View style={{ marginLeft: safeSpacingXs, flex: 1 }}>
          <Text style={styles.title}>{t('soilCalcTitle')}</Text>
          <Text style={styles.sub}>{t('soilCalcSub')}</Text>
        </View>
        <Badge label="DOSAGE AI" variant="success" size="sm" />
      </View>

      {/* Crop Selector */}
      <Text style={styles.label}>{t('selectCrop')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {CROPS.map((crop) => (
          <TouchableOpacity
            key={crop.id}
            onPress={() => setSelectedCrop(crop)}
            style={[styles.chip, selectedCrop.id === crop.id && styles.selectedChip]}
          >
            <Text style={[styles.chipText, selectedCrop.id === crop.id && styles.selectedChipText]}>
              {crop.nameKey}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Acreage Control */}
      <View style={styles.acreageRow}>
        <Text style={styles.label}>{t('farmAcreage')}</Text>
        <View style={styles.qtyControl}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setAcreage(Math.max(1, acreage - 1))}
          >
            <Ionicons name="remove" size={14} color={safeTextPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{acreage} Acres</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setAcreage(acreage + 1)}>
            <Ionicons name="add" size={14} color={safeTextPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Result Doses */}
      <View style={styles.resultBox}>
        <Text style={styles.resultHeading}>{t('recDose')}</Text>

        <View style={styles.doseRow}>
          <Ionicons name="flask" size={16} color={safePrimary} />
          <Text style={styles.doseText}>
            {t('liquidNpk')}: <Text style={styles.doseVal}>{reqLiquidNPK} Liters</Text>
          </Text>
        </View>

        <View style={styles.doseRow}>
          <Ionicons name="leaf" size={16} color="#5D4037" />
          <Text style={styles.doseText}>
            {t('vermicompost')}: <Text style={styles.doseVal}>{reqVermicompostKg} Kg</Text>
          </Text>
        </View>

        <Button
          title={added ? t('calcDoseAdded') : t('calcDoseAdd')}
          variant={added ? 'secondary' : 'primary'}
          size="sm"
          onPress={handleAddToCart}
          style={{ marginTop: safeSpacingSm }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#A5D6A7',
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
    backgroundColor: safePrimary,
    borderColor: safePrimary,
  },
  chipText: {
    fontSize: 12,
    color: safeTextPrimary,
  },
  selectedChipText: {
    color: safeTextLight,
    fontWeight: '700',
  },
  acreageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: safeSpacingXs,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeBackground,
    borderRadius: safeRadiusMd,
    padding: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: safeRadiusSm,
    backgroundColor: safeCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
    marginHorizontal: safeSpacingSm,
  },
  resultBox: {
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd,
    marginTop: safeSpacingXs,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  resultHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: safePrimaryDark,
    marginBottom: safeSpacingXs,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  doseText: {
    fontSize: 12,
    color: safeTextPrimary,
    marginLeft: 6,
  },
  doseVal: {
    fontWeight: '800',
    color: safePrimary,
  },
});
