import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Avatar from '../common/Avatar';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const RING = SIZES.storyRing;

// ── Single story circle ────────────────────────────────────────────────────
export const StoryCircle = ({ story, isOwn, onPress }) => {
  const name   = isOwn ? 'Ma Story' : story?.user?.username;
  const uri    = isOwn ? story?.profilePicture : story?.user?.profilePicture;
  const viewed = story?.viewed;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      {isOwn ? (
        // Own story: "add" button style with plus badge
        <View style={styles.ownWrap}>
          <Avatar uri={uri} username={name} size={RING - 8} />
          <View style={styles.addBtn}>
            <Ionicons name="add" size={14} color={COLORS.bg} />
          </View>
        </View>
      ) : !viewed ? (
        // Unseen story: neon green ring
        <LinearGradient
          colors={COLORS.gradientStory}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ring}
        >
          <View style={styles.inner}>
            <Avatar uri={uri} username={name} size={RING - 10} />
          </View>
        </LinearGradient>
      ) : (
        // Seen story: dim ring
        <View style={[styles.ring, styles.ringViewed]}>
          <View style={styles.inner}>
            <Avatar uri={uri} username={name} size={RING - 10} />
          </View>
        </View>
      )}

      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
};

// ── Story bar (horizontal scroll) ─────────────────────────────────────────
export const StoryBar = ({ stories = [], currentUser, onOwnPress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.bar}
    contentContainerStyle={styles.barContent}
  >
    {/* Own story */}
    <StoryCircle
      isOwn
      story={currentUser}
      onPress={onOwnPress ?? (() => router.push('/story/create'))}
    />

    {/* Others */}
    {stories.map(s => (
      <StoryCircle
        key={s.id}
        story={s}
        onPress={() =>
          router.push({ pathname: '/story/viewer', params: { storyId: s.id } })
        }
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  bar:        { backgroundColor: COLORS.bg },
  barContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.md,
    gap:               SPACING.md,
  },
  item: {
    alignItems: 'center',
    width:      RING + 12,
    gap:        SPACING.xs,
  },
  // Own story
  ownWrap: {
    width:      RING,
    height:     RING,
    borderRadius: RING / 2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position:   'relative',
  },
  addBtn: {
    position:        'absolute',
    bottom:          -2,
    right:           -2,
    width:           20,
    height:          20,
    borderRadius:    10,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     COLORS.bg,
  },
  // Others
  ring: {
    width:          RING,
    height:         RING,
    borderRadius:   RING / 2,
    padding:        2.5,
    alignItems:     'center',
    justifyContent: 'center',
  },
  ringViewed: {
    backgroundColor: COLORS.transparent,
    borderWidth:     2,
    borderColor:     COLORS.storyViewed,
    padding:         2,
  },
  inner: {
    backgroundColor: COLORS.bg,
    borderRadius:    999,
    padding:         2,
    alignItems:      'center',
    justifyContent:  'center',
  },
  name: {
    color:     COLORS.textSub,
    fontSize:  FONTS.sizes.xs,
    textAlign: 'center',
    maxWidth:  RING + 12,
  },
});
