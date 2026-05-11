import { useState, useCallback, useEffect } from 'react';
import { postService, storyService } from '../services/apiServices';

export default function useFeed() {
  const [posts,      setPosts]      = useState([]);
  const [stories,    setStories]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page,       setPage]       = useState(0);
  const [hasMore,    setHasMore]    = useState(true);
  const [error,      setError]      = useState(null);

  const load = useCallback(async (p = 0, refresh = false) => {
    try {
      setError(null);
      const [feedRes, storyRes] = await Promise.all([
        postService.getFeed(p, 10),
        p === 0 ? storyService.getFeed() : Promise.resolve({ data: null }),
      ]);

      const newPosts = feedRes.data?.content ?? [];
      setPosts(prev => refresh ? newPosts : [...prev, ...newPosts]);

      if (p === 0 && storyRes.data !== null) {
        setStories(storyRes.data ?? []);
      }

      setHasMore(!feedRes.data?.last);
    } catch (e) {
      setError(e?.response?.data?.message || 'Erreur de chargement');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await load(0, true);
      setLoading(false);
    };
    init();
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    await load(0, true);
    setRefreshing(false);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || refreshing) return;
    const next = page + 1;
    setPage(next);
    await load(next, false);
  }, [hasMore, loading, refreshing, page, load]);

  const removePost = useCallback((id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  return {
    posts, stories, loading, refreshing, hasMore, error,
    refresh, loadMore, removePost,
  };
}
