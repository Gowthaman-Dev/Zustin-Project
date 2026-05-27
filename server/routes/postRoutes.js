// backend/routes/postRoutes.js
import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  getUserPosts,
  toggleLike,
  addComment,
  deleteComment,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/user/:userId', getUserPosts);

// Protected routes
router.post('/', protect, uploadSingle, createPost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);                    // Q17
router.post('/:id/comment', protect, addComment);                 // Q18
router.delete('/:id/comment/:commentId', protect, deleteComment); // Q19

export default router;