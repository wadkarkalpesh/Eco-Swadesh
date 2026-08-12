import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
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
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;

export default function SellerLoginScreen() {
  const router = useRouter();
  const { changePersona } = useApp();

  const [authMode, setAuthMode] = useState('phone');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+91 98230 11200');
  const [step, setStep] = useState(1);
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpCode, setOtpCode] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneOrEmail.trim()) {
      Alert.alert('Required Field', 'Please enter your Mobile Number or Email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOTP(phoneOrEmail, 'IN');
      if (res && res.success) {
        setOtpSessionId(res.otpSessionId);
        setStep(2);
        Alert.alert('OTP Sent', `Farmer/Seller code sent to ${phoneOrEmail}. (Simulated OTP: 123456)`);
      }
    } catch (e) {
      Alert.alert('Authentication Error', e.message || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const res = await authApi.verifyOTP(otpSessionId || 'sess_mock', otpCode, 'farmer');
      if (res && res.success) {
        changePersona('farmer');
        if (res.isExistingUser && res.onboardingCompleted) {
          Alert.alert('Welcome Back!', `Logged in successfully as ${res.user.name || 'Farmer / Seller'}.`);
          router.replace('/(tabs)');
        } else {
          Alert.alert('OTP Verified!', 'Please complete your farm & business onboarding information.');
          router.push('/auth/onboarding?persona=farmer');
        }
      }
    } catch (e) {
      Alert.alert('Verification Failed', e.message || 'Incorrect OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner Header */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="leaf" size={36} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Farmer & Seller Authentication</Text>
            <Text style={styles.headerSub}>List Bulk Harvest Tons, Bio-Inputs & APMC Mandi Rates</Text>
          </View>
        </View>
      </Card>

      {/* Auth Card */}
      <Card style={styles.authCard}>
        <View style={styles.stepRow}>
          <Badge label={`STEP ${step} OF 3`} variant="success" size="sm" />
          <Badge label={step === 1 ? 'FARMER LOGIN / SIGNUP' : 'VERIFY OTP'} variant="gold" size="sm" />
        </View>

        {step === 1 ? (
          <>
            <Text style={styles.cardTitle}>Enter Your Mobile Number or Email</Text>

            {/* Toggle Switch */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, authMode === 'phone' && styles.activeToggleBtn]}
                onPress={() => setAuthMode('phone')}
              >
                <Ionicons name="call" size={14} color={authMode === 'phone' ? safeTextLight : safeTextSecondary} />
                <Text style={[styles.toggleText, authMode === 'phone' && styles.activeToggleText]}>Mobile SMS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, authMode === 'email' && styles.activeToggleBtn]}
                onPress={() => setAuthMode('email')}
              >
                <Ionicons name="mail" size={14} color={authMode === 'email' ? safeTextLight : safeTextSecondary} />
                <Text style={[styles.toggleText, authMode === 'email' && styles.activeToggleText]}>Email OTP</Text>
              </TouchableOpacity>
            </View>

            <Input
              label={authMode === 'phone' ? 'Mobile Number (with +91)' : 'Email Address'}
              keyboardType={authMode === 'phone' ? 'phone-pad' : 'email-address'}
              value={phoneOrEmail}
              onChangeText={setPhoneOrEmail}
            />

            <Button
              title={loading ? 'Sending OTP...' : 'Send Verification OTP'}
              variant="primary"
              size="md"
              onPress={handleSendOTP}
              disabled={loading}
              style={{ marginTop: safeSpacingSm }}
            />
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Enter 6-Digit Verification OTP</Text>
            <Text style={styles.otpSentSub}>Sent to {phoneOrEmail}</Text>

            <Input
              label="6-Digit OTP Code"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
            />

            <Button
              title={loading ? 'Verifying...' : 'Verify OTP & Log In'}
              variant="primary"
              size="md"
              onPress={handleVerifyOTP}
              disabled={loading}
              style={{ marginTop: safeSpacingSm }}
            />

            <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: safeSpacingSm, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: safeTextSecondary }}>← Edit Mobile / Email</Text>
            </TouchableOpacity>
          </>
        )}
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
  authCard: { marginBottom: safeSpacingMd },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: safeSpacingSm },
  cardTitle: { fontSize: 16, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingXs },
  otpSentSub: { fontSize: 12, color: safeTextSecondary, marginBottom: safeSpacingSm },
  toggleRow: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: safeRadiusMd, padding: 2, marginBottom: safeSpacingSm },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: safeRadiusMd - 2, gap: 4 },
  activeToggleBtn: { backgroundColor: safePrimary },
  toggleText: { fontSize: 11, fontWeight: '700', color: safeTextSecondary },
  activeToggleText: { color: safeTextLight },
});
