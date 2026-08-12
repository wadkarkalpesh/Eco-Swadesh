import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authApi } from '../../utils/apiClient';
import { useApp } from '../../context/AppContext';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { persona, changePersona } = useApp();

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

  const [loading, setLoading] = useState(false);

  const handleSubmitOnboarding = async () => {
    if (!fullName.trim() || !stateName.trim() || !district.trim()) {
      Alert.alert('Required Fields', 'Please enter your Full Name, State, and District.');
      return;
    }

    setLoading(true);
    try {
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
        persona: isSeller ? 'farmer' : 'consumer',
      };

      const res = await authApi.updateProfile(payload);
      if (res && res.success) {
        changePersona(isSeller ? 'farmer' : 'consumer');
        Alert.alert(
          'Onboarding Complete!',
          `Welcome to Eco-Swadesh, ${fullName}! Your account is now fully set up.`
        );
        router.replace('/(tabs)');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: safeBg },
  scrollBody: { padding: safeSpacingMd, paddingBottom: safeSpacingXxl },
  headerCard: { marginBottom: safeSpacingMd },
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: safeTextLight },
  headerSub: { fontSize: 11, color: '#C8E6C9', marginTop: 2 },
  formCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingSm },
  sellerSection: { marginTop: safeSpacingMd, paddingTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
});
