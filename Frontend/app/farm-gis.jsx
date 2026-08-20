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
import { gisApi } from '../utils/apiClient';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';
const safeDanger = (COLORS && COLORS.danger) || '#D32F2F';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;

export default function FarmGisScreen() {
  const [farmId, setFarmId] = useState('farm-sehore-101');
  const [farmName, setFarmName] = useState('Patel Bio Heritage Acres');
  const [ownerName, setOwnerName] = useState('Ramesh Patel');
  const [chemicalDistance, setChemicalDistance] = useState('45.0');

  const [gisReport, setGisReport] = useState(null);

  const handleVerifyBoundary = async () => {
    try {
      const res = await gisApi.verifyBoundary({
        farmId,
        farmName,
        ownerName,
        nearestChemicalFarmDistanceMeters: parseFloat(chemicalDistance) || 45.0,
      });

      if (res && res.parcelReport) {
        setGisReport(res.parcelReport);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Satellite GIS audit failed.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="map" size={38} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Satellite GIS Farm Boundary Hub</Text>
            <Text style={styles.headerSub}>GeoJSON Polygon Boundary & 30-Meter Chemical Buffer Zone Auditor</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Badge label="SENTINEL-2 SATELLITE 10M RES" variant="trust" size="sm" />
          <Badge label="ORGANIC BUFFER AUDIT" variant="success" size="sm" />
        </View>
      </Card>

      {/* Input Farm Form */}
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>🌐 Verify Farm GIS Boundary & Buffer</Text>

        <Input
          label="Farm ID / Cadastral Plot Number"
          value={farmId}
          onChangeText={setFarmId}
        />
        <Input
          label="Farm Parcel Name"
          value={farmName}
          onChangeText={setFarmName}
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="Owner Name"
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="Distance to Chem Farm (m)"
              keyboardType="numeric"
              value={chemicalDistance}
              onChangeText={setChemicalDistance}
            />
          </View>
        </View>

        <Button
          title="Run Satellite Buffer Audit"
          variant="primary"
          size="sm"
          onPress={handleVerifyBoundary}
          style={{ marginTop: safeSpacingXs }}
        />
      </Card>

      {/* Satellite Audit Report Card */}
      {gisReport && (
        <Card
          style={[
            styles.reportCard,
            { borderLeftColor: gisReport.bufferZoneAudit.isCompliant ? safeSuccess : safeDanger },
          ]}
        >
          <View style={styles.reportHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.parcelTitle}>📍 {gisReport.farmName}</Text>
              <Text style={styles.ownerText}>Owner: {gisReport.ownerName}</Text>
            </View>
            <Badge
              label={gisReport.bufferZoneAudit.isCompliant ? 'BUFFER COMPLIANT' : 'DRIFT HAZARD ALARM'}
              variant={gisReport.bufferZoneAudit.isCompliant ? 'success' : 'danger'}
              size="sm"
            />
          </View>

          {/* Map Wireframe Box */}
          <View style={styles.mapBox}>
            <Ionicons name="planet-outline" size={32} color={safePrimaryDark} />
            <Text style={styles.mapText}>GeoJSON Polygon Boundary Mapped</Text>

            <View style={styles.coordRow}>
              <Text style={styles.coordLabel}>Center Lat/Lng:</Text>
              <Text style={styles.coordVal}>
                {gisReport.polygonGeoJSON.coordinates[0][0][1]}° N, {gisReport.polygonGeoJSON.coordinates[0][0][0]}° E
              </Text>
            </View>
          </View>

          {/* Buffer Audit Details */}
          <View style={styles.auditDetailsBox}>
            <Text style={styles.auditHeader}>30-Meter Organic Buffer Zone Audit</Text>
            <Text style={styles.auditSub}>
              Nearest Synthetic Chemical Farm Boundary: <Text style={{ fontWeight: '800' }}>{gisReport.bufferZoneAudit.nearestChemicalFarmDistanceMeters} Meters</Text>
            </Text>
            <Text style={styles.auditSub}>
              Min Mandatory Distance Required: <Text style={{ fontWeight: '800' }}>{gisReport.bufferZoneAudit.requiredBufferMeters} Meters</Text>
            </Text>

            <View
              style={[
                styles.statusBanner,
                { backgroundColor: gisReport.bufferZoneAudit.isCompliant ? '#E8F5E9' : '#FFEBEE' },
              ]}
            >
              <Ionicons
                name={gisReport.bufferZoneAudit.isCompliant ? 'shield-checkmark' : 'alert-circle'}
                size={20}
                color={gisReport.bufferZoneAudit.isCompliant ? safeSuccess : safeDanger}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: gisReport.bufferZoneAudit.isCompliant ? safeSuccess : safeDanger },
                ]}
              >
                {gisReport.bufferZoneAudit.complianceStatus}
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
  reportCard: { marginBottom: safeSpacingMd, borderLeftWidth: 5 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: safeSpacingXs },
  parcelTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary },
  ownerText: { fontSize: 11, color: safeTextMuted },
  mapBox: {
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    padding: safeSpacingMd,
    borderRadius: safeRadiusSm,
    marginVertical: safeSpacingXs,
  },
  mapText: { fontSize: 12, fontWeight: '700', color: safePrimaryDark, marginTop: 4 },
  coordRow: { flexDirection: 'row', marginTop: 4 },
  coordLabel: { fontSize: 10, color: safeTextMuted },
  coordVal: { fontSize: 10, fontWeight: '700', color: safeTextPrimary, marginLeft: 4 },
  auditDetailsBox: { marginTop: safeSpacingXs },
  auditHeader: { fontSize: 13, fontWeight: '700', color: safeTextPrimary },
  auditSub: { fontSize: 11, color: safeTextSecondary, marginTop: 2 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: safeSpacingXs,
    borderRadius: 4,
    marginTop: safeSpacingXs,
  },
  statusText: { fontSize: 11, fontWeight: '800', marginLeft: 6, flex: 1 },
});
