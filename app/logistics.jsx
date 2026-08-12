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
import CustomsCalculatorCard from '../components/CustomsCalculatorCard';
import apiClient, { shelfLifeApi } from '../utils/apiClient';

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
const safeTrustBlue = (COLORS && COLORS.trustBlue) || '#1976D2';
const safeEarth = (COLORS && COLORS.earth) || '#5D4037';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function LogisticsScreen() {
  const { shipments, t } = useApp();
  const [calcTons, setCalcTons] = useState('10');
  const [calcKM, setCalcKM] = useState('250');
  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [quoteBreakdown, setQuoteBreakdown] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Cold-Chain Arrhenius State
  const commodityType = 'BIO_INOCULANT_BEAUVERIA';
  const [exposureHours, setExposureHours] = useState('48');
  const [shelfReport, setShelfReport] = useState(null);

  const handleEvaluateShelfLife = async () => {
    try {
      const res = await shelfLifeApi.evaluate({
        commodityType,
        nominalShelfLifeDays: 180,
        referenceTempCelsius: 4.0,
        temperatureReadingsCelsius: [4.5, 4.8, 5.0, 4.2],
        exposureHours: parseFloat(exposureHours) || 48,
      });
      if (res && res.shelfLifeReport) {
        setShelfReport(res.shelfLifeReport);
      }
    } catch (e) {
      console.warn('Shelf-life evaluation error:', e);
    }
  };

  const handleCalculateFreight = async () => {
    const tons = parseFloat(calcTons) || 1;
    const km = parseFloat(calcKM) || 100;
    setIsCalculating(true);
    try {
      const res = await apiClient.logistics.calculateFreight({
        weightTons: tons,
        distanceKm: km,
      });
      if (res && res.breakdown) {
        setCalculatedQuote(res.breakdown.totalFreight);
        setQuoteBreakdown(res.breakdown);
      } else {
        const est = 1500 + tons * km * 12;
        setCalculatedQuote(est);
      }
    } catch (_err) {
      const est = 1500 + tons * km * 12;
      setCalculatedQuote(est);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Header Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="bus-outline" size={28} color={safeSunGold} />
          <View style={{ marginLeft: safeSpacingSm, flex: 1 }}>
            <Text style={styles.headerTitle}>{t('logisticsTitle')}</Text>
            <Text style={styles.headerSub}>Middleman-Free Direct Farm Trucking & Global Freight</Text>
          </View>
        </View>
      </Card>

      {/* Live Route GPS Visualizer Simulator */}
      <Card bg="#E3F2FD" style={styles.mapVisualCard} elevation="medium">
        <View style={styles.mapHeader}>
          <Ionicons name="map-outline" size={20} color={safeTrustBlue} />
          <Text style={styles.mapTitle}>Live GPS Route & Transit Progress Simulator</Text>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapNode}>
            <View style={styles.mapIconCircle}>
              <Ionicons name="leaf" size={16} color={safePrimary} />
            </View>
            <Text style={styles.mapNodeText}>Farm Origin</Text>
            <Text style={styles.mapTime}>08:00 AM</Text>
          </View>

          <View style={styles.mapLineDone} />

          <View style={styles.mapNode}>
            <View style={styles.mapIconCircle}>
              <Ionicons name="scale" size={16} color={safeEarth} />
            </View>
            <Text style={styles.mapNodeText}>Weighbridge</Text>
            <Text style={styles.mapTime}>11:30 AM</Text>
          </View>

          <View style={styles.mapLineActive} />

          <View style={styles.mapNode}>
            <View style={[styles.mapIconCircle, { backgroundColor: safeTerracotta }]}>
              <Ionicons name="bus" size={16} color={safeTextLight} />
            </View>
            <Text style={styles.mapNodeTextActive}>In Transit</Text>
            <Text style={styles.mapTimeActive}>LIVE NOW</Text>
          </View>

          <View style={styles.mapLinePending} />

          <View style={styles.mapNode}>
            <View style={[styles.mapIconCircle, { backgroundColor: safeBorder }]}>
              <Ionicons name="business" size={16} color={safeTextMuted} />
            </View>
            <Text style={styles.mapNodeText}>Warehouse</Text>
            <Text style={styles.mapTime}>04:30 PM</Text>
          </View>
        </View>

        {/* Cold-Chain Telemetry Log */}
        <View style={styles.telemetryBox}>
          <View style={styles.telemetryItem}>
            <Ionicons name="thermometer-outline" size={16} color={safeTrustBlue} />
            <Text style={styles.telemetryLabel}>Cold-Chain Temp:</Text>
            <Text style={styles.telemetryVal}>5.4 °C (Optimal)</Text>
          </View>
          <View style={styles.telemetryItem}>
            <Ionicons name="water-outline" size={16} color={safePrimaryLight} />
            <Text style={styles.telemetryLabel}>Container Humidity:</Text>
            <Text style={styles.telemetryVal}>62% RH</Text>
          </View>
        </View>
      </Card>

      {/* Domestic Heavy Freight Calculator */}
      <Card style={styles.calcCard}>
        <Text style={styles.sectionTitle}>🚛 Direct Farm Bulk Freight Calculator (Tons)</Text>
        <Text style={styles.sectionSub}>Get instant domestic freight rates for multi-ton harvests & bio-inputs:</Text>

        <View style={styles.inputRow}>
          <Input
            label="Weight (Tons)"
            value={calcTons}
            onChangeText={setCalcTons}
            keyboardType="numeric"
            style={{ flex: 1, marginRight: safeSpacingXs }}
          />
          <Input
            label="Distance (KM)"
            value={calcKM}
            onChangeText={setCalcKM}
            keyboardType="numeric"
            style={{ flex: 1, marginLeft: safeSpacingXs }}
          />
        </View>

        <Button
          title={isCalculating ? 'Calculating Live Freight Quote...' : 'Calculate Domestic Freight Quote'}
          variant="terracotta"
          size="md"
          onPress={handleCalculateFreight}
          disabled={isCalculating}
          style={{ marginTop: safeSpacingXs }}
        />

        {calculatedQuote !== null && (
          <View style={styles.quoteBox}>
            <Text style={styles.quoteLabel}>Estimated Direct Freight Cost:</Text>
            <Text style={styles.quoteVal}>₹{calculatedQuote.toLocaleString()}</Text>
            {quoteBreakdown && (
              <Text style={{ fontSize: 11, color: safeTextSecondary, marginTop: 2 }}>
                Transport: ₹{quoteBreakdown.transportCost} | Surcharge: ₹{quoteBreakdown.fuelSurcharge}
              </Text>
            )}
            <Text style={styles.quoteNote}>
              Includes weighbridge verification, transit insurance, and destination lab inspection.
            </Text>
          </View>
        )}
      </Card>

      {/* Global Customs & Duty Tariff Calculator Widget */}
      <CustomsCalculatorCard />

      {/* Arrhenius Biological Cold-Chain Watchdog */}
      <Card bg="#F4FBF7" style={{ marginBottom: safeSpacingMd, borderLeftWidth: 4, borderLeftColor: safePrimary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: safeSpacingXs }}>
          <Ionicons name="thermometer-outline" size={24} color={safePrimary} />
          <Text style={{ fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginLeft: 8, flex: 1 }}>
            Arrhenius Cold-Chain Biological Watchdog
          </Text>
          <Badge label="Q10 KINETICS" variant="success" size="sm" />
        </View>

        <Text style={{ fontSize: 11, color: safeTextSecondary, marginBottom: safeSpacingSm }}>
          Predictive microbial inoculant degradation & spore viability watchdog in transit:
        </Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Exposure Hours:"
              keyboardType="numeric"
              value={exposureHours}
              onChangeText={setExposureHours}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', paddingTop: 8 }}>
            <Button
              title="Evaluate Potency"
              variant="primary"
              size="sm"
              onPress={handleEvaluateShelfLife}
            />
          </View>
        </View>

        {shelfReport && (
          <View style={{ backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginTop: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: safePrimaryDark }}>
                Status: {shelfReport.viabilityStatus}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: safePrimary }}>
                {shelfReport.integrityPercentage}% Viable
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: safeTextSecondary }}>
              Remaining Potency: {shelfReport.remainingShelfLifeDays} / {shelfReport.nominalShelfLifeDays} Nominal Days
            </Text>
          </View>
        )}
      </Card>

      {/* Active Shipments Trackers */}
      <Text style={styles.sectionTitleHeader}>{t('activeShipments')} ({shipments.length})</Text>

      {shipments.map((ship) => (
        <Card key={ship.id} style={styles.shipCard}>
          <View style={styles.shipHeader}>
            <Badge
              label={ship.type === 'BULK_FREIGHT' ? 'HEAVY TRUCKLOAD FREIGHT' : 'GREEN PARCEL EXPRESS'}
              variant={ship.type === 'BULK_FREIGHT' ? 'bulk' : 'success'}
              size="sm"
            />
            <Text style={styles.shipId}>{ship.id}</Text>
          </View>

          <Text style={styles.shipTitle}>{ship.title}</Text>
          <Text style={styles.shipRoute}>📍 From: {ship.origin}</Text>
          <Text style={styles.shipRoute}>🏁 To: {ship.destination}</Text>

          {ship.vehicleNo && (
            <View style={styles.driverBox}>
              <Ionicons name="person-circle-outline" size={24} color={safePrimary} />
              <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
                <Text style={styles.driverName}>Driver: {ship.driverName} ({ship.vehicleNo})</Text>
                <Text style={styles.driverPhone}>{ship.driverPhone}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call" size={14} color={safeTextLight} />
              </TouchableOpacity>
            </View>
          )}

          {/* Timeline Milestones */}
          <Text style={styles.timelineTitle}>Tracking Timeline:</Text>
          <View style={styles.timeline}>
            {ship.milestones.map((m, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineDot,
                    m.completed ? styles.timelineDotDone : styles.timelineDotPending,
                  ]}
                >
                  {m.completed && <Ionicons name="checkmark" size={10} color={safeTextLight} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, m.completed && { fontWeight: '700' }]}>
                    {m.label}
                  </Text>
                  <Text style={styles.timelineDate}>{m.date}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.escrowFooter}>
            <Ionicons name="shield-checkmark" size={14} color={safeTrustBlue} />
            <Text style={styles.escrowText}>{ship.escrowStatus}</Text>
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
  mapVisualCard: {
    borderColor: '#90CAF9',
    marginBottom: safeSpacingMd,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: safeSpacingSm,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: safeTrustBlue,
    marginLeft: safeSpacingXs,
  },
  mapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: safeSpacingXs,
  },
  mapNode: {
    alignItems: 'center',
    flex: 1,
  },
  mapIconCircle: {
    width: 28,
    height: 28,
    borderRadius: safeRadiusFull,
    backgroundColor: safeCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: safeBorder,
  },
  mapNodeText: {
    fontSize: 9,
    color: safeTextMuted,
    textAlign: 'center',
  },
  mapNodeTextActive: {
    fontSize: 9,
    fontWeight: '800',
    color: safeTerracotta,
    textAlign: 'center',
  },
  mapTime: {
    fontSize: 8,
    color: safeTextMuted,
  },
  mapTimeActive: {
    fontSize: 8,
    fontWeight: '800',
    color: safeTerracotta,
  },
  mapLineDone: {
    flex: 1,
    height: 2,
    backgroundColor: safePrimary,
    marginTop: -16,
  },
  mapLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: safeTerracotta,
    marginTop: -16,
  },
  mapLinePending: {
    flex: 1,
    height: 2,
    backgroundColor: safeBorder,
    marginTop: -16,
  },
  telemetryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: safeSpacingXs + 2,
    marginTop: safeSpacingSm,
    borderWidth: 1,
    borderColor: safeBorder,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryLabel: {
    fontSize: 10,
    color: safeTextMuted,
    marginLeft: 3,
  },
  telemetryVal: {
    fontSize: 10,
    fontWeight: '700',
    color: safeTextPrimary,
    marginLeft: 3,
  },
  calcCard: {
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
  inputRow: {
    flexDirection: 'row',
  },
  quoteBox: {
    backgroundColor: '#FBE9E7',
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd,
    marginTop: safeSpacingSm,
    borderWidth: 1,
    borderColor: '#FFAB91',
    alignItems: 'center',
  },
  quoteLabel: {
    fontSize: 12,
    color: safeTextSecondary,
  },
  quoteVal: {
    fontSize: 22,
    fontWeight: '800',
    color: safeTerracotta,
    marginVertical: 2,
  },
  quoteNote: {
    fontSize: 10,
    color: safeTextMuted,
    textAlign: 'center',
  },
  sectionTitleHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: safeSpacingXs,
  },
  shipCard: {
    marginBottom: safeSpacingMd,
  },
  shipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shipId: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextMuted,
  },
  shipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: safeTextPrimary,
    marginBottom: 2,
  },
  shipRoute: {
    fontSize: 12,
    color: safeTextSecondary,
  },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeBg,
    borderRadius: safeRadiusMd,
    padding: safeSpacingXs + 2,
    marginVertical: safeSpacingXs,
  },
  driverName: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  driverPhone: {
    fontSize: 11,
    color: safeTextMuted,
  },
  callBtn: {
    width: 28,
    height: 28,
    borderRadius: safeRadiusFull,
    backgroundColor: safePrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextSecondary,
    marginTop: safeSpacingXs,
    marginBottom: 6,
  },
  timeline: {
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: safeRadiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: safeSpacingSm,
    marginTop: 2,
  },
  timelineDotDone: {
    backgroundColor: safePrimary,
  },
  timelineDotPending: {
    backgroundColor: safeBorder,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    color: safeTextPrimary,
  },
  timelineDate: {
    fontSize: 10,
    color: safeTextMuted,
  },
  escrowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: safeSpacingXs,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: safeBorder,
  },
  escrowText: {
    fontSize: 11,
    fontWeight: '600',
    color: safeTrustBlue,
    marginLeft: 4,
  },
});
