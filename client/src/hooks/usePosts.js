// client/src/hooks/usePosts.js
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const usePosts = (initialCategory = 'all', initialSearch = '') => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [totalPosts, setTotalPosts] = useState(0);
  const limit = 50;

  const fetchPosts = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await api.get('/posts', {
        params: {
          page: currentPage,
          limit,
          category: category === 'all' ? undefined : category,
          search: search || undefined,
        },
      });
      const { posts: newPosts, total, pages } = response.data;
      setTotalPosts(total);
      setHasMore(currentPage < pages);
      if (reset) {
        setPosts(newPosts);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, category, search, loading]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(true);
  }, [category, search]);

  const loadMore = () => {
    if (!loading && hasMore) fetchPosts();
  };

  const resetFilters = () => {
    setCategory('all');
    setSearch('');
  };

  return { posts, loading, hasMore, category, setCategory, search, setSearch, totalPosts, loadMore, resetFilters };
};

export default usePosts;