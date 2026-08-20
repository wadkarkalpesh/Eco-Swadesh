/**
 * Deccan Origin - Farm Equipment & Drone Rental Component
 * Provides direct farmer-to-farmer and cooperative farm machinery booking:
 * Solar Tractors, Drone Bio-Sprayers, Laser Levelers, and Combine Harvesters.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingMd = (SPACING && SPACING.md) || 16;

const EQUIPMENT_CATALOG = [
  {
    id: 'eq-01',
    name: 'Autonomous Bio-Pesticide Drone (16L Tank)',
    category: 'Drone Sprayer',
    providerName: 'Kisan Drone Co-op Hub',
    rateINR: 450,
    rateUnit: 'Acre',
    speed: '8-10 Acres / Hr',
    operatorIncluded: true,
    ecoBenefit: '95% Chemical Drift Reduction',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    availableLocations: 'Punjab, Haryana, Maharashtra',
    rating: 4.9,
    verifiedOperator: true,
  },
  {
    id: 'eq-02',
    name: 'Solar-Electric 55HP Tractor & Rotavator',
    category: 'Tractor & Tillage',
    providerName: 'Sahyadri Green Agro Fleet',
    rateINR: 650,
    rateUnit: 'Hour',
    speed: '2 Acres / Hr',
    operatorIncluded: true,
    ecoBenefit: '100% Diesel-Free & Zero Carbon',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80',
    availableLocations: 'Madhya Pradesh, Maharashtra',
    rating: 4.85,
    verifiedOperator: true,
  },
  {
    id: 'eq-03',
    name: 'Laser Land Leveler with Dual-Slope GNSS',
    category: 'Precision Grading',
    providerName: 'Punjab Custom Hiring Center',
    rateINR: 950,
    rateUnit: 'Acre',
    speed: '1.5 Acres / Hr',
    operatorIncluded: true,
    ecoBenefit: '25% Irrigation Water Saved',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80',
    availableLocations: 'All North & Central Zones',
    rating: 4.95,
    verifiedOperator: true,
  },
];

export default function EquipmentRentalCard() {
  const [selectedEq, setSelectedEq] = useState(null);
  const [bookingUnits, setBookingUnits] = useState(5);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleOpenBooking = (item) => {
    setSelectedEq(item);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setSelectedEq(null);
      setBookingConfirmed(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <View style={styles.titleWithBadge}>
            <Text style={styles.sectionTitle}>🚜 Farm Machinery & Drone Rental Hub</Text>
            <Badge variant="verified" label="Operator Included" size="sm" />
          </View>
          <Text style={styles.sectionSubtitle}>
            Rent precision agriculture machinery by the hour/acre without middleman markups.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {EQUIPMENT_CATALOG.map((item) => (
          <Card key={item.id} style={styles.eqCard} variant="elevated">
            <Image source={{ uri: item.image }} style={styles.eqImage} />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={safeSunGold} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>

            <View style={styles.cardContent}>
              <Badge variant="outline" label={item.category} size="xs" />
              <Text style={styles.eqName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.providerText}>
                By {item.providerName}
              </Text>

              <View style={styles.ecoHighlight}>
                <Ionicons name="leaf" size={12} color={safeSuccess} />
                <Text style={styles.ecoText}>{item.ecoBenefit}</Text>
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.rateLabel}>Rental Rate</Text>
                  <Text style={styles.rateValue}>
                    ₹{item.rateINR.toLocaleString('en-IN')} / {item.rateUnit}
                  </Text>
                </View>
                <Button
                  title="Book Now"
                  size="sm"
                  variant="primary"
                  onPress={() => handleOpenBooking(item)}
                />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Booking Modal */}
      {selectedEq && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Reserve Machinery</Text>
                  <Text style={styles.modalSubtitle}>{selectedEq.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedEq(null)}>
                  <Ionicons name="close-circle" size={26} color={safeTextMuted} />
                </TouchableOpacity>
              </View>

              {bookingConfirmed ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={56} color={safeSuccess} />
                  <Text style={styles.successTitle}>Booking Request Dispatched!</Text>
                  <Text style={styles.successSubtitle}>
                    Operator {selectedEq.providerName} has reserved your slot. Escrow funds will be held securely until completion.
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.detailBox}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Rental Rate:</Text>
                      <Text style={styles.detailValue}>
                        ₹{selectedEq.rateINR.toLocaleString('en-IN')} per {selectedEq.rateUnit}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Operating Speed:</Text>
                      <Text style={styles.detailValue}>{selectedEq.speed}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Certified Operator:</Text>
                      <Text style={[styles.detailValue, { color: safeSuccess }]}>
                        Included (Verified by Co-op)
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.unitsPrompt}>
                    Estimated {selectedEq.rateUnit}s needed for your farm:
                  </Text>
                  <View style={styles.stepperRow}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setBookingUnits(Math.max(1, bookingUnits - 1))}
                    >
                      <Ionicons name="remove" size={20} color={safePrimaryDark} />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>
                      {bookingUnits} {selectedEq.rateUnit}s
                    </Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setBookingUnits(bookingUnits + 1)}
                    >
                      <Ionicons name="add" size={20} color={safePrimaryDark} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>Estimated Escrow Amount:</Text>
                    <Text style={styles.totalValue}>
                      ₹{(selectedEq.rateINR * bookingUnits).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <Button
                    title="Confirm Escrow Reservation"
                    variant="primary"
                    size="lg"
                    style={{ marginTop: safeSpacingMd }}
                    onPress={handleConfirmBooking}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: safeSpacingMd,
    paddingHorizontal: safeSpacingMd,
  },
  headerRow: {
    marginBottom: safeSpacingSm,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: safeSpacingSm,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: safeTextSecondary,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingVertical: safeSpacingSm,
    gap: safeSpacingMd,
  },
  eqCard: {
    width: 290,
    padding: 0,
    overflow: 'hidden',
    borderRadius: safeRadiusMd,
    backgroundColor: safeCard,
    borderColor: safeBorder,
    borderWidth: 1,
  },
  eqImage: {
    width: '100%',
    height: 140,
    backgroundColor: safeBg,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: safeRadiusFull,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: safeTextPrimary,
  },
  cardContent: {
    padding: safeSpacingMd,
  },
  eqName: {
    fontSize: 15,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: safeSpacingXs,
    lineHeight: 20,
  },
  providerText: {
    fontSize: 12,
    color: safeTextMuted,
    marginTop: 2,
  },
  ecoHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: safeRadiusMd,
    marginVertical: safeSpacingSm,
  },
  ecoText: {
    fontSize: 11,
    color: safeSuccess,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: safeSpacingXs,
  },
  rateLabel: {
    fontSize: 11,
    color: safeTextMuted,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 30, 21, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: safeSpacingMd,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
    paddingBottom: safeSpacingSm,
    marginBottom: safeSpacingMd,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  modalSubtitle: {
    fontSize: 13,
    color: safeTextSecondary,
    marginTop: 2,
  },
  detailBox: {
    backgroundColor: safeBg,
    padding: 12,
    borderRadius: safeRadiusMd,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: safeTextMuted,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  unitsPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: safeSpacingMd,
    marginBottom: safeSpacingSm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: safeRadiusFull,
    backgroundColor: '#E2E8E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: safeRadiusMd,
    marginTop: safeSpacingMd,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: safePrimaryDark,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: safePrimaryDark,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safeSuccess,
  },
  successSubtitle: {
    fontSize: 13,
    color: safeTextSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
