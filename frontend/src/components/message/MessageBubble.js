import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

const MessageBubble = ({ message, isMe, onLongPress }) => (
  <View style={[styles.wrap, isMe && styles.wrapMe]}>
    <TouchableOpacity
      style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
      onLongPress={() => onLongPress?.(message)}
      activeOpacity={0.85}
    >
      {message.sharedPost && (
        <View style={styles.shared}>
          <Image source={{ uri: message.sharedPost.mediaUrl }} style={styles.sharedImg} />
          <Text style={styles.sharedCaption} numberOfLines={1}>
            {message.sharedPost.caption || 'Post partagé'}
          </Text>
        </View>
      )}

      <Text style={[styles.text, isMe && styles.textMe]}>{message.content}</Text>

      <View style={styles.meta}>
        <Text style={[styles.time, isMe && styles.timeMe]}>
          {dayjs(message.createdAt).format('HH:mm')}
        </Text>
        {isMe && (
          <Ionicons
            name={message.isRead ? 'checkmark-done' : 'checkmark'}
            size={12}
            color={message.isRead ? COLORS.white : 'rgba(255,255,255,0.5)'}
            style={{ marginLeft: 3 }}
          />
        )}
      </View>
    </TouchableOpacity>

    {message.likesCount > 0 && (
      <View style={[styles.likePill, isMe && styles.likePillMe]}>
        <Ionicons name="heart" size={9} color={COLORS.like} />
        {message.likesCount > 1 && <Text style={styles.likeCount}>{message.likesCount}</Text>}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrap:        { paddingHorizontal: SPACING.md, marginBottom: SPACING.sm, alignItems: 'flex-start' },
  wrapMe:      { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '75%', borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  bubbleMe:    { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleThem:  { backgroundColor: COLORS.surfaceAlt, borderBottomLeftRadius: 4 },
  text:        { color: COLORS.text, fontSize: FONTS.sizes.base, lineHeight: 20 },
  textMe:      { color: COLORS.white },
  meta:        { flexDirection: 'row', alignItems: 'center', marginTop: 3, justifyContent: 'flex-end' },
  time:        { color: COLORS.textSub, fontSize: FONTS.sizes.xs },
  timeMe:      { color: 'rgba(255,255,255,0.65)' },
  shared:      { marginBottom: SPACING.sm, borderRadius: RADIUS.sm, overflow: 'hidden' },
  sharedImg:   { width: 180, height: 180, resizeMode: 'cover' },
  sharedCaption:{ color: COLORS.textSub, fontSize: FONTS.sizes.xs, padding: SPACING.sm },
  likePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 999,
    paddingHorizontal: 5, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS.border,
    marginTop: -6, marginLeft: SPACING.sm,
  },
  likePillMe:  { marginLeft: 0, marginRight: SPACING.sm },
  likeCount:   { color: COLORS.textMuted, fontSize: 9, marginLeft: 2 },
});

export default MessageBubble;
