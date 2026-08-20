import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import TrustBadge from '../../components/ui/TrustBadge';
import Button from '../../components/ui/Button';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeTrustBlue = (COLORS && COLORS.trustBlue) || '#1976D2';
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

const CATEGORIES = [
  { id: 'all', labelKey: 'allCategories', icon: 'grid-outline' },
  { id: 'fertilizers', labelKey: 'fertilizers', icon: 'flask-outline' },
  { id: 'bulkHarvest', labelKey: 'bulkHarvest', icon: 'bus-outline' },
  { id: 'bioPesticides', labelKey: 'bioPesticides', icon: 'shield-outline' },
  { id: 'seeds', labelKey: 'seeds', icon: 'leaf-outline' },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  const {
    t,
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    certFilter,
    setCertFilter,
    orderMode,
    setOrderMode,
    addToCart,
    formatPrice,
  } = useApp();

  const filteredProducts = products.filter((p) => {
    // Search Filter
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    // Certification Filter
    const matchesCert =
      certFilter === 'ALL' ||
      (certFilter === 'NATIONAL' && p.certifiedType === 'NATIONAL') ||
      (certFilter === 'LOCAL_GOV' && p.certifiedType === 'LOCAL_GOV');

    return matchesSearch && matchesCategory && matchesCert;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Search */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('marketplace')}</Text>
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={18} color={safeTextMuted} />}
          rightIcon={
            searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={safeTextMuted} />
              </TouchableOpacity>
            ) : null
          }
          style={styles.searchInput}
        />
      </View>

      {/* Certification Norms Filter Segment */}
      <View style={styles.certFilterContainer}>
        <Text style={styles.certFilterLabel}>{t('certFilterTitle')}:</Text>
        <View style={styles.certFilterRow}>
          <TouchableOpacity
            style={[styles.certChip, certFilter === 'ALL' && styles.selectedCertChip]}
            onPress={() => setCertFilter('ALL')}
          >
            <Text style={[styles.certChipText, certFilter === 'ALL' && styles.selectedCertChipText]}>
              {t('allCerts')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.certChip, certFilter === 'NATIONAL' && styles.selectedCertChip]}
            onPress={() => setCertFilter('NATIONAL')}
          >
            <Ionicons
              name="ribbon"
              size={12}
              color={certFilter === 'NATIONAL' ? safeTextLight : safeTrustBlue}
            />
            <Text style={[styles.certChipText, certFilter === 'NATIONAL' && styles.selectedCertChipText]}>
              National (USDA/EU)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.certChip, certFilter === 'LOCAL_GOV' && styles.selectedCertChipGov]}
            onPress={() => setCertFilter('LOCAL_GOV')}
          >
            <Ionicons
              name="shield-checkmark"
              size={12}
              color={certFilter === 'LOCAL_GOV' ? safeTextLight : safeGovGold}
            />
            <Text style={[styles.certChipText, certFilter === 'LOCAL_GOV' && styles.selectedCertChipText]}>
              Local Gov Seals
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Mode Toggle (Retail vs Bulk) */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeButton, orderMode === 'RETAIL' && styles.modeButtonActive]}
          onPress={() => setOrderMode('RETAIL')}
        >
          <Text style={[styles.modeText, orderMode === 'RETAIL' && styles.modeTextActive]}>
            {t('smallOrders')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, orderMode === 'BULK' && styles.modeButtonBulkActive]}
          onPress={() => setOrderMode('BULK')}
        >
          <Text style={[styles.modeText, orderMode === 'BULK' && styles.modeTextBulkActive]}>
            {t('bulkOrders')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[styles.categoryChip, isSelected && styles.selectedCategoryChip]}
            >
              <Ionicons
                name={cat.icon}
                size={14}
                color={isSelected ? safeTextLight : safePrimary}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && { color: safeTextLight, fontWeight: '700' },
                ]}
              >
                {t(cat.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Products Catalog */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isBulkMode = orderMode === 'BULK' || item.category === 'bulkHarvest';
          return (
            <Card style={styles.productCard} onPress={() => router.push(`/product/${item.id}`)}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    {item.category === 'bulkHarvest' ? (
                      <Badge label="DIRECT FARM HARVEST" variant="bulk" size="sm" />
                    ) : (
                      <Badge label="100% ORGANIC" variant="success" size="sm" />
                    )}
                    {item.certifiedType === 'LOCAL_GOV' ? (
                      <Badge label="LOCAL GOVT SEAL" variant="gov" size="sm" style={{ marginLeft: 4 }} />
                    ) : (
                      <Badge label="NATIONAL STANDARD" variant="trust" size="sm" style={{ marginLeft: 4 }} />
                    )}
                  </View>

                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productSeller}>By {item.sellerName}</Text>

                  <TrustBadge
                    certifiedType={item.certifiedType}
                    certName={item.certName}
                    licenseNo={item.certLicense}
                    labPurityRating={item.labPurityRating}
                    showQRSeal={false}
                  />

                  <View style={styles.priceRow}>
                    <Text style={isBulkMode ? styles.bulkPriceText : styles.retailPriceText}>
                      {isBulkMode
                        ? `${formatPrice(item.bulkPricePerTon, true)} (Min ${item.bulkMinTons || 2} Tons)`
                        : formatPrice(item.retailPrice, false, item.retailUnit)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Button
                  title={t('viewCertificate')}
                  variant="outline"
                  size="sm"
                  onPress={() => router.push('/trust-center')}
                  style={{ flex: 1, marginRight: safeSpacingXs }}
                />
                <Button
                  title={t('addToCart')}
                  variant={isBulkMode ? 'terracotta' : 'primary'}
                  size="sm"
                  onPress={() => addToCart(item, isBulkMode, isBulkMode ? (item.bulkMinTons || 2) : 1)}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  header: {
    backgroundColor: safePrimary,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingSm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: safeTextLight,
    marginBottom: safeSpacingXs,
  },
  searchInput: {
    backgroundColor: safeCard,
  },
  certFilterContainer: {
    backgroundColor: safePrimaryDark,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingXs + 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certFilterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A5D6A7',
    marginRight: safeSpacingSm,
  },
  certFilterRow: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  certChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: safeRadiusFull,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  selectedCertChip: {
    backgroundColor: safeTrustBlue,
    borderColor: safeTrustBlue,
  },
  selectedCertChipGov: {
    backgroundColor: safeGovGold,
    borderColor: safeGovGold,
  },
  certChipText: {
    fontSize: 10,
    color: safeTextLight,
    marginLeft: 3,
  },
  selectedCertChipText: {
    fontWeight: '700',
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: safeCard,
    marginHorizontal: safeSpacingMd,
    marginTop: safeSpacingSm,
    borderRadius: safeRadiusMd,
    padding: 2,
    borderWidth: 1,
    borderColor: safeBorder,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: safeRadiusSm,
  },
  modeButtonActive: {
    backgroundColor: safeAccentLight,
  },
  modeButtonBulkActive: {
    backgroundColor: '#FBE9E7',
  },
  modeText: {
    fontSize: 11,
    fontWeight: '600',
    color: safeTextMuted,
  },
  modeTextActive: {
    color: safePrimary,
    fontWeight: '700',
  },
  modeTextBulkActive: {
    color: safeTerracotta,
    fontWeight: '700',
  },
  categoryScroll: {
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingSm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeCard,
    paddingHorizontal: safeSpacingSm + 2,
    paddingVertical: 6,
    borderRadius: safeRadiusFull,
    borderWidth: 1,
    borderColor: safeBorder,
    marginRight: safeSpacingXs + 2,
  },
  selectedCategoryChip: {
    backgroundColor: safePrimary,
    borderColor: safePrimary,
  },
  categoryText: {
    fontSize: 12,
    color: safeTextPrimary,
    marginLeft: 4,
  },
  listContainer: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  productCard: {
    marginBottom: safeSpacingSm,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 90,
    height: 110,
    borderRadius: safeRadiusMd,
    marginRight: safeSpacingSm,
    backgroundColor: safeBorder,
  },
  cardInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: safeTextPrimary,
    marginTop: 2,
  },
  productSeller: {
    fontSize: 11,
    color: safeTextMuted,
    marginBottom: 2,
  },
  priceRow: {
    marginTop: safeSpacingXs,
  },
  retailPriceText: {
    fontSize: 14,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  bulkPriceText: {
    fontSize: 13,
    fontWeight: '800',
    color: safeTerracotta,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: safeSpacingSm,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: safeBorder,
  },
});
