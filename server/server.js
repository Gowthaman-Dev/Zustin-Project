// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './middleware/errorHandler.js';   // <-- import
import { scrapeImagesFromUrl } from './controllers/scraperController.js';
import cloudinary from './config/cloudinary.js';


dotenv.config();
connectdb();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local frontend
    'https://your-frontend-url.vercel.app'  // Your frontend URL after Vercel deploy
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Pinterest Clone API is running...');
});
app.get('/test-cloud', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ status: 'ok', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.post('/api/scrape/images', scrapeImagesFromUrl);

// Global error handler – MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});