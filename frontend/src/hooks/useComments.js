import { useState, useCallback, useEffect } from 'react';
import { commentService, likeService } from '../services/apiServices';

export default function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [replyTo,  setReplyTo]  = useState(null);

  useEffect(() => {
    if (!postId) return;
    commentService.getAll(postId)
      .then(r => setComments(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const add = useCallback(async (text) => {
    if (!text.trim() || sending) return false;
    setSending(true);
    try {
      const { data } = await commentService.add(postId, {
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
  }, [postId, replyTo, sending]);

  const remove = useCallback(async (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    try { await commentService.delete(commentId); } catch {}
  }, []);

  const likeComment = useCallback(async (commentId) => {
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, liked: !c.liked, likesCount: c.liked ? c.likesCount - 1 : c.likesCount + 1 }
        : c
    ));
    try { await likeService.toggleComment(commentId); } catch {}
  }, []);

  return { comments, loading, sending, replyTo, setReplyTo, add, remove, likeComment };
}
