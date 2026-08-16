import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LanguagePicker from '../../components/ui/LanguagePicker';
import { privacyManager } from '../../utils/privacyManager';
import apiClient from '../../utils/apiClient';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryLight = (COLORS && COLORS.primaryLight) || '#2E7D32';
const safeLogisticsPurple = (COLORS && COLORS.logisticsPurple) || '#673AB7';
const safeTrustBlue = (COLORS && COLORS.trustBlue) || '#1976D2';
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';

const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusXs = (RADIUS && RADIUS.xs) || 4;

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

const PERSONA_ROLES = [
  { id: 'farmer', title: 'Organic & Commercial Farmer', desc: 'Manage farm produce, list bulk harvest in tons, request soil advisory' },
  { id: 'consumer', title: 'Retail Household Consumer', desc: 'Buy certified 100% organic fertilizers, seeds, and fresh chemical-free produce' },
  { id: 'bulkBuyer', title: 'Bulk Commercial Buyer / Processor', desc: 'Direct farm-to-consumer B2B freight trade in tons with escrow safety' },
  { id: 'seller', title: 'Fertilizer & Seed Manufacturer', desc: 'List bio-inputs, manage retail & bulk inventory, upload lab test reports' },
  { id: 'expert', title: 'Agri-Scientist & Expert Advisor', desc: 'Provide verified soil advisory, review leaf diagnosis, publish research' },
  { id: 'admin', title: 'Platform Admin Governance', desc: 'Moderate listings, verify local/national government certificates, oversee GMV' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const {
    t,
    persona,
    changePersona,
    currency,
    changeCurrency,
    language,
    logoutUser,
  } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Profile Info */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80' }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Tejas & Team Eco-Swadesh</Text>
            <View style={styles.roleBadgeRow}>
              <Badge label={persona.toUpperCase()} variant="trust" size="sm" />
              <Badge label="VERIFIED USER" variant="success" size="sm" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.regionText}>📍 Global Hub • India / North America</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Active Persona Selection Card */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Active Persona Role Switcher</Text>
          <Text style={styles.sectionSub}>Switch active experience to view specialized features for your role:</Text>

          {PERSONA_ROLES.map((role) => {
            const isSelected = persona === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                onPress={() => changePersona(role.id)}
                style={[styles.roleItem, isSelected && styles.selectedRoleItem]}
              >
                <View style={styles.roleRadio}>
                  {isSelected && <View style={styles.roleRadioInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.roleTitle, isSelected && { color: safePrimary, fontWeight: '700' }]}>
                    {role.title}
                  </Text>
                  <Text style={styles.roleDesc}>{role.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Specialized Ecosystem Portals */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Specialized Platform Portals</Text>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/logistics')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="bus-outline" size={20} color={safeLogisticsPurple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>{t('logisticsTitle')}</Text>
              <Text style={styles.portalSub}>Track parcel & bulk heavy freight truckloads in real-time</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/seller-dashboard')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="storefront-outline" size={20} color={safePrimaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>{t('sellerDashboard')}</Text>
              <Text style={styles.portalSub}>Manage products, bulk RFQs & upload lab certificates</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/trust-center')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={safeTrustBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>Trust & Organic Certification Hub</Text>
              <Text style={styles.portalSub}>Verify National (USDA/Jaivik) & Local Govt state board seals</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/admin-oversight')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="ribbon-outline" size={20} color={safeGovGold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>{t('adminOversight')}</Text>
              <Text style={styles.portalSub}>Platform metrics, seller verification & fraud prevention</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/knowledge')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="book-outline" size={20} color={safePrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>Agri Knowledge & Learning Hub</Text>
              <Text style={styles.portalSub}>Farming Guides, NPOP Organic Rules & Videos</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/wishlist')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="heart-outline" size={20} color="#D32F2F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>My Saved Wishlist</Text>
              <Text style={styles.portalSub}>View saved bio-inputs and organic produce</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/notifications')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="notifications-outline" size={20} color="#E65100" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>Notifications & Alerts</Text>
              <Text style={styles.portalSub}>Order updates, Escrow payouts & AI Doctor diagnosis</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.portalItem} onPress={() => router.push('/help-support')}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="help-buoy-outline" size={20} color="#00695C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>Help & Support Center</Text>
              <Text style={styles.portalSub}>24/7 Support tickets, FAQs & dispute assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>
        </Card>

        {/* Global Settings (Language & Currency) */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Global Region & Currency Settings</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Display Language (i18n)</Text>
              <Text style={styles.settingValue}>Active: {language.toUpperCase()}</Text>
            </View>
            <LanguagePicker />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.settingLabel}>Active Currency</Text>
              <Text style={styles.settingValue}>{t(currency)}</Text>
            </View>
            <View style={styles.currencyRow}>
              {['inr', 'usd', 'eur', 'aud'].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => changeCurrency(c)}
                  style={[styles.currChip, currency === c && styles.selectedCurrChip]}
                >
                  <Text style={[styles.currText, currency === c && styles.selectedCurrText]}>
                    {c.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* DPDP Privacy & Data Subject Rights (India DPDP Act 2023) */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DPDP Privacy & Data Subject Rights</Text>
          <Text style={styles.sectionSub}>Manage personal data, export records, or invoke DPDP statutory rights:</Text>

          <TouchableOpacity
            style={styles.portalItem}
            onPress={async () => {
              try {
                const res = await apiClient.auth.exportData();
                Alert.alert(
                  '✅ DPDP Section 11 Data Export',
                  `Data Subject Access Request (DSAR) export generated successfully.\nRecords: Orders, Profile, Consents & Certificates.\nCompliance: ${res.complianceStandard || 'DPDP Act 2023'}`
                );
              } catch (_e) {
                const res = privacyManager.requestDataExport();
                Alert.alert('Data Export Request', `${res.summary}\nRequested at: ${res.requestedAt}`);
              }
            }}
          >
            <View style={[styles.portalIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="download-outline" size={20} color={safePrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.portalTitle}>Export My Data (DPDP DSAR JSON)</Text>
              <Text style={styles.portalSub}>Download all orders, certificates, and consent audit records</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.portalItem}
            onPress={() => {
              const res = privacyManager.requestRightToBeForgotten();
              Alert.alert('Erasure Request Registered', `${res.message}\nTicket ID: ${res.erasureTicketId}`);
            }}
          >
            <View style={[styles.portalIconCircle, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="trash-outline" size={20} color="#D32F2F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.portalTitle, { color: '#D32F2F' }]}>Right to be Forgotten (Erasure)</Text>
              <Text style={styles.portalSub}>Request statutory DPDP deletion of personal PII records</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={safeTextMuted} />
          </TouchableOpacity>
        </Card>

        {/* Account Logout Action Card */}
        <Card style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              logoutUser();
              Alert.alert('Logged Out', 'You have been logged out of Eco-Swadesh.');
              router.replace('/auth/register');
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
            <Text style={styles.logoutText}>Log Out of Eco-Swadesh Account</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  header: {
    backgroundColor: safePrimary,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingMd,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: safeRadiusFull,
    borderWidth: 2,
    borderColor: safeTextLight,
  },
  profileInfo: {
    marginLeft: safeSpacingSm,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: safeTextLight,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  regionText: {
    fontSize: 11,
    color: '#A5D6A7',
  },
  scrollBody: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  sectionCard: {
    marginBottom: safeSpacingMd,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: safeTextMuted,
    marginBottom: safeSpacingSm,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: safeSpacingSm + 2,
    borderRadius: safeRadiusMd,
    borderWidth: 1,
    borderColor: safeBorder,
    marginBottom: safeSpacingXs,
  },
  selectedRoleItem: {
    backgroundColor: safeAccentLight,
    borderColor: safePrimary,
  },
  roleRadio: {
    width: 16,
    height: 16,
    borderRadius: safeRadiusFull,
    borderWidth: 1.5,
    borderColor: safePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: safeSpacingSm,
    marginTop: 2,
  },
  roleRadioInner: {
    width: 8,
    height: 8,
    borderRadius: safeRadiusFull,
    backgroundColor: safePrimary,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: safeTextPrimary,
  },
  roleDesc: {
    fontSize: 11,
    color: safeTextSecondary,
    marginTop: 2,
  },
  portalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: safeSpacingSm,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  portalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: safeRadiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: safeSpacingSm,
  },
  portalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  portalSub: {
    fontSize: 11,
    color: safeTextMuted,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: safeSpacingSm,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  settingValue: {
    fontSize: 11,
    color: safeTextMuted,
  },
  currencyRow: {
    flexDirection: 'row',
  },
  currChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: safeRadiusXs,
    borderWidth: 1,
    borderColor: safeBorder,
    marginLeft: 4,
  },
  selectedCurrChip: {
    backgroundColor: safePrimary,
    borderColor: safePrimary,
  },
  currText: {
    fontSize: 11,
    fontWeight: '600',
    color: safeTextPrimary,
  },
  selectedCurrText: {
    color: safeTextLight,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: safeSpacingSm,
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D32F2F',
  },
});
