import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storyService, likeService } from '../../src/services/apiServices';
import { Loader } from '../../src/components/common/UI';
import Avatar from '../../src/components/common/Avatar';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { width: W, height: H } = Dimensions.get('window');
const DURATION = 5000; // 5 secondes par story

export default function StoryViewerScreen() {
  const { storyId }  = useLocalSearchParams();
  const insets       = useSafeAreaInsets();
  const [story, setStory]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked]   = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const anim     = useRef(null);

  useEffect(() => {
    // On charge les stories du feed pour trouver la bonne
    storyService.getFeed()
      .then(r => {
        const found = (r.data ?? []).find(s => String(s.id) === String(storyId));
        setStory(found ?? null);
        if (found) storyService.view(found.id).catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [storyId]);

  useEffect(() => {
    if (!story) return;
    progress.setValue(0);
    anim.current = Animated.timing(progress, {
      toValue: 1, duration: DURATION, useNativeDriver: false,
    });
    anim.current.start(({ finished }) => {
      if (finished) router.back();
    });
    return () => anim.current?.stop();
  }, [story]);

  const handleLike = async () => {
    setLiked(p => !p);
    try { await likeService.toggleStory(story.id); } catch { setLiked(p => !p); }
  };

  if (loading) return <Loader />;
  if (!story)  return null;

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <Image source={{ uri: story.mediaUrl }} style={styles.bg} resizeMode="cover" />

      {/* Progress bar */}
      <View style={[styles.progressWrap, { top: insets.top + 8 }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, {
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
          }]} />
        </View>
      </View>

      {/* Header */}
      <View style={[styles.header, { top: insets.top + 20 }]}>
        <View style={styles.userRow}>
          <Avatar uri={story.user?.profilePicture} username={story.user?.username} size={36} />
          <View style={{ marginLeft: SPACING.sm }}>
            <Text style={styles.username}>{story.user?.username}</Text>
            <Text style={styles.time}>{dayjs(story.createdAt).fromNow()}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Tap zones */}
      <TouchableOpacity style={styles.tapLeft}  onPress={() => router.back()} />
      <TouchableOpacity style={styles.tapRight} onPress={() => router.back()} />

      {/* Bottom actions */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? COLORS.like : COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewsBtn}>
          <Ionicons name="eye-outline" size={22} color={COLORS.white} />
          <Text style={styles.viewsTxt}>{story.viewsCount ?? 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.black },
  bg:           { position: 'absolute', width: W, height: H },
  progressWrap: { position: 'absolute', left: SPACING.md, right: SPACING.md, zIndex: 10 },
  progressTrack:{ height: 2, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 99 },
  progressFill: { height: 2, backgroundColor: COLORS.white, borderRadius: 99 },
  header:       { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  userRow:      { flexDirection: 'row', alignItems: 'center' },
  username:     { color: COLORS.white, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold },
  time:         { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  tapLeft:      { position: 'absolute', left: 0, top: 0, width: W * 0.35, height: H },
  tapRight:     { position: 'absolute', right: 0, top: 0, width: W * 0.65, height: H },
  bottom:       { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.xl },
  viewsBtn:     { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  viewsTxt:     { color: COLORS.white, fontSize: FONTS.sizes.sm },
});
