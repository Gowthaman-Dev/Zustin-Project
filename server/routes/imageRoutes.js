// backend/routes/imageRoutes.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/images/trending - Fetch trending images from Pixabay
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: 'YOUR_API_KEY', // Get free key from pixabay.com
        q: 'nature',         // search term
        image_type: 'photo',
        per_page: 20,
        safesearch: true
      }
    });
    
    const images = response.data.hits.map(img => ({
      url: img.webformatURL,
      title: img.tags,
      likes: img.likes,
      downloads: img.downloads
    }));
    
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch images' });
  }
});

export default router;