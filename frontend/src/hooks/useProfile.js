import { useState, useCallback, useEffect } from 'react';
import { userService, postService, followService, blockService } from '../services/apiServices';

export default function useProfile(userId, isOwn = false) {
  const [profile,    setProfile]    = useState(null);
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following,  setFollowing]  = useState(false);
  const [blocked,    setBlocked]    = useState(false);
  const [error,      setError]      = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const fetchProfile = isOwn
        ? userService.getMe()
        : userService.getProfile(userId);

      const [pRes, postsRes] = await Promise.all([
        fetchProfile,
        postService.getUserPosts(userId, 0),
      ]);

      setProfile(pRes.data);
      setPosts(postsRes.data?.content ?? []);

      if (!isOwn) {
        setFollowing(pRes.data.following ?? false);
        setBlocked(pRes.data.blocked ?? false);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [userId, isOwn]);

  useEffect(() => { load(); }, [userId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const toggleFollow = useCallback(async () => {
    const prev = following;
    setFollowing(!prev);
    setProfile(p => ({
      ...p,
      followersCount: prev ? p.followersCount - 1 : p.followersCount + 1,
    }));
    try {
      await followService.toggle(userId);
    } catch {
      setFollowing(prev);
      setProfile(p => ({
        ...p,
        followersCount: prev ? p.followersCount + 1 : p.followersCount - 1,
      }));
    }
  }, [following, userId]);

  const toggleBlock = useCallback(async () => {
    const prev = blocked;
    setBlocked(!prev);
    try {
      await blockService.toggle(userId);
    } catch {
      setBlocked(prev);
    }
  }, [blocked, userId]);

  const removePost = useCallback((id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  return {
    profile, posts, loading, refreshing, following, blocked, error,
    refresh, toggleFollow, toggleBlock, removePost, setProfile,
  };
}
