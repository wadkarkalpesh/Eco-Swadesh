import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ordersApi } from '../utils/apiClient';
import { useApp } from '../context/AppContext';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';

export default function OrderMessagesScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { currentUser, persona } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      senderId: 'usr_seller_01',
      senderName: 'Ramesh Patel (Producer Collective)',
      senderRole: 'seller',
      text: 'Namaste! The Sharbati wheat batch is packed in moisture-proof jute bags and ready for cold reefer dispatch.',
      createdAt: '10:30 AM',
    },
    {
      id: 'msg-2',
      senderId: 'usr_buyer_01',
      senderName: 'Verified Organic Buyer',
      senderRole: 'buyer',
      text: 'Thanks Ramesh Ji! Please ensure the NABL Lab chemical residue test report barcode is attached on pallet #4.',
      createdAt: '10:35 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (orderId) {
      ordersApi.getMessages(orderId).then((res) => {
        if (res && res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        }
      }).catch(() => null);
    }
  }, [orderId]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'usr_current',
      senderName: currentUser?.name || (persona === 'farmer' ? 'Ramesh Patel' : 'Buyer'),
      senderRole: persona === 'farmer' ? 'seller' : 'buyer',
      text: inputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (orderId) {
      setSending(true);
      await ordersApi.sendMessage(orderId, newMsg.text).catch(() => null);
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={safeTextLight} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Order Messaging Thread</Text>
          <Text style={styles.headerSub}>Order: {orderId || 'ORD-2026-9041'} (Escrow Protected)</Text>
        </View>
        <Badge label="PARTY ENCRYPTED" variant="gold" size="sm" />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {messages.map((m) => {
            const isMe = m.senderRole === (persona === 'farmer' ? 'seller' : 'buyer');
            return (
              <View
                key={m.id}
                style={[
                  styles.msgBubbleWrap,
                  isMe ? styles.myMsgWrap : styles.otherMsgWrap,
                ]}
              >
                <Text style={styles.senderLabel}>
                  {m.senderName} ({m.senderRole.toUpperCase()})
                </Text>
                <View
                  style={[
                    styles.msgBubble,
                    isMe ? styles.myMsgBubble : styles.otherMsgBubble,
                  ]}
                >
                  <Text style={[styles.msgText, isMe && { color: safeTextLight }]}>
                    {m.text}
                  </Text>
                  <Text style={[styles.msgTime, isMe && { color: 'rgba(255,255,255,0.7)' }]}>
                    {m.createdAt}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Type message regarding delivery / sampling..."
              value={inputText}
              onChangeText={setInputText}
              style={{ marginBottom: 0 }}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={20} color={safeTextLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: safeTextLight,
  },
  headerSub: {
    fontSize: 12,
    color: '#A5D6A7',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 24,
  },
  msgBubbleWrap: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  myMsgWrap: {
    alignSelf: 'flex-end',
  },
  otherMsgWrap: {
    alignSelf: 'flex-start',
  },
  senderLabel: {
    fontSize: 11,
    color: safeTextSecondary,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  msgBubble: {
    padding: 12,
    borderRadius: 14,
  },
  myMsgBubble: {
    backgroundColor: safePrimary,
    borderBottomRightRadius: 2,
  },
  otherMsgBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: safeBorder,
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 14,
    color: safeTextPrimary,
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    color: '#9E9E9E',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: safeBorder,
    gap: 8,
  },
  sendBtn: {
    backgroundColor: safePrimary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
