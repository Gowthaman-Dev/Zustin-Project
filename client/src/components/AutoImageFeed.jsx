// client/src/components/AutoImageFeed.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import MasonryGrid from './MasonryGrid';

const AutoImageFeed = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingImages();
  }, []);

  const fetchTrendingImages = async () => {
    try {
      const response = await api.get('/images/trending');
      const formattedImages = response.data.images.map((img, index) => ({
        _id: img.url || `trending-${index}`,
        title: img.title || `Trending Image ${index + 1}`,
        image: img.url,
        author: { username: 'Trending' },
        likes: img.likes,
      }));
      setImages(formattedImages);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trending Images</h2>
      <MasonryGrid posts={images} loading={loading} />
    </div>
  );
};

export default AutoImageFeed;