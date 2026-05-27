// client/src/components/AutoImageScraper.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import MasonryGrid from './MasonryGrid'; // Use your existing grid component
import Button from './ui/Button';
import Input from './ui/Input';
import toast from 'react-hot-toast';

const AutoImageScraper = () => {
  const [url, setUrl] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/scrape/images', { url, maxImages: 20 });
      if (response.data.success) {
        // Format the scraped image URLs to match your PostCard component's expected structure
        const formattedPosts = response.data.images.map((imgUrl, index) => ({
          _id: `scraped-${index}`,
          title: `Image from ${url}`,
          image: imgUrl,
          author: { username: 'Scraped' },
        }));
        setImages(formattedPosts);
        toast.success(`Found ${response.data.total} images!`);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error(error.response?.data?.msg || 'Failed to scrape images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleScrape} className="flex gap-2 mb-6">
        <Input
          type="url"
          placeholder="Enter URL to scrape images from..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" loading={loading}>
          Scrape Images
        </Button>
      </form>
      <MasonryGrid posts={images} loading={loading} />
    </div>
  );
};

export default AutoImageScraper;