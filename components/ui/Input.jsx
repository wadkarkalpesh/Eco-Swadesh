import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const safeRadiusMd = (RADIUS && RADIUS.md) || 14;
const safeSpacingXs = (SPACING && SPACING.xs) || 4;
const safeSpacingSm = (SPACING && SPACING.sm) || 8;
const safeSpacingMd = (SPACING && SPACING.md) || 16;
const safeTextSecondary = (COLORS && COLORS.textSecondary) || '#5A6E5D';
const safeCard = (COLORS && COLORS.card) || '#FFFFFF';
const safeBorder = (COLORS && COLORS.border) || '#E2E8E2';
const safeDanger = (COLORS && COLORS.danger) || '#D32F2F';
const safeTextPrimary = (COLORS && COLORS.textPrimary) || '#1A2E1E';
const safeTextMuted = (COLORS && COLORS.textMuted) || '#8A9E8C';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={safeTextMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            multiline && { height: numberOfLines * 24, textAlignVertical: 'top' },
          ]}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: safeSpacingXs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: safeTextSecondary,
    marginBottom: safeSpacingXs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: safeCard,
    borderWidth: 1,
    borderColor: safeBorder,
    borderRadius: safeRadiusMd,
    paddingHorizontal: safeSpacingMd,
    height: 48,
  },
  inputError: {
    borderColor: safeDanger,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: safeTextPrimary,
  },
  leftIcon: {
    marginRight: safeSpacingSm,
  },
  rightIcon: {
    marginLeft: safeSpacingSm,
  },
  errorText: {
    fontSize: 11,
    color: safeDanger,
    marginTop: 2,
  },
});
