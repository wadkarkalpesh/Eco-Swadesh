import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import ScreenContainer from '../../components/ui/ScreenContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authApi } from '../../utils/apiClient';
import { useApp } from '../../context/AppContext';

const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { persona, changePersona, loginUser } = useApp();

  const isSeller = (params.persona || persona) === 'farmer' || (params.persona || persona) === 'seller';

  // Personal Information Fields
  const [fullName, setFullName] = useState(isSeller ? 'Ramesh Patel' : 'Baldev Singh');
  const [email, setEmail] = useState(isSeller ? 'ramesh.patel@ecoswadesh.com' : 'baldev.singh@ecoswadesh.com');
  const [stateName, setStateName] = useState(isSeller ? 'Madhya Pradesh' : 'Punjab');
  const [district, setDistrict] = useState(isSeller ? 'Ujjain' : 'Ludhiana');
  const [address, setAddress] = useState('Central District Farmer Collective Hub, Main Road');

  // Business / Seller Specific Fields
  const [farmSizeAcres, setFarmSizeAcres] = useState('35.0');
  const [primaryCrops, setPrimaryCrops] = useState('Sharbati Wheat, Bio-NPK Liquid, Soybean');
  const [bankUpiId, setBankUpiId] = useState('ramesh@upi');
  const [gstLicenseNo, setGstLicenseNo] = useState('NPOP/NAB/0014/2026');

  const [selectedRole, setSelectedRole] = useState(isSeller ? 'seller' : 'buyer');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmitOnboarding = async () => {
    if (!fullName.trim() || !stateName.trim() || !district.trim()) {
      Alert.alert('Required Fields', 'Please enter your Full Name, State, and District.');
      return;
    }

    if (!dpdpConsent) {
      Alert.alert('DPDP Consent Required', 'Please accept the DPDP Act 2023 data processing terms to continue.');
      return;
    }

    setLoading(true);
    try {
      if (selectedRole && selectedRole !== 'buyer') {
        await authApi.addRole(selectedRole).catch(() => null);
      }

      const payload = {
        name: fullName,
        email,
        state: stateName,
        district,
        address,
        farmSizeAcres: isSeller ? parseFloat(farmSizeAcres) : undefined,
        primaryCrops: isSeller ? primaryCrops : undefined,
        bankUpiId: isSeller ? bankUpiId : undefined,
        gstLicenseNo: isSeller ? gstLicenseNo : undefined,
        persona: selectedRole === 'seller' ? 'farmer' : (selectedRole === 'gardener' ? 'gardener' : 'consumer'),
        roles: ['buyer', selectedRole],
        dpdpConsentRecorded: true,
      };

      const res = await authApi.updateProfile(payload);
      if (res && res.success) {
        loginUser(res.user);
        changePersona(selectedRole === 'seller' ? 'farmer' : (selectedRole === 'gardener' ? 'gardener' : 'consumer'));
        Alert.alert(
          '🎉 Onboarding Complete!',
          `Welcome to Eco-Swadesh, ${fullName}! Your account has been registered with DPDP 2023 compliance.`
        );
        router.replace('/(tabs)');
      }
    } catch (e) {
      Alert.alert('Notice', e.message || 'Profile saved locally.');
      loginUser({
        id: `usr-${Date.now()}`,
        name: fullName,
        persona: selectedRole === 'seller' ? 'farmer' : 'consumer',
        onboardingCompleted: true,
      });
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer maxWidth="auth" withSafeArea={true}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="person-add" size={34} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Personal & Profile Information</Text>
            <Text style={styles.headerSub}>
              {isSeller ? 'Setup Farmer / Seller Business Credentials' : 'Setup Customer / Buyer Profile'}
            </Text>
          </View>
        </View>

        <Badge label="STEP 3 OF 3: PROFILE ONBOARDING" variant="gold" size="sm" style={{ marginTop: safeSpacingSm }} />
      </Card>

      {/* Role Selection */}
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>🎭 Account Persona & Roles</Text>
        <Text style={{ fontSize: 13, color: safeTextSecondary, marginBottom: 12 }}>
          Choose your primary platform role (additional roles can be self-assigned anytime):
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {[
            { id: 'buyer', label: '🛒 Buyer', icon: 'cart' },
            { id: 'seller', label: '🌾 Farmer / Seller', icon: 'leaf' },
            { id: 'gardener', label: '🌱 Urban Gardener', icon: 'flower' },
          ].map((r) => (
            <TouchableOpacity
              key={r.id}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: selectedRole === r.id ? safePrimary : '#E0E0E0',
                backgroundColor: selectedRole === r.id ? '#E8F5E9' : '#FFFFFF',
                alignItems: 'center',
              }}
              onPress={() => setSelectedRole(r.id)}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: selectedRole === r.id ? safePrimary : safeTextPrimary }}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Profile Form Card */}
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>👤 Personal Information</Text>

        <Input
          label="Full Legal Name *"
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label="Email Address"
          placeholder="name@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="State *"
              placeholder="e.g. MP, Punjab"
              value={stateName}
              onChangeText={setStateName}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="District / City *"
              placeholder="e.g. Ujjain, Indore"
              value={district}
              onChangeText={setDistrict}
            />
          </View>
        </View>

        <Input
          label="Delivery / Pickup Address"
          placeholder="Street address or Cold Depot name"
          value={address}
          onChangeText={setAddress}
        />

        {/* DPDP Act 2023 Consent Checkbox */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 14,
            padding: 10,
            backgroundColor: '#F9FBF9',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E2E8E2',
          }}
          onPress={() => setDpdpConsent(!dpdpConsent)}
        >
          <Ionicons
            name={dpdpConsent ? 'checkbox' : 'square-outline'}
            size={22}
            color={dpdpConsent ? safePrimary : '#757575'}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: safeTextPrimary }}>
              Digital Personal Data Protection (DPDP) Act, 2023 Consent
            </Text>
            <Text style={{ fontSize: 11, color: safeTextSecondary, marginTop: 2 }}>
              I consent to processing my personal and telemetry data strictly for marketplace orders, escrow settlement, and APEDA compliance.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Business / Seller Specific Fields */}
        {isSeller && (
          <View style={styles.sellerSection}>
            <Text style={styles.cardTitle}>🌾 Farm & Seller Credentials</Text>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Input
                  label="Farm Size (Acres)"
                  keyboardType="numeric"
                  value={farmSizeAcres}
                  onChangeText={setFarmSizeAcres}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Input
                  label="Bank UPI ID (Escrow Payout)"
                  placeholder="name@upi"
                  value={bankUpiId}
                  onChangeText={setBankUpiId}
                />
              </View>
            </View>

            <Input
              label="Primary Harvest Crops / Products"
              placeholder="e.g. Wheat, Bio-NPK, Soybeans"
              value={primaryCrops}
              onChangeText={setPrimaryCrops}
            />

            <Input
              label="Govt / Organic License Number (APEDA / NPOP)"
              placeholder="e.g. NPOP/NAB/0014/2026"
              value={gstLicenseNo}
              onChangeText={setGstLicenseNo}
            />
          </View>
        )}

        <Button
          title={loading ? 'Saving Profile...' : 'Complete Profile & Enter Platform →'}
          variant="primary"
          size="md"
          onPress={handleSubmitOnboarding}
          disabled={loading}
          style={{ marginTop: safeSpacingMd }}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: { marginBottom: safeSpacingMd },
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: safeTextLight },
  headerSub: { fontSize: 11, color: '#C8E6C9', marginTop: 2 },
  formCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingSm },
  sellerSection: { marginTop: safeSpacingMd, paddingTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
});
