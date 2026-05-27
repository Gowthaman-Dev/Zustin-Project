// backend/controllers/postController.js
import Post from '../models/Post.js';
import cloudinary from '../config/cloudinary.js';

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
// backend/controllers/postController.js
export const createPost = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const imageFile = req.file;

    console.log('Received file:', imageFile); // debug

    if (!title || !imageFile) {
      return res.status(400).json({ msg: 'Title and image are required' });
    }

    if (!imageFile.buffer || imageFile.buffer.length === 0) {
      return res.status(400).json({ msg: 'Image buffer is empty' });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile.buffer, 'pinterest_clone');
    console.log('Cloudinary upload result:', uploadResult.secure_url);

    const post = await Post.create({
      title,
      description: description || '',
      category: category || 'other',
      image: uploadResult.secure_url,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'username profileImage');
    res.status(201).json({ success: true, msg: 'Post created', post: populatedPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
// @desc    Get all posts with pagination, filter, search
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search;

    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username profileImage'),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profileImage')
      .populate('comments.user', 'username profileImage');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Get post by id error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (only author)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the logged-in user is the author
    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ msg: 'You are not authorized to delete this post' });
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const imageUrl = post.image;
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    // Example: "pinterest_clone/abc123" (without extension)

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete post from database
    await post.deleteOne();

    res.status(200).json({
      success: true,
      msg: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get all posts by a specific user
// @route   GET /api/posts/user/:userId
// @access  Public
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username profileImage');

    if (!posts) {
      return res.status(200).json({ success: true, posts: [] });
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


// @desc    Toggle like/unlike on a post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;

    if (!text) {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the new comment's user info
    const populatedPost = await Post.findById(postId).populate('comments.user', 'username profileImage');
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({
      success: true,
      comment: addedComment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Delete a comment from a post
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private (only comment author or post owner)
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const comment = post.comments[commentIndex];

    // Check if current user is comment author OR post author
    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostAuthor = post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }

    // Remove comment
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({
      success: true,
      msg: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

