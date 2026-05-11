import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import Avatar from '../common/Avatar';
import { likeService } from '../../services/apiServices';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const CommentItem = ({ comment, onReply, depth = 0 }) => {
  const [liked,       setLiked]       = useState(comment.liked || false);
  const [likes,       setLikes]       = useState(comment.likesCount || 0);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
    try { await likeService.toggleComment(comment.id); }
    catch { setLiked(p => !p); setLikes(p => liked ? p + 1 : p - 1); }
  };

  return (
    <View style={[styles.wrap, depth > 0 && styles.reply]}>
      <Avatar uri={comment.user?.profilePicture} username={comment.user?.username} size={depth > 0 ? 28 : 34} />
      <View style={styles.body}>
        <View>
          <Text style={styles.name}>{comment.user?.username} <Text style={styles.text}>{comment.text}</Text></Text>
          <View style={styles.meta}>
            <Text style={styles.time}>{dayjs(comment.createdAt).fromNow()}</Text>
            {likes > 0 && <Text style={styles.metaItem}>{likes} j'aime</Text>}
            <TouchableOpacity onPress={() => onReply?.(comment)}>
              <Text style={styles.replyBtn}>Répondre</Text>
            </TouchableOpacity>
          </View>

          {comment.replies?.length > 0 && (
            <TouchableOpacity onPress={() => setShowReplies(p => !p)} style={styles.showReplies}>
              <View style={styles.line} />
              <Text style={styles.showRepliesText}>
                {showReplies ? 'Masquer' : `Voir ${comment.replies.length} réponse${comment.replies.length > 1 ? 's' : ''}`}
              </Text>
            </TouchableOpacity>
          )}
          {showReplies && comment.replies?.map(r => (
            <CommentItem key={r.id} comment={r} onReply={onReply} depth={depth + 1} />
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={13} color={liked ? COLORS.like : COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap:          { flexDirection: 'row', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  reply:         { paddingLeft: 50, marginTop: SPACING.sm },
  body:          { flex: 1, marginLeft: SPACING.sm },
  name:          { color: COLORS.text, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, lineHeight: 19 },
  text:          { fontWeight: FONTS.weight.regular },
  meta:          { flexDirection: 'row', gap: SPACING.md, marginTop: 4 },
  time:          { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  metaItem:      { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.semibold },
  replyBtn:      { color: COLORS.textSub, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.semibold },
  likeBtn:       { padding: 4 },
  showReplies:   { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
  line:          { width: 24, height: 1, backgroundColor: COLORS.border, marginRight: SPACING.sm },
  showRepliesText:{ color: COLORS.textSub, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.semibold },
});

export default CommentItem;
