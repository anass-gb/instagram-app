import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useFeed from '../../src/hooks/useFeed';
import useAuthStore from '../../src/store/authStore';
import useNotifStore from '../../src/store/notifStore';
import PostCard from '../../src/components/post/PostCard';
import { StoryBar } from '../../src/components/story/StoryBar';
import { Loader, EmptyState, Divider } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

export default function HomeScreen() {
  const insets      = useSafeAreaInsets();
  const currentUser = useAuthStore(s => s.user);
  const unreadCount = useNotifStore(s => s.unreadCount);
  const fetchUnread = useNotifStore(s => s.fetchUnread);

  const { posts, stories, loading, refreshing, refresh, loadMore, removePost } = useFeed();

  useEffect(() => { fetchUnread(); }, []);

  if (loading) return <Loader />;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <View style={styles.logoDot} />
          <Text style={styles.logo}>VERD</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.hBtn}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={23} color={COLORS.text} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeTxt}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hBtn}
            onPress={() => router.push('/message/list')}
          >
            <Ionicons name="paper-plane-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Feed ─── */}
      <FlashList
        data={posts}
        keyExtractor={item => String(item.id)}
        estimatedItemSize={520}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onDelete={(id) => removePost(id)}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <StoryBar
              stories={stories}
              currentUser={currentUser}
              onOwnPress={() => router.push('/story/create')}
            />
            <Divider />
          </>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="leaf-outline"
            title="Votre feed est vide"
            subtitle="Suivez des personnes pour voir leurs publications"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor:   COLORS.bg,
  },

  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  logoDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: COLORS.primary,
    shadowColor:     COLORS.primary,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    6,
    elevation:       4,
  },
  logo: {
    color:         COLORS.text,
    fontSize:      FONTS.sizes.xl,
    fontWeight:    FONTS.weight.black,
    letterSpacing: 4,
  },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  hBtn: {
    width:           40,
    height:          40,
    borderRadius:    RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     COLORS.border,
    position:        'relative',
  },
  badge: {
    position:          'absolute',
    top:               6,
    right:             6,
    backgroundColor:   COLORS.like,
    borderRadius:      99,
    minWidth:          14,
    height:            14,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 2,
    borderWidth:       1.5,
    borderColor:       COLORS.bg,
  },
  badgeTxt: { color: COLORS.white, fontSize: 8, fontWeight: FONTS.weight.bold },
});
