// Install axios: npm install axios

// backend/controllers/imageController.js
export const searchUnsplashImages = async (req, res) => {
  try {
    const { query = 'nature', page = 1, per_page = 20 } = req.query;
    
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      },
      params: { query, page, per_page }
    });
    
    const formattedImages = response.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      title: photo.alt_description || 'Untitled',
      author: photo.user.name,
      likes: photo.likes
    }));
    
    res.json({ success: true, images: formattedImages, total: response.data.total });
  } catch (error) {
    res.status(500).json({ msg: 'Unsplash API error', error: error.message });
  }
};