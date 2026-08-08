import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Badge from './ui/Badge';

const safeAccent = (COLORS && COLORS.accent) || '#4CAF50';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;

export default function SustainabilityAnalyticsCard() {
  const { t } = useApp();

  return (
    <Card bg="#12361C" style={styles.card} elevation="medium">
      <View style={styles.header}>
        <Ionicons name="leaf-outline" size={24} color={safeAccent} />
        <View style={{ marginLeft: safeSpacingXs, flex: 1 }}>
          <Text style={styles.title}>{t('sustainabilityTitle')}</Text>
          <Text style={styles.sub}>{t('sustainabilitySub')}</Text>
        </View>
        <Badge label="VERIFIED 2026" variant="success" size="sm" />
      </View>

      <View style={styles.grid}>
        <View style={styles.metricBox}>
          <Ionicons name="cloud-done-outline" size={20} color={safeAccent} />
          <Text style={styles.metricVal}>14,890</Text>
          <Text style={styles.metricLabel}>{t('co2Offset')}</Text>
        </View>

        <View style={styles.metricBox}>
          <Ionicons name="beaker-outline" size={20} color="#81C784" />
          <Text style={styles.metricVal}>84,200 Kg</Text>
          <Text style={styles.metricLabel}>{t('chemReplaced')}</Text>
        </View>

        <View style={styles.metricBox}>
          <Ionicons name="water-outline" size={20} color="#64B5F6" />
          <Text style={styles.metricVal}>1.2M L</Text>
          <Text style={styles.metricLabel}>{t('waterSaved')}</Text>
        </View>

        <View style={styles.metricBox}>
          <Ionicons name="planet-outline" size={20} color="#FFD54F" />
          <Text style={styles.metricVal}>0.84%</Text>
          <Text style={styles.metricLabel}>{t('socIncrease')}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#2E7D32',
    marginVertical: safeSpacingSm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: safeSpacingSm,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextLight,
  },
  sub: {
    fontSize: 11,
    color: '#A5D6A7',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: safeSpacingXs + 2,
  },
  metricBox: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: safeRadiusMd,
    padding: safeSpacingSm + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: safeTextLight,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#C8E6C9',
    marginTop: 2,
  },
});
