import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CertificateUploaderModal from '../components/CertificateUploaderModal';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safeTrustBlue = (COLORS && COLORS.trustBlue) || '#1976D2';
const safeTerracotta = (COLORS && COLORS.terracotta) || '#D84315';
const safeOverlay = (COLORS && COLORS.overlay) || 'rgba(18, 30, 21, 0.5)';
const safeRadiusXl = (RADIUS && RADIUS.xl) || 28;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function SellerDashboardScreen() {
  const { products, publishProductListing } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [prodName, setProdName] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!prodName.trim()) return;
    setIsPublishing(true);
    try {
      await publishProductListing({
        name: prodName,
        retailPrice: parseFloat(retailPrice) || 350,
        bulkPricePerTon: parseFloat(bulkPrice) || 42000,
        category: 'bulkHarvest',
        sellerName: 'Swadesh Farmer Collective',
        certifiedType: 'NATIONAL',
        certName: 'Jaivik Bharat & APEDA',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
      });
      setProdName('');
      setRetailPrice('');
      setBulkPrice('');
      setModalVisible(false);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Analytics Overview */}
      <View style={styles.analyticsGrid}>
        <Card bg={safePrimaryDark} style={styles.metricCard}>
          <Text style={styles.metricVal}>₹12,45,000</Text>
          <Text style={styles.metricLabel}>Monthly Revenue</Text>
        </Card>
        <Card bg={safeTerracotta} style={styles.metricCard}>
          <Text style={styles.metricVal}>48.5 Tons</Text>
          <Text style={styles.metricLabel}>Bulk Dispatched</Text>
        </Card>
      </View>

      {/* Add New Product / Harvest CTA */}
      <Button
        title="➕ List New Bio-Input / Bulk Harvest in Tons"
        variant="primary"
        size="lg"
        onPress={() => setModalVisible(true)}
        style={{ marginVertical: safeSpacingSm }}
      />

      {/* Manage Certificate Uploads */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Uploaded Organic & Government Certificates</Text>
        <Text style={styles.sectionSub}>Manage National Authorities & Local Govt State Agro Board Permits:</Text>

        <View style={styles.certItem}>
          <Ionicons name="ribbon" size={20} color={safeTrustBlue} />
          <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
            <Text style={styles.certTitle}>Jaivik Bharat / NPOP Certified Organic</Text>
            <Text style={styles.certSub}>APEDA License: NPOP/NAB/0014/2025 (Valid to 2028)</Text>
          </View>
          <Badge label="ACTIVE" variant="success" size="sm" />
        </View>

        <View style={styles.certItem}>
          <Ionicons name="shield-checkmark" size={20} color={safeGovGold} />
          <View style={{ flex: 1, marginLeft: safeSpacingXs }}>
            <Text style={styles.certTitle}>State Department of Agriculture Board Permit</Text>

            <Text style={styles.certSub}>Local Gov Seal: MH-AGRI-ORG-4402</Text>
          </View>
          <Badge label="LOCAL GOVT SEAL" variant="gov" size="sm" />
        </View>

        <Button
          title="Upload New Government / Local License"
          variant="outline"
          size="sm"
          onPress={() => setCertModalVisible(true)}
          style={{ marginTop: safeSpacingXs }}
        />

        <CertificateUploaderModal
          visible={certModalVisible}
          onClose={() => setCertModalVisible(false)}
        />
      </Card>

      {/* Product Listings Table */}
      <Text style={styles.sectionTitleHeader}>My Active Product Listings ({products.length})</Text>

      {products.map((item) => (
        <Card key={item.id} style={styles.productRow}>
          <View style={{ flex: 1 }}>
            <Badge
              label={item.certifiedType === 'LOCAL_GOV' ? 'LOCAL GOVT APPROVED' : 'NATIONAL GOV STANDARD'}
              variant={item.certifiedType === 'LOCAL_GOV' ? 'gov' : 'trust'}
              size="sm"
            />
            <Text style={styles.prodName}>{item.name}</Text>
            <Text style={styles.prodPrice}>
              Retail: ₹{item.retailPrice} | Bulk: ₹{item.bulkPricePerTon || item.retailPrice * 1000} / Ton
            </Text>
          </View>
          <Badge label={item.inStock ? 'IN STOCK' : 'OUT OF STOCK'} variant="success" size="sm" />
        </Card>
      ))}

      {/* Add Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List New Organic Input / Bulk Harvest</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color={safeTextPrimary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Product / Harvest Title"
              placeholder="e.g. Bio-NPK Granules or Organic Wheat 20 Tons..."
              value={prodName}
              onChangeText={setProdName}
            />

            <View style={styles.inputRow}>
              <Input
                label="Retail Price (₹/Kg)"
                placeholder="450"
                value={retailPrice}
                onChangeText={setRetailPrice}
                keyboardType="numeric"
                style={{ flex: 1, marginRight: safeSpacingXs }}
              />
              <Input
                label="Bulk Price (₹/Ton)"
                placeholder="42000"
                value={bulkPrice}
                onChangeText={setBulkPrice}
                keyboardType="numeric"
                style={{ flex: 1, marginLeft: safeSpacingXs }}
              />
            </View>

            <Button
              title={isPublishing ? 'Publishing to Network...' : 'Publish Listing to Eco Swadesh'}
              variant="terracotta"
              size="md"
              onPress={handlePublish}
              disabled={isPublishing}
              style={{ marginTop: safeSpacingMd }}
            />
          </View>
        </View>
      </Modal>
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
  analyticsGrid: {
    flexDirection: 'row',
    gap: safeSpacingSm,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: safeSpacingMd,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    color: safeTextLight,
  },
  metricLabel: {
    fontSize: 11,
    color: '#E8F5E9',
    marginTop: 2,
  },
  sectionCard: {
    marginVertical: safeSpacingXs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: safeTextMuted,
    marginBottom: safeSpacingXs,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: safeSpacingXs,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  certTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  certSub: {
    fontSize: 10,
    color: safeTextMuted,
  },
  sectionTitleHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: safeTextPrimary,
    marginTop: safeSpacingMd,
    marginBottom: safeSpacingXs,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: safeSpacingXs,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
    marginTop: 2,
  },
  prodPrice: {
    fontSize: 11,
    color: safeTextSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: safeOverlay,
    justifyContent: 'center',
    padding: safeSpacingMd,
  },
  modalCard: {
    backgroundColor: safeCard,
    borderRadius: safeRadiusXl,
    padding: safeSpacingMd,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: safeSpacingMd,
    paddingBottom: safeSpacingXs,
    borderBottomWidth: 1,
    borderBottomColor: safeBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  inputRow: {
    flexDirection: 'row',
  },
});
