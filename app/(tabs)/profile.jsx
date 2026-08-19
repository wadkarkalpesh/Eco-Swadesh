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
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
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
    currentUser,
    isAuthenticated,
    logoutUser,
  } = useApp();

  // Active user details with robust fallbacks
  const userName = currentUser?.name || (isAuthenticated ? 'Ramesh Patel' : 'Guest Member');
  const userPhone = currentUser?.phone || '+91 98230 11200';
  const userEmail = currentUser?.email || 'ramesh.patel@ecoswadesh.com';
  const userRole = (currentUser?.persona || persona || 'FARMER').toUpperCase();
  const userId = currentUser?.id || 'USR-IN-2026-9041';
  const userLocation = currentUser?.district && currentUser?.state
    ? `${currentUser.district}, ${currentUser.state}`
    : (currentUser?.state || 'Ujjain, Madhya Pradesh, India');
  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Jan 15, 2026';

  const handleLogout = () => {
    Alert.alert(
      '🚪 Log Out of Eco-Swadesh',
      'Are you sure you want to end your current session? You can sign back in anytime with your registered phone number or email.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logoutUser();
            Alert.alert('Logged Out', 'You have been successfully logged out of your session.');
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Profile Banner */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80' }}
              style={styles.profileAvatar}
            />
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileIdentifier}>{userPhone}</Text>
            <View style={styles.roleBadgeRow}>
              <Badge label={userRole} variant="gold" size="sm" />
              <Badge label="DPDP VERIFIED" variant="success" size="sm" style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.regionText}>📍 {userLocation}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* ========================================================================= */}
        {/* 1. REGISTERED / LOGGED-IN USER ACCOUNT DATA (USER SPECIFICATION)           */}
        {/* ========================================================================= */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.headerTitleWithIcon}>
              <Ionicons name="person-circle" size={22} color={safePrimary} />
              <Text style={[styles.sectionTitle, { marginLeft: 6, marginBottom: 0 }]}>
                Registered User Account Details
              </Text>
            </View>
            <Badge label={isAuthenticated ? 'ACTIVE SESSION' : 'GUEST'} variant={isAuthenticated ? 'success' : 'default'} size="sm" />
          </View>
          <Text style={styles.sectionSub}>Verified identity parameters, contact coordinates, and statutory data</Text>

          <View style={styles.userProfileTable}>
            {/* Full Name */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="person-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Full Name</Text>
              </View>
              <Text style={styles.profileDataVal}>{userName}</Text>
            </View>

            {/* Registered Phone */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="call-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Mobile Phone</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.profileDataVal}>{userPhone}</Text>
                <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="mail-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Email Address</Text>
              </View>
              <Text style={styles.profileDataVal}>{userEmail}</Text>
            </View>

            {/* Persona Role */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="shield-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Account Persona</Text>
              </View>
              <Text style={[styles.profileDataVal, { color: safePrimary, fontWeight: '800' }]}>{userRole}</Text>
            </View>

            {/* Account ID */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="finger-print-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Member UID</Text>
              </View>
              <Text style={[styles.profileDataVal, styles.monoText]}>{userId}</Text>
            </View>

            {/* State & District */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="location-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Jurisdiction</Text>
              </View>
              <Text style={styles.profileDataVal}>{userLocation}</Text>
            </View>

            {/* Member Since */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="calendar-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>Member Since</Text>
              </View>
              <Text style={styles.profileDataVal}>{memberSince}</Text>
            </View>

            {/* DPDP Compliance */}
            <View style={styles.profileDataRow}>
              <View style={styles.profileDataKeyCol}>
                <Ionicons name="lock-closed-outline" size={15} color={safeTextSecondary} />
                <Text style={styles.profileDataKey}>DPDP Act 2023</Text>
              </View>
              <Badge label="CONSENT ACTIVE (SEC 11)" variant="trust" size="sm" />
            </View>

            {/* Persona Specific Custom Fields */}
            {persona === 'farmer' && (
              <>
                <View style={styles.profileDataRow}>
                  <View style={styles.profileDataKeyCol}>
                    <Ionicons name="leaf-outline" size={15} color={safeTextSecondary} />
                    <Text style={styles.profileDataKey}>Farm Acreage</Text>
                  </View>
                  <Text style={styles.profileDataVal}>{currentUser?.farmSizeAcres ? `${currentUser.farmSizeAcres} Acres` : '18 Acres Organic'}</Text>
                </View>
                <View style={styles.profileDataRow}>
                  <View style={styles.profileDataKeyCol}>
                    <Ionicons name="business-outline" size={15} color={safeTextSecondary} />
                    <Text style={styles.profileDataKey}>Producer FPO</Text>
                  </View>
                  <Text style={[styles.profileDataVal, { maxWidth: '55%', textAlign: 'right' }]}>
                    {currentUser?.fpoName || 'Malwa Narmada Organic FPC Ltd.'}
                  </Text>
                </View>
                <View style={[styles.profileDataRow, { borderBottomWidth: 0 }]}>
                  <View style={styles.profileDataKeyCol}>
                    <Ionicons name="document-text-outline" size={15} color={safeTextSecondary} />
                    <Text style={styles.profileDataKey}>Soil Health Card</Text>
                  </View>
                  <Text style={[styles.profileDataVal, styles.monoText]}>
                    {currentUser?.soilHealthCardId || 'SHC-MP-UJJ-2025-09142'}
                  </Text>
                </View>
              </>
            )}

            {persona === 'bulkBuyer' && (
              <>
                <View style={styles.profileDataRow}>
                  <View style={styles.profileDataKeyCol}>
                    <Ionicons name="briefcase-outline" size={15} color={safeTextSecondary} />
                    <Text style={styles.profileDataKey}>Commercial Entity</Text>
                  </View>
                  <Text style={[styles.profileDataVal, { maxWidth: '55%', textAlign: 'right' }]}>
                    {currentUser?.extraDetail || 'AgroFlour Milling & Food Processing Corp'}
                  </Text>
                </View>
                <View style={[styles.profileDataRow, { borderBottomWidth: 0 }]}>
                  <View style={styles.profileDataKeyCol}>
                    <Ionicons name="receipt-outline" size={15} color={safeTextSecondary} />
                    <Text style={styles.profileDataKey}>Verified GSTIN</Text>
                  </View>
                  <Text style={[styles.profileDataVal, styles.monoText]}>
                    {currentUser?.gstin || '03AAAAA0000A1Z5'}
                  </Text>
                </View>
              </>
            )}

            {persona === 'seller' && (
              <View style={[styles.profileDataRow, { borderBottomWidth: 0 }]}>
                <View style={styles.profileDataKeyCol}>
                  <Ionicons name="flask-outline" size={15} color={safeTextSecondary} />
                  <Text style={styles.profileDataKey}>Lab License</Text>
                </View>
                <Text style={styles.profileDataVal}>NABL-BIO-2026-44 (NPOP Certified)</Text>
              </View>
            )}

            {persona === 'expert' && (
              <View style={[styles.profileDataRow, { borderBottomWidth: 0 }]}>
                <View style={styles.profileDataKeyCol}>
                  <Ionicons name="school-outline" size={15} color={safeTextSecondary} />
                  <Text style={styles.profileDataKey}>Accreditation</Text>
                </View>
                <Text style={[styles.profileDataVal, { maxWidth: '55%', textAlign: 'right' }]}>Senior Organic Agronomist & ICAR Member</Text>
              </View>
            )}
          </View>

          {/* Switch Account / Re-authenticate Quick Buttons */}
          <View style={styles.accountActionBtnRow}>
            <TouchableOpacity
              style={styles.switchAccBtn}
              onPress={() => router.push('/auth/login')}
            >
              <Ionicons name="swap-horizontal-outline" size={16} color={safePrimary} />
              <Text style={styles.switchAccText}>Switch User / Re-login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAccBtn}
              onPress={() => router.push('/auth/register')}
            >
              <Ionicons name="person-add-outline" size={16} color={safePrimary} />
              <Text style={styles.switchAccText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ========================================================================= */}
        {/* 2. ACTIVE PERSONA ROLE SWITCHER                                           */}
        {/* ========================================================================= */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Active Persona Role Switcher</Text>
          <Text style={styles.sectionSub}>Switch active role to unlock specialized views and features:</Text>

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
                  <Text style={[styles.roleTitle, isSelected && { color: safePrimary, fontWeight: '800' }]}>
                    {role.title}
                  </Text>
                  <Text style={styles.roleDesc}>{role.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* ========================================================================= */}
        {/* 3. SPECIALIZED ECOSYSTEM PORTALS                                          */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* 4. GLOBAL REGION & CURRENCY SETTINGS                                     */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* 5. DPDP PRIVACY & STATUTORY COMPLIANCE                                    */}
        {/* ========================================================================= */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DPDP Privacy & Statutory Rights</Text>
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
            style={[styles.portalItem, { borderBottomWidth: 0 }]}
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

        {/* ========================================================================= */}
        {/* 6. LOGOUT OPTION IN THE END (USER SPECIFICATION)                         */}
        {/* ========================================================================= */}
        <Card style={[styles.sectionCard, styles.logoutCard]}>
          <View style={styles.logoutHeaderRow}>
            <View style={[styles.portalIconCircle, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.logoutCardTitle}>Account Authentication & Security</Text>
              <Text style={styles.logoutCardSub}>Session linked to {userPhone} ({userName})</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <Text style={styles.logoutBtnText}>Log Out of Eco-Swadesh Account</Text>
          </TouchableOpacity>

          <Text style={styles.logoutFooterNote}>
            🔒 Logging out clears cryptographic session keys and local cache tokens safely.
          </Text>
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
    backgroundColor: safePrimaryDark,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingMd + 4,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: safeRadiusFull,
    borderWidth: 2.5,
    borderColor: '#A5D6A7',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00E676',
    borderWidth: 2,
    borderColor: safePrimaryDark,
  },
  profileInfo: {
    marginLeft: safeSpacingMd,
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: safeTextLight,
    letterSpacing: 0.2,
  },
  profileIdentifier: {
    fontSize: 12,
    color: '#C8E6C9',
    marginTop: 1,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  regionText: {
    fontSize: 11,
    color: '#E8F5E9',
    marginTop: 2,
  },
  scrollBody: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl + 20,
  },
  sectionCard: {
    marginBottom: safeSpacingMd,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    lineHeight: 16,
  },
  userProfileTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: safeRadiusMd,
    borderWidth: 1,
    borderColor: safeBorder,
    overflow: 'hidden',
    marginTop: safeSpacingXs,
  },
  profileDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingSm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F0',
  },
  profileDataKeyCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileDataKey: {
    fontSize: 12,
    fontWeight: '600',
    color: safeTextSecondary,
  },
  profileDataVal: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: safePrimaryDark,
  },
  accountActionBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: safeSpacingSm + 4,
  },
  switchAccBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: safeRadiusMd,
    backgroundColor: safeAccentLight,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  switchAccText: {
    fontSize: 12,
    fontWeight: '700',
    color: safePrimary,
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
    paddingVertical: safeSpacingSm + 2,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  portalIconCircle: {
    width: 38,
    height: 38,
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
  logoutCard: {
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF8F8',
    padding: safeSpacingMd,
  },
  logoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: safeSpacingMd,
  },
  logoutCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#C62828',
  },
  logoutCardSub: {
    fontSize: 11,
    color: '#E57373',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: safeRadiusMd,
    gap: 8,
    elevation: 2,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  logoutFooterNote: {
    fontSize: 10.5,
    color: '#8A9E8C',
    textAlign: 'center',
    marginTop: safeSpacingSm,
    lineHeight: 15,
  },
});
