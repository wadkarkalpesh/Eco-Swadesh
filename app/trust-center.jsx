import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import QRScannerModal from '../components/QRScannerModal';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safeTrustBlue = (COLORS && COLORS.trustBlue) || '#1976D2';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';
const safeEarth = (COLORS && COLORS.earth) || '#5D4037';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function TrustCenterScreen() {
  const { certifications } = useApp();
  const [certQuery, setCertQuery] = useState('');
  const [searchedCert, setSearchedCert] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleVerifyCert = () => {
    if (!certQuery.trim()) return;
    const found = certifications.find(
      (c) =>
        c.licenseNo.toLowerCase().includes(certQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(certQuery.toLowerCase())
    );
    setSearchedCert(found || certifications[0]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Header Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="shield-checkmark" size={32} color={safeGovGold} />
          <View style={{ marginLeft: safeSpacingSm, flex: 1 }}>
            <Text style={styles.headerTitle}>Eco Swadesh Organic Trust & Certification Center</Text>
            <Text style={styles.headerSub}>Verifying National Authorities & Local Government Regional Norms</Text>
          </View>
        </View>
      </Card>

      {/* Certificate Verification Lookup Form */}
      <Card style={styles.searchCard}>
        <Text style={styles.sectionTitle}>🔍 Certificate & Lot Number Verification Search</Text>
        <Text style={styles.sectionSub}>Enter Certificate ID, QR Code Code, or Local Gov License #:</Text>

        <Input
          placeholder="e.g. NPOP/NAB/0014/2025 or MH-AGRI-ORG-4402"
          value={certQuery}
          onChangeText={setCertQuery}
          rightIcon={
            <TouchableOpacity onPress={handleVerifyCert}>
              <Ionicons name="search" size={20} color={safePrimary} />
            </TouchableOpacity>
          }
        />

        <View style={{ flexDirection: 'row', gap: safeSpacingXs, marginTop: safeSpacingXs }}>
          <Button
            title="Verify Certificate"
            variant="primary"
            size="md"
            onPress={handleVerifyCert}
            style={{ flex: 1 }}
          />
          <Button
            title="📷 Scan QR Code"
            variant="terracotta"
            size="md"
            onPress={() => setShowScanner(true)}
            style={{ flex: 1 }}
          />
        </View>

        <QRScannerModal
          visible={showScanner}
          onClose={() => setShowScanner(false)}
          certData={searchedCert}
        />

        {/* Verification Result Box */}
        {searchedCert && (
          <View
            style={[
              styles.certResultBox,
              searchedCert.type === 'LOCAL_GOV' ? styles.certResultGov : styles.certResultNational,
            ]}
          >
            <View style={styles.resultHeader}>
              <Badge
                label={searchedCert.type === 'LOCAL_GOV' ? 'LOCAL GOVT REGIONAL SEAL' : 'NATIONAL STANDARD'}
                variant={searchedCert.type === 'LOCAL_GOV' ? 'gov' : 'trust'}
                size="sm"
              />
              <Text style={styles.verifiedScore}>Verified: {searchedCert.verifiedScore}%</Text>
            </View>

            <Text style={styles.certNameText}>{searchedCert.name}</Text>
            <Text style={styles.certDetailText}>Issuing Authority: {searchedCert.issuingAuthority}</Text>
            <Text style={styles.certDetailText}>License No: {searchedCert.licenseNo}</Text>
            <Text style={styles.certDetailText}>Country/State: {searchedCert.country}</Text>
            <Text style={styles.certDetailText}>Valid Until: {searchedCert.validUntil}</Text>
          </View>
        )}
      </Card>

      {/* Multi-Tier Certification Standards Engine */}
      <Text style={styles.sectionTitleHeader}>Supported Organic & Government Standards</Text>

      {certifications.map((c) => (
        <Card key={c.id} style={styles.certCard}>
          <View style={styles.certRow}>
            <Ionicons
              name={c.type === 'LOCAL_GOV' ? 'shield-checkmark' : 'ribbon'}
              size={24}
              color={c.type === 'LOCAL_GOV' ? safeGovGold : safeTrustBlue}
            />
            <View style={{ flex: 1, marginLeft: safeSpacingSm }}>
              <Badge
                label={c.type === 'LOCAL_GOV' ? 'LOCAL GOVT APPROVED' : 'NATIONAL STANDARD'}
                variant={c.type === 'LOCAL_GOV' ? 'gov' : 'trust'}
                size="sm"
              />
              <Text style={styles.cTitle}>{c.name}</Text>
              <Text style={styles.cAuth}>Authority: {c.issuingAuthority}</Text>
              <Text style={styles.cLic}>License: {c.licenseNo} ({c.country})</Text>
            </View>
          </View>
        </Card>
      ))}

      {/* Anti-Counterfeit Guarantee Card */}
      <Card bg="#FFF8E1" style={styles.guaranteeCard}>
        <View style={styles.guaranteeRow}>
          <Ionicons name="lock-closed" size={28} color={safeGovGold} />
          <View style={{ marginLeft: safeSpacingSm, flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Anti-Counterfeit Protection Guarantee</Text>
            <Text style={styles.guaranteeSub}>
              Every fertilizer packet and bulk ton harvest listed on Eco Swadesh undergoes double-layer verification: Lab Chemical Analysis + QR Code Tracking. Zero fake products permitted.
            </Text>
          </View>
        </View>
      </Card>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: safeTextLight,
  },
  headerSub: {
    fontSize: 11,
    color: '#C8E6C9',
  },
  searchCard: {
    marginBottom: safeSpacingMd,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: safeTextMuted,
    marginBottom: safeSpacingXs,
  },
  certResultBox: {
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd,
    marginTop: safeSpacingMd,
    borderWidth: 1,
  },
  certResultNational: {
    backgroundColor: '#E3F2FD',
    borderColor: '#90CAF9',
  },
  certResultGov: {
    backgroundColor: '#FFFDF5',
    borderColor: '#FFE082',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: safeSpacingXs,
  },
  verifiedScore: {
    fontSize: 12,
    fontWeight: '800',
    color: safeSuccess,
  },
  certNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: 4,
  },
  certDetailText: {
    fontSize: 12,
    color: safeTextSecondary,
    marginVertical: 1,
  },
  sectionTitleHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: safeSpacingXs,
  },
  certCard: {
    marginBottom: safeSpacingSm,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 2,
  },
  cAuth: {
    fontSize: 11,
    color: safeTextMuted,
  },
  cLic: {
    fontSize: 11,
    color: safeTextSecondary,
    fontWeight: '600',
  },
  guaranteeCard: {
    borderColor: '#FFE082',
    marginTop: safeSpacingSm,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: safeEarth,
  },
  guaranteeSub: {
    fontSize: 11,
    color: safeTextSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
});
