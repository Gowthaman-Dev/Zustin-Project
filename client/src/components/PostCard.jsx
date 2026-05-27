// client/src/components/PostCard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PostCard = ({ post, onLikeToggle, onSaveToggle }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const [savePop, setSavePop] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes?.length || 0);
      if (user) {
        setIsLiked(post.likes?.includes(user._id) || false);
      }
    }
  }, [post, user]);

  useEffect(() => {
    const checkSaved = async () => {
      if (!isAuthenticated || !user) return;
      try {
        const res = await api.get('/auth/saved');
        const savedIds = res.data.savedPosts.map(p => p._id);
        setIsSaved(savedIds.includes(post._id));
      } catch (err) {
        console.error('Failed to fetch saved status', err);
      }
    };
    checkSaved();
  }, [post._id, isAuthenticated, user]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }
    if (likeLoading) return;

    const previousLiked = isLiked;
    const previousCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(prev => (previousLiked ? prev - 1 : prev + 1));

    if (!previousLiked) {
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 300);
    }

    setLikeLoading(true);
    try {
      const response = await api.post(`/posts/${post._id}/like`);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
      if (onLikeToggle) onLikeToggle(post._id, response.data.liked);
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to save posts');
      return;
    }
    if (saveLoading) return;

    const previousSaved = isSaved;
    setIsSaved(!isSaved);

    if (!previousSaved) {
      setSavePop(true);
      setTimeout(() => setSavePop(false), 300);
    }

    setSaveLoading(true);
    try {
      const response = await api.post(`/auth/save/${post._id}`);
      setIsSaved(response.data.saved);
      if (onSaveToggle) onSaveToggle(post._id, response.data.saved);
      toast.success(response.data.saved ? 'Saved!' : 'Removed from saved');
    } catch (error) {
      setIsSaved(previousSaved);
      toast.error('Failed to update saved');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/post/${post._id}`);
  };

  const handleCardClick = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-900/50">
        <img
          src={post.image || 'https://via.placeholder.com/300'}
          alt={post.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'blur-0 scale-100' : 'blur-md scale-105'
          } group-hover:scale-105 transition-transform duration-300`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={handleSave}
            disabled={saveLoading}
            whileTap={{ scale: 0.9 }}
            animate={savePop ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-full p-2 shadow-md hover:bg-white/40 transition"
          >
            {isSaved ? <FaBookmark className="text-pink-500" size={16} /> : <FaRegBookmark className="text-white" size={16} />}
          </motion.button>

          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <motion.button
              onClick={handleLike}
              disabled={likeLoading}
              whileTap={{ scale: 0.9 }}
              animate={heartPop ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.2 }}
              className="text-white hover:text-red-500 transition"
            >
              {isLiked ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
            </motion.button>
            <span className="text-white text-xs">{likesCount}</span>
          </div>

          <button
            onClick={handleQuickView}
            className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md rounded-full p-2 shadow-md hover:bg-white/40 transition"
          >
            <FaEye className="text-white" size={14} />
          </button>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium text-white truncate">{post.title}</h3>
        <p className="text-xs text-gray-400 truncate">by {post.author?.username || 'Unknown'}</p>
      </div>
    </motion.div>
  );
};

export default PostCard;