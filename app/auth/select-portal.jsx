import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import ScreenContainer from '../../components/ui/ScreenContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';

const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;

export default function SelectPortalScreen() {
  const router = useRouter();
  const { changePersona } = useApp();

  const handleSelectBuyer = () => {
    changePersona('consumer');
    router.push('/auth/register');
  };

  const handleSelectSeller = () => {
    changePersona('farmer');
    router.push('/auth/register');
  };

  return (
    <ScreenContainer maxWidth="auth" withSafeArea={true}>
      {/* Header Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={32} color={safeSunGold} />
          <Text style={styles.headerTitle}>Deccan-Origin</Text>
        </View>
        <Text style={styles.headerSub}>
          India&apos;s Direct Sustainable Agriculture & Certified Bio-Input Marketplace
        </Text>
        <Badge label="100% ESCROW PROTECTED" variant="gold" size="sm" style={{ marginTop: safeSpacingSm }} />
      </Card>

      <Text style={styles.selectHeader}>Select Your Registration Portal:</Text>

      {/* Buyer Portal Tile */}
      <TouchableOpacity onPress={handleSelectBuyer} activeOpacity={0.85}>
        <Card bg="#FFFDF7" style={styles.portalCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="cart" size={28} color="#1976D2" />
            </View>
            <Badge label="BUYER & CONSUMER" variant="trust" size="sm" />
          </View>

          <Text style={styles.portalTitle}>Customer & Bulk Buyer Portal</Text>
          <Text style={styles.portalDesc}>
            Buy 100% lab-certified organic produce, bio-pesticides, high-yield seeds, and request freight truckloads in tons.
          </Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureItem}>🛒 Retail Package Orders</Text>
            <Text style={styles.featureItem}>🚛 Direct Bulk Tons</Text>
            <Text style={styles.featureItem}>🛡️ Escrow Protected</Text>
          </View>

          <View style={[styles.enterBtn, { backgroundColor: '#1976D2' }]}>
            <Text style={styles.enterBtnText}>Register as Buyer / Customer →</Text>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Seller Portal Tile */}
      <TouchableOpacity onPress={handleSelectSeller} activeOpacity={0.85}>
        <Card bg="#F4FBF7" style={styles.portalCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="leaf" size={28} color={safePrimary} />
            </View>
            <Badge label="FARMER & SELLER" variant="success" size="sm" />
          </View>

          <Text style={styles.portalTitle}>Farmer & Producer Portal</Text>
          <Text style={styles.portalDesc}>
            Sell direct farm harvests in bulk tons, list bio-fertilizers, check APMC Mandi rates, and get 4% Kisan Credit loans.
          </Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureItem}>🌾 List Bulk Harvest</Text>
            <Text style={styles.featureItem}>📈 Mandi AI Forecast</Text>
            <Text style={styles.featureItem}>💳 4% Kisan Loans</Text>
          </View>

          <View style={[styles.enterBtn, { backgroundColor: safePrimary }]}>
            <Text style={styles.enterBtnText}>Register as Farmer / Seller →</Text>
          </View>
        </Card>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: { marginBottom: safeSpacingMd, alignItems: 'center', paddingVertical: safeSpacingMd },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: safeTextLight, marginLeft: 8 },
  headerSub: { fontSize: 12, color: '#C8E6C9', textAlign: 'center', marginTop: 4 },
  selectHeader: { fontSize: 16, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingSm },
  portalCard: { marginBottom: safeSpacingMd, borderWidth: 1, borderColor: '#E2E8E2' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconCircle: { width: 50, height: 50, borderRadius: safeRadiusMd, alignItems: 'center', justifyContent: 'center' },
  portalTitle: { fontSize: 18, fontWeight: '800', color: safeTextPrimary, marginTop: safeSpacingSm },
  portalDesc: { fontSize: 12, color: safeTextSecondary, marginTop: 4, lineHeight: 18 },
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: safeSpacingSm, paddingTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
  featureItem: { fontSize: 11, fontWeight: '600', color: safeTextPrimary },
  enterBtn: { marginTop: safeSpacingMd, paddingVertical: 12, borderRadius: safeRadiusMd, alignItems: 'center' },
  enterBtnText: { fontSize: 14, fontWeight: '800', color: safeTextLight },
});
