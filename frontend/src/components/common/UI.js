import React, { useState } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  View, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SIZES, SHADOWS } from '../../constants/theme';

// ══════════════════════════════════════════════════════════════
//  BUTTON — style "terminal" avec bordure néon et glow
// ══════════════════════════════════════════════════════════════
export const Button = ({
  title, onPress, variant = 'primary', loading = false,
  disabled = false, style, textStyle, size = 'md',
}) => {
  const isOutline = variant === 'outline';
  const isGhost   = variant === 'ghost';
  const isDanger  = variant === 'danger';
  const isSmall   = size === 'sm';

  if (variant === 'primary' && !isSmall) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.82}
        style={[styles.btnOuter, (disabled || loading) && { opacity: 0.4 }, style]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDim]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btnGradient}
        >
          {loading
            ? <ActivityIndicator color={COLORS.bg} size="small" />
            : <Text style={[styles.btnTextPrimary, textStyle]}>{title}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isSmall   && styles.btnSm,
        isOutline && styles.btnOutline,
        isGhost   && styles.btnGhost,
        isDanger  && styles.btnDanger,
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.78}
    >
      {loading
        ? <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} size="small" />
        : <Text style={[
            styles.btnText,
            isSmall   && styles.btnTextSm,
            isOutline && styles.btnTextOutline,
            isGhost   && styles.btnTextGhost,
            isDanger  && styles.btnTextDanger,
            textStyle,
          ]}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

// ══════════════════════════════════════════════════════════════
//  INPUT — style "terminal" dark avec accent vert
// ══════════════════════════════════════════════════════════════
export const Input = ({
  label, placeholder, value, onChangeText, secureTextEntry = false,
  error, keyboardType = 'default', autoCapitalize = 'none',
  multiline = false, numberOfLines = 1, leftIcon, style, editable = true,
}) => {
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles.inputWrapper, style]}>
      {label && (
        <Text style={styles.inputLabel}>
          <Text style={{ color: COLORS.primary }}>{'> '}</Text>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputRow,
        focused && styles.inputFocused,
        !!error && styles.inputError,
      ]}>
        {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.inputField, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(p => !p)} style={styles.inputIcon}>
            <Ionicons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={19}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.inputErrorText}>{error}</Text>}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
//  HEADER — avec ligne accent verte
// ══════════════════════════════════════════════════════════════
export const Header = ({ title, onBack, rightIcon, onRightPress, rightComponent }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity style={styles.headerSide} onPress={onBack} disabled={!onBack}>
        {onBack && (
          <View style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.headerSide}>
        {rightComponent
          ? rightComponent
          : rightIcon && (
            <TouchableOpacity onPress={onRightPress}>
              <Ionicons name={rightIcon} size={24} color={COLORS.text} />
            </TouchableOpacity>
          )
        }
      </View>
      {/* Green accent line */}
      <View style={styles.headerAccent} />
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
//  EMPTY STATE — minimaliste avec icône néon
// ══════════════════════════════════════════════════════════════
export const EmptyState = ({ icon = 'images-outline', title, subtitle }) => (
  <View style={styles.empty}>
    <View style={styles.emptyIconWrap}>
      <Ionicons name={icon} size={36} color={COLORS.primary} />
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
  </View>
);

// ══════════════════════════════════════════════════════════════
//  LOADER — spinner néon
// ══════════════════════════════════════════════════════════════
export const Loader = ({ style }) => (
  <View style={[styles.loader, style]}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <View style={styles.loaderGlow} />
  </View>
);

// ══════════════════════════════════════════════════════════════
//  DIVIDER
// ══════════════════════════════════════════════════════════════
export const Divider = ({ style }) => <View style={[styles.divider, style]} />;

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Button ────────────────────────────────────────────────
  btnOuter: {
    borderRadius:  RADIUS.md,
    overflow:      'hidden',
    ...SHADOWS.glow,
  },
  btnGradient: {
    paddingVertical:   14,
    paddingHorizontal: SPACING.xl,
    alignItems:        'center',
    justifyContent:    'center',
    minHeight:         50,
  },
  btnTextPrimary: {
    color:      COLORS.bg,
    fontSize:   FONTS.sizes.base,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 0.5,
  },
  btn: {
    backgroundColor:   COLORS.surfaceAlt,
    borderRadius:      RADIUS.md,
    paddingVertical:   14,
    paddingHorizontal: SPACING.xl,
    alignItems:        'center',
    justifyContent:    'center',
    minHeight:         50,
    borderWidth:       1,
    borderColor:       COLORS.border,
  },
  btnSm:          { paddingVertical: 8, paddingHorizontal: SPACING.md, minHeight: 36 },
  btnOutline:     { backgroundColor: COLORS.transparent, borderWidth: 1.5, borderColor: COLORS.primary },
  btnGhost:       { backgroundColor: COLORS.transparent, borderWidth: 0, paddingVertical: 8 },
  btnDanger:      { backgroundColor: 'transparent', borderColor: COLORS.error },
  btnDisabled:    { opacity: 0.4 },
  btnText:        { color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.semibold },
  btnTextSm:      { fontSize: FONTS.sizes.sm },
  btnTextOutline: { color: COLORS.primary },
  btnTextGhost:   { color: COLORS.textSub },
  btnTextDanger:  { color: COLORS.error },

  // ── Input ──────────────────────────────────────────────────
  inputWrapper:    { marginBottom: SPACING.md },
  inputLabel: {
    color:        COLORS.textSub,
    fontSize:     FONTS.sizes.sm,
    fontWeight:   FONTS.weight.medium,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   COLORS.surfaceAlt,
    borderRadius:      RADIUS.md,
    borderWidth:       1,
    borderColor:       COLORS.border,
    minHeight:         50,
    paddingHorizontal: SPACING.md,
  },
  inputFocused:    { borderColor: COLORS.primary, backgroundColor: COLORS.surface },
  inputError:      { borderColor: COLORS.error },
  inputField:      { flex: 1, color: COLORS.text, fontSize: FONTS.sizes.base, paddingVertical: SPACING.sm },
  inputIcon:       { paddingHorizontal: 4 },
  inputErrorText:  { color: COLORS.error, fontSize: FONTS.sizes.xs, marginTop: 4 },

  // ── Header ─────────────────────────────────────────────────
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   COLORS.bg,
    paddingHorizontal: SPACING.md,
    paddingBottom:     SPACING.sm,
    minHeight:         SIZES.header,
    position:          'relative',
  },
  headerSide:   { width: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle:  {
    flex:        1,
    textAlign:   'center',
    color:       COLORS.text,
    fontSize:    FONTS.sizes.lg,
    fontWeight:  FONTS.weight.bold,
    letterSpacing: -0.3,
  },
  backBtn: {
    width:           32,
    height:          32,
    borderRadius:    RADIUS.sm,
    borderWidth:     1,
    borderColor:     COLORS.border,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.surfaceAlt,
  },
  headerAccent: {
    position:        'absolute',
    bottom:          0,
    left:            SPACING.md,
    right:           SPACING.md,
    height:          1,
    backgroundColor: COLORS.border,
  },

  // ── Empty ──────────────────────────────────────────────────
  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxxl },
  emptyIconWrap: {
    width:           72,
    height:          72,
    borderRadius:    RADIUS.xl,
    backgroundColor: COLORS.primaryFaint,
    borderWidth:     1,
    borderColor:     COLORS.primary + '40',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    SPACING.lg,
  },
  emptyTitle: {
    color:       COLORS.text,
    fontSize:    FONTS.sizes.lg,
    fontWeight:  FONTS.weight.semibold,
    textAlign:   'center',
    marginBottom: SPACING.sm,
  },
  emptySub: {
    color:     COLORS.textSub,
    fontSize:  FONTS.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Loader ─────────────────────────────────────────────────
  loader:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxxl },
  loaderGlow: {
    position:        'absolute',
    width:           60,
    height:          60,
    borderRadius:    30,
    backgroundColor: COLORS.primaryGlow,
  },

  // ── Divider ────────────────────────────────────────────────
  divider:     { height: 0.5, backgroundColor: COLORS.border },
});
