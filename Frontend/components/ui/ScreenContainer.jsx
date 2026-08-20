import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/theme';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingXxl = (SPACING && SPACING.xxl) || 48;

/**
 * ScreenContainer - Universal Responsive Container for App and Web
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'auth' | 'standard' | 'full'} [props.maxWidth='standard'] - 'auth' (580px), 'standard' (1100px), 'full' (100%)
 * @param {boolean} [props.scrollable=true] - Whether content should scroll
 * @param {Object} [props.style] - Additional container style
 * @param {Object} [props.contentContainerStyle] - Scroll body style
 * @param {boolean} [props.withSafeArea=true] - Wrap in SafeAreaView
 * @param {string[]} [props.edges=['top']] - SafeArea edges
 */
export default function ScreenContainer({
  children,
  maxWidth = 'standard',
  scrollable = true,
  style,
  contentContainerStyle,
  withSafeArea = true,
  edges = ['top'],
}) {
  const getMaxWidth = () => {
    if (maxWidth === 'auth') return 580;
    if (maxWidth === 'standard') return 1100;
    return '100%';
  };

  const isWeb = Platform.OS === 'web';
  const widthConstraint = isWeb
    ? {
        maxWidth: getMaxWidth(),
        width: '100%',
        alignSelf: 'center',
      }
    : { width: '100%' };

  const content = scrollable ? (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[
        styles.scrollContent,
        widthConstraint,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContainer, widthConstraint, style]}>
      {children}
    </View>
  );

  if (withSafeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: safeBg }]} edges={edges}>
        <View style={styles.outerWebWrapper}>
          {content}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: safeBg }]}>
      <View style={styles.outerWebWrapper}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  outerWebWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: safeSpacingMd,
    paddingBottom: safeSpacingXxl,
  },
  staticContainer: {
    flex: 1,
    padding: safeSpacingMd,
  },
});
