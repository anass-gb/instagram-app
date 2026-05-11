import { useState, useCallback, useEffect } from 'react';
import { storyService, likeService } from '../services/apiServices';

export default function useStories(userId = null) {
  const [stories, setStories] = useState([]);
  const [story,   setStory]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked,   setLiked]   = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetch = userId
      ? storyService.getUser(userId)
      : storyService.getFeed();

    fetch
      .then(r => {
        const data = r.data ?? [];
        setStories(data);
        if (data.length > 0) setStory(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const viewStory = useCallback(async (id) => {
    try { await storyService.view(id); } catch {}
  }, []);

  const toggleLike = useCallback(async () => {
    if (!story) return;
    const prev = liked;
    setLiked(!prev);
    try { await likeService.toggleStory(story.id); }
    catch { setLiked(prev); }
  }, [liked, story]);

  const next = useCallback(() => {
    const nextIdx = current + 1;
    if (nextIdx < stories.length) {
      setCurrent(nextIdx);
      setStory(stories[nextIdx]);
      setLiked(false);
      viewStory(stories[nextIdx].id);
      return true;
    }
    return false; // no more stories
  }, [current, stories, viewStory]);

  const prev = useCallback(() => {
    const prevIdx = current - 1;
    if (prevIdx >= 0) {
      setCurrent(prevIdx);
      setStory(stories[prevIdx]);
      setLiked(false);
      return true;
    }
    return false;
  }, [current, stories]);

  return {
    stories, story, loading, liked, current,
    toggleLike, next, prev, viewStory,
  };
}
