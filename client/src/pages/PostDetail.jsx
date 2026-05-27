// client/src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaTrash, FaUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/posts/${id}`);
      const postData = response.data.post;
      setPost(postData);
      setLikesCount(postData.likes?.length || 0);
      if (user) {
        setIsLiked(postData.likes?.includes(user._id) || false);
      }
      if (user) {
        try {
          const savedRes = await api.get('/auth/saved');
          const savedIds = savedRes.data.savedPosts.map(p => p._id);
          setIsSaved(savedIds.includes(postData._id));
        } catch (err) {
          console.error('Failed to fetch saved status', err);
        }
      }
    } catch (err) {
      console.error('Fetch post error:', err);
      if (err.response?.status === 404) setError('Post not found');
      else setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }
    const previousLiked = isLiked;
    const previousCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(prev => (previousLiked ? prev - 1 : prev + 1));

    try {
      const res = await api.post(`/posts/${id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error('Failed to update like');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save posts');
      return;
    }
    const previousSaved = isSaved;
    setIsSaved(!isSaved);
    try {
      const res = await api.post(`/auth/save/${id}`);
      setIsSaved(res.data.saved);
      toast.success(res.data.saved ? 'Saved!' : 'Removed from saved');
    } catch (err) {
      setIsSaved(previousSaved);
      toast.error('Failed to update saved');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    setSubmitting(true);
    const tempId = Date.now().toString();
    const newCommentOptimistic = {
      _id: tempId,
      text: commentText,
      user: {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
      },
      createdAt: new Date().toISOString(),
    };
    setPost(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newCommentOptimistic]
    }));
    setCommentText('');

    try {
      const res = await api.post(`/posts/${id}/comment`, { text: commentText });
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(c => c._id === tempId ? res.data.comment : c)
      }));
      toast.success('Comment added');
    } catch (err) {
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== tempId)
      }));
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) return;
    const previousComments = [...(post.comments || [])];
    setPost(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c._id !== commentId)
    }));
    try {
      await api.delete(`/posts/${id}/comment/${commentId}`);
      toast.success('Comment deleted');
    } catch (err) {
      setPost(prev => ({ ...prev, comments: previousComments }));
      toast.error('Failed to delete comment');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">Go back home</button>
      </div>
    );
  }
  if (!post) return null;

  const canDeleteComment = (commentUserId) => {
    if (!user) return false;
    return commentUserId === user._id || post.author._id === user._id;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center p-4">
          <img src={post.image} alt={post.title} loading="lazy" className="max-h-[80vh] w-full object-contain rounded-lg" />
        </div>
        <div className="lg:w-1/2 flex flex-col p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center space-x-3 mb-4">
            {post.author?.profileImage ? (
              <img src={post.author.profileImage} alt={post.author.username} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
            ) : (
              <FaUserCircle className="w-10 h-10 text-gray-400" />
            )}
            <div>
              <p className="font-semibold text-gray-800">{post.author?.username || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
          {post.description && <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.description}</p>}
          <div className="flex items-center space-x-6 mb-6">
            <button onClick={handleLike} className="flex items-center space-x-1 text-gray-700 hover:text-red-500 transition">
              {isLiked ? <FaHeart className="text-red-500" size={22} /> : <FaRegHeart size={22} />}
              <span>{likesCount} likes</span>
            </button>
            <button onClick={handleSave} className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
              {isSaved ? <FaBookmark className="text-primary" size={20} /> : <FaRegBookmark size={20} />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-2">
            <h3 className="font-semibold text-lg mb-3">Comments ({post.comments?.length || 0})</h3>
            <form onSubmit={handleAddComment} className="flex items-start space-x-2 mb-6">
              {user?.profileImage ? (
                <img src={user.profileImage} className="w-8 h-8 rounded-full" alt="avatar" loading="lazy" />
              ) : (
                <FaUserCircle className="w-8 h-8 text-gray-400" />
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={submitting}
                />
              </div>
              <Button type="submit" size="sm" disabled={!commentText.trim() || submitting}>Post</Button>
            </form>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {post.comments?.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
              ) : (
                post.comments.map(comment => (
                  <div key={comment._id} className="flex space-x-3">
                    {comment.user?.profileImage ? (
                      <img src={comment.user.profileImage} className="w-8 h-8 rounded-full" alt="avatar" loading="lazy" />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <p className="font-semibold text-sm">{comment.user?.username || 'Unknown'}</p>
                        <p className="text-gray-800 text-sm">{comment.text}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                    </div>
                    {canDeleteComment(comment.user?._id) && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-500 transition">
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;