import React, { useState, useEffect } from 'react';
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
import { procurementApi } from '../utils/apiClient';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safePrimaryLight = (COLORS && COLORS.primaryLight) || '#2E7D32';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusSm = (RADIUS && RADIUS.sm) || 8;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;

export default function ProcurementScreen() {
  const [pools, setPools] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [joinTons, setJoinTons] = useState('5.0');

  const [newTitle, setNewTitle] = useState('');
  const [newProduct, setNewProduct] = useState('Bio-Active NPK Liquid Fertilizer');
  const [newRetailPrice, setNewRetailPrice] = useState('450');
  const [newTargetTons, setNewTargetTons] = useState('50.0');
  const [newDepot, setNewDepot] = useState('Central District Farmer Co-Op Depot');

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    try {
      const res = await procurementApi.getPools();
      if (res && res.pools) {
        setPools(res.pools);
      }
    } catch (e) {
      console.warn('Error loading pools:', e);
    }
  };

  const handleCreatePool = async () => {
    if (!newTitle) {
      Alert.alert('Required Field', 'Please enter a collective pool title.');
      return;
    }
    try {
      const res = await procurementApi.createPool({
        title: newTitle,
        productId: 'prod-custom',
        productName: newProduct,
        retailPricePerLiterINR: parseFloat(newRetailPrice) || 450,
        targetTons: parseFloat(newTargetTons) || 50,
        deliveryDepot: newDepot,
      });
      if (res && res.success) {
        Alert.alert('Pool Created!', `Collective Procurement Pool "${newTitle}" registered.`);
        setShowCreateModal(false);
        setNewTitle('');
        loadPools();
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not create pool.');
    }
  };

  const handleJoinPool = async (poolId) => {
    const tons = parseFloat(joinTons) || 1.0;
    try {
      const res = await procurementApi.joinPool(poolId, {
        farmerId: 'usr_farmer_cur',
        farmerName: 'Current User',
        committedTons: tons,
      });
      if (res && res.success) {
        Alert.alert(
          'Joined Collective Pool!',
          `You joined with ${tons} Tons. Unlocked discount: ${res.pool.currentDiscountPct}%.`
        );
        setSelectedPool(null);
        loadPools();
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not join pool.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Header Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="people-circle-outline" size={38} color={safeSunGold} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>FPO Group Procurement</Text>
            <Text style={styles.headerSub}>Collective Buying & Volume Tier Discounts for Smallholders</Text>
          </View>
        </View>

        <View style={styles.tierContainer}>
          <View style={styles.tierBox}>
            <Text style={styles.tierPercent}>10% OFF</Text>
            <Text style={styles.tierLabel}>10 Tons</Text>
          </View>
          <View style={[styles.tierBox, styles.activeTierBox]}>
            <Text style={[styles.tierPercent, { color: safeSunGold }]}>15% OFF</Text>
            <Text style={styles.tierLabel}>25 Tons</Text>
          </View>
          <View style={[styles.tierBox, styles.activeTierBox]}>
            <Text style={[styles.tierPercent, { color: '#81C784' }]}>25% OFF</Text>
            <Text style={styles.tierLabel}>50+ Tons</Text>
          </View>
        </View>
      </Card>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <Text style={styles.sectionHeader}>Active District Procurement Pools ({pools.length})</Text>
        <Button
          title="+ Create Pool"
          variant="primary"
          size="sm"
          onPress={() => setShowCreateModal(!showCreateModal)}
        />
      </View>

      {/* Create Pool Form */}
      {showCreateModal && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Initiate FPO Bulk Procurement Pool</Text>
          <Input
            label="Pool Title"
            placeholder="e.g. Ujjain Organic Bio-NPK 50 Ton Wholesale Pool"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <Input
            label="Product Name"
            placeholder="Product name"
            value={newProduct}
            onChangeText={setNewProduct}
          />
          <View style={styles.rowTwo}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Input
                label="Retail Price (₹)"
                keyboardType="numeric"
                value={newRetailPrice}
                onChangeText={setNewRetailPrice}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Input
                label="Target Tons"
                keyboardType="numeric"
                value={newTargetTons}
                onChangeText={setNewTargetTons}
              />
            </View>
          </View>
          <Input
            label="Delivery Cold Depot / FPO Hub"
            placeholder="Depot name"
            value={newDepot}
            onChangeText={setNewDepot}
          />

          <View style={styles.formButtons}>
            <Button
              title="Cancel"
              variant="outline"
              size="sm"
              onPress={() => setShowCreateModal(false)}
              style={{ marginRight: 8 }}
            />
            <Button title="Launch Group Pool" variant="primary" size="sm" onPress={handleCreatePool} />
          </View>
        </Card>
      )}

      {/* Pools List */}
      {pools.map((item) => {
        const progressPct = Math.min(100, Math.round((item.currentTons / item.targetTons) * 100));
        const isSelected = selectedPool === item.poolId;

        return (
          <Card key={item.poolId} style={styles.poolCard}>
            <View style={styles.poolHeader}>
              <Badge label={`${item.currentDiscountPct}% UNLOCKED`} variant="success" size="sm" />
              <Badge label={item.status || 'ACTIVE_OPEN'} variant="trust" size="sm" />
            </View>

            <Text style={styles.poolTitle}>{item.title}</Text>
            <Text style={styles.poolSub}>📦 {item.productName}</Text>
            <Text style={styles.depotText}>📍 Depot: {item.deliveryDepot}</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {item.currentTons} Tons committed of {item.targetTons} Tons target
                </Text>
                <Text style={styles.progressPctText}>{progressPct}%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
              </View>
            </View>

            {/* Price Savings */}
            <View style={styles.priceSavingsRow}>
              <View>
                <Text style={styles.priceLabel}>Regular Retail Price</Text>
                <Text style={styles.strikePrice}>₹{item.retailPricePerLiterINR}/L</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.discountedLabel}>FPO Group Discounted</Text>
                <Text style={styles.discountedPrice}>₹{item.effectivePricePerLiterINR}/L</Text>
              </View>
            </View>

            {/* Join Expandable Input */}
            {isSelected ? (
              <View style={styles.joinBox}>
                <Input
                  label="Enter your committed tonnage (Tons):"
                  keyboardType="numeric"
                  value={joinTons}
                  onChangeText={setJoinTons}
                />
                <View style={styles.formButtons}>
                  <Button
                    title="Close"
                    variant="outline"
                    size="sm"
                    onPress={() => setSelectedPool(null)}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    title="Confirm Order & Join Pool"
                    variant="primary"
                    size="sm"
                    onPress={() => handleJoinPool(item.poolId)}
                  />
                </View>
              </View>
            ) : (
              <Button
                title="Join FPO Bulk Procurement"
                variant="primary"
                size="sm"
                onPress={() => setSelectedPool(item.poolId)}
                style={{ marginTop: safeSpacingSm }}
              />
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: safeBg },
  scrollBody: { padding: safeSpacingMd, paddingBottom: safeSpacingXxl },
  headerCard: { marginBottom: safeSpacingMd },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: safeTextLight },
  headerSub: { fontSize: 12, color: '#C8E6C9', marginTop: 2 },
  tierContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: safeSpacingMd,
    paddingTop: safeSpacingSm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  tierBox: { alignItems: 'center', flex: 1, paddingVertical: 4 },
  activeTierBox: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: safeRadiusSm },
  tierPercent: { fontSize: 14, fontWeight: '800', color: safeTextLight },
  tierLabel: { fontSize: 10, color: '#C8E6C9' },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: safeSpacingSm,
  },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: safeTextPrimary },
  formCard: { marginBottom: safeSpacingMd, borderLeftWidth: 4, borderLeftColor: safePrimary },
  formTitle: { fontSize: 15, fontWeight: '700', color: safeTextPrimary, marginBottom: safeSpacingSm },
  rowTwo: { flexDirection: 'row' },
  formButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: safeSpacingSm },
  poolCard: { marginBottom: safeSpacingMd },
  poolHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingXs },
  poolTitle: { fontSize: 16, fontWeight: '800', color: safeTextPrimary, marginTop: 4 },
  poolSub: { fontSize: 13, color: safeTextSecondary, marginTop: 2 },
  depotText: { fontSize: 11, color: safeTextMuted, marginTop: 2 },
  progressContainer: { marginTop: safeSpacingSm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 11, fontWeight: '600', color: safeTextSecondary },
  progressPctText: { fontSize: 11, fontWeight: '800', color: safePrimary },
  progressBarTrack: { height: 8, backgroundColor: '#E0E0E0', borderRadius: safeRadiusFull, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: safePrimaryLight, borderRadius: safeRadiusFull },
  priceSavingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: safeSpacingSm,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E2',
  },
  priceLabel: { fontSize: 10, color: safeTextMuted },
  strikePrice: { fontSize: 13, color: safeTextMuted, textDecorationLine: 'line-through' },
  discountedLabel: { fontSize: 10, color: safePrimary, fontWeight: '700' },
  discountedPrice: { fontSize: 15, fontWeight: '800', color: safePrimaryDark },
  joinBox: { marginTop: safeSpacingSm, backgroundColor: '#F0F7F1', padding: safeSpacingSm, borderRadius: safeRadiusSm },
});
