import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, Dimensions, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userService, postService, followService, blockService } from '../../src/services/apiServices';
import useAuthStore from '../../src/store/authStore';
import Avatar from '../../src/components/common/Avatar';
import { Button, Loader, Divider, EmptyState, Header } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const CELL = (width - 3) / 3;

export default function UserProfileScreen() {
  const { userId }  = useLocalSearchParams();
  const insets      = useSafeAreaInsets();
  const currentUser = useAuthStore(s => s.user);
  const isOwn       = Number(userId) === currentUser?.id;

  const [profile,    setProfile]    = useState(null);
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following,  setFollowing]  = useState(false);
  const [blocked,    setBlocked]    = useState(false);

  const load = useCallback(async () => {
    try {
      const [pRes, postsRes] = await Promise.all([
        userService.getProfile(userId),
        postService.getUserPosts(userId, 0),
      ]);
      setProfile(pRes.data);
      setPosts(postsRes.data?.content ?? []);
      setFollowing(pRes.data.following);
      setBlocked(pRes.data.blocked);
    } catch {} finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { load(); }, [userId]);

  const handleFollow = async () => {
    setFollowing(p => !p);
    setProfile(p => ({ ...p, followersCount: following ? p.followersCount - 1 : p.followersCount + 1 }));
    try { await followService.toggle(userId); }
    catch { setFollowing(p => !p); }
  };

  const handleBlock = () =>
    Alert.alert(
      blocked ? 'Débloquer' : 'Bloquer',
      `${blocked ? 'Débloquer' : 'Bloquer'} @${profile?.username} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: blocked ? 'Débloquer' : 'Bloquer', style: blocked ? 'default' : 'destructive',
          onPress: async () => { setBlocked(p => !p); await blockService.toggle(userId); }
        },
      ]
    );

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <Loader />;

  return (
    <View style={styles.screen}>
      <Header title={profile?.username ?? ''} onBack={() => router.back()} />

      <FlatList
        data={posts}
        keyExtractor={i => String(i.id)}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.topRow}>
              <Avatar uri={profile?.profilePicture} username={profile?.username} size={86} />
              <View style={styles.statsRow}>
                {[
                  { label: 'Posts',       value: posts.length },
                  { label: 'Abonnés',     value: profile?.followersCount ?? 0 },
                  { label: 'Abonnements', value: profile?.followingCount  ?? 0 },
                ].map(s => (
                  <View key={s.label} style={styles.stat}>
                    <Text style={styles.statNum}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.bio}>
              <Text style={styles.username}>{profile?.username}</Text>
              {profile?.bio && <Text style={styles.bioText}>{profile.bio}</Text>}
            </View>

            {!isOwn && (
              <View style={styles.btnRow}>
                <Button
                  title={following ? 'Abonné ✓' : 'Suivre'}
                  variant={following ? 'outline' : 'primary'}
                  style={styles.btn}
                  onPress={handleFollow}
                />
                <Button
                  title="Message"
                  variant="outline"
                  style={styles.btn}
                  onPress={() => router.push({ pathname: `/message/${userId}`, params: { username: profile?.username, profilePicture: profile?.profilePicture } })}
                />
                <TouchableOpacity onPress={handleBlock} style={styles.blockBtn}>
                  <Ionicons
                    name={blocked ? 'shield-checkmark' : 'shield-outline'}
                    size={22}
                    color={blocked ? COLORS.error : COLORS.textSub}
                  />
                </TouchableOpacity>
              </View>
            )}

            <Divider style={{ marginVertical: SPACING.sm }} />
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cell} onPress={() => router.push(`/post/${item.id}`)}>
            <Image source={{ uri: item.mediaUrl }} style={styles.cellImg} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon="camera-outline" title="Aucun post" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.bg },
  topRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, gap: SPACING.xl },
  statsRow:  { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  stat:      { alignItems: 'center' },
  statNum:   { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  statLabel: { color: COLORS.textSub, fontSize: FONTS.sizes.xs, marginTop: 2 },
  bio:       { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  username:  { color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold },
  bioText:   { color: COLORS.textSub, fontSize: FONTS.sizes.sm, marginTop: 4, lineHeight: 18 },
  btnRow:    { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, alignItems: 'center' },
  btn:       { flex: 1, paddingVertical: 9, minHeight: 36 },
  blockBtn:  { width: 38, height: 38, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  cell:      { width: CELL, height: CELL, margin: 0.5 },
  cellImg:   { width: '100%', height: '100%', backgroundColor: COLORS.surfaceAlt },
});
