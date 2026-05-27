// client/src/pages/SavedPosts.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MasonryGrid from '../components/MasonryGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/saved');
      setSavedPosts(response.data.savedPosts);
    } catch (error) {
      console.error('Fetch saved error:', error);
      toast.error('Failed to load saved posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved Pins</h1>
      <MasonryGrid posts={savedPosts} loading={false} />
    </div>
  );
};

export default SavedPosts;