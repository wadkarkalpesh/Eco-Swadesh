import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import InvoicePreviewModal from '../components/InvoicePreviewModal';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeDanger = (COLORS && COLORS.danger) || '#D32F2F';
const safeTrustBlue = (COLORS && COLORS.trustBlue) || '#1976D2';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';
const safeSunGold = (COLORS && COLORS.sunGold) || '#FFA000';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeAccentLight = (COLORS && COLORS.accentLight) || '#E8F5E9';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusXs = (RADIUS && RADIUS.xs) || 4;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXl = (SPACING && SPACING.xl) || 32;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart, formatPrice, createEscrowOrder, t } = useApp();

  const [shippingMethod, setShippingMethod] = useState('PARCEL'); // 'PARCEL' | 'FREIGHT' | 'PICKUP'
  const [paymentMethod, setPaymentMethod] = useState('ESCROW'); // 'ESCROW' | 'UPI' | 'CARD'
  const [showInvoice, setShowInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const shippingFee = shippingMethod === 'FREIGHT' ? 4500 : 150;
  const grandTotal = subtotal + shippingFee;

  const handleConfirmOrder = async () => {
    if (cart.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          isBulk: item.isBulk,
          quantity: item.quantity,
          unit: item.unit,
          price: item.unitPrice,
        })),
        shippingMethod,
        paymentMethod,
        subtotal,
        shippingFee,
        grandTotal,
        shippingAddress: 'Direct Farm Hub Logistics Center, Pune, India',
      };

      await createEscrowOrder(orderPayload);
      router.push('/logistics');
    } catch (err) {
      console.warn('[CartScreen] Order placement notice:', err.message);
      clearCart();
      router.push('/logistics');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={safeTextMuted} />
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySub}>
            Explore certified organic fertilizers, seeds, and direct farm harvests in tons.
          </Text>
          <Button
            title="Browse Marketplace"
            variant="primary"
            size="md"
            onPress={() => router.push('/(tabs)/explore')}
            style={{ marginTop: safeSpacingMd }}
          />
        </View>
      ) : (
        <View>
          {/* Cart Item Cards */}
          <Text style={styles.sectionTitle}>Order Summary ({cart.length} items)</Text>

          {cart.map((item) => (
            <Card key={item.itemKey} style={styles.cartCard}>
              <View style={styles.itemRow}>
                <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Badge
                    label={item.isBulk ? 'DIRECT BULK (TONS)' : 'RETAIL PACK'}
                    variant={item.isBulk ? 'bulk' : 'success'}
                    size="sm"
                  />
                  <Text style={styles.itemTitle}>{item.product.name}</Text>
                  <Text style={styles.itemSeller}>Seller: {item.product.sellerName}</Text>

                  <Text style={item.isBulk ? styles.bulkPrice : styles.retailPrice}>
                    {formatPrice(item.unitPrice, item.isBulk, item.unit)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQuantity(item.itemKey, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={14} color={safeTextPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>
                    {item.quantity} {item.unit}s
                  </Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateCartQuantity(item.itemKey, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={14} color={safeTextPrimary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removeFromCart(item.itemKey)}>
                  <Ionicons name="trash-outline" size={20} color={safeDanger} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}

          {/* Logistics Selection */}
          <Card style={styles.shippingCard}>
            <Text style={styles.sectionTitle}>Select Logistics & Shipping</Text>

            <TouchableOpacity
              style={[styles.shipOption, shippingMethod === 'PARCEL' && styles.selectedShipOption]}
              onPress={() => setShippingMethod('PARCEL')}
            >
              <Ionicons name="leaf-outline" size={20} color={safePrimary} />
              <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
                <Text style={styles.shipTitle}>{t('retailDelivery')}</Text>
                <Text style={styles.shipSub}>Carbon-Neutral Small Pack Express Courier</Text>
              </View>
              <Text style={styles.shipPrice}>+₹150</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shipOption, shippingMethod === 'FREIGHT' && styles.selectedShipOptionBulk]}
              onPress={() => setShippingMethod('FREIGHT')}
            >
              <Ionicons name="bus-outline" size={20} color={safeTerracotta} />
              <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
                <Text style={styles.shipTitle}>{t('bulkFreight')}</Text>
                <Text style={styles.shipSub}>Direct Heavy Truckload (Destination Quality Check)</Text>
              </View>
              <Text style={styles.shipPriceBulk}>+₹4,500</Text>
            </TouchableOpacity>
          </Card>

          {/* Payment Method */}
          <Card style={styles.shippingCard}>
            <Text style={styles.sectionTitle}>Payment & Protection</Text>

            <TouchableOpacity
              style={[styles.shipOption, paymentMethod === 'ESCROW' && styles.selectedShipOption]}
              onPress={() => setPaymentMethod('ESCROW')}
            >
              <Ionicons name="shield-checkmark" size={20} color={safeTrustBlue} />
              <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
                <Text style={styles.shipTitle}>Eco Swadesh Escrow Guarantee</Text>
                <Text style={styles.shipSub}>Payment released to farmer/seller after lab verification</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shipOption, paymentMethod === 'UPI' && styles.selectedShipOption]}
              onPress={() => setPaymentMethod('UPI')}
            >
              <Ionicons name="qr-code-outline" size={20} color={safePrimary} />
              <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
                <Text style={styles.shipTitle}>Instant UPI / Card / Net Banking</Text>
                <Text style={styles.shipSub}>Instant order dispatch confirmation</Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Grand Total Card */}
          <Card bg={safePrimaryDark} style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalVal}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Logistics:</Text>
              <Text style={styles.totalVal}>{formatPrice(shippingFee)}</Text>
            </View>
            <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: safeSpacingXs, marginTop: safeSpacingXs }]}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalVal}>{formatPrice(grandTotal)}</Text>
            </View>

            <Button
              title="📄 Preview Tax Invoice & Escrow Guarantee"
              variant="outline"
              size="md"
              onPress={() => setShowInvoice(true)}
              style={{ marginTop: safeSpacingSm, borderColor: safeTextLight }}
              textStyle={{ color: safeTextLight }}
            />

            <Button
              title={isSubmitting ? 'Securing Escrow Pool...' : `Confirm Order (${formatPrice(grandTotal)})`}
              variant="terracotta"
              size="lg"
              onPress={handleConfirmOrder}
              disabled={isSubmitting}
              style={{ marginTop: safeSpacingSm }}
            />

            <InvoicePreviewModal
              visible={showInvoice}
              onClose={() => setShowInvoice(false)}
            />
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  scrollBody: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: safeSpacingXxl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: safeTextPrimary,
    marginTop: safeSpacingMd,
  },
  emptySub: {
    fontSize: 12,
    color: safeTextMuted,
    textAlign: 'center',
    paddingHorizontal: safeSpacingXl,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginBottom: safeSpacingXs,
  },
  cartCard: {
    marginBottom: safeSpacingSm,
  },
  itemRow: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: safeRadiusMd,
    marginRight: safeSpacingSm,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 2,
  },
  itemSeller: {
    fontSize: 11,
    color: safeTextMuted,
  },
  retailPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: safePrimaryDark,
    marginTop: 2,
  },
  bulkPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: safeTerracotta,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: safeSpacingXs + 2,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: safeBorder,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeBg,
    borderRadius: safeRadiusMd,
    padding: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: safeRadiusXs,
    backgroundColor: safeCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
    marginHorizontal: safeSpacingSm,
  },
  shippingCard: {
    marginVertical: safeSpacingXs,
  },
  shipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: safeSpacingSm,
    borderRadius: safeRadiusMd,
    borderWidth: 1,
    borderColor: safeBorder,
    marginBottom: safeSpacingXs,
  },
  selectedShipOption: {
    backgroundColor: safeAccentLight,
    borderColor: safePrimary,
  },
  selectedShipOptionBulk: {
    backgroundColor: '#FBE9E7',
    borderColor: safeTerracotta,
  },
  shipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  shipSub: {
    fontSize: 11,
    color: safeTextMuted,
  },
  shipPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: safePrimaryDark,
  },
  shipPriceBulk: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTerracotta,
  },
  totalCard: {
    padding: safeSpacingMd,
    marginTop: safeSpacingMd,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  totalLabel: {
    fontSize: 12,
    color: '#C8E6C9',
  },
  totalVal: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextLight,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: safeTextLight,
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: safeSunGold,
  },
});
