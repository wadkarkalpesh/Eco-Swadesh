import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import TrustBadge from '../../components/ui/TrustBadge';
import Button from '../../components/ui/Button';
import BulkContractModal from '../../components/BulkContractModal';
import NurseryBatchModal from '../../components/NurseryBatchModal';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { products, addToCart, formatPrice, t } = useApp();

  const product = products.find((p) => p.id === id) || products[0];

  const [buyMode, setBuyMode] = useState(product.category === 'bulkHarvest' ? 'BULK' : 'RETAIL');
  const [qty, setQty] = useState(buyMode === 'BULK' ? (product.bulkMinTons || 2) : 1);
  const [showContract, setShowContract] = useState(false);
  const [showNurseryBatch, setShowNurseryBatch] = useState(false);

  const isBulk = buyMode === 'BULK';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Image Gallery Mockup */}
      <Image source={{ uri: product.image }} style={styles.heroImage} />

      <View style={styles.content}>
        {/* Category & Badge */}
        <View style={styles.badgeRow}>
          <Badge label={product.category.toUpperCase()} variant="primary" size="sm" />
          {product.certifiedType === 'LOCAL_GOV' ? (
            <Badge label="LOCAL GOVT SEAL APPROVED" variant="gov" size="sm" style={{ marginLeft: 4 }} />
          ) : (
            <Badge label="NATIONAL ORGANIC STANDARD" variant="trust" size="sm" style={{ marginLeft: 4 }} />
          )}
        </View>

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.sellerText}>By {product.sellerName} • {product.sellerType}</Text>
        <Text style={styles.originText}>📍 Origin: {product.origin}</Text>

        {/* Multi-Level Trust Badge */}
        <TrustBadge
          certifiedType={product.certifiedType}
          certName={product.certName}
          licenseNo={product.certLicense}
          labPurityRating={product.labPurityRating}
          showQRSeal
        />

        {/* Mode Selector (Retail vs Bulk) */}
        {product.bulkAvailable && (
          <View style={styles.modeSelectorCard}>
            <Text style={styles.modeSelectorTitle}>Choose Order Mode:</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[styles.modeTab, !isBulk && styles.activeModeTab]}
                onPress={() => {
                  setBuyMode('RETAIL');
                  setQty(1);
                }}
              >
                <Text style={[styles.modeTabText, !isBulk && styles.activeModeTabText]}>
                  Small Retail Pack
                </Text>
                <Text style={styles.modeTabPrice}>{formatPrice(product.retailPrice, false, product.retailUnit)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, isBulk && styles.activeModeTabBulk]}
                onPress={() => {
                  setBuyMode('BULK');
                  setQty(product.bulkMinTons || 2);
                }}
              >
                <Text style={[styles.modeTabText, isBulk && styles.activeModeTabTextBulk]}>
                  Direct Bulk (Tons)
                </Text>
                <Text style={styles.modeTabPriceBulk}>{formatPrice(product.bulkPricePerTon, true)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Price & Quantity Selector */}
        <Card style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <View>
              <Text style={styles.priceLabel}>{isBulk ? 'Bulk Freight Price' : 'Retail Price'}</Text>
              <Text style={isBulk ? styles.bulkPriceText : styles.retailPriceText}>
                {isBulk
                  ? formatPrice(product.bulkPricePerTon, true)
                  : formatPrice(product.retailPrice, false, product.retailUnit)}
              </Text>
            </View>

            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(Math.max(isBulk ? (product.bulkMinTons || 1) : 1, qty - 1))}
              >
                <Ionicons name="remove" size={16} color={safeTextPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>
                {qty} {isBulk ? 'Tons' : product.retailUnit}
              </Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                <Ionicons name="add" size={16} color={safeTextPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {isBulk && (
            <View style={styles.escrowNote}>
              <Ionicons name="shield-checkmark" size={14} color={safeTerracotta} />
              <Text style={styles.escrowNoteText}>
                Zero Middlemen Direct Freight. Payment held in Escrow until destination lab check.
              </Text>
            </View>
          )}
        </Card>

        {/* Description & Specifications */}
        <Card style={styles.descCard}>
          <Text style={styles.sectionHeader}>Product Overview</Text>
          <Text style={styles.descText}>{product.description}</Text>

          {product.npkRatio && (
            <View style={styles.specRow}>
              <Text style={styles.specKey}>NPK Composition:</Text>
              <Text style={styles.specVal}>{product.npkRatio}</Text>
            </View>
          )}
          {product.usageDose && (
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Recommended Dose:</Text>
              <Text style={styles.specVal}>{product.usageDose}</Text>
            </View>
          )}
          {product.moistureContent && (
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Moisture Content:</Text>
              <Text style={styles.specVal}>{product.moistureContent}</Text>
            </View>
          )}
        </Card>

        {/* Lab Certification Report & Digital Contract Buttons */}
        <View style={{ flexDirection: 'row', gap: safeSpacingXs, marginVertical: safeSpacingSm }}>
          <Button
            title="📄 Lab CoA Report"
            variant="outline"
            size="md"
            onPress={() => router.push('/trust-center')}
            style={{ flex: 1 }}
          />
          {product.category === 'seeds' ? (
            <Button
              title="🌱 Nursery Batch Quality"
              variant="secondary"
              size="md"
              onPress={() => setShowNurseryBatch(true)}
              style={{ flex: 1 }}
            />
          ) : isBulk ? (
            <Button
              title="✍️ Digital B2B Contract"
              variant="terracotta"
              size="md"
              onPress={() => setShowContract(true)}
              style={{ flex: 1 }}
            />
          ) : null}
        </View>

        <BulkContractModal
          visible={showContract}
          onClose={() => setShowContract(false)}
          itemData={product}
        />

        <NurseryBatchModal
          visible={showNurseryBatch}
          onClose={() => setShowNurseryBatch(false)}
        />

        {/* Actions Footer */}
        <View style={styles.actionsRow}>
          <Button
            title={t('addToCart')}
            variant={isBulk ? 'terracotta' : 'primary'}
            size="lg"
            onPress={() => {
              addToCart(product, isBulk, qty);
              router.push('/cart');
            }}
            style={{ flex: 1, marginRight: safeSpacingSm }}
          />
          <Button
            title="Track Shipping"
            variant="secondary"
            size="lg"
            onPress={() => router.push('/logistics')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  scrollBody: {
    paddingBottom: safeSpacingXxl,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: safeBorder,
  },
  content: {
    padding: safeSpacingMd,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: safeSpacingXs,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: safeTextPrimary,
  },
  sellerText: {
    fontSize: 12,
    color: safeTextMuted,
    marginTop: 2,
  },
  originText: {
    fontSize: 12,
    color: safeTextSecondary,
    marginBottom: safeSpacingXs,
  },
  modeSelectorCard: {
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd,
    borderWidth: 1,
    borderColor: safeBorder,
    marginVertical: safeSpacingXs,
  },
  modeSelectorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextSecondary,
    marginBottom: safeSpacingXs,
  },
  modeRow: {
    flexDirection: 'row',
    gap: safeSpacingXs,
  },
  modeTab: {
    flex: 1,
    padding: safeSpacingSm,
    borderRadius: safeRadiusSm,
    borderWidth: 1,
    borderColor: safeBorder,
    alignItems: 'center',
  },
  activeModeTab: {
    backgroundColor: safeAccentLight,
    borderColor: safePrimary,
  },
  activeModeTabBulk: {
    backgroundColor: '#FBE9E7',
    borderColor: safeTerracotta,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: safeTextMuted,
  },
  activeModeTabText: {
    color: safePrimary,
    fontWeight: '700',
  },
  activeModeTabTextBulk: {
    color: safeTerracotta,
    fontWeight: '700',
  },
  modeTabPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: safePrimaryDark,
    marginTop: 2,
  },
  modeTabPriceBulk: {
    fontSize: 11,
    fontWeight: '700',
    color: safeTerracotta,
    marginTop: 2,
  },
  priceCard: {
    marginVertical: safeSpacingXs,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: safeTextMuted,
  },
  retailPriceText: {
    fontSize: 22,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  bulkPriceText: {
    fontSize: 22,
    fontWeight: '800',
    color: safeTerracotta,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeBg,
    borderRadius: safeRadiusMd,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: safeRadiusSm,
    backgroundColor: safeCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
    marginHorizontal: safeSpacingSm,
  },
  escrowNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: safeSpacingXs + 2,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: safeBorder,
  },
  escrowNoteText: {
    fontSize: 11,
    color: safeTerracotta,
    marginLeft: 4,
    fontWeight: '600',
  },
  descCard: {
    marginVertical: safeSpacingXs,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: safeTextSecondary,
    lineHeight: 18,
    marginBottom: safeSpacingXs,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: safeBorder,
  },
  specKey: {
    fontSize: 12,
    fontWeight: '600',
    color: safeTextSecondary,
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: safeSpacingMd,
  },
});
