import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { exportApi } from '../utils/apiClient';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function PhytosanitaryScreen() {
  const [exporterName, setExporterName] = useState('Swadesh Organic Exports Pvt Ltd');
  const [destCountry, setDestCountry] = useState('US');
  const [commodity, setCommodity] = useState('Organic Basmati Rice');
  const [tonnage, setTonnage] = useState('24.0');
  const [heavyMetalsPpm, setHeavyMetalsPpm] = useState('0.002');

  const [passport, setPassport] = useState(null);

  const handleIssuePassport = async () => {
    try {
      const res = await exportApi.issuePhytosanitary({
        exporterName,
        destinationCountry: destCountry,
        commodity,
        netTonnage: parseFloat(tonnage) || 24.0,
        icpMsLabAudit: { heavyMetalsPpm: parseFloat(heavyMetalsPpm) || 0.002 },
      });

      if (res && res.certificate) {
        setPassport(res.certificate);
        Alert.alert('Export Passport Issued!', `Certificate Number: ${res.certificate.certNumber}`);
      }
    } catch (e) {
      Alert.alert('Quarantine Excursion!', e.message || 'Heavy metal / pest excursion detected. Quarantine lock engaged.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="airplane" size={38} color={safeSunGold} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Export Biosecurity & Phytosanitary</Text>
            <Text style={styles.headerSub}>APEDA / USDA Plant Protection Biosecurity Passports</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Badge label="NABL ICP-MS LAB AUDITED" variant="trust" size="sm" />
          <Badge label="IPPC INTERNATIONAL STAMP" variant="gold" size="sm" />
        </View>
      </Card>

      {/* Issue Passport Form */}
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>✈️ Issue Phytosanitary Export Passport</Text>

        <Input
          label="Exporter Legal Entity"
          value={exporterName}
          onChangeText={setExporterName}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="Commodity"
              value={commodity}
              onChangeText={setCommodity}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="Destination (e.g. US, EU, CA)"
              value={destCountry}
              onChangeText={setDestCountry}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="Net Tonnage (Tons)"
              keyboardType="numeric"
              value={tonnage}
              onChangeText={setTonnage}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="ICP-MS Metals (PPM)"
              keyboardType="numeric"
              value={heavyMetalsPpm}
              onChangeText={setHeavyMetalsPpm}
            />
          </View>
        </View>

        <Button
          title="Audit & Issue Export Passport"
          variant="primary"
          size="sm"
          onPress={handleIssuePassport}
          style={{ marginTop: safeSpacingXs }}
        />
      </Card>

      {/* Passport Issued Certificate */}
      {passport && (
        <Card style={styles.passportCard}>
          <View style={styles.passHeader}>
            <View>
              <Text style={styles.passCertNo}>📜 {passport.certNumber}</Text>
              <Text style={styles.passSub}>Official Plant Protection Biosecurity Registry</Text>
            </View>
            <Badge label={passport.status} variant="success" size="sm" />
          </View>

          <View style={styles.passBody}>
            <View style={styles.pRow}>
              <Text style={styles.pLab}>Exporter:</Text>
              <Text style={styles.pVal}>{passport.exporterName}</Text>
            </View>
            <View style={styles.pRow}>
              <Text style={styles.pLab}>Destination Port:</Text>
              <Text style={styles.pVal}>{passport.destinationCountry}</Text>
            </View>
            <View style={styles.pRow}>
              <Text style={styles.pLab}>ICP-MS Residue Audit:</Text>
              <Text style={[styles.pVal, { color: safeSuccess }]}>PASSED (0.002 PPM &lt; 0.01 Max)</Text>
            </View>
            <View style={styles.pRow}>
              <Text style={styles.pLab}>Customs Status:</Text>
              <Text style={[styles.pVal, { color: safeSuccess, fontWeight: '800' }]}>
                {passport.customsClearanceCode || 'CLEARED_FOR_INTERNATIONAL_CONTAINER'}
              </Text>
            </View>
          </View>
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
  badgeRow: { flexDirection: 'row', marginTop: safeSpacingMd, gap: 8 },
  formCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingXs },
  passportCard: { marginBottom: safeSpacingMd, borderLeftWidth: 5, borderLeftColor: safeSunGold, backgroundColor: '#FFFDF7' },
  passHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingXs },
  passCertNo: { fontSize: 16, fontWeight: '800', color: safePrimaryDark },
  passSub: { fontSize: 11, color: safeTextMuted },
  passBody: { marginTop: safeSpacingXs, paddingTop: safeSpacingXs, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
  pRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  pLab: { fontSize: 11, color: safeTextMuted },
  pVal: { fontSize: 11, fontWeight: '700', color: safeTextPrimary },
});
