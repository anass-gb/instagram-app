import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { userService } from '../../src/services/apiServices';
import { uploadToCloudinary } from '../../src/constants/api';
import useAuthStore from '../../src/store/authStore';
import Avatar from '../../src/components/common/Avatar';
import { Button, Input, Header } from '../../src/components/common/UI';
import { COLORS, SPACING } from '../../src/constants/theme';
import { TouchableOpacity } from 'react-native';

export default function EditProfileScreen() {
  const currentUser = useAuthStore(s => s.user);
  const updateUser  = useAuthStore(s => s.updateUser);

  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [bio,      setBio]      = useState(currentUser?.bio ?? '');
  const [avatar,   setAvatar]   = useState(currentUser?.profilePicture ?? null);
  const [loading,  setLoading]  = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let profilePicture = currentUser?.profilePicture;
      if (avatar && avatar !== currentUser?.profilePicture) {
        profilePicture = await uploadToCloudinary(avatar);
      }
      const { data } = await userService.updateProfile({ username, bio, profilePicture });
      updateUser(data);
      router.back();
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible de mettre à jour');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Modifier le profil" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar}>
          <Avatar uri={avatar} username={username} size={90} />
          <View style={styles.changePhotoBtn}>
            <View style={styles.changePhotoIcon}>
              <View style={{ width: 24, height: 24, backgroundColor: COLORS.primary, borderRadius: 99, alignItems: 'center', justifyContent: 'center' }}>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <Input label="Nom d'utilisateur" value={username} onChangeText={setUsername} placeholder="votre_pseudo" />
        <Input label="Bio" value={bio} onChangeText={setBio} placeholder="Parlez de vous..." multiline numberOfLines={3} />

        <Button title="Enregistrer" onPress={handleSave} loading={loading} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: COLORS.bg },
  scroll:         { padding: SPACING.xl },
  avatarWrap:     { alignItems: 'center', marginBottom: SPACING.xxl, position: 'relative' },
  changePhotoBtn: { position: 'absolute', bottom: 0, right: '32%' },
});
