import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../src/store/authStore';
import { Button, Input } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const schema = yup.object({
  email:    yup.string().email('Email invalide').required('Email obligatoire'),
  password: yup.string().min(6, 'Minimum 6 caractères').required('Mot de passe obligatoire'),
});

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signin, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await signin(data);
    if (res.success) router.replace('/(tabs)');
    else Alert.alert('Connexion échouée', res.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo zone */}
        <View style={styles.logoZone}>
          <LinearGradient
            colors={[COLORS.primaryGlow, 'transparent']}
            style={styles.logoGlow}
          />
          <View style={styles.logoBox}>
            <Ionicons name="leaf" size={36} color={COLORS.bg} />
          </View>
          <Text style={styles.appName}>VERD</Text>
          <Text style={styles.tagline}>{'// connect · share · grow'}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.sectionLabel}>{'> CONNEXION'}</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                error={errors.email?.message}
                leftIcon={<Ionicons name="at" size={17} color={COLORS.primary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
                leftIcon={<Ionicons name="lock-closed" size={17} color={COLORS.primary} />}
              />
            )}
          />

          <Button
            title="SE CONNECTER"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={{ marginTop: SPACING.sm }}
          />
        </View>

        {/* Divider */}
        <View style={styles.divRow}>
          <View style={styles.divLine} />
          <Text style={styles.divText}>ou</Text>
          <View style={styles.divLine} />
        </View>

        {/* Register */}
        <TouchableOpacity
          style={styles.regWrap}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.regText}>Pas encore de compte ? </Text>
          <Text style={styles.regLink}>Créer un compte →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  // Background circles (bioluminescence effect)
  bgCircle1: {
    position:        'absolute',
    top:             -80,
    right:           -80,
    width:           260,
    height:          260,
    borderRadius:    130,
    backgroundColor: COLORS.primaryFaint,
  },
  bgCircle2: {
    position:        'absolute',
    bottom:          100,
    left:            -100,
    width:           200,
    height:          200,
    borderRadius:    100,
    backgroundColor: COLORS.primaryFaint,
  },

  scroll: { flexGrow: 1, paddingHorizontal: SPACING.xl },

  // Logo
  logoZone:  { alignItems: 'center', marginBottom: SPACING.xxxl + 8, position: 'relative' },
  logoGlow: {
    position:     'absolute',
    top:          -20,
    width:        180,
    height:       180,
    borderRadius: 90,
  },
  logoBox: {
    width:           76,
    height:          76,
    borderRadius:    RADIUS.xl,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    SPACING.lg,
    shadowColor:     COLORS.primary,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.6,
    shadowRadius:    20,
    elevation:       10,
  },
  appName: {
    color:         COLORS.text,
    fontSize:      FONTS.sizes.huge,
    fontWeight:    FONTS.weight.black,
    letterSpacing: 8,
  },
  tagline: {
    color:         COLORS.primary,
    fontSize:      FONTS.sizes.xs,
    letterSpacing: 1.5,
    marginTop:     6,
    fontFamily:    'monospace',
  },

  // Form
  form:         { marginBottom: SPACING.xl },
  sectionLabel: {
    color:         COLORS.primary,
    fontSize:      FONTS.sizes.xs,
    fontWeight:    FONTS.weight.bold,
    letterSpacing: 2,
    marginBottom:  SPACING.lg,
    fontFamily:    'monospace',
  },

  // Divider
  divRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
  divLine: { flex: 1, height: 0.5, backgroundColor: COLORS.border },
  divText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginHorizontal: SPACING.md },

  // Register
  regWrap: { flexDirection: 'row', justifyContent: 'center' },
  regText: { color: COLORS.textSub, fontSize: FONTS.sizes.base },
  regLink: { color: COLORS.primary, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold },
});
