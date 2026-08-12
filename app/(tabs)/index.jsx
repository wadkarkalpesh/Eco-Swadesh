import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import LanguagePicker from '../../components/ui/LanguagePicker';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import TrustBadge from '../../components/ui/TrustBadge';
import Button from '../../components/ui/Button';
import SoilCalculatorCard from '../../components/SoilCalculatorCard';
import SustainabilityAnalyticsCard from '../../components/SustainabilityAnalyticsCard';
import CommodityTrendChart from '../../components/CommodityTrendChart';
import SubsidyFinderCard from '../../components/SubsidyFinderCard';
import EquipmentRentalCard from '../../components/EquipmentRentalCard';
import { MOCK_COMMODITY_PRICES } from '../../constants/mockData';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safePrimaryLight = (COLORS && COLORS.primaryLight) || '#2E7D32';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';
const safeAccent = (COLORS && COLORS.accent) || '#4CAF50';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusXs = (RADIUS && RADIUS.xs) || 4;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

const PERSONAS = [
  { id: 'farmer', labelKey: 'farmer', icon: 'leaf' },
  { id: 'consumer', labelKey: 'consumer', icon: 'cart' },
  { id: 'bulkBuyer', labelKey: 'bulkBuyer', icon: 'bus' },
  { id: 'seller', labelKey: 'seller', icon: 'flask' },
  { id: 'expert', labelKey: 'expert', icon: 'school' },
  { id: 'admin', labelKey: 'admin', icon: 'shield-checkmark' },
];

export default function HomeScreen() {
  const router = useRouter();
  const {
    t,
    persona,
    changePersona,
    orderMode,
    setOrderMode,
    products,
    cart,
    addToCart,
    formatPrice,
    commodityTrends,
  } = useApp();

  const featuredFertilizers = products.filter((p) => p.category === 'fertilizers');
  const featuredBulk = products.filter((p) => p.category === 'bulkHarvest');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={20} color={safeTextLight} />
          </View>
          <View>
            <Text style={styles.appTitle}>{t('appTitle')}</Text>
            <Text style={styles.appTagline}>{t('appTagline')}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <LanguagePicker />
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <Ionicons name="cart-outline" size={22} color={safeTextLight} />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Market Commodity Ticker */}
      <View style={styles.tickerContainer}>
        <View style={styles.tickerBadge}>
          <Ionicons name="pulse" size={14} color={safeSunGold} />
          <Text style={styles.tickerBadgeText}>LIVE</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tickerScroll}
        >
          {(commodityTrends || MOCK_COMMODITY_PRICES).map((item, idx) => (
            <View key={idx} style={styles.tickerItem}>
              <Text style={styles.tickerCrop}>{item.crop}:</Text>
              <Text style={styles.tickerPrice}>
                {orderMode === 'BULK' ? item.priceBulk : item.priceRetail}
              </Text>
              <Text style={styles.tickerChange}>{item.change}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Commodity & Fertilizer Price Trend Chart */}
        <CommodityTrendChart />

        {/* Persona Selector Bar */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('selectPersona')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.personaScroll}>
            {PERSONAS.map((p) => {
              const isSelected = persona === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => changePersona(p.id)}
                  style={[styles.personaChip, isSelected && styles.selectedPersonaChip]}
                >
                  <Ionicons
                    name={p.icon}
                    size={14}
                    color={isSelected ? safeTextLight : safePrimary}
                  />
                  <Text
                    style={[
                      styles.personaText,
                      isSelected && { color: safeTextLight, fontWeight: '700' },
                    ]}
                  >
                    {t(p.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Order Mode Switcher (Retail vs Bulk) */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[styles.modeTab, orderMode === 'RETAIL' && styles.activeModeTab]}
            onPress={() => setOrderMode('RETAIL')}
          >
            <Ionicons
              name="basket-outline"
              size={16}
              color={orderMode === 'RETAIL' ? safePrimary : safeTextMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                orderMode === 'RETAIL' && styles.activeModeTabText,
              ]}
            >
              {t('smallOrders')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, orderMode === 'BULK' && styles.activeModeTabBulk]}
            onPress={() => setOrderMode('BULK')}
          >
            <Ionicons
              name="bus-outline"
              size={16}
              color={orderMode === 'BULK' ? safeTerracotta : safeTextMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                orderMode === 'BULK' && styles.activeModeTabTextBulk,
              ]}
            >
              {t('bulkOrders')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner: Direct Bulk Farm Trade */}
        <Card bg={safePrimaryDark} style={styles.heroCard} elevation="medium">
          <View style={styles.heroBadgeRow}>
            <Badge label="MIDDLEMAN-FREE TRADE" variant="bulk" size="sm" />
            <Badge label="ZERO COMMISSION" variant="gov" size="sm" />
          </View>
          <Text style={styles.heroTitle}>{t('directBulkBannerTitle')}</Text>
          <Text style={styles.heroSub}>{t('directBulkBannerSub')}</Text>
          <View style={styles.heroActions}>
            <Button
              title={t('requestBulkQuote')}
              variant="terracotta"
              size="sm"
              onPress={() => router.push('/logistics')}
            />
            <Button
              title={t('viewCertificate')}
              variant="outline"
              size="sm"
              style={{ borderColor: safeTextLight, marginLeft: safeSpacingXs }}
              textStyle={{ color: safeTextLight }}
              onPress={() => router.push('/trust-center')}
            />
          </View>
        </Card>

        {/* Enterprise & Rural Agri-Tech Hub Shortcuts */}
        <Text style={styles.sectionTitleHeader}>Enterprise Agri-Tech & FinTech Hubs</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: safeSpacingMd }}>
          {[
            { title: 'FPO Procurement', sub: 'Group Bulk Pools', icon: 'people', color: '#1E4D2B', bg: '#E8F5E9', route: '/procurement' },
            { title: 'Mandi AI Rates', sub: 'APMC Price Forecast', icon: 'trending-up', color: '#FFA000', bg: '#FFF8E1', route: '/mandi-prices' },
            { title: 'Soil Carbon', sub: 'Verra ESG Offsets', icon: 'leaf', color: '#2E7D32', bg: '#E8F5E9', route: '/carbon-credits' },
            { title: 'Agri-Credit', sub: '4% Kisan Loans', icon: 'card', color: '#1976D2', bg: '#E3F2FD', route: '/agri-credit' },
            { title: 'Satellite GIS', sub: '30m Buffer Audit', icon: 'map', color: '#673AB7', bg: '#EDE7F6', route: '/farm-gis' },
            { title: 'Export Passports', sub: 'Phytosanitary Biosecurity', icon: 'airplane', color: '#D84315', bg: '#FBE9E7', route: '/phytosanitary' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                width: '48%',
                backgroundColor: item.bg,
                padding: 12,
                borderRadius: safeRadiusMd,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)',
              }}
              onPress={() => router.push(item.route)}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
              <Text style={{ fontSize: 13, fontWeight: '800', color: safeTextPrimary, marginTop: 4 }}>{item.title}</Text>
              <Text style={{ fontSize: 10, color: safeTextSecondary, marginTop: 1 }}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Farmer Government Subsidy & Grant Finder Widget */}
        <SubsidyFinderCard />

        {/* Soil Health & Fertilizer Dosage Calculator Widget */}
        <SoilCalculatorCard />

        {/* Farm Machinery, Tractors & Drone Bio-Sprayer Rental Hub */}
        <EquipmentRentalCard />

        {/* AI Doctor & Soil Advisor Quick Banner */}
        <Card bg="#E8F5E9" style={styles.aiCard} elevation="small">
          <View style={styles.aiRow}>
            <View style={styles.aiIconCircle}>
              <Ionicons name="medical" size={24} color={safePrimaryLight} />
            </View>
            <View style={styles.aiTextCol}>
              <Text style={styles.aiTitle}>{t('aiScannerBannerTitle')}</Text>
              <Text style={styles.aiSub}>{t('aiScannerBannerSub')}</Text>
            </View>
          </View>
          <Button
            title={t('askAI')}
            variant="secondary"
            size="sm"
            style={{ marginTop: safeSpacingSm }}
            onPress={() => router.push('/(tabs)/ai-assistant')}
          />
        </Card>

        {/* Section: Organic Fertilizers & Bio Inputs */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleHeader}>{t('featuredFertilizers')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {featuredFertilizers.map((item) => (
            <Card key={item.id} style={styles.productCardHorizontal} onPress={() => router.push(`/product/${item.id}`)}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Badge
                label={item.certifiedType === 'LOCAL_GOV' ? 'LOCAL GOVT SEAL' : 'NATIONAL GOV SEAL'}
                variant={item.certifiedType === 'LOCAL_GOV' ? 'gov' : 'trust'}
                size="sm"
                style={{ marginTop: safeSpacingXs }}
              />
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productSeller}>{item.sellerName}</Text>
              
              <Text style={styles.productPrice}>
                {orderMode === 'BULK'
                  ? formatPrice(item.bulkPricePerTon, true)
                  : formatPrice(item.retailPrice, false, item.retailUnit)}
              </Text>

              <Button
                title={t('addToCart')}
                variant={orderMode === 'BULK' ? 'terracotta' : 'primary'}
                size="sm"
                onPress={() => addToCart(item, orderMode === 'BULK', 1)}
                style={{ marginTop: safeSpacingXs }}
              />
            </Card>
          ))}
        </ScrollView>

        {/* Section: Direct Bulk Farm Harvests (Tons) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleHeader}>{t('featuredProduce')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredBulk.map((item) => (
          <Card key={item.id} style={styles.bulkCard} onPress={() => router.push(`/product/${item.id}`)}>
            <View style={styles.bulkRow}>
              <Image source={{ uri: item.image }} style={styles.bulkImage} />
              <View style={styles.bulkInfo}>
                <Badge label="DIRECT FARM HARVEST" variant="bulk" size="sm" />
                <Text style={styles.bulkTitle}>{item.name}</Text>
                <Text style={styles.bulkOrigin}>📍 Origin: {item.origin}</Text>
                <TrustBadge
                  certifiedType={item.certifiedType}
                  certName={item.certName}
                  licenseNo={item.certLicense}
                  labPurityRating={item.labPurityRating}
                  showQRSeal={false}
                />
                <Text style={styles.bulkPriceText}>
                  {formatPrice(item.bulkPricePerTon, true)} (Min {item.bulkMinTons} Tons)
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Sustainability & Carbon Analytics Dashboard */}
        <SustainabilityAnalyticsCard />

        {/* Carbon Offset & Sustainability Counter Footer */}
        <Card bg="#12361C" style={styles.carbonCard}>
          <View style={styles.carbonRow}>
            <Ionicons name="earth" size={32} color={safeAccent} />
            <View style={{ marginLeft: safeSpacingMd }}>
              <Text style={styles.carbonNumber}>14,890 Tons</Text>
              <Text style={styles.carbonLabel}>{t('carbonSaved')} & Chemical Pesticides Reduced</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: safePrimary,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingSm + 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: safeRadiusSm,
    backgroundColor: safePrimaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: safeSpacingXs + 2,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safeTextLight,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 10,
    color: '#A5D6A7',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    marginLeft: safeSpacingSm,
    padding: safeSpacingXs,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: safeTerracotta,
    borderRadius: safeRadiusFull,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: safeTextLight,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safePrimaryDark,
    paddingVertical: 6,
    paddingHorizontal: safeSpacingSm,
  },
  tickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 160, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: safeRadiusXs,
    marginRight: safeSpacingXs,
  },
  tickerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: safeSunGold,
    marginLeft: 3,
  },
  tickerScroll: {
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: safeSpacingMd,
  },
  tickerCrop: {
    fontSize: 11,
    color: safeTextLight,
    fontWeight: '600',
  },
  tickerPrice: {
    fontSize: 11,
    color: '#81C784',
    fontWeight: '700',
    marginLeft: 4,
  },
  tickerChange: {
    fontSize: 10,
    color: safeSunGold,
    marginLeft: 4,
  },
  scrollBody: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  sectionContainer: {
    marginBottom: safeSpacingSm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextSecondary,
    marginBottom: safeSpacingXs,
    textTransform: 'uppercase',
  },
  personaScroll: {
    flexDirection: 'row',
  },
  personaChip: {
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
  selectedPersonaChip: {
    backgroundColor: safePrimary,
    borderColor: safePrimary,
  },
  personaText: {
    fontSize: 12,
    color: safeTextPrimary,
    marginLeft: 4,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: 4,
    borderWidth: 1,
    borderColor: safeBorder,
    marginVertical: safeSpacingXs,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: safeRadiusSm,
  },
  activeModeTab: {
    backgroundColor: safeAccentLight,
  },
  activeModeTabBulk: {
    backgroundColor: '#FBE9E7',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: safeTextMuted,
    marginLeft: 4,
  },
  activeModeTabText: {
    color: safePrimary,
    fontWeight: '700',
  },
  activeModeTabTextBulk: {
    color: safeTerracotta,
    fontWeight: '700',
  },
  heroCard: {
    padding: safeSpacingMd,
    marginVertical: safeSpacingXs,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: safeSpacingXs,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safeTextLight,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: '#C8E6C9',
    lineHeight: 16,
    marginBottom: safeSpacingSm,
  },
  heroActions: {
    flexDirection: 'row',
  },
  aiCard: {
    padding: safeSpacingMd,
    borderColor: '#C8E6C9',
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconCircle: {
    width: 42,
    height: 42,
    borderRadius: safeRadiusFull,
    backgroundColor: safeCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: safeSpacingSm,
  },
  aiTextCol: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: safePrimaryDark,
  },
  aiSub: {
    fontSize: 11,
    color: safeTextSecondary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: safeSpacingMd,
    marginBottom: safeSpacingXs,
  },
  sectionTitleHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  seeAllText: {
    fontSize: 12,
    color: safePrimary,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -safeSpacingMd,
    paddingHorizontal: safeSpacingMd,
  },
  productCardHorizontal: {
    width: 200,
    marginRight: safeSpacingMd,
  },
  productImage: {
    width: '100%',
    height: 110,
    borderRadius: safeRadiusMd,
    backgroundColor: safeBorder,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 4,
    height: 36,
  },
  productSeller: {
    fontSize: 11,
    color: safeTextMuted,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  bulkCard: {
    marginBottom: safeSpacingSm,
  },
  bulkRow: {
    flexDirection: 'row',
  },
  bulkImage: {
    width: 90,
    height: 120,
    borderRadius: safeRadiusMd,
    marginRight: safeSpacingSm,
  },
  bulkInfo: {
    flex: 1,
  },
  bulkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 2,
  },
  bulkOrigin: {
    fontSize: 11,
    color: safeTextSecondary,
    marginVertical: 2,
  },
  bulkPriceText: {
    fontSize: 13,
    fontWeight: '800',
    color: safeTerracotta,
    marginTop: 4,
  },
  carbonCard: {
    padding: safeSpacingMd,
    marginTop: safeSpacingMd,
  },
  carbonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carbonNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: safeAccent,
  },
  carbonLabel: {
    fontSize: 11,
    color: '#C8E6C9',
  },
});
