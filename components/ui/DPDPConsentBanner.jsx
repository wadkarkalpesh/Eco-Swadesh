import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import Card from './Card';
import Button from './Button';
import { privacyManager } from '../../utils/privacyManager';

const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeSuccess = (COLORS && COLORS.success) || '#2E7D32';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;

export default function DPDPConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    marketingUpdates: false,
    thirdPartyCertifiers: true,
    agronomyTelemetry: true,
  });

  useEffect(() => {
    const existing = privacyManager.getConsentState();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    privacyManager.saveConsentState({
      marketingUpdates: true,
      thirdPartyCertifiers: true,
      agronomyTelemetry: true,
    }, true);
    setVisible(false);
  };

  const handleSavePreferences = () => {
    privacyManager.saveConsentState(preferences, true);
    setShowModal(false);
    setVisible(false);
  };

  if (!visible && !showModal) return null;

  return (
    <>
      {visible && (
        <Card bg="#FFFDF5" style={styles.bannerContainer}>
          <View style={styles.bannerRow}>
            <Ionicons name="shield-checkmark" size={24} color={safePrimary} />
            <View style={{ flex: 1, marginLeft: safeSpacingSm }}>
              <Text style={styles.bannerTitle}>DPDP Privacy & Data Transparency Notice</Text>
              <Text style={styles.bannerSub}>
                Eco-Swadesh processes essential farm order data & organic certification seals in compliance with India&apos;s DPDP Act 2023.
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.customBtn}>
              <Text style={styles.customBtnText}>Manage Preferences</Text>
            </TouchableOpacity>
            <Button
              title="Accept & Continue"
              variant="primary"
              size="sm"
              onPress={handleAcceptAll}
            />
          </View>
        </Card>
      )}

      {/* Preferences & Rights Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="lock-closed" size={24} color={safePrimaryDark} />
              <Text style={styles.modalTitle}>DPDP Consent Preferences</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color={safeTextMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              <Text style={styles.sectionHeader}>Purpose Specifications:</Text>

              <View style={styles.prefRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prefLabel}>Escrow & Trade Telemetry (Essential)</Text>
                  <Text style={styles.prefSub}>Required for order fulfillment, weighing & funds release.</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color={safeSuccess} />
              </View>

              <View style={styles.prefRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prefLabel}>Organic Certification Sharing</Text>
                  <Text style={styles.prefSub}>Allow sharing lab purity seals with APEDA & buyers.</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setPreferences((p) => ({ ...p, thirdPartyCertifiers: !p.thirdPartyCertifiers }))}
                >
                  <Ionicons
                    name={preferences.thirdPartyCertifiers ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={safePrimary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.prefRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prefLabel}>AI Agronomy & Voice Advisory Telemetry</Text>
                  <Text style={styles.prefSub}>Anonymized leaf image models for disease detection.</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setPreferences((p) => ({ ...p, agronomyTelemetry: !p.agronomyTelemetry }))}
                >
                  <Ionicons
                    name={preferences.agronomyTelemetry ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={safePrimary}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <Button
              title="Save My Privacy Preferences"
              variant="primary"
              size="md"
              onPress={handleSavePreferences}
              style={{ marginTop: safeSpacingMd }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    margin: safeSpacingSm,
    borderLeftWidth: 4,
    borderLeftColor: safePrimary,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  bannerTitle: { fontSize: 13, fontWeight: '800', color: safeTextPrimary },
  bannerSub: { fontSize: 10, color: safeTextSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: safeSpacingSm,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E2',
  },
  customBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  customBtnText: { fontSize: 11, fontWeight: '700', color: safePrimary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: safeSpacingMd,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: safeSpacingSm },
  modalTitle: { fontSize: 16, fontWeight: '800', color: safeTextPrimary, flex: 1, marginLeft: 8 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: safeTextSecondary, marginBottom: safeSpacingXs },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: safeSpacingSm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  prefLabel: { fontSize: 12, fontWeight: '700', color: safeTextPrimary },
  prefSub: { fontSize: 10, color: safeTextMuted, marginTop: 2 },
});
