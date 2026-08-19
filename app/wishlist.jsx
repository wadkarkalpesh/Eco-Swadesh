import React from 'react';
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
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';

const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;

export default function WishlistScreen() {
  const router = useRouter();
  const { products, addToCart, formatPrice } = useApp();

  const [savedItems, setSavedItems] = React.useState(products.slice(0, 3));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="heart" size={36} color="#FF8A80" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>My Saved Wishlist</Text>
            <Text style={styles.headerSub}>Saved Organic Bio-Inputs & Favorite Produce Listings</Text>
          </View>
        </View>
      </Card>

      {/* Wishlist Items List */}
      {savedItems.map((item) => (
        <Card key={item.id} style={styles.itemCard}>
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Badge label={item.certScheme || 'NPOP CERTIFIED'} variant="success" size="sm" />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setSavedItems((prev) => prev.filter((i) => i.id !== item.id))}
            >
              <Ionicons name="trash-outline" size={16} color="#D32F2F" />
              <Text style={{ fontSize: 11, color: '#D32F2F', fontWeight: '700' }}>Remove</Text>
            </TouchableOpacity>

            <Button
              title="Move to Cart 🛒"
              variant="primary"
              size="sm"
              onPress={() => addToCart(item)}
            />
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
  itemCard: { marginBottom: safeSpacingMd },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemImg: { width: 70, height: 70, borderRadius: safeRadiusMd },
  itemTitle: { fontSize: 14, fontWeight: '800', color: safeTextPrimary, marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: safePrimary, marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: safeSpacingSm, paddingTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
