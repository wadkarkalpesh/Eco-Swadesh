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
import { creditApi } from '../utils/apiClient';

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
const safeRadiusXs = (RADIUS && RADIUS.xs) || 4;

export default function AgriCreditScreen() {
  const [completedOrders, setCompletedOrders] = useState('52');
  const [disputesCount, setDisputesCount] = useState('0');
  const [labPurityPct, setLabPurityPct] = useState('99.8');
  const [annualTonnage, setAnnualTonnage] = useState('45.0');

  const [creditReport, setCreditReport] = useState(null);
  const [loanOffers, setLoanOffers] = useState([]);
  const [appliedLoan, setAppliedLoan] = useState(null);

  const handleEvaluateScore = async () => {
    try {
      const res = await creditApi.getScore({
        farmerId: 'usr_farmer_patel',
        farmerName: 'Ramesh Patel',
        completedEscrowOrdersCount: parseInt(completedOrders) || 50,
        escrowDefaultDisputeCount: parseInt(disputesCount) || 0,
        labChemicalPurityPct: parseFloat(labPurityPct) || 99.8,
        annualHarvestTonnage: parseFloat(annualTonnage) || 45.0,
      });

      if (res && res.creditReport) {
        setCreditReport(res.creditReport);

        const offersRes = await creditApi.getLoanOffers(res.creditReport.farmerId);
        if (offersRes && offersRes.offers) {
          setLoanOffers(offersRes.offers);
        }
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Credit rating calculation failed.');
    }
  };

  const handleApplyLoan = (offer) => {
    setAppliedLoan(offer);
    Alert.alert(
      'Kisan Credit Loan Applied!',
      `Application for ${offer.facilityName} (${offer.maxAmountINR.toLocaleString()} INR at ${offer.interestRate}) submitted successfully.`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="card" size={38} color={safeSunGold} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Alternative Eco Agri-Credit Hub</Text>
            <Text style={styles.headerSub}>300-900 Alternative Underwriting & Subsidized 4% Kisan Credit Loans</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Badge label="PRIORITY SECTOR AGRI-LENDING" variant="gold" size="sm" />
          <Badge label="NO COLLATERAL UP TO ₹3 LAKH" variant="success" size="sm" />
        </View>
      </Card>

      {/* Credit Evaluation Form */}
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>📊 Calculate Alternative Agri-Credit Rating</Text>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="Completed Escrow Orders"
              keyboardType="numeric"
              value={completedOrders}
              onChangeText={setCompletedOrders}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="Default Disputes"
              keyboardType="numeric"
              value={disputesCount}
              onChangeText={setDisputesCount}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="NABL Lab Purity (%)"
              keyboardType="numeric"
              value={labPurityPct}
              onChangeText={setLabPurityPct}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="Annual Tonnage (Tons)"
              keyboardType="numeric"
              value={annualTonnage}
              onChangeText={setAnnualTonnage}
            />
          </View>
        </View>

        <Button
          title="Underwrite My Agri-Credit Score"
          variant="primary"
          size="sm"
          onPress={handleEvaluateScore}
          style={{ marginTop: safeSpacingXs }}
        />
      </Card>

      {/* Underwriting Report */}
      {creditReport && (
        <Card style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View>
              <Text style={styles.scoreTitle}>Agri-Credit Score</Text>
              <Text style={styles.scoreVal}>{creditReport.creditScore} / 900</Text>
            </View>
            <Badge label={creditReport.ratingGrade || 'PRIME_ORGANIC_BORROWER'} variant="success" size="lg" />
          </View>

          <Text style={styles.tierSub}>
            Tier Status: <Text style={{ fontWeight: '700', color: safePrimaryDark }}>{creditReport.tierCategory || 'Prime Kisan Tier A+'}</Text>
          </Text>

          <View style={styles.breakdownGrid}>
            <View style={styles.bBox}>
              <Text style={styles.bLab}>Escrow Track Record</Text>
              <Text style={styles.bVal}>98% Clean</Text>
            </View>
            <View style={styles.bBox}>
              <Text style={styles.bLab}>Organic Lab Rating</Text>
              <Text style={styles.bVal}>99.8% Pure</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Eligible Loan Facilities */}
      {loanOffers.length > 0 && (
        <View style={{ marginTop: safeSpacingSm }}>
          <Text style={styles.sectionTitleHeader}>Eligible Kisan Credit Facilities ({loanOffers.length})</Text>

          {loanOffers.map((offer, idx) => (
            <Card key={idx} style={styles.offerCard}>
              <View style={styles.offerHeader}>
                <Badge label={offer.interestRate} variant="gold" size="sm" />
                <Badge label="NABARD SUBSIDIZED" variant="trust" size="sm" />
              </View>

              <Text style={styles.facilityName}>{offer.facilityName}</Text>
              <Text style={styles.facilityLender}>Lender: {offer.lendingBank}</Text>

              <View style={styles.amountRow}>
                <View>
                  <Text style={styles.aLab}>Pre-Approved Amount</Text>
                  <Text style={styles.aVal}>₹{offer.maxAmountINR.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.aLab}>Tenure</Text>
                  <Text style={styles.aTenure}>{offer.tenureMonths} Months</Text>
                </View>
              </View>

              <Button
                title={appliedLoan && appliedLoan.facilityName === offer.facilityName ? "Application Under Review" : "Instant Apply"}
                variant={appliedLoan && appliedLoan.facilityName === offer.facilityName ? "outline" : "primary"}
                size="sm"
                onPress={() => handleApplyLoan(offer)}
                style={{ marginTop: safeSpacingSm }}
              />
            </Card>
          ))}
        </View>
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
  badgeRow: { flexDirection: 'row', marginTop: safeSpacingMd, gap: 8 },
  formCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingXs },
  reportCard: { marginBottom: safeSpacingMd, borderLeftWidth: 5, borderLeftColor: safeSunGold },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreTitle: { fontSize: 12, color: safeTextMuted },
  scoreVal: { fontSize: 26, fontWeight: '800', color: safePrimaryDark },
  tierSub: { fontSize: 12, color: safeTextSecondary, marginTop: safeSpacingXs },
  breakdownGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: safeSpacingSm },
  bBox: { flex: 1, backgroundColor: '#F4F7F4', padding: safeSpacingXs, borderRadius: safeRadiusXs, marginHorizontal: 2, alignItems: 'center' },
  bLab: { fontSize: 10, color: safeTextMuted },
  bVal: { fontSize: 12, fontWeight: '700', color: safeSuccess, marginTop: 2 },
  sectionTitleHeader: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingXs },
  offerCard: { marginBottom: safeSpacingSm },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingXs },
  facilityName: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginTop: 2 },
  facilityLender: { fontSize: 11, color: safeTextMuted },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: safeSpacingXs, paddingTop: safeSpacingXs, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
  aLab: { fontSize: 10, color: safeTextMuted },
  aVal: { fontSize: 16, fontWeight: '800', color: safeSuccess },
  aTenure: { fontSize: 13, fontWeight: '700', color: safeTextPrimary },
});
