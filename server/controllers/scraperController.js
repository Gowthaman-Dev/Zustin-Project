// backend/controllers/scraperController.js
import { getImages } from 'imgminer';

// @desc    Scrape images from a provided URL
// @route   POST /api/scrape/images
// @access  Public (or Protected if you prefer)
export const scrapeImagesFromUrl = async (req, res) => {
  const { url, maxImages = 50, deepScan = true } = req.body;

  if (!url) {
    return res.status(400).json({ msg: 'URL is required' });
  }

  try {
    // The 'getImages' function scrapes image URLs without downloading them
    const result = await getImages(url, { maxImages: maxImages, deepScan: deepScan });
    // result.images contains an array of objects, each with a 'url' property
    const imageUrls = result.images.map(img => img.url);
    res.status(200).json({ success: true, images: imageUrls, total: result.totalImages });
  } catch (error) {
    console.error('Error scraping images:', error);
    res.status(500).json({ msg: 'Failed to scrape images', error: error.message });
  }
};