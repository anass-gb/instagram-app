import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storyService } from '../../src/services/apiServices';
import { uploadToCloudinary } from '../../src/constants/api';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

export default function CreateStoryScreen() {
  const insets = useSafeAreaInsets();
  const [image,   setImage]   = useState(null);
  const [loading, setLoading] = useState(false);

  const pick = async (src) => {
    let result;
    if (src === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
    }
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handlePublish = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const mediaUrl = await uploadToCloudinary(image);
      await storyService.create(mediaUrl);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de publier la story');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle story</Text>
        {image && (
          <TouchableOpacity onPress={handlePublish} disabled={loading}>
            {loading
              ? <ActivityIndicator color={COLORS.primary} />
              : <Text style={styles.publish}>Publier</Text>
            }
          </TouchableOpacity>
        )}
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.picker}>
          <Text style={styles.hint}>Choisissez une photo ou vidéo</Text>
          <View style={styles.btns}>
            <TouchableOpacity style={styles.btn} onPress={() => pick('gallery')}>
              <Ionicons name="images" size={32} color={COLORS.primary} />
              <Text style={styles.btnTxt}>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => pick('camera')}>
              <Ionicons name="camera" size={32} color={COLORS.primary} />
              <Text style={styles.btnTxt}>Caméra</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.black },
  header:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  title:    { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  publish:  { color: COLORS.primary, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  preview:  { flex: 1 },
  picker:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.xxl },
  hint:     { color: COLORS.textSub, fontSize: FONTS.sizes.base },
  btns:     { flexDirection: 'row', gap: SPACING.xxxl },
  btn:      { alignItems: 'center', gap: SPACING.sm },
  btnTxt:   { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.semibold },
});
