import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

const FAQS = [
  {
    q: 'How does Eco-Swadesh Trade Escrow protect my funds?',
    a: 'When you place an order, payment is held in an audited Escrow pool. Funds are only released to the seller after cold-chain delivery is confirmed and quality inspection passes.',
  },
  {
    q: 'How do I upload NPOP / Jaivik organic certificates for my products?',
    a: 'Go to Profile → Seller Dashboard → Add Product, and attach your certificate registration number. Our automated verification system checks APEDA / NABL databases.',
  },
  {
    q: 'What is the 30-meter organic buffer zone rule?',
    a: 'NPOP organic standards require a minimum 30m buffer between certified organic land and adjacent synthetic chemical farms to prevent pesticide drift.',
  },
];

export default function HelpSupportScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTicket = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Required Fields', 'Please enter a Subject and Message for your support ticket.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Support Ticket Submitted!', `Ticket #TICK-${Date.now().toString().slice(-4)} created. Our agronomy support team will respond within 2 hours.`);
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="help-buoy" size={36} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Eco-Swadesh Help & Support Center</Text>
            <Text style={styles.headerSub}>24/7 Agronomy Support & Order Dispute Assistance</Text>
          </View>
        </View>
      </Card>

      {/* FAQs */}
      <Card style={styles.sectionCard}>
        <Text style={styles.cardTitle}>❓ Frequently Asked Questions</Text>
        {FAQS.map((f, idx) => (
          <View key={idx} style={styles.faqBox}>
            <Text style={styles.faqQ}>{f.q}</Text>
            <Text style={styles.faqA}>{f.a}</Text>
          </View>
        ))}
      </Card>

      {/* Support Ticket Creation */}
      <Card style={styles.sectionCard}>
        <Text style={styles.cardTitle}>📩 Submit Support Ticket</Text>

        <Input
          label="Issue Subject / Order ID"
          placeholder="e.g. Question about Escrow Order ORD-2026"
          value={subject}
          onChangeText={setSubject}
        />

        <Input
          label="Detailed Description"
          placeholder="Describe your issue or query..."
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <Button
          title={loading ? 'Submitting Ticket...' : 'Submit Support Ticket →'}
          variant="primary"
          size="md"
          onPress={handleCreateTicket}
          disabled={loading}
          style={{ marginTop: safeSpacingSm }}
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
  sectionCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingSm },
  faqBox: { paddingVertical: safeSpacingSm, borderBottomWidth: 1, borderBottomColor: '#E2E8E2' },
  faqQ: { fontSize: 13, fontWeight: '700', color: safeTextPrimary },
  faqA: { fontSize: 11, color: safeTextSecondary, marginTop: 4, lineHeight: 16 },
});
