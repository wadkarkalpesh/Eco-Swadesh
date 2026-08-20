import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;

const NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Escrow Funds Released',
    message: 'Your payment of ₹14,500 for Order ORD-2026-6633 has been released to the seller upon delivery verification.',
    time: '10 mins ago',
    type: 'ORDER',
    icon: 'shield-checkmark',
    color: safePrimary,
  },
  {
    id: 'notif-2',
    title: 'Expert Answered Your Question',
    message: 'Dr. Anita Roy replied to your query regarding Azotobacter dosage for Sharbati Wheat.',
    time: '1 hour ago',
    type: 'COMMUNITY',
    icon: 'chatbubbles',
    color: '#1976D2',
  },
  {
    id: 'notif-3',
    title: 'AI Crop Doctor Alert',
    message: 'Leaf image diagnosis completed: Early Blight detected (89% confidence). Organic copper fungicide recommended.',
    time: '3 hours ago',
    type: 'AI_DIAGNOSIS',
    icon: 'medical',
    color: '#D32F2F',
  },
  {
    id: 'notif-4',
    title: 'APMC Mandi Price Surge',
    message: 'Wheat spot arrival prices in Ujjain APMC Mandi increased by +4.2% today to ₹2,450/Quintal.',
    time: 'Yesterday',
    type: 'MANDI',
    icon: 'trending-up',
    color: '#FFA000',
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="notifications" size={36} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Deccan-Origin Notifications</Text>
            <Text style={styles.headerSub}>Orders, Escrow Payouts, Community & AI Alerts</Text>
          </View>
        </View>
      </Card>

      {/* List */}
      {NOTIFICATIONS.map((n) => (
        <Card key={n.id} style={styles.notifCard}>
          <View style={styles.notifRow}>
            <View style={[styles.iconCircle, { backgroundColor: `${n.color}15` }]}>
              <Ionicons name={n.icon} size={22} color={n.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
              <Text style={styles.notifMsg}>{n.message}</Text>
            </View>
          </View>
        </Card>
      ))}
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
  notifCard: { marginBottom: safeSpacingSm },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconCircle: { width: 40, height: 40, borderRadius: safeRadiusMd, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 13, fontWeight: '800', color: safeTextPrimary },
  notifTime: { fontSize: 10, color: safeTextSecondary },
  notifMsg: { fontSize: 11, color: safeTextSecondary, marginTop: 4, lineHeight: 16 },
});
