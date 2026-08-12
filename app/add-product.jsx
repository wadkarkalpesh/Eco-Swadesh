import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { productsApi } from '../utils/apiClient';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';

const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function AddProductScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('Bio-Enriched Organic NPK Liquid');
  const [category, setCategory] = useState('fertilizers');
  const [price, setPrice] = useState('450');
  const [unit, setUnit] = useState('Liter');
  const [stock, setStock] = useState('500');
  const [description, setDescription] = useState('100% Organic certified Bio-NPK solution with Azotobacter microbial strain.');
  const [certScheme, setCertScheme] = useState('NPOP_INDIA');
  const [certNumber, setCertNumber] = useState('NPOP/NAB/0014/2026');

  const [loading, setLoading] = useState(false);

  const handlePublishProduct = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Required Fields', 'Please enter Product Title and Price.');
      return;
    }

    setLoading(true);
    try {
      const res = await productsApi.createProduct({
        title,
        category,
        price: parseFloat(price) || 450,
        unit,
        stock: parseInt(stock, 10) || 500,
        description,
        certScheme,
        certNumber,
        certifiedOrganic: true,
      });

      if (res && res.product) {
        Alert.alert('🎉 Published to Marketplace!', `Product "${res.product.title}" is now live for buyers.`);
        router.replace('/(tabs)/explore');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not publish product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="add-circle" size={36} color="#81C784" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Publish Product to Marketplace</Text>
            <Text style={styles.headerSub}>List Retail Bio-Inputs or Direct Bulk Harvest Tons</Text>
          </View>
        </View>

        <Badge label="NPOP / JAIVIK CERTIFICATE ATTACHMENT" variant="gold" size="sm" style={{ marginTop: safeSpacingSm }} />
      </Card>

      {/* Product Details Form */}
      <Card style={styles.formCard}>
        <Text style={styles.cardTitle}>📦 Product & Pricing Details</Text>

        <Input
          label="Product Title *"
          value={title}
          onChangeText={setTitle}
        />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="Price (₹) *"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="Unit (e.g. Kg, Liter, Ton)"
              value={unit}
              onChangeText={setUnit}
            />
          </View>
        </View>

        <Input
          label="Available Stock Quantity"
          keyboardType="numeric"
          value={stock}
          onChangeText={setStock}
        />

        <Input
          label="Detailed Product Description"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
        />

        {/* Organic Certification Section */}
        <View style={styles.certSection}>
          <Text style={styles.cardTitle}>📜 Organic Certification Attachment</Text>

          <Input
            label="Certification Scheme (e.g. NPOP, Jaivik, USDA)"
            value={certScheme}
            onChangeText={setCertScheme}
          />

          <Input
            label="Certificate Registration Number"
            value={certNumber}
            onChangeText={setCertNumber}
          />
        </View>

        <Button
          title={loading ? 'Publishing...' : 'Publish Live to Marketplace →'}
          variant="primary"
          size="md"
          onPress={handlePublishProduct}
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
  certSection: { marginTop: safeSpacingMd, paddingTop: safeSpacingSm, borderTopWidth: 1, borderTopColor: '#E2E8E2' },
});
