import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Dimensions, Alert, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import Avatar from '../common/Avatar';
import { likeService, savedService, postService } from '../../services/apiServices';
import useAuthStore from '../../store/authStore';
import { formatCount } from '../../utils/helpers';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const W = Dimensions.get('window').width;

const PostCard = ({ post, onDelete }) => {
  const currentUser     = useAuthStore(s => s.user);
  const [liked,  setLiked]  = useState(post.liked  || false);
  const [saved,  setSaved]  = useState(post.saved  || false);
  const [likes,  setLikes]  = useState(post.likesCount || 0);
  const isOwner = currentUser?.id === post.user?.id;

  // Heart animation on double-tap
  const heartScale = useRef(new Animated.Value(0)).current;
  const lastTap    = useRef(null);

  const showHeart = () => {
    heartScale.setValue(0);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.3, useNativeDriver: true, speed: 30 }),
      Animated.timing(heartScale, { toValue: 0, duration: 400, delay: 500, useNativeDriver: true }),
    ]).start();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      if (!liked) { handleLike(); showHeart(); }
    }
    lastTap.current = now;
  };

  const handleLike = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
    try { await likeService.togglePost(post.id); }
    catch { setLiked(p => !p); setLikes(p => liked ? p + 1 : p - 1); }
  }, [liked, post.id]);

  const handleSave = async () => {
    setSaved(p => !p);
    try { await savedService.toggle(post.id); }
    catch { setSaved(p => !p); }
  };

  const handleDelete = () =>
    Alert.alert('Supprimer ce post ?', '', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          try { await postService.delete(post.id); onDelete?.(post.id); } catch {}
        },
      },
    ]);

  return (
    <View style={styles.card}>
      {/* ─── Header ────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => router.push(`/profile/${post.user?.id}`)}
          activeOpacity={0.75}
        >
          <Avatar
            uri={post.user?.profilePicture}
            username={post.user?.username}
            size={36}
          />
          <View style={{ marginLeft: SPACING.sm }}>
            <Text style={styles.username}>
              <Text style={styles.atSign}>@</Text>
              {post.user?.username}
            </Text>
            <Text style={styles.time}>{dayjs(post.createdAt).fromNow()}</Text>
          </View>
        </TouchableOpacity>

        {isOwner ? (
          <TouchableOpacity style={styles.optBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.optBtn}>
            <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textSub} />
          </TouchableOpacity>
        )}
      </View>

      {/* ─── Image ─────────────────────────────────────── */}
      <TouchableOpacity onPress={handleDoubleTap} activeOpacity={1} style={styles.imgWrap}>
        <Image source={{ uri: post.mediaUrl }} style={styles.image} resizeMode="cover" />

        {/* Double-tap heart */}
        <Animated.View
          style={[styles.heartOverlay, { transform: [{ scale: heartScale }] }]}
          pointerEvents="none"
        >
          <Ionicons name="heart" size={90} color={COLORS.like} />
        </Animated.View>

        {/* Bottom gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(5,15,9,0.6)']}
          style={styles.imgGradient}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {/* ─── Actions ───────────────────────────────────── */}
      <View style={styles.actions}>
        {/* Like */}
        <TouchableOpacity
          style={[styles.actionBtn, liked && styles.actionBtnActive]}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? COLORS.like : COLORS.textSub}
          />
          {likes > 0 && (
            <Text style={[styles.actionCount, liked && { color: COLORS.like }]}>
              {formatCount(likes)}
            </Text>
          )}
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/post/${post.id}?tab=comments`)}
        >
          <Ionicons name="chatbubble-outline" size={19} color={COLORS.textSub} />
          {(post.commentsCount || 0) > 0 && (
            <Text style={styles.actionCount}>{formatCount(post.commentsCount)}</Text>
          )}
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="paper-plane-outline" size={19} color={COLORS.textSub} />
        </TouchableOpacity>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Save */}
        <TouchableOpacity
          style={[styles.actionBtn, saved && styles.actionBtnActive]}
          onPress={handleSave}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? COLORS.primary : COLORS.textSub}
          />
        </TouchableOpacity>
      </View>

      {/* ─── Caption ───────────────────────────────────── */}
      {post.caption ? (
        <View style={styles.captionWrap}>
          <Text style={styles.caption} numberOfLines={2}>
            <Text style={styles.captionUser}>@{post.user?.username} </Text>
            {post.caption}
          </Text>
        </View>
      ) : null}

      {/* ─── Separator ─────────────────────────────────── */}
      <View style={styles.sep} />
    </View>
  );
};

const styles = StyleSheet.create({
  card:         { backgroundColor: COLORS.bg, marginBottom: 2 },

  // Header
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
  },
  userRow:      { flexDirection: 'row', alignItems: 'center', flex: 1 },
  atSign:       { color: COLORS.primary, fontWeight: FONTS.weight.bold },
  username:     { color: COLORS.text, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold },
  time:         { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 1 },
  optBtn: {
    width:           32,
    height:          32,
    borderRadius:    RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     COLORS.border,
  },

  // Image
  imgWrap:      { position: 'relative' },
  image:        { width: W, height: W * 0.88, backgroundColor: COLORS.surfaceAlt },
  imgGradient:  { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  heartOverlay: {
    position:  'absolute',
    top: '50%', left: '50%',
    marginTop: -45, marginLeft: -45,
  },

  // Actions
  actions: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    gap:               SPACING.xs,
  },
  actionBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            5,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius:   RADIUS.sm,
  },
  actionBtnActive: { backgroundColor: COLORS.primaryFaint },
  actionCount: {
    color:      COLORS.textSub,
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weight.semibold,
  },

  // Caption
  captionWrap:  { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  captionUser:  { color: COLORS.primary, fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.sm },
  caption:      { color: COLORS.text, fontSize: FONTS.sizes.sm, lineHeight: 19 },

  // Sep
  sep: { height: 0.5, backgroundColor: COLORS.border, marginTop: SPACING.xs },
});

export default PostCard;
