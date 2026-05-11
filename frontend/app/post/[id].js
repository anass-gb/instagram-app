import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { postService, commentService, likeService, savedService } from '../../src/services/apiServices';
import useAuthStore from '../../src/store/authStore';
import Avatar from '../../src/components/common/Avatar';
import CommentItem from '../../src/components/comment/CommentItem';
import { Loader, EmptyState } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const W = Dimensions.get('window').width;

export default function PostDetailScreen() {
  const { id }      = useLocalSearchParams();
  const insets      = useSafeAreaInsets();
  const currentUser = useAuthStore(s => s.user);

  const [post,     setPost]     = useState(null);
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [liked,    setLiked]    = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [likes,    setLikes]    = useState(0);
  const [text,     setText]     = useState('');
  const [replyTo,  setReplyTo]  = useState(null);
  const [sending,  setSending]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          postService.getOne(id),
          commentService.getAll(id),
        ]);
        setPost(pRes.data);
        setLiked(pRes.data.liked ?? false);
        setSaved(pRes.data.saved ?? false);
        setLikes(pRes.data.likesCount ?? 0);
        setComments(cRes.data ?? []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleLike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
    try { await likeService.togglePost(id); }
    catch { setLiked(p => !p); setLikes(p => liked ? p + 1 : p - 1); }
  };

  const handleSave = async () => {
    setSaved(p => !p);
    try { await savedService.toggle(id); }
    catch { setSaved(p => !p); }
  };

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const { data } = await commentService.add(id, {
        text: text.trim(),
        parentCommentId: replyTo?.id ?? null,
      });
      if (replyTo) {
        setComments(prev => prev.map(c =>
          c.id === replyTo.id ? { ...c, replies: [...(c.replies ?? []), data] } : c
        ));
      } else {
        setComments(prev => [data, ...prev]);
      }
      setText('');
      setReplyTo(null);
    } catch {} finally { setSending(false); }
  };

  if (loading) return <Loader />;
  if (!post) return null;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={comments}
        keyExtractor={i => String(i.id)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* Post header */}
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => router.push(`/profile/${post.user?.id}`)}
            >
              <Avatar uri={post.user?.profilePicture} username={post.user?.username} size={36} />
              <Text style={styles.username}>{post.user?.username}</Text>
            </TouchableOpacity>

            {/* Image */}
            <Image source={{ uri: post.mediaUrl }} style={styles.image} resizeMode="cover" />

            {/* Actions */}
            <View style={styles.actions}>
              <View style={styles.actLeft}>
                <TouchableOpacity onPress={handleLike} style={styles.actBtn}>
                  <Ionicons name={liked ? 'heart' : 'heart-outline'} size={26} color={liked ? COLORS.like : COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actBtn}>
                  <Ionicons name="chatbubble-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actBtn}>
                  <Ionicons name="paper-plane-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSave}>
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color={saved ? COLORS.primary : COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.info}>
              {likes > 0 && <Text style={styles.likes}>{likes} j'aime{likes > 1 ? 's' : ''}</Text>}
              {post.caption && (
                <Text style={styles.caption}>
                  <Text style={styles.captionUser}>{post.user?.username} </Text>
                  {post.caption}
                </Text>
              )}
              <Text style={styles.time}>{dayjs(post.createdAt).fromNow()}</Text>
            </View>

            <View style={styles.divider} />
            <Text style={styles.commentsTitle}>Commentaires</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <CommentItem comment={item} onReply={(c) => setReplyTo(c)} />
        )}
        ListEmptyComponent={
          <EmptyState icon="chatbubble-outline" title="Aucun commentaire" subtitle="Soyez le premier !" />
        }
      />

      {/* Comment input */}
      <View style={[styles.inputWrap, { paddingBottom: insets.bottom + SPACING.sm }]}>
        {replyTo && (
          <View style={styles.replyBar}>
            <Text style={styles.replyTxt}>
              Répondre à <Text style={styles.replyUser}>{replyTo.user?.username}</Text>
            </Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <Avatar uri={currentUser?.profilePicture} username={currentUser?.username} size={30} />
          <TextInput
            style={styles.input}
            placeholder="Ajouter un commentaire..."
            placeholderTextColor={COLORS.textMuted}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity onPress={handleSend} disabled={!text.trim() || sending}>
            <Ionicons name="send" size={20} color={text.trim() ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  headerTitle:  { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold },
  userRow:      { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  username:     { color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold },
  image:        { width: W, height: W, backgroundColor: COLORS.surfaceAlt },
  actions:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  actLeft:      { flexDirection: 'row', alignItems: 'center' },
  actBtn:       { marginRight: SPACING.md },
  info:         { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  likes:        { color: COLORS.text, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, marginBottom: 4 },
  caption:      { color: COLORS.text, fontSize: FONTS.sizes.sm, lineHeight: 19 },
  captionUser:  { fontWeight: FONTS.weight.bold },
  time:         { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 6 },
  divider:      { height: 0.5, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  commentsTitle:{ color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  inputWrap:    { borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingHorizontal: SPACING.md, paddingTop: SPACING.sm },
  replyBar:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: SPACING.xs },
  replyTxt:     { color: COLORS.textSub, fontSize: FONTS.sizes.xs },
  replyUser:    { color: COLORS.primary, fontWeight: FONTS.weight.bold },
  inputRow:     { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm },
  input: {
    flex: 1, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    color: COLORS.text, fontSize: FONTS.sizes.base, maxHeight: 100,
  },
});
