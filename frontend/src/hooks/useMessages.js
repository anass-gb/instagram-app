import { useState, useCallback, useEffect, useRef } from 'react';
import { messageService, likeService } from '../services/apiServices';

export default function useMessages(userId, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    messageService.conversation(userId)
      .then(r => {
        const data = r.data ?? [];
        setMessages(data.reverse());
        // Mark unread messages as read
        data
          .filter(m => !m.isRead && m.sender?.id !== currentUserId)
          .forEach(m => messageService.markRead(m.id).catch(() => {}));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, currentUserId]);

  const send = useCallback(async (content) => {
    if (!content.trim() || sending) return;
    setSending(true);
    const tempId = Date.now();
    const temp = {
      id: tempId,
      content: content.trim(),
      sender:   { id: currentUserId },
      receiver: { id: Number(userId) },
      isRead:   false,
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };
    setMessages(prev => [...prev, temp]);
    // Scroll to end
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const { data } = await messageService.send(userId, { content: content.trim() });
      setMessages(prev => prev.map(m => m.id === tempId ? data : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  }, [sending, userId, currentUserId]);

  const likeMessage = useCallback(async (msgId) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId
        ? { ...m, likesCount: (m.likesCount ?? 0) + 1 }
        : m
    ));
    try { await likeService.toggleMessage(msgId); } catch {}
  }, []);

  return { messages, loading, sending, listRef, send, likeMessage };
}
