import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const safeOverlay = (COLORS && COLORS.overlay) || 'rgba(18, 30, 21, 0.5)';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeRadiusXl = (RADIUS && RADIUS.xl) || 28;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingLg = (SPACING && SPACING.lg) || 24;
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';
const safeShadowLarge = (SHADOWS && SHADOWS.large) || { elevation: 8 };

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🌐' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flag: '🇰🇪' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export default function LanguagePicker() {
  const { language, changeLanguage, t } = useApp();
  const [visible, setVisible] = useState(false);

  const activeLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const primaryColor = (COLORS && COLORS.primary) || '#1E4D2B';

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.pickerButton}
        activeOpacity={0.8}
      >
        <Text style={styles.flagText}>{activeLang.flag}</Text>
        <Text style={styles.langName}>{activeLang.code.toUpperCase()}</Text>
        <Ionicons name="chevron-down" size={14} color={safeTextSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={20} color={safeTextPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = item.code === language;
                return (
                  <TouchableOpacity
                    style={[styles.langItem, isSelected && styles.selectedLangItem]}
                    onPress={() => {
                      changeLanguage(item.code);
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.itemFlag}>{item.flag}</Text>
                    <Text
                      style={[
                        styles.itemText,
                        isSelected && { color: primaryColor, fontWeight: '700' },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={primaryColor} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeCard,
    paddingHorizontal: safeSpacingSm + 2,
    paddingVertical: 6,
    borderRadius: safeRadiusFull,
    borderWidth: 1,
    borderColor: safeBorder,
  },
  flagText: {
    fontSize: 14,
    marginRight: 4,
  },
  langName: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: safeOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: safeSpacingLg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: safeCard,
    borderRadius: safeRadiusXl,
    padding: safeSpacingMd,
    ...safeShadowLarge,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: safeSpacingMd,
    paddingBottom: safeSpacingSm,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: safeSpacingSm + 2,
    paddingHorizontal: safeSpacingSm,
    borderRadius: safeRadiusMd,
    marginVertical: 2,
  },
  selectedLangItem: {
    backgroundColor: safeAccentLight,
  },
  itemFlag: {
    fontSize: 20,
    marginRight: safeSpacingSm,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: safeTextPrimary,
  },
});
