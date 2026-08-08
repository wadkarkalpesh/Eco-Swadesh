import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';

export default function TabLayout() {
  const { t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: safePrimary,
        tabBarInactiveTintColor: safeTextMuted,
        tabBarStyle: {
          backgroundColor: safeCard,
          borderTopColor: safeBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('marketplace'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: t('aiDoctor'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t('community'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
