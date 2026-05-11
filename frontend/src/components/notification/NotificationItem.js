import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import Avatar from '../common/Avatar';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const TYPE_META = {
  LIKE_POST:    { icon: 'heart',               color: '#FF3B5C', bg: '#FF3B5C22' },
  LIKE_COMMENT: { icon: 'heart',               color: '#FF3B5C', bg: '#FF3B5C22' },
  LIKE_MESSAGE: { icon: 'heart',               color: '#FF3B5C', bg: '#FF3B5C22' },
  LIKE_STORY:   { icon: 'heart',               color: '#FF3B5C', bg: '#FF3B5C22' },
  COMMENT:      { icon: 'chatbubble',          color: COLORS.primary, bg: COLORS.primaryFaint },
  COMMENT_REPLY:{ icon: 'chatbubble-ellipses', color: COLORS.primary, bg: COLORS.primaryFaint },
  FOLLOW:       { icon: 'person-add',          color: '#00B4FF', bg: '#00B4FF22' },
  STORY_VIEW:   { icon: 'eye',                 color: '#9B59B6', bg: '#9B59B622' },
  MESSAGE:      { icon: 'paper-plane',         color: COLORS.primary, bg: COLORS.primaryFaint },
  SHARED_POST:  { icon: 'share-social',        color: '#00B4FF', bg: '#00B4FF22' },
};

const NotificationItem = ({ item, onPress }) => {
  const meta = TYPE_META[item.type] ?? { icon: 'notifications', color: COLORS.primary, bg: COLORS.primaryFaint };

  const handlePress = () => {
    if (onPress) { onPress(item); return; }
    if (item.actor) router.push(`/profile/${item.actor.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.wrap, !item.isRead && styles.unreadBg]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Avatar + icon badge */}
      <View style={styles.avatarWrap}>
        <Avatar
          uri={item.actor?.profilePicture}
          username={item.actor?.username}
          size={46}
        />
        <View style={[styles.badge, { backgroundColor: meta.color }]}>
          <Ionicons name={meta.icon} size={9} color={COLORS.white} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.msg} numberOfLines={2}>
          <Text style={styles.actor}>{item.actor?.username} </Text>
          {item.message?.replace(`${item.actor?.username} `, '') ?? ''}
        </Text>
        <Text style={styles.time}>{dayjs(item.createdAt).fromNow()}</Text>
      </View>

      {/* Unread dot */}
      {!item.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: SPACING.md,
    paddingVertical:  SPACING.md,
    gap:              SPACING.md,
  },
  unreadBg:  { backgroundColor: COLORS.primaryFaint },
  avatarWrap:{ position: 'relative' },
  badge: {
    position:        'absolute',
    bottom:          -2,
    right:           -2,
    width:           18,
    height:          18,
    borderRadius:    99,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1.5,
    borderColor:     COLORS.bg,
  },
  content:   { flex: 1 },
  msg:       { color: COLORS.text, fontSize: FONTS.sizes.sm, lineHeight: 18 },
  actor:     { fontWeight: FONTS.weight.bold },
  time:      { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 3 },
  dot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
});

export default NotificationItem;
