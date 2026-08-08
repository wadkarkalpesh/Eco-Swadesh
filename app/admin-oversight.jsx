import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingLg = (SPACING && SPACING.lg) || 24;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function AdminOversightScreen() {
  const { t, products } = useApp();

  const [pendingSellers, setPendingSellers] = useState([
    {
      id: 'sel-901',
      name: 'Organic Harvest Farmer Union',
      location: 'Punjab, India',
      type: 'Direct Farm Collective',
      licenseSubmitted: 'NPOP/NAB/8821/2026',
    },
    {
      id: 'sel-902',
      name: 'BioFlora Earth Fertilizers Pvt Ltd',
      location: 'California, US',
      type: 'Bio-Input Manufacturer',
      licenseSubmitted: 'CDFA-CCOF-1192',
    },
  ]);

  const handleApprove = (id) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Overview Cards */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <Text style={styles.headerTitle}>{t('adminOversight')}</Text>
        <Text style={styles.headerSub}>Platform Health, Trust Verification & Fraud Protection</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.mItem}>
            <Text style={styles.mVal}>₹1.48 Cr</Text>
            <Text style={styles.mLab}>{t('totalGMV')}</Text>
          </View>
          <View style={styles.mItem}>
            <Text style={styles.mVal}>1,240 Tons</Text>
            <Text style={styles.mLab}>Bulk Traded</Text>
          </View>
          <View style={styles.mItem}>
            <Text style={styles.mVal}>42</Text>
            <Text style={styles.mLab}>Fraud Blocked</Text>
          </View>
        </View>
      </Card>

      {/* Verification Queue */}
      <Text style={styles.sectionTitleHeader}>
        {t('sellersPending')} ({pendingSellers.length})
      </Text>

      {pendingSellers.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="checkmark-circle" size={32} color={safeSuccess} />
          <Text style={styles.emptyText}>All seller verification requests approved!</Text>
        </Card>
      ) : (
        pendingSellers.map((seller) => (
          <Card key={seller.id} style={styles.pendingCard}>
            <View style={styles.pendingRow}>
              <View style={{ flex: 1 }}>
                <Badge label={seller.type.toUpperCase()} variant="trust" size="sm" />
                <Text style={styles.sellerName}>{seller.name}</Text>
                <Text style={styles.sellerSub}>📍 {seller.location}</Text>
                <Text style={styles.licText}>Gov License: {seller.licenseSubmitted}</Text>
              </View>

              <View style={styles.actionCol}>
                <Button
                  title="Approve"
                  variant="primary"
                  size="sm"
                  onPress={() => handleApprove(seller.id)}
                />
                <Button
                  title="Reject"
                  variant="danger"
                  size="sm"
                  onPress={() => handleApprove(seller.id)}
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>
          </Card>
        ))
      )}

      {/* Moderation Queue */}
      <Text style={styles.sectionTitleHeader}>Recent Product & Bulk Harvest Audit</Text>

      {products.slice(0, 3).map((item) => (
        <Card key={item.id} style={styles.auditCard}>
          <View style={styles.auditRow}>
            <View style={{ flex: 1 }}>
              <Badge
                label={item.certifiedType === 'LOCAL_GOV' ? 'LOCAL GOVT SEAL' : 'NATIONAL GOV SEAL'}
                variant={item.certifiedType === 'LOCAL_GOV' ? 'gov' : 'trust'}
                size="sm"
              />
              <Text style={styles.auditTitle}>{item.name}</Text>
              <Text style={styles.auditSeller}>Seller: {item.sellerName}</Text>
            </View>
            <Badge label="100% PASSED" variant="success" size="sm" />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  scrollBody: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  headerCard: {
    marginBottom: safeSpacingMd,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safeTextLight,
  },
  headerSub: {
    fontSize: 11,
    color: '#C8E6C9',
    marginBottom: safeSpacingMd,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  mItem: {
    alignItems: 'center',
  },
  mVal: {
    fontSize: 16,
    fontWeight: '800',
    color: safeSunGold,
  },
  mLab: {
    fontSize: 10,
    color: '#C8E6C9',
  },
  sectionTitleHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: safeSpacingXs,
  },
  pendingCard: {
    marginBottom: safeSpacingSm,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 2,
  },
  sellerSub: {
    fontSize: 11,
    color: safeTextMuted,
  },
  licText: {
    fontSize: 11,
    color: safeTextSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  actionCol: {
    marginLeft: safeSpacingSm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: safeSpacingLg,
    marginBottom: safeSpacingMd,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: safeSuccess,
    marginTop: safeSpacingXs,
  },
  auditCard: {
    marginBottom: safeSpacingXs,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 2,
  },
  auditSeller: {
    fontSize: 11,
    color: safeTextMuted,
  },
});
