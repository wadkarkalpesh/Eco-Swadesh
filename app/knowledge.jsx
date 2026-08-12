import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

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

const KNOWLEDGE_ARTICLES = [
  {
    id: 'art-1',
    title: 'Complete Guide to NPOP Organic Certification in India',
    category: 'Certification Rules',
    readTime: '6 min read',
    summary: 'Step-by-step walkthrough of National Programme for Organic Production (NPOP) field audits, soil conversion periods, and heavy metal testing.',
    author: 'Dr. Anita Roy, Organic Audit Specialist',
    tag: 'NPOP & JAIVIK',
  },
  {
    id: 'art-2',
    title: 'Bio-NPK Liquid Fermentation & Microbial Inoculants',
    category: 'Sustainable Farming',
    readTime: '8 min read',
    summary: 'How Azotobacter and Phosphate Solubilizing Bacteria (PSB) increase soil nitrogen uptake by 35% without synthetic chemical runoff.',
    author: 'ICAR Senior Scientist Board',
    tag: 'SOIL HEALTH',
  },
  {
    id: 'art-3',
    title: '30-Meter Buffer Zone Management for Drift Hazard Mitigation',
    category: 'Farm GIS & Buffer',
    readTime: '5 min read',
    summary: 'Establishing biological hedges and barrier trees to protect certified organic crops from adjacent synthetic pesticide spray drift.',
    author: 'Eco-Swadesh GIS Team',
    tag: 'GIS AUDIT',
  },
  {
    id: 'art-4',
    title: 'PM-KISAN & Soil Health Card Scheme Benefits 2026',
    category: 'Govt Schemes',
    readTime: '4 min read',
    summary: 'How to claim 4% subsidized Kisan Credit Loans, bio-input subventions, and soil sample lab testing vouchers.',
    author: 'Agri Ministry Advisory',
    tag: 'SUBSIDY',
  },
];

export default function KnowledgeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollBody}>
      {/* Banner Header */}
      <Card bg={safePrimaryDark} style={styles.headerCard}>
        <View style={styles.bannerRow}>
          <Ionicons name="book-outline" size={36} color={safeSunGold} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerTitle}>Agri Knowledge & Learning Hub</Text>
            <Text style={styles.headerSub}>Farming Guides, Organic Rules, Videos & Govt Schemes</Text>
          </View>
        </View>

        <Input
          placeholder="Search organic guides, soil science, NPOP..."
          value={search}
          onChangeText={setSearch}
          style={{ marginTop: safeSpacingMd }}
        />
      </Card>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: safeSpacingMd }}>
        {['ALL', 'Certification Rules', 'Sustainable Farming', 'Farm GIS & Buffer', 'Govt Schemes'].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.catChip, selectedCategory === cat && styles.activeCatChip]}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.activeCatText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles Feed */}
      {filteredArticles.map((art) => (
        <Card key={art.id} style={styles.articleCard}>
          <View style={styles.articleHeader}>
            <Badge label={art.tag} variant="trust" size="sm" />
            <Text style={styles.readTime}>⏱️ {art.readTime}</Text>
          </View>

          <Text style={styles.articleTitle}>{art.title}</Text>
          <Text style={styles.articleSummary}>{art.summary}</Text>

          <View style={styles.authorRow}>
            <Ionicons name="person-circle-outline" size={16} color={safeTextSecondary} />
            <Text style={styles.authorText}>{art.author}</Text>
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
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: safeRadiusMd, backgroundColor: '#E2E8E2', marginRight: 8 },
  activeCatChip: { backgroundColor: safePrimary },
  catText: { fontSize: 11, fontWeight: '700', color: safeTextPrimary },
  activeCatText: { color: safeTextLight },
  articleCard: { marginBottom: safeSpacingMd },
  articleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  readTime: { fontSize: 10, color: safeTextSecondary },
  articleTitle: { fontSize: 15, fontWeight: '800', color: safeTextPrimary, marginBottom: 4 },
  articleSummary: { fontSize: 12, color: safeTextSecondary, lineHeight: 18, marginBottom: 8 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorText: { fontSize: 11, fontStyle: 'italic', color: safeTextSecondary },
});
