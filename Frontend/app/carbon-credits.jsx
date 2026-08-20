import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { carbonApi } from '../utils/apiClient';

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
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;

export default function CarbonCreditsScreen() {
  const [acres, setAcres] = useState('25');
  const [compostTons, setCompostTons] = useState('12');
  const [noTillYears, setNoTillYears] = useState('3');
  const [result, setResult] = useState(null);

  const [mintedCredit, setMintedCredit] = useState(null);
  const [buyerCorp, setBuyerCorp] = useState('Tata Sustainability ESG Fund');
  const [retired, setRetired] = useState(false);

  const handleCalculate = async () => {
    try {
      const res = await carbonApi.calculateSequestration({
        farmAcres: parseFloat(acres) || 25,
        organicCompostTonsApplied: parseFloat(compostTons) || 12,
        noTillYears: parseInt(noTillYears) || 3,
      });
      if (res && res.success) {
        setResult(res.sequestrationAudit);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Calculation failed.');
    }
  };

  const handleMintCredits = async () => {
    try {
      const res = await carbonApi.mintCredits({
        farmerId: 'usr_farmer_cur',
        co2eTons: result ? result.co2eSequesteredTons : 52.8,
        verraStandardVerified: true,
      });
      if (res && res.success) {
        setMintedCredit(res.carbonCredit);
        Alert.alert('Carbon Credits Minted!', `Certificate ID: ${res.carbonCredit.creditId}`);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Credit minting failed.');
    }
  };

  const handleRetire = async () => {
    if (!mintedCredit) return;
    try {
      const res = await carbonApi.retireCredits(mintedCredit.creditId, buyerCorp);
      if (res && res.success) {
        setRetired(true);
        Alert.alert('ESG Credit Retired', `Credit ${mintedCredit.creditId} officially assigned to ${buyerCorp}.`);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Credit retirement failed.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="leaf" size={38} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Soil Carbon Credits & ESG Registry</Text>
            <Text style={styles.headerSub}>Quantify Soil Organic Carbon (Delta SOC%) & Mint Verra Offsets</Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.sItem}>
            <Text style={styles.sVal}>14,890</Text>
            <Text style={styles.sLab}>Total Tons CO2e</Text>
          </View>
          <View style={styles.sItem}>
            <Text style={styles.sVal}>₹1,650</Text>
            <Text style={styles.sLab}>Avg Price / Ton</Text>
          </View>
          <View style={styles.sItem}>
            <Text style={styles.sVal}>VERRA-100%</Text>
            <Text style={styles.sLab}>Certified Audit</Text>
          </View>
        </View>
      </Card>

      {/* Carbon Sequestration Calculator */}
      <Card style={styles.calcCard}>
        <Text style={styles.cardTitle}>🌾 Soil Carbon Sequestration Calculator</Text>

        <Input
          label="Farm Plot Area (Acres)"
          keyboardType="numeric"
          value={acres}
          onChangeText={setAcres}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="Compost / Bio-Char (Tons)"
              keyboardType="numeric"
              value={compostTons}
              onChangeText={setCompostTons}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="No-Till Farming (Years)"
              keyboardType="numeric"
              value={noTillYears}
              onChangeText={setNoTillYears}
            />
          </View>
        </View>

        <Button
          title="Calculate Carbon Sequestration"
          variant="primary"
          size="sm"
          onPress={handleCalculate}
          style={{ marginTop: safeSpacingXs }}
        />
      </Card>

      {/* Calculation Result */}
      {result && (
        <Card style={styles.resultCard}>
          <View style={styles.resHeader}>
            <Text style={styles.resTitle}>Delta SOC% Audit Summary</Text>
            <Badge label="VERIFIED COMPLIANT" variant="success" size="sm" />
          </View>

          <View style={styles.resGrid}>
            <View style={styles.resBox}>
              <Text style={styles.resLab}>CO2e Sequestered</Text>
              <Text style={styles.resVal}>{result.co2eSequesteredTons} Tons</Text>
            </View>

            <View style={styles.resBox}>
              <Text style={styles.resLab}>Estimated Value (₹)</Text>
              <Text style={[styles.resVal, { color: safeSuccess }]}>
                ₹{result.totalMonetaryValueINR ? result.totalMonetaryValueINR.toLocaleString() : '87,120'}
              </Text>
            </View>
          </View>

          {!mintedCredit && (
            <Button
              title="Mint Verra Eco-Carbon Credits"
              variant="secondary"
              size="sm"
              onPress={handleMintCredits}
              style={{ marginTop: safeSpacingSm }}
            />
          )}
        </Card>
      )}

      {/* Minted Credit Details & Corporate Retirement */}
      {mintedCredit && (
        <Card style={styles.mintedCard}>
          <View style={styles.resHeader}>
            <Text style={styles.mintedTitle}>📜 Verra Credit ID: {mintedCredit.creditId}</Text>
            <Badge
              label={retired ? 'RETIRED FOR ESG' : 'ACTIVE IN REGISTRY'}
              variant={retired ? 'trust' : 'success'}
              size="sm"
            />
          </View>

          <Text style={styles.mintedSub}>
            Standard: Verra VM0042 Methodology for Improved Land Management
          </Text>

          {!retired ? (
            <View style={styles.retireBox}>
              <Text style={styles.retireHeader}>Corporate ESG Offset Retirement</Text>
              <Input
                label="Corporate Buyer / ESG Fund:"
                value={buyerCorp}
                onChangeText={setBuyerCorp}
              />
              <Button
                title="Retire & Issue ESG Certificate"
                variant="primary"
                size="sm"
                onPress={handleRetire}
                style={{ marginTop: safeSpacingXs }}
              />
            </View>
          ) : (
            <View style={styles.retiredSuccessBox}>
              <Ionicons name="checkmark-seal" size={24} color={safeSuccess} />
              <Text style={styles.retiredSuccessText}>
                Officially Retired & Locked in Registry for {buyerCorp}.
              </Text>
            </View>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: safeBg },
  scrollBody: { padding: safeSpacingMd, paddingBottom: safeSpacingXxl },
  headerCard: { marginBottom: safeSpacingMd },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: safeTextLight },
  headerSub: { fontSize: 11, color: '#C8E6C9', marginTop: 2 },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: safeSpacingMd,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  sItem: { alignItems: 'center' },
  sVal: { fontSize: 15, fontWeight: '800', color: safeSunGold },
  sLab: { fontSize: 10, color: '#C8E6C9' },
  calcCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingXs },
  resultCard: { marginBottom: safeSpacingMd, borderLeftWidth: 4, borderLeftColor: safeSuccess },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingXs },
  resTitle: { fontSize: 15, fontWeight: '700', color: safeTextPrimary },
  resGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: safeSpacingXs },
  resBox: { flex: 1, alignItems: 'center', backgroundColor: '#F4F7F4', padding: safeSpacingSm, borderRadius: safeRadiusSm, marginHorizontal: 4 },
  resLab: { fontSize: 11, color: safeTextMuted },
  resVal: { fontSize: 16, fontWeight: '800', color: safeTextPrimary, marginTop: 2 },
  mintedCard: { marginBottom: safeSpacingMd, backgroundColor: '#F0F7F1' },
  mintedTitle: { fontSize: 14, fontWeight: '800', color: safePrimaryDark },
  mintedSub: { fontSize: 11, color: safeTextSecondary, marginTop: 2 },
  retireBox: { marginTop: safeSpacingSm, paddingTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#C8D4C8' },
  retireHeader: { fontSize: 13, fontWeight: '700', color: safeTextPrimary, marginBottom: 4 },
  retiredSuccessBox: { flexDirection: 'row', alignItems: 'center', marginTop: safeSpacingSm },
  retiredSuccessText: { fontSize: 12, fontWeight: '700', color: safeSuccess, marginLeft: 8 },
});
