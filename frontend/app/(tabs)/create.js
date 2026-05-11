import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { postService } from '../../src/services/apiServices';
import { uploadToCloudinary } from '../../src/constants/api';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const [image,     setImage]     = useState(null);
  const [caption,   setCaption]   = useState('');
  const [uploading, setUploading] = useState(false);
  const [step,      setStep]      = useState('idle'); // idle | uploading | posting

  const pick = async (source) => {
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission caméra refusée');
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1,1], quality: 0.85 });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission galerie refusée');
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.85 });
    }
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handlePost = async () => {
    if (!image) return Alert.alert('Sélectionnez une image');
    try {
      setStep('uploading');
      // Upload vers Cloudinary (API gratuite)
      const mediaUrl = await uploadToCloudinary(image);
      setStep('posting');
      await postService.create({ mediaUrl, caption });
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Impossible de publier');
      setStep('idle');
    }
  };

  const isLoading = step !== 'idle';

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <Ionicons name="close" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau post</Text>
        <TouchableOpacity onPress={handlePost} disabled={!image || isLoading}>
          {isLoading
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Text style={[styles.share, !image && styles.shareOff]}>Partager</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image picker */}
        {image ? (
          <View>
            <Image source={{ uri: image }} style={styles.preview} />
            <TouchableOpacity style={styles.changeBtn} onPress={() => setImage(null)}>
              <Ionicons name="refresh" size={18} color={COLORS.white} />
              <Text style={styles.changeTxt}>Changer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pickerWrap}>
            <Ionicons name="image-outline" size={56} color={COLORS.textMuted} />
            <Text style={styles.pickerHint}>Choisissez une photo</Text>
            <View style={styles.pickerBtns}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => pick('gallery')}>
                <Ionicons name="images-outline" size={22} color={COLORS.primary} />
                <Text style={styles.pickerBtnTxt}>Galerie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => pick('camera')}>
                <Ionicons name="camera-outline" size={22} color={COLORS.primary} />
                <Text style={styles.pickerBtnTxt}>Caméra</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Caption */}
        <View style={styles.captionWrap}>
          <TextInput
            style={styles.captionInput}
            placeholder="Écrivez une légende..."
            placeholderTextColor={COLORS.textMuted}
            value={caption} onChangeText={setCaption}
            multiline maxLength={2200}
          />
          <Text style={styles.charCount}>{caption.length}/2200</Text>
        </View>

        {/* Status upload */}
        {isLoading && (
          <View style={styles.uploadStatus}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.uploadTxt}>
              {step === 'uploading' ? 'Upload de l\'image...' : 'Publication en cours...'}
            </Text>
          </View>
        )}

        {/* Extra options */}
        {[
          { icon: 'location-outline',  label: 'Ajouter un lieu'  },
          { icon: 'people-outline',    label: 'Identifier'        },
        ].map(o => (
          <TouchableOpacity key={o.label} style={styles.opt}>
            <Ionicons name={o.icon} size={22} color={COLORS.textSub} />
            <Text style={styles.optTxt}>{o.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title:       { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  share:       { color: COLORS.primary, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  shareOff:    { opacity: 0.35 },
  preview:     { width: '100%', aspectRatio: 1, backgroundColor: COLORS.surfaceAlt },
  changeBtn: {
    position: 'absolute', top: SPACING.md, right: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
  },
  changeTxt:   { color: COLORS.white, fontSize: FONTS.sizes.sm },
  pickerWrap: {
    aspectRatio: 1, backgroundColor: COLORS.surfaceAlt, margin: SPACING.md,
    borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', gap: SPACING.md,
  },
  pickerHint:  { color: COLORS.textSub, fontSize: FONTS.sizes.base },
  pickerBtns:  { flexDirection: 'row', gap: SPACING.xl },
  pickerBtn:   { alignItems: 'center', gap: SPACING.xs },
  pickerBtnTxt:{ color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.semibold },
  captionWrap: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, paddingTop: SPACING.md },
  captionInput:{ color: COLORS.text, fontSize: FONTS.sizes.base, lineHeight: 22, minHeight: 80 },
  charCount:   { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, textAlign: 'right', marginTop: SPACING.xs },
  uploadStatus:{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  uploadTxt:   { color: COLORS.textSub, fontSize: FONTS.sizes.sm },
  opt: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderTopWidth: 0.5, borderTopColor: COLORS.border,
  },
  optTxt:      { flex: 1, color: COLORS.text, fontSize: FONTS.sizes.base },
});
