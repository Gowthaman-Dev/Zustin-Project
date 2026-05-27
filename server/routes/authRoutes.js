// backend/routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  getMe,               // <-- add this
  toggleSavePost,
  getSavedPosts,
  updateProfile,
  getUserById,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/user/:userId', getUserById);
// Protected routes
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);   // <-- add this line
router.post('/save/:postId', protect, toggleSavePost);
router.get('/saved', protect, getSavedPosts);
router.put('/profile', protect, uploadSingle, updateProfile);

export default router;