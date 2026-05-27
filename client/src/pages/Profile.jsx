// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import MasonryGrid from '../components/MasonryGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FaUserCircle, FaEdit, FaBookmark, FaTh } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const isOwnProfile = isAuthenticated && currentUser?._id === userId;

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (profileUser) {
      if (activeTab === 'posts') fetchUserPosts();
      else if (activeTab === 'saved' && isOwnProfile) fetchSavedPosts();
    }
  }, [activeTab, profileUser, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/auth/user/${userId}`);
      setProfileUser(response.data.user);
    } catch (error) {
      console.error('Fetch profile error:', error);
      if (error.response?.status === 404) {
        toast.error('User not found');
        navigate('/');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await api.get(`/posts/user/${userId}`);
      setUserPosts(response.data.posts);
    } catch (error) {
      console.error('Fetch user posts error:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchSavedPosts = async () => {
    setLoadingSaved(true);
    try {
      const response = await api.get('/auth/saved');
      setSavedPosts(response.data.savedPosts);
    } catch (error) {
      console.error('Fetch saved posts error:', error);
      toast.error('Failed to load saved posts');
    } finally {
      setLoadingSaved(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profileUser) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/40 to-primary/20"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 mb-4">
            <div className="relative">
              {profileUser.profileImage ? (
                <img
                  src={profileUser.profileImage}
                  alt={profileUser.username}
                  loading="lazy"
                  className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
                />
              ) : (
                <FaUserCircle className="w-28 h-28 rounded-full border-4 border-white shadow-md text-gray-300 bg-white" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0 md:ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{profileUser.username}</h1>
              {profileUser.bio && <p className="text-gray-600 mt-1">{profileUser.bio}</p>}
              <div className="mt-2 text-sm text-gray-500">
                <span className="font-semibold">{userPosts.length}</span> pins
              </div>
            </div>
            {isOwnProfile && (
              <Link to={`/profile/${userId}/edit`} className="mt-4 md:mt-0 inline-flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-full hover:bg-red-700 transition">
                <FaEdit size={14} />
                <span>Edit Profile</span>
              </Link>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 text-center font-medium flex items-center justify-center space-x-2 transition ${
                activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTh /> <span>Posts</span>
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-3 text-center font-medium flex items-center justify-center space-x-2 transition ${
                  activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaBookmark /> <span>Saved</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6">
        {activeTab === 'posts' && <MasonryGrid posts={userPosts} loading={loadingPosts} />}
        {activeTab === 'saved' && isOwnProfile && <MasonryGrid posts={savedPosts} loading={loadingSaved} />}
      </div>
    </div>
  );
};

export default Profile;