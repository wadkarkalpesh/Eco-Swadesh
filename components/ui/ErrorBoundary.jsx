import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const safeBg = (COLORS && COLORS.background) || '#F4F7F4';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safePrimary = (COLORS && COLORS.primary) || '#1E4D2B';
const safePrimaryDark = (COLORS && COLORS.primaryDark) || '#12361C';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';
const safeTextLight = (COLORS && COLORS.textLight) || '#FFFFFF';
const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeRadiusFull = (RADIUS && RADIUS.full) || 9999;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Eco Swadesh ErrorBoundary caught an exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="alert-circle-outline" size={40} color="#D32F2F" />
            </View>
            <Text style={styles.title}>Application Recovery State</Text>
            <Text style={styles.sub}>
              Eco Swadesh encountered a transient rendering error. Your data and cart state are safely preserved.
            </Text>

            {this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText} numberOfLines={3}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.reloadBtn} onPress={this.handleReload}>
              <Ionicons name="refresh-outline" size={18} color={safeTextLight} style={{ marginRight: 6 }} />
              <Text style={styles.reloadBtnText}>Reload Eco Swadesh Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: safeBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: safeSpacingMd,
  },
  errorCard: {
    backgroundColor: safeCard,
    borderRadius: safeRadiusMd,
    padding: safeSpacingMd * 1.5,
    alignItems: 'center',
    maxWidth: 420,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: safeRadiusFull,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: safeSpacingSm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: safePrimaryDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: safeTextMuted,
    textAlign: 'center',
    marginBottom: safeSpacingMd,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: safeSpacingSm,
    width: '100%',
    marginBottom: safeSpacingMd,
  },
  errorText: {
    fontSize: 11,
    color: '#D32F2F',
    fontFamily: 'monospace',
  },
  reloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: safePrimary,
    paddingHorizontal: safeSpacingMd,
    paddingVertical: safeSpacingSm + 2,
    borderRadius: safeRadiusMd,
    width: '100%',
  },
  reloadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: safeTextLight,
  },
});
