import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../src/store/authStore';
import { Button, Input } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

const schema = yup.object({
  username: yup.string().min(3, 'Minimum 3 caractères').required('Obligatoire'),
  email:    yup.string().email('Email invalide').required('Obligatoire'),
  password: yup.string().min(6, 'Minimum 6 caractères').required('Obligatoire'),
});

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { signup, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const res = await signup(data);
    if (res.success) router.replace('/(tabs)');
    else Alert.alert('Inscription échouée', res.message);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.sub}>C'est rapide et gratuit</Text>
        </View>

        <Controller control={control} name="username"
          render={({ field: { onChange, value } }) => (
            <Input label="Nom d'utilisateur" placeholder="votre_pseudo"
              value={value} onChangeText={onChange} error={errors.username?.message}
              leftIcon={<Ionicons name="person-outline" size={18} color={COLORS.textMuted} />} />
          )}
        />
        <Controller control={control} name="email"
          render={({ field: { onChange, value } }) => (
            <Input label="Email" placeholder="votre@email.com"
              value={value} onChangeText={onChange} keyboardType="email-address"
              error={errors.email?.message}
              leftIcon={<Ionicons name="mail-outline" size={18} color={COLORS.textMuted} />} />
          )}
        />
        <Controller control={control} name="password"
          render={({ field: { onChange, value } }) => (
            <Input label="Mot de passe" placeholder="••••••••"
              value={value} onChangeText={onChange} secureTextEntry
              error={errors.password?.message}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />} />
          )}
        />

        <Button title="Créer mon compte" onPress={handleSubmit(onSubmit)} loading={isLoading} style={{ marginTop: SPACING.md }} />

        <TouchableOpacity style={styles.loginRow} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <Text style={styles.loginLink}>Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  scroll:   { flexGrow: 1, paddingHorizontal: SPACING.xl },
  back:     { marginBottom: SPACING.xl },
  titleWrap:{ marginBottom: SPACING.xxl },
  title:    { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weight.black },
  sub:      { color: COLORS.textSub, fontSize: FONTS.sizes.base, marginTop: 4 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  loginText:{ color: COLORS.textSub, fontSize: FONTS.sizes.base },
  loginLink:{ color: COLORS.primary, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold },
});
