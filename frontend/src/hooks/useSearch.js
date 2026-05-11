import { useState, useCallback, useRef } from 'react';
import { searchService } from '../services/apiServices';

export default function useSearch() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState('users');
  const debounceRef = useRef(null);

  const search = useCallback((text) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setResults({ users: [], posts: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await searchService.all(text.trim());
        setResults(data ?? { users: [], posts: [] });
      } catch {
        setResults({ users: [], posts: [] });
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults({ users: [], posts: [] });
    setLoading(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const hasResults = results.users.length > 0 || results.posts.length > 0;

  return { query, results, loading, tab, hasResults, setTab, search, clear };
}
