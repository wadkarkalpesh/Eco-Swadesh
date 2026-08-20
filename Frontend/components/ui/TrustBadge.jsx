import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import Badge from './Badge';

const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusXs = (RADIUS && RADIUS.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safeEarth = (COLORS && COLORS.earth) || '#5D4037';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';

export default function TrustBadge({
  certifiedType = 'NATIONAL', // 'NATIONAL' | 'LOCAL_GOV' | 'INTERNATIONAL'
  certName = 'Organic Certified',
  licenseNo,
  labPurityRating = '99% Pure',
  showQRSeal = true,
}) {
  const isLocalGov = certifiedType === 'LOCAL_GOV';

  return (
    <View style={[styles.container, isLocalGov && styles.localGovContainer]}>
      <View style={styles.headerRow}>
        <Ionicons
          name={isLocalGov ? 'shield-checkmark' : 'ribbon'}
          size={18}
          color={isLocalGov ? safeGovGold : safePrimary}
        />
        <Text style={[styles.certName, { color: isLocalGov ? safeEarth : safePrimaryDark }]}>
          {certName}
        </Text>
        <Badge
          label={isLocalGov ? 'LOCAL GOVT SEAL' : 'NATIONAL STANDARD'}
          variant={isLocalGov ? 'gov' : 'trust'}
          size="sm"
        />
      </View>

      <View style={styles.detailsRow}>
        {licenseNo && (
          <Text style={styles.licenseText}>
            License: <Text style={styles.boldText}>{licenseNo}</Text>
          </Text>
        )}
        <View style={styles.purityBadge}>
          <Ionicons name="flask-outline" size={12} color={safeSuccess} />
          <Text style={styles.purityText}>{labPurityRating}</Text>
        </View>
      </View>

      {showQRSeal && (
        <View style={styles.qrSealRow}>
          <Ionicons name="qr-code-outline" size={14} color={safeTextMuted} />
          <Text style={styles.qrText}>Deccan Origin Anti-Counterfeit Seal Active</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F7F1',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: safeRadiusMd,
    padding: safeSpacingSm + 2,
    marginVertical: safeSpacingXs,
  },
  localGovContainer: {
    backgroundColor: '#FFFDF5',
    borderColor: '#FFE082',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: safeSpacingXs,
  },
  certName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    marginRight: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  licenseText: {
    fontSize: 11,
    color: safeTextSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: safeTextPrimary,
  },
  purityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeAccentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: safeRadiusXs,
  },
  purityText: {
    fontSize: 11,
    fontWeight: '700',
    color: safeSuccess,
    marginLeft: 4,
  },
  qrSealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: safeSpacingXs,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  qrText: {
    fontSize: 10,
    color: safeTextMuted,
    marginLeft: 4,
    fontStyle: 'italic',
  },
});
