import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Hero Banner */}
      <Card bg={safePrimaryDark} style={styles.heroCard}>
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={40} color={safeSunGold} />
          <Text style={styles.logoTitle}>Eco-Swadesh</Text>
        </View>
        <Text style={styles.heroSub}>
          Global Sustainable Agriculture Platform • Farm-to-Consumer & Bio-Input Ecosystem
        </Text>
        <Badge label="NPOP & JAIVIK BHARAT CERTIFIED" variant="gold" size="sm" style={{ marginTop: safeSpacingSm }} />
      </Card>

      {/* Value Pillars */}
      <Card style={styles.pillarCard}>
        <Text style={styles.sectionTitle}>One Connected Agriculture Ecosystem</Text>
        
        <View style={styles.pillarRow}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="cart-outline" size={24} color={safePrimary} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pillarTitle}>Buy & Sell Organic Produce</Text>
            <Text style={styles.pillarDesc}>Direct 100% lab-tested fertilizers, seeds, and bulk harvest truckloads.</Text>
          </View>
        </View>

        <View style={styles.pillarRow}>
          <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="medical-outline" size={24} color="#1976D2" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pillarTitle}>AI Crop Doctor & Agronomy</Text>
            <Text style={styles.pillarDesc}>Instant image leaf diagnosis, soil NPK dosage, and expert consultation.</Text>
          </View>
        </View>

        <View style={styles.pillarRow}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFF8E1' }]}>
            <Ionicons name="people-outline" size={24} color="#C5A059" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pillarTitle}>Community & Knowledge Center</Text>
            <Text style={styles.pillarDesc}>Connect with certified farmers, share experiences, and learn organic techniques.</Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.actionCard}>
        <Button
          title="Create New Account (Sign Up)"
          variant="primary"
          size="md"
          onPress={() => router.push('/auth/select-portal')}
          style={{ marginBottom: safeSpacingSm }}
        />
        <Button
          title="Already Have an Account? Log In"
          variant="secondary"
          size="md"
          onPress={() => router.push('/auth/select-portal')}
          style={{ marginBottom: safeSpacingSm }}
        />
        <Button
          title="Explore Platform as Guest →"
          variant="outline"
          size="sm"
          onPress={() => router.replace('/(tabs)')}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: safeBg },
  scrollBody: { padding: safeSpacingMd, paddingBottom: safeSpacingXxl },
  heroCard: { marginBottom: safeSpacingMd, alignItems: 'center', paddingVertical: safeSpacingMd + 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoTitle: { fontSize: 26, fontWeight: '800', color: safeTextLight, marginLeft: 8 },
  heroSub: { fontSize: 12, color: '#C8E6C9', textAlign: 'center', marginTop: 6, paddingHorizontal: 12 },
  pillarCard: { marginBottom: safeSpacingMd },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingMd },
  pillarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: safeSpacingMd },
  iconCircle: { width: 44, height: 44, borderRadius: safeRadiusMd, alignItems: 'center', justifyContent: 'center' },
  pillarTitle: { fontSize: 14, fontWeight: '800', color: safeTextPrimary },
  pillarDesc: { fontSize: 11, color: safeTextSecondary, marginTop: 2, lineHeight: 16 },
  actionCard: { marginBottom: safeSpacingMd },
});
