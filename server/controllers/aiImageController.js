// backend/controllers/aiImageController.js
export const generateImage = async (req, res) => {
  try {
    const { prompt = 'beautiful landscape', width = 1024, height = 1024 } = req.query;
    
    // Pollinations.ai endpoint (no API key needed)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}`;
    
    // You can also fetch the image as blob and upload to Cloudinary
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    
    res.json({ 
      success: true, 
      imageUrl, 
      base64: `data:image/png;base64,${base64Image}`,
      prompt 
    });
  } catch (error) {
    res.status(500).json({ msg: 'AI generation failed' });
  }
};