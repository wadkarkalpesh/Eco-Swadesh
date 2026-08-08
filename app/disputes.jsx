import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const safeOverlay = (COLORS && COLORS.overlay) || 'rgba(18, 30, 21, 0.5)';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safeRadiusXl = (RADIUS && RADIUS.xl) || 28;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeDanger = (COLORS && COLORS.danger) || '#D32F2F';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';

export default function DisputesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [disputesList] = useState([
    {
      id: 'DISP-992',
      orderId: 'SHIP-8921',
      crop: '15 Tons Sharbati Wheat Truckload',
      buyer: 'AgroProcessor Flour Mill Pune',
      seller: 'Swadesh Farmer Collective Indore',
      claimReason: 'Destination Lab Test Moisture Variance (12.8% vs 11.5% Spec)',
      amountHeld: '₹6,30,000 in Escrow',
      status: 'UNDER_LAB_RETEST',
      timeline: [
        { label: 'Claim Filed by Buyer', date: '24 Jul, 02:00 PM', done: true },
        { label: 'Escrow Payout Frozen in Trust', date: '24 Jul, 02:05 PM', done: true },
        { label: 'Independent Lab Re-test Sample Sent', date: '24 Jul, 05:00 PM', done: true },
        { label: 'Final Escrow Adjustment Decision', date: '26 Jul, 10:00 AM', done: false },
      ],
    },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Header Banner */}
      <Card bg="#5D4037" style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="shield-half-outline" size={28} color={safeSunGold} />
          <View style={{ marginLeft: safeSpacingSm, flex: 1 }}>
            <Text style={styles.headerTitle}>Agri-Contract & Escrow Dispute Center</Text>
            <Text style={styles.headerSub}>Neutral Lab Resolution for Direct Bulk Freight Trade</Text>
          </View>
        </View>
      </Card>

      {/* File New Quality Claim Button */}
      <Button
        title="⚠️ File Bulk Freight Quality Claim / Lab Mismatch"
        variant="terracotta"
        size="md"
        onPress={() => setModalVisible(true)}
        style={{ marginBottom: safeSpacingMd }}
      />

      {/* Active Disputes List */}
      <Text style={styles.sectionTitle}>Active Escrow Quality Claims ({disputesList.length})</Text>

      {disputesList.map((d) => (
        <Card key={d.id} style={styles.disputeCard}>
          <View style={styles.disputeHeader}>
            <Badge label="ESCROW FROZEN" variant="danger" size="sm" />
            <Text style={styles.disputeId}>{d.id} ({d.orderId})</Text>
          </View>

          <Text style={styles.cropTitle}>{d.crop}</Text>
          <Text style={styles.partyText}>Buyer: {d.buyer}</Text>
          <Text style={styles.partyText}>Seller: {d.seller}</Text>
          <Text style={styles.claimReason}>Reason: {d.claimReason}</Text>

          <View style={styles.escrowAmountBox}>
            <Ionicons name="lock-closed" size={16} color={safeTerracotta} />
            <Text style={styles.escrowAmountText}>Amount Held: {d.amountHeld}</Text>
          </View>

          {/* Timeline */}
          <Text style={styles.timelineTitle}>Mediation Progress:</Text>
          <View style={styles.timeline}>
            {d.timeline.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={[styles.dot, step.done ? styles.dotDone : styles.dotPending]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepLabel, step.done && { fontWeight: '700' }]}>{step.label}</Text>
                  <Text style={styles.stepDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      ))}

      {/* File Claim Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>File Quality Dispute / Lab Mismatch</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color={safeTextPrimary} />
              </TouchableOpacity>
            </View>

            <Input label="Order / Waybill ID" placeholder="e.g. SHIP-8921" />
            <Input
              label="Dispute Reason"
              placeholder="e.g. Moisture content exceeded contract spec or lab test variance..."
              multiline
              numberOfLines={3}
            />

            <Button
              title="Freeze Escrow & Submit Claim"
              variant="terracotta"
              size="md"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: safeSpacingMd }}
            />
          </View>
        </View>
      </Modal>
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
    color: '#FFE082',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: safeSpacingXs,
  },
  disputeCard: {
    marginBottom: safeSpacingMd,
  },
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  disputeId: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextMuted,
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: safeTextPrimary,
    marginVertical: 2,
  },
  partyText: {
    fontSize: 12,
    color: safeTextSecondary,
  },
  claimReason: {
    fontSize: 12,
    fontWeight: '600',
    color: safeDanger,
    marginVertical: 4,
  },
  escrowAmountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBE9E7',
    padding: safeSpacingXs + 2,
    borderRadius: safeRadiusMd,
    marginVertical: safeSpacingXs,
  },
  escrowAmountText: {
    fontSize: 12,
    fontWeight: '800',
    color: safeTerracotta,
    marginLeft: 6,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextSecondary,
    marginTop: safeSpacingXs,
    marginBottom: 4,
  },
  timeline: {
    marginLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: safeRadiusFull,
    marginRight: safeSpacingXs,
    marginTop: 3,
  },
  dotDone: {
    backgroundColor: safePrimary,
  },
  dotPending: {
    backgroundColor: safeBorder,
  },
  stepLabel: {
    fontSize: 11,
    color: safeTextPrimary,
  },
  stepDate: {
    fontSize: 9,
    color: safeTextMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: safeOverlay,
    justifyContent: 'center',
    padding: safeSpacingMd,
  },
  modalCard: {
    backgroundColor: safeCard,
    borderRadius: safeRadiusXl,
    padding: safeSpacingMd,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: safeSpacingMd,
    paddingBottom: safeSpacingXs,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: safeTextPrimary,
  },
});
