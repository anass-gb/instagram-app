import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { messageService, likeService } from '../../src/services/apiServices';
import useAuthStore from '../../src/store/authStore';
import MessageBubble from '../../src/components/message/MessageBubble';
import Avatar from '../../src/components/common/Avatar';
import { Loader } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

export default function ChatScreen() {
  const { userId, username, profilePicture } = useLocalSearchParams();
  const insets      = useSafeAreaInsets();
  const currentUser = useAuthStore(s => s.user);
  const listRef     = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [text,     setText]     = useState('');
  const [sending,  setSending]  = useState(false);

  useEffect(() => {
    messageService.conversation(userId)
      .then(r => {
        setMessages((r.data ?? []).reverse());
        // Marquer comme lus
        r.data?.filter(m => !m.isRead && m.sender?.id !== currentUser?.id)
          .forEach(m => messageService.markRead(m.id).catch(() => {}));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    const temp = {
      id: Date.now(), content: text.trim(),
      sender: currentUser, receiver: { id: Number(userId) },
      isRead: false, createdAt: new Date().toISOString(), likesCount: 0,
    };
    setMessages(p => [...p, temp]);
    setText('');
    try {
      const { data } = await messageService.send(userId, { content: temp.content });
      setMessages(p => p.map(m => m.id === temp.id ? data : m));
    } catch {
      setMessages(p => p.filter(m => m.id !== temp.id));
    } finally { setSending(false); }
  };

  const handleLongPress = async (msg) => {
    try {
      await likeService.toggleMessage(msg.id);
      setMessages(p => p.map(m => m.id === msg.id ? { ...m, likesCount: m.likesCount + 1 } : m));
    } catch {}
  };

  if (loading) return <Loader />;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => router.push(`/profile/${userId}`)}
        >
          <Avatar uri={profilePicture} username={username} size={36} showOnline />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.online}>En ligne</Text>
          </View>
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={i => String(i.id)}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isMe={item.sender?.id === currentUser?.id}
            onLongPress={handleLongPress}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <View style={[styles.inputWrap, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <TouchableOpacity style={styles.attach}>
          <Ionicons name="image-outline" size={24} color={COLORS.textSub} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && styles.sendOff]}
          onPress={handleSend}
          disabled={!text.trim() || sending}
        >
          <Ionicons name="send" size={19} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, gap: SPACING.sm,
  },
  backBtn:   { width: 36 },
  userRow:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  userInfo:  {},
  username:  { color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold },
  online:    { color: COLORS.primary, fontSize: FONTS.sizes.xs },
  list:      { paddingVertical: SPACING.md },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm, borderTopWidth: 0.5, borderTopColor: COLORS.border, gap: SPACING.sm,
  },
  attach:    {},
  input: {
    flex: 1, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    color: COLORS.text, fontSize: FONTS.sizes.base, maxHeight: 100,
  },
  sendBtn:   { width: 38, height: 38, borderRadius: 99, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendOff:   { backgroundColor: COLORS.surfaceAlt },
});
