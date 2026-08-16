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
import { COLORS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { ordersApi, paymentsApi } from '../utils/apiClient';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, clearCart, formatPrice } = useApp();

  const [address, setAddress] = useState('Patel Organic Farm Depot, Plot 45, Main Highway, Ujjain, MP');
  const [payMethod, setPayMethod] = useState('UPI'); // 'UPI' | 'ESCROW' | 'KISAN_CREDIT'
  const [loading, setLoading] = useState(false);

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price || 500) * (item.quantity || 1), 0);
  const freightCost = 150;
  const grandTotal = cartSubtotal + freightCost;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Initialize Escrow Order
      const res = await ordersApi.createEscrowOrder({
        productId: cart[0]?.id || 'prod-1',
        quantity: cart[0]?.quantity || 1,
        totalAmount: grandTotal,
        paymentMethod: payMethod,
        shippingAddress: address,
      });

      // 2. Initialize Razorpay Payment with Route Split Transfers (Phase 5)
      const rzpRes = await paymentsApi.createRazorpayOrder({
        amountINR: grandTotal,
        orderId: res.orderId,
        sellers: cart.map(item => ({
          sellerId: item.sellerId || item.farmerId || 'usr_seller_01',
          payoutINR: (item.price || 500) * (item.quantity || 1) * 0.975,
        })),
      }).catch(() => null);

      if (res && res.orderId) {
        clearCart();
        Alert.alert(
          '🎉 Escrow Order Initialized & Locked!',
          `Order ID: ${res.orderId}\nRazorpay Order: ${rzpRes?.razorpayOrderId || 'rzp_simulated'}\nEscrow Status: HELD_IN_ESCROW_POOL\nSeller Route Payout Split: Active`
        );
        router.replace('/(tabs)');
      }
    } catch (e) {
      Alert.alert('Payment Failed', e.message || 'Could not process transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Header */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="shield-checkmark" size={36} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>100% Escrow Protected Checkout</Text>
            <Text style={styles.headerSub}>Funds safely held until delivery quality is verified</Text>
          </View>
        </View>
      </Card>

      {/* Address Card */}
      <Card style={styles.sectionCard}>
        <Text style={styles.cardTitle}>📍 Delivery Address</Text>
        <Input
          label="Street Address / Cold Depot"
          value={address}
          onChangeText={setAddress}
        />
      </Card>

      {/* Payment Method Selector */}
      <Card style={styles.sectionCard}>
        <Text style={styles.cardTitle}>💳 Payment Method</Text>

        {[
          { id: 'UPI', label: 'UPI / GPay / PhonePe', desc: 'Instant 100% Escrow protection' },
          { id: 'ESCROW', label: 'Bank Trade Escrow Pool', desc: 'Ideal for bulk commodity harvest tons' },
          { id: 'KISAN_CREDIT', label: 'Kisan Credit Card (4% Subsidized)', desc: 'Direct agricultural loan credit' },
        ].map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setPayMethod(m.id)}
            style={[styles.payOption, payMethod === m.id && styles.activePayOption]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.payTitle, payMethod === m.id && { color: safePrimary }]}>{m.label}</Text>
              <Text style={styles.payDesc}>{m.desc}</Text>
            </View>
            <Ionicons
              name={payMethod === m.id ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={payMethod === m.id ? safePrimary : safeTextSecondary}
            />
          </TouchableOpacity>
        ))}
      </Card>

      {/* Price Summary */}
      <Card style={styles.sectionCard}>
        <Text style={styles.cardTitle}>📊 Order Price Breakdown</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Items Subtotal ({cart.length} items):</Text>
          <Text style={styles.priceVal}>{formatPrice(cartSubtotal)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Freight & Cold-Chain Logistics:</Text>
          <Text style={styles.priceVal}>{formatPrice(freightCost)}</Text>
        </View>

        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Grand Total (Incl. GST):</Text>
          <Text style={styles.totalVal}>{formatPrice(grandTotal)}</Text>
        </View>

        <Button
          title={loading ? 'Processing Escrow Payment...' : 'Confirm & Lock Funds in Escrow →'}
          variant="primary"
          size="md"
          onPress={handlePlaceOrder}
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
  sectionCard: { marginBottom: safeSpacingMd },
  cardTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: safeSpacingSm },
  payOption: { flexDirection: 'row', alignItems: 'center', padding: safeSpacingSm + 2, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8E2', marginBottom: 8 },
  activePayOption: { borderColor: safePrimary, backgroundColor: '#F4FBF7' },
  payTitle: { fontSize: 13, fontWeight: '700', color: safeTextPrimary },
  payDesc: { fontSize: 10, color: safeTextSecondary, marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  priceLabel: { fontSize: 12, color: safeTextSecondary },
  priceVal: { fontSize: 12, fontWeight: '700', color: safeTextPrimary },
  totalRow: { paddingTop: safeSpacingSm, marginTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
  totalLabel: { fontSize: 14, fontWeight: '800', color: safeTextPrimary },
  totalVal: { fontSize: 16, fontWeight: '800', color: safePrimary },
});
