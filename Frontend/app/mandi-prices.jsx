import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { mandiApi } from '../utils/apiClient';

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
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeRadiusXs = (RADIUS && RADIUS.xs) || 4;

export default function MandiPricesScreen() {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [rates, setRates] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [searchCrop, setSearchCrop] = useState('');

  useEffect(() => {
    fetchMandiData(selectedCrop);
  }, [selectedCrop]);

  const fetchMandiData = async (crop) => {
    try {
      const [liveRes, forecastRes] = await Promise.all([
        mandiApi.getLiveRates(crop),
        mandiApi.getForecast(crop),
      ]);
      if (liveRes && liveRes.rates) {
        setRates(liveRes.rates);
      }
      if (forecastRes && forecastRes.forecast) {
        setForecast(forecastRes.forecast);
      }
    } catch (e) {
      console.warn('Error fetching mandi prices:', e);
    }
  };

  const handleSearch = () => {
    if (searchCrop) {
      setSelectedCrop(searchCrop.toLowerCase().trim());
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Header Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="trending-up-outline" size={38} color={safeSunGold} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>APMC Mandi AI Price Forecaster</Text>
            <Text style={styles.headerSub}>Live Arrival Quotes & 30/60/90-Day Market Predictions</Text>
          </View>
        </View>
      </Card>

      {/* Crop Filter Bar */}
      <Card style={styles.filterCard}>
        <Text style={styles.filterTitle}>Select Crop / Commodity:</Text>
        <View style={styles.cropChips}>
          {['wheat', 'soybean', 'cotton', 'turmeric'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, selectedCrop === c && styles.activeChip]}
              onPress={() => setSelectedCrop(c)}
            >
              <Text style={[styles.chipText, selectedCrop === c && styles.activeChipText]}>
                {c.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input
              placeholder="Search custom crop (e.g. Rice, Mustard)..."
              value={searchCrop}
              onChangeText={setSearchCrop}
            />
          </View>
          <Button title="Search" variant="primary" size="sm" onPress={handleSearch} />
        </View>
      </Card>

      {/* Forecast Section */}
      {forecast && (
        <Card style={styles.forecastCard}>
          <View style={styles.forecastHeader}>
            <Text style={styles.forecastCropName}>
              🌾 {forecast.crop ? forecast.crop.toUpperCase() : selectedCrop.toUpperCase()} FORECAST
            </Text>
            <Badge label="AI REGRESSION MODEL" variant="trust" size="sm" />
          </View>

          <Text style={styles.currentAvg}>
            Current National Avg: <Text style={{ fontWeight: '800', color: safePrimaryDark }}>₹{forecast.currentAvgQuintalINR}/Quintal</Text>
          </Text>

          {/* Forecast Grid */}
          <View style={styles.forecastGrid}>
            <View style={styles.fBox}>
              <Text style={styles.fDays}>30 DAYS</Text>
              <Text style={styles.fPrice}>₹{forecast.projectedPrice30DaysINR}</Text>
              <Text style={styles.fTrend}>
                {forecast.trend30Days > 0 ? `+${forecast.trend30Days}%` : `${forecast.trend30Days}%`}
              </Text>
            </View>
            <View style={[styles.fBox, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.fDays}>60 DAYS</Text>
              <Text style={[styles.fPrice, { color: safeSuccess }]}>₹{forecast.projectedPrice60DaysINR}</Text>
              <Text style={[styles.fTrend, { color: safeSuccess }]}>
                {forecast.trend60Days > 0 ? `+${forecast.trend60Days}%` : `${forecast.trend60Days}%`}
              </Text>
            </View>
            <View style={styles.fBox}>
              <Text style={styles.fDays}>90 DAYS</Text>
              <Text style={styles.fPrice}>₹{forecast.projectedPrice90DaysINR}</Text>
              <Text style={styles.fTrend}>
                {forecast.trend90Days > 0 ? `+${forecast.trend90Days}%` : `${forecast.trend90Days}%`}
              </Text>
            </View>
          </View>

          <View style={styles.recBox}>
            <Ionicons name="information-circle-outline" size={18} color={safePrimaryDark} />
            <Text style={styles.recText}>
              <Text style={{ fontWeight: '700' }}>AI Advisor:</Text> {forecast.recommendation || 'Hold harvest for 45 days to maximize peak mandi rate returns.'}
            </Text>
          </View>
        </Card>
      )}

      {/* Live Mandi Rates List */}
      <Text style={styles.sectionTitleHeader}>Live State APMC Mandi Rates ({rates.length})</Text>

      {rates.map((item, idx) => (
        <Card key={idx} style={styles.mandiCard}>
          <View style={styles.mandiHeader}>
            <View>
              <Text style={styles.mandiName}>🏛️ {item.mandiName}</Text>
              <Text style={styles.mandiLocation}>📍 {item.district}, {item.state}</Text>
            </View>
            <Badge label={item.grade || 'SUPERIOR'} variant="success" size="sm" />
          </View>

          <View style={styles.mandiPriceRow}>
            <View>
              <Text style={styles.pLabel}>Modal / Benchmark Rate</Text>
              <Text style={styles.pVal}>₹{item.modalPriceQuintalINR} / Qtl</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.pLabel}>Range (Min - Max)</Text>
              <Text style={styles.pRange}>
                ₹{item.minPriceQuintalINR} - ₹{item.maxPriceQuintalINR}
              </Text>
            </View>
          </View>

          <View style={styles.arrivalFooter}>
            <Text style={styles.arrText}>Daily Arrivals: {item.dailyArrivalTons} Tons</Text>
            <Text style={styles.arrText}>Updated: {item.updatedAt || 'Today, Live'}</Text>
          </View>
        </Card>
      ))}
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
  filterCard: { marginBottom: safeSpacingMd },
  filterTitle: { fontSize: 13, fontWeight: '700', color: safeTextPrimary, marginBottom: safeSpacingXs },
  cropChips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: safeSpacingXs },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: safeRadiusFull,
    backgroundColor: '#E0EAE0',
    marginRight: 8,
    marginBottom: 6,
  },
  activeChip: { backgroundColor: safePrimaryDark },
  chipText: { fontSize: 11, fontWeight: '700', color: safeTextSecondary },
  activeChipText: { color: safeTextLight },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginTop: safeSpacingXs },
  forecastCard: { marginBottom: safeSpacingMd, borderLeftWidth: 4, borderLeftColor: safeSunGold },
  forecastHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingXs },
  forecastCropName: { fontSize: 15, fontWeight: '800', color: safeTextPrimary },
  currentAvg: { fontSize: 13, color: safeTextSecondary, marginBottom: safeSpacingSm },
  forecastGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingSm },
  fBox: {
    flex: 1,
    alignItems: 'center',
    padding: safeSpacingXs,
    backgroundColor: '#F4F7F4',
    borderRadius: safeRadiusSm,
    marginHorizontal: 2,
  },
  fDays: { fontSize: 10, fontWeight: '700', color: safeTextMuted },
  fPrice: { fontSize: 14, fontWeight: '800', color: safeTextPrimary, marginTop: 2 },
  fTrend: { fontSize: 11, fontWeight: '700', color: safeSuccess, marginTop: 1 },
  recBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: safeSpacingXs,
    borderRadius: safeRadiusXs,
  },
  recText: { fontSize: 11, color: safeTextPrimary, marginLeft: 6, flex: 1 },
  sectionTitleHeader: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingXs },
  mandiCard: { marginBottom: safeSpacingXs },
  mandiHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingXs },
  mandiName: { fontSize: 14, fontWeight: '700', color: safeTextPrimary },
  mandiLocation: { fontSize: 11, color: safeTextMuted },
  mandiPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E2',
  },
  pLabel: { fontSize: 10, color: safeTextMuted },
  pVal: { fontSize: 15, fontWeight: '800', color: safePrimaryDark },
  pRange: { fontSize: 12, fontWeight: '600', color: safeTextSecondary },
  arrivalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  arrText: { fontSize: 10, color: safeTextMuted },
});
