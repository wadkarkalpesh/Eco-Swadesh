import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ExpertBookingModal from '../../components/ExpertBookingModal';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryLight = (COLORS && COLORS.primaryLight) || '#2E7D32';
const safeGovGold = (COLORS && COLORS.govGold) || '#C5A059';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeOverlay = (COLORS && COLORS.overlay) || 'rgba(18, 30, 21, 0.5)';
const safeRadiusXl = (RADIUS && RADIUS.xl) || 28;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

export default function CommunityScreen() {
  const { t, communityPosts, addCommunityPost, upvoteCommunityPost } = useApp();
  
  // Post modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [expertModalVisible, setExpertModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    await addCommunityPost({
      title: newTitle,
      content: newContent,
      tags: ['Organic Farming', 'Q&A'],
    });
    setNewTitle('');
    setNewContent('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('community')}</Text>
          <View style={{ flexDirection: 'row', gap: safeSpacingXs }}>
            <TouchableOpacity
              style={styles.expertBtn}
              onPress={() => setExpertModalVisible(true)}
            >
              <Ionicons name="school" size={16} color={safeTextLight} />
              <Text style={styles.postBtnText}>Book Expert</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.postBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color={safeTextLight} />
              <Text style={styles.postBtnText}>{t('postQuestion')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSub}>Connect with 45,000+ organic farmers, soil experts & researchers</Text>
      </View>

      <ExpertBookingModal
        visible={expertModalVisible}
        onClose={() => setExpertModalVisible(false)}
      />

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Posts Stream */}
        {communityPosts.map((post) => (
          <Card key={post.id} style={styles.postCard}>
            <View style={styles.authorRow}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={styles.authorInfo}>
                <View style={styles.authorNameRow}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  {post.verifiedExpert && (
                    <Badge label="VERIFIED EXPERT" variant="trust" size="sm" style={{ marginLeft: 4 }} />
                  )}
                </View>
                <Text style={styles.authorRole}>{post.role} • {post.date}</Text>
              </View>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.tagRow}>
              {post.tags.map((tag, idx) => (
                <Badge key={idx} label={`#${tag}`} variant="success" size="sm" style={{ marginRight: 4 }} />
              ))}
            </View>

            <View style={styles.postFooter}>
              <TouchableOpacity
                style={styles.footerAction}
                onPress={() => upvoteCommunityPost(post.id)}
              >
                <Ionicons name="thumbs-up" size={16} color={safePrimary} />
                <Text style={styles.actionText}>{post.upvotes} Upvotes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerAction}>
                <Ionicons name="chatbubble-outline" size={16} color={safeTextSecondary} />
                <Text style={styles.actionText}>{post.repliesCount} Answers</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ask Community / Share Insights</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color={safeTextPrimary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Topic Title"
              placeholder="e.g., Best organic bio-fertilizers for sugarcane yield..."
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Input
              label="Details & Field Context"
              placeholder="Describe soil type, acreage, crop symptoms or trade experience..."
              value={newContent}
              onChangeText={setNewContent}
              multiline
              numberOfLines={4}
            />

            <Button
              title="Publish Question / Post"
              variant="primary"
              size="md"
              onPress={handleCreatePost}
              style={{ marginTop: safeSpacingMd }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
  },
  header: {
    backgroundColor: safePrimary,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingSm + 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: safeTextLight,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safePrimaryLight,
    paddingHorizontal: safeSpacingSm + 2,
    paddingVertical: 6,
    borderRadius: safeRadiusFull,
  },
  expertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeGovGold,
    paddingHorizontal: safeSpacingSm + 2,
    paddingVertical: 6,
    borderRadius: safeRadiusFull,
  },
  postBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: safeTextLight,
    marginLeft: 4,
  },
  headerSub: {
    fontSize: 11,
    color: '#C8E6C9',
    marginTop: 2,
  },
  scrollBody: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  postCard: {
    marginBottom: safeSpacingMd,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: safeSpacingXs,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: safeRadiusFull,
    marginRight: safeSpacingSm,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextPrimary,
  },
  authorRole: {
    fontSize: 10,
    color: safeTextMuted,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: safeTextPrimary,
    marginVertical: 4,
  },
  postContent: {
    fontSize: 12,
    color: safeTextSecondary,
    lineHeight: 17,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: safeSpacingXs + 2,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: safeSpacingSm,
    paddingTop: safeSpacingXs,
    borderTopWidth: 1,
    borderTopColor: safeBorder,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 11,
    color: safeTextSecondary,
    fontWeight: '600',
    marginLeft: 4,
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
});
