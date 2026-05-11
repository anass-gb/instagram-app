import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDiceBearAvatar } from '../../constants/api';
import { COLORS, SIZES } from '../../constants/theme';

const Avatar = ({
  uri,
  username = '?',
  size = SIZES.avatarMd,
  showOnline = false,
  showStoryRing = false,   // green gradient ring = has active story
  storyViewed = false,     // grey ring = story viewed
  style,
}) => {
  const r       = size / 2;
  const fallback = getDiceBearAvatar(username);
  const ringSize = size + 6;

  const img = (
    <Image
      source={{ uri: uri || fallback }}
      style={{ width: size, height: size, borderRadius: r, backgroundColor: COLORS.surfaceAlt }}
      defaultSource={{ uri: fallback }}
    />
  );

  return (
    <View style={[{ width: ringSize, height: ringSize, alignItems: 'center', justifyContent: 'center' }, style]}>
      {showStoryRing && !storyViewed ? (
        <LinearGradient
          colors={COLORS.gradientStory}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.ring, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}
        >
          <View style={[styles.inner, { width: size + 2, height: size + 2, borderRadius: r + 1 }]}>
            {img}
          </View>
        </LinearGradient>
      ) : showStoryRing && storyViewed ? (
        <View style={[styles.ringViewed, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}>
          <View style={[styles.inner, { width: size + 2, height: size + 2, borderRadius: r + 1 }]}>
            {img}
          </View>
        </View>
      ) : (
        <View style={{ width: size, height: size }}>
          {img}
        </View>
      )}

      {showOnline && (
        <View style={[styles.dot, { right: 0, bottom: 0 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    alignItems:     'center',
    justifyContent: 'center',
    padding:        2.5,
  },
  ringViewed: {
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2.5,
    borderColor:     COLORS.storyViewed,
    backgroundColor: COLORS.transparent,
  },
  inner: {
    backgroundColor: COLORS.bg,
    padding:         2,
    borderRadius:    999,
    alignItems:      'center',
    justifyContent:  'center',
  },
  dot: {
    position:        'absolute',
    width:           12,
    height:          12,
    borderRadius:    6,
    backgroundColor: COLORS.online,
    borderWidth:     2,
    borderColor:     COLORS.bg,
  },
});

export default Avatar;
