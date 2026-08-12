import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { COLORS } from '../constants/theme';

const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeBackground = (COLORS && COLORS.background) || '#F4F7F4';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: safePrimary,
            },
            headerTintColor: safeTextLight,
            headerTitleStyle: {
              fontWeight: '700',
            },
            headerBackTitleVisible: false,
            contentStyle: {
              backgroundColor: safeBackground,
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="product/[id]"
            options={{
              title: 'Product & Organic Certification',
            }}
          />
          <Stack.Screen
            name="cart"
            options={{
              title: 'Shopping Cart & Checkout',
            }}
          />
          <Stack.Screen
            name="logistics"
            options={{
              title: 'Eco Logistics & Freight Hub',
            }}
          />
          <Stack.Screen
            name="seller-dashboard"
            options={{
              title: 'Seller & Farmer Management',
            }}
          />
          <Stack.Screen
            name="trust-center"
            options={{
              title: 'Organic Certification Verifier',
            }}
          />
          <Stack.Screen
            name="admin-oversight"
            options={{
              title: 'Admin Platform Governance',
            }}
          />
          <Stack.Screen
            name="disputes"
            options={{
              title: 'Escrow & Quality Dispute Resolution',
            }}
          />
          <Stack.Screen
            name="procurement"
            options={{
              title: 'FPO Group Procurement',
            }}
          />
          <Stack.Screen
            name="mandi-prices"
            options={{
              title: 'APMC Mandi AI Price Forecaster',
            }}
          />
          <Stack.Screen
            name="carbon-credits"
            options={{
              title: 'Soil Carbon Credits & ESG Registry',
            }}
          />
          <Stack.Screen
            name="agri-credit"
            options={{
              title: 'Alternative Eco Agri-Credit',
            }}
          />
          <Stack.Screen
            name="farm-gis"
            options={{
              title: 'Satellite GIS Farm Buffer Auditor',
            }}
          />
          <Stack.Screen
            name="phytosanitary"
            options={{
              title: 'Export Biosecurity & Phytosanitary',
            }}
          />
          <Stack.Screen
            name="auth/select-portal"
            options={{
              title: 'Select Authentication Portal',
            }}
          />
          <Stack.Screen
            name="auth/buyer-login"
            options={{
              title: 'Customer & Buyer Login',
            }}
          />
          <Stack.Screen
            name="auth/seller-login"
            options={{
              title: 'Farmer & Seller Login',
            }}
          />
          <Stack.Screen
            name="auth/onboarding"
            options={{
              title: 'Personal Information Setup',
            }}
          />
          <Stack.Screen
            name="auth/welcome"
            options={{
              title: 'Welcome to Eco-Swadesh',
            }}
          />
          <Stack.Screen
            name="knowledge"
            options={{
              title: 'Agri Knowledge & Learning Hub',
            }}
          />
          <Stack.Screen
            name="wishlist"
            options={{
              title: 'Saved Wishlist',
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              title: 'Escrow Protected Checkout',
            }}
          />
          <Stack.Screen
            name="add-product"
            options={{
              title: 'Publish Product to Marketplace',
            }}
          />
          <Stack.Screen
            name="notifications"
            options={{
              title: 'Eco-Swadesh Notifications',
            }}
          />
          <Stack.Screen
            name="help-support"
            options={{
              title: 'Help & Support Center',
            }}
          />
        </Stack>
      </AppProvider>
    </ErrorBoundary>
  );
}
