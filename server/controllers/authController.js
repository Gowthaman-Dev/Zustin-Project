// backend/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';   // ✅ ADD THIS IMPORT

// Generate JWT Token (expires in 7 days)
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email: email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields: username, email, password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      msg: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Save or unsave a post
// @route   POST /api/auth/save/:postId
// @access  Private
export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      saved: !isSaved,
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error('Toggle save post error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get all saved posts of the logged-in user
// @route   GET /api/auth/saved
// @access  Private
export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'username profileImage' },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({
      success: true,
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Update user profile (username, bio, profile image)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const profileImageFile = req.file;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;

    if (profileImageFile) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'pinterest_clone/profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(profileImageFile.buffer);
      });
      user.profileImage = uploadResult.secure_url;
    }

    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      msg: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/auth/user/:userId
// @access  Public
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'No user with that email' });
  }

  // Generate token (use crypto or JWT)
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // For testing, log the reset link (in production send email)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  console.log('Reset link:', resetUrl);

  // In real app, send email using nodemailer
  res.json({ msg: 'Password reset link sent (check console for demo)' });
};

// @desc    Verify reset token
// @route   GET /api/auth/verify-reset-token/:token
export const verifyResetToken = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });
  res.json({ msg: 'Token valid' });
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ msg: 'Password reset successful' });
};