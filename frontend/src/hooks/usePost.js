import { useState, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { postService, likeService, savedService, commentService } from '../services/apiServices';

export default function usePost(id) {
  const [post,     setPost]     = useState(null);
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [liked,    setLiked]    = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [likes,    setLikes]    = useState(0);
  const [sending,  setSending]  = useState(false);
  const [replyTo,  setReplyTo]  = useState(null);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setError(null);
        const [pRes, cRes] = await Promise.all([
          postService.getOne(id),
          commentService.getAll(id),
        ]);
        setPost(pRes.data);
        setLiked(pRes.data.liked ?? false);
        setSaved(pRes.data.saved ?? false);
        setLikes(pRes.data.likesCount ?? 0);
        setComments(cRes.data ?? []);
      } catch (e) {
        setError(e?.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleLike = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prev = liked;
    setLiked(!prev);
    setLikes(l => prev ? l - 1 : l + 1);
    try {
      await likeService.togglePost(id);
    } catch {
      setLiked(prev);
      setLikes(l => prev ? l + 1 : l - 1);
    }
  }, [liked, id]);

  const toggleSave = useCallback(async () => {
    const prev = saved;
    setSaved(!prev);
    try {
      await savedService.toggle(id);
    } catch {
      setSaved(prev);
    }
  }, [saved, id]);

  const sendComment = useCallback(async (text) => {
    if (!text.trim() || sending) return false;
    setSending(true);
    try {
      const { data } = await commentService.add(id, {
        text: text.trim(),
        parentCommentId: replyTo?.id ?? null,
      });
      if (replyTo) {
        setComments(prev => prev.map(c =>
          c.id === replyTo.id
            ? { ...c, replies: [...(c.replies ?? []), data] }
            : c
        ));
      } else {
        setComments(prev => [data, ...prev]);
      }
      setReplyTo(null);
      return true;
    } catch {
      return false;
    } finally {
      setSending(false);
    }
  }, [id, replyTo, sending]);

  const deleteComment = useCallback(async (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    try {
      await commentService.delete(commentId);
    } catch {
      // optimistic rollback not needed — just log
    }
  }, []);

  return {
    post, comments, loading, liked, saved, likes, sending, replyTo, error,
    setReplyTo, toggleLike, toggleSave, sendComment, deleteComment,
  };
}
