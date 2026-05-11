import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, Dimensions, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userService, postService } from '../../src/services/apiServices';
import useAuthStore from '../../src/store/authStore';
import Avatar from '../../src/components/common/Avatar';
import { Button, Loader, Divider, EmptyState } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const CELL = (width - 3) / 3;

export default function ProfileTab() {
  const insets      = useSafeAreaInsets();
  const currentUser = useAuthStore(s => s.user);
  const signout     = useAuthStore(s => s.signout);
  const updateUser  = useAuthStore(s => s.updateUser);

  const [profile,    setProfile]    = useState(null);
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [pRes, postsRes] = await Promise.all([
        userService.getMe(),
        postService.getUserPosts(currentUser?.id, 0),
      ]);
      setProfile(pRes.data);
      updateUser(pRes.data);
      setPosts(postsRes.data?.content ?? []);
    } catch {} finally { setLoading(false); }
  }, [currentUser?.id]);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleSignout = () =>
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: signout },
    ]);

  if (loading) return <Loader />;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{profile?.username}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/message/list')} style={styles.hBtn}>
            <Ionicons name="paper-plane-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignout} style={styles.hBtn}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={i => String(i.id)}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListHeaderComponent={() => (
          <View>
            {/* Top row */}
            <View style={styles.topRow}>
              <Avatar uri={profile?.profilePicture} username={profile?.username} size={86} />
              <View style={styles.statsRow}>
                {[
                  { label: 'Posts',       value: posts.length },
                  { label: 'Abonnés',     value: profile?.followersCount ?? 0 },
                  { label: 'Abonnements', value: profile?.followingCount  ?? 0 },
                ].map(s => (
                  <TouchableOpacity key={s.label} style={styles.stat}>
                    <Text style={styles.statNum}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bio */}
            <View style={styles.bio}>
              {profile?.bio
                ? <Text style={styles.bioText}>{profile.bio}</Text>
                : <Text style={styles.bioEmpty}>Ajoutez une bio...</Text>
              }
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <Button
                title="Modifier le profil"
                variant="outline"
                style={styles.btn}
                onPress={() => router.push('/profile/edit')}
              />
              <Button
                title="Posts sauvegardés"
                variant="outline"
                style={styles.btn}
                onPress={() => router.push('/profile/saved')}
              />
            </View>

            <Divider style={{ marginVertical: SPACING.sm }} />
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cell}
            onPress={() => router.push(`/post/${item.id}`)}
          >
            <Image source={{ uri: item.mediaUrl }} style={styles.cellImg} />
            {item.likesCount > 0 && (
              <View style={styles.overlay}>
                <Ionicons name="heart" size={13} color={COLORS.white} />
                <Text style={styles.overlayTxt}>{item.likesCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="camera-outline"
            title="Aucun post"
            subtitle="Partagez votre première photo"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  username:    { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weight.black },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  hBtn:        { marginLeft: SPACING.lg },
  topRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, gap: SPACING.xl },
  statsRow:    { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  stat:        { alignItems: 'center' },
  statNum:     { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  statLabel:   { color: COLORS.textSub, fontSize: FONTS.sizes.xs, marginTop: 2 },
  bio:         { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  bioText:     { color: COLORS.text, fontSize: FONTS.sizes.sm, lineHeight: 19 },
  bioEmpty:    { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, fontStyle: 'italic' },
  btnRow:      { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  btn:         { flex: 1, paddingVertical: 9, minHeight: 36 },
  cell:        { width: CELL, height: CELL, margin: 0.5, position: 'relative' },
  cellImg:     { width: '100%', height: '100%', backgroundColor: COLORS.surfaceAlt },
  overlay:     { position: 'absolute', bottom: 4, left: 4, flexDirection: 'row', alignItems: 'center', gap: 3 },
  overlayTxt:  { color: COLORS.white, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.bold },
});
