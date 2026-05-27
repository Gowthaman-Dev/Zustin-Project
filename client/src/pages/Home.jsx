import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MasonryGrid from '../components/MasonryGrid';
import usePosts from '../hooks/usePosts';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const categories = [
  'all', 'nature', 'technology', 'food', 'travel',
  'art', 'design', 'fashion', 'other'
];

const categoryLabels = {
  all: 'All',
  nature: 'Nature',
  technology: 'Technology',
  food: 'Food',
  travel: 'Travel',
  art: 'Art',
  design: 'Design',
  fashion: 'Fashion',
  other: 'Other'
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const {
    posts,
    loading,
    hasMore,
    category,
    setCategory,
    search,
    setSearch,
    totalPosts,
    loadMore,
    resetFilters,
  } = usePosts('all', urlSearch);

  const [searchInput, setSearchInput] = useState(urlSearch);

  const dummyPosts = [
    { _id: 'dummy-1', title: 'Sunny Forest', image: 'https://picsum.photos/id/1011/400/600', category: 'nature', author: { username: 'Sample' } },
    { _id: 'dummy-2', title: 'Deep Ocean', image: 'https://picsum.photos/id/1012/400/600', category: 'nature', author: { username: 'Sample' } },
    { _id: 'dummy-3', title: 'Misty Mountain', image: 'https://picsum.photos/id/1020/400/600', category: 'nature', author: { username: 'Sample' } },
    { _id: 'dummy-4', title: 'Golden Sunset', image: 'https://picsum.photos/id/1024/400/600', category: 'nature', author: { username: 'Sample' } },
    { _id: 'dummy-5', title: 'Technology Hub', image: 'https://picsum.photos/id/1050/400/600', category: 'technology', author: { username: 'Sample' } },
    { _id: 'dummy-6', title: 'Neon Circuit', image: 'https://picsum.photos/id/1051/400/600', category: 'technology', author: { username: 'Sample' } },
    { _id: 'dummy-7', title: 'Modern Workspace', image: 'https://picsum.photos/id/1052/400/600', category: 'technology', author: { username: 'Sample' } },
    { _id: 'dummy-8', title: 'Robotics Lab', image: 'https://picsum.photos/id/1060/400/600', category: 'technology', author: { username: 'Sample' } },
    { _id: 'dummy-9', title: 'Fresh Ingredients', image: 'https://picsum.photos/id/1080/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-10', title: 'Baking Delights', image: 'https://picsum.photos/id/1081/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-11', title: 'Colorful Market', image: 'https://picsum.photos/id/1082/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-12', title: 'Gourmet Plate', image: 'https://picsum.photos/id/1083/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-13', title: 'Beach Escape', image: 'https://picsum.photos/id/1084/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-14', title: 'City Skyline', image: 'https://picsum.photos/id/1085/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-15', title: 'Road Trip', image: 'https://picsum.photos/id/1086/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-16', title: 'Misty Valley', image: 'https://picsum.photos/id/1087/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-17', title: 'Studio Art', image: 'https://picsum.photos/id/1088/400/600', category: 'art', author: { username: 'Sample' } },
    { _id: 'dummy-18', title: 'Abstract Paint', image: 'https://picsum.photos/id/1089/400/600', category: 'art', author: { username: 'Sample' } },
    { _id: 'dummy-19', title: 'Sculpture Form', image: 'https://picsum.photos/id/1090/400/600', category: 'art', author: { username: 'Sample' } },
    { _id: 'dummy-20', title: 'Gallery View', image: 'https://picsum.photos/id/1091/400/600', category: 'art', author: { username: 'Sample' } },
    { _id: 'dummy-21', title: 'Minimal Design', image: 'https://picsum.photos/id/1092/400/600', category: 'design', author: { username: 'Sample' } },
    { _id: 'dummy-22', title: 'Color Study', image: 'https://picsum.photos/id/1093/400/600', category: 'design', author: { username: 'Sample' } },
    { _id: 'dummy-23', title: 'Pattern Play', image: 'https://picsum.photos/id/1094/400/600', category: 'design', author: { username: 'Sample' } },
    { _id: 'dummy-24', title: 'Creative Space', image: 'https://picsum.photos/id/1095/400/600', category: 'design', author: { username: 'Sample' } },
    { _id: 'dummy-25', title: 'Fashion Forward', image: 'https://picsum.photos/id/1096/400/600', category: 'fashion', author: { username: 'Sample' } },
    { _id: 'dummy-26', title: 'Street Style', image: 'https://picsum.photos/id/1097/400/600', category: 'fashion', author: { username: 'Sample' } },
    { _id: 'dummy-27', title: 'Runway Look', image: 'https://picsum.photos/id/1098/400/600', category: 'fashion', author: { username: 'Sample' } },
    { _id: 'dummy-28', title: 'Modern Outfit', image: 'https://picsum.photos/id/1099/400/600', category: 'fashion', author: { username: 'Sample' } },
    { _id: 'dummy-29', title: 'Urban Alley', image: 'https://picsum.photos/id/1100/400/600', category: 'other', author: { username: 'Sample' } },
    { _id: 'dummy-30', title: 'Cozy Corner', image: 'https://picsum.photos/id/1101/400/600', category: 'other', author: { username: 'Sample' } },
    { _id: 'dummy-31', title: 'Soft Lighting', image: 'https://picsum.photos/id/1102/400/600', category: 'other', author: { username: 'Sample' } },
    { _id: 'dummy-32', title: 'Hidden Path', image: 'https://picsum.photos/id/1103/400/600', category: 'other', author: { username: 'Sample' } },
    { _id: 'dummy-33', title: 'Forest Bridge', image: 'https://picsum.photos/id/1110/400/600', category: 'nature', author: { username: 'Sample' } },
    { _id: 'dummy-34', title: 'Drone View', image: 'https://picsum.photos/id/1111/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-35', title: 'Mountain Hut', image: 'https://picsum.photos/id/1112/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-36', title: 'Food Art', image: 'https://picsum.photos/id/1113/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-37', title: 'Creative Tech', image: 'https://picsum.photos/id/1114/400/600', category: 'technology', author: { username: 'Sample' } },
    { _id: 'dummy-38', title: 'City Cafe', image: 'https://picsum.photos/id/1115/400/600', category: 'fashion', author: { username: 'Sample' } },
    { _id: 'dummy-39', title: 'Minimal Desk', image: 'https://picsum.photos/id/1116/400/600', category: 'design', author: { username: 'Sample' } },
    { _id: 'dummy-40', title: 'Painter Studio', image: 'https://picsum.photos/id/1117/400/600', category: 'art', author: { username: 'Sample' } },
    { _id: 'dummy-41', title: 'Forest Waterfall', image: 'https://picsum.photos/id/1118/400/600', category: 'nature', author: { username: 'Sample' } },
    { _id: 'dummy-42', title: 'Tech Conference', image: 'https://picsum.photos/id/1119/400/600', category: 'technology', author: { username: 'Sample' } },
    { _id: 'dummy-43', title: 'Sushi Platter', image: 'https://picsum.photos/id/1120/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-44', title: 'Island Resort', image: 'https://picsum.photos/id/1121/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-45', title: 'Modern Sculpture', image: 'https://picsum.photos/id/1122/400/600', category: 'art', author: { username: 'Sample' } },
    { _id: 'dummy-46', title: 'Bold Graphics', image: 'https://picsum.photos/id/1123/400/600', category: 'design', author: { username: 'Sample' } },
    { _id: 'dummy-47', title: 'Fashion Shoot', image: 'https://picsum.photos/id/1124/400/600', category: 'fashion', author: { username: 'Sample' } },
    { _id: 'dummy-48', title: 'Street Food', image: 'https://picsum.photos/id/1125/400/600', category: 'food', author: { username: 'Sample' } },
    { _id: 'dummy-49', title: 'Night City', image: 'https://picsum.photos/id/1126/400/600', category: 'travel', author: { username: 'Sample' } },
    { _id: 'dummy-50', title: 'Cozy Studio', image: 'https://picsum.photos/id/1127/400/600', category: 'other', author: { username: 'Sample' } },
  ];

  const filteredDummyPosts = dummyPosts.filter((post) => {
    const matchesCategory = category === 'all' || post.category === category;
    const matchesSearch = search
      ? post.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const shouldUseDummyPosts = posts.length === 0 && !search;
  const postsToRender = shouldUseDummyPosts ? filteredDummyPosts : posts;
  const resultCount = posts.length > 0 ? totalPosts : postsToRender.length;

  useEffect(() => {
    if (search) searchParams.set('search', search);
    else searchParams.delete('search');
    setSearchParams(searchParams, { replace: true });
  }, [search, searchParams, setSearchParams]);

  useEffect(() => setSearchInput(urlSearch), [urlSearch]);

  const sentinelRef = useIntersectionObserver(() => {
    if (hasMore && !loading) loadMore();
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleCategoryChange = (cat) => setCategory(cat);

  return (
    <div className="relative">
      {/* Glass search bar */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-400 transition-colors" />
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results header */}
      {search && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white">Results for "{search}"</h2>
          <p className="text-gray-400 text-sm mt-1">Found {resultCount} pins</p>
          <button onClick={clearSearch} className="text-pink-400 text-sm mt-2 hover:underline">Clear search</button>
        </div>
      )}

      {/* Category chips – dark glass */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300 ${
              category === cat
                ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-md'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {categoryLabels[cat]}
          </motion.button>
        ))}
      </div>

      {/* Masonry Grid with dark theme */}
      <MasonryGrid posts={postsToRender} loading={loading && posts.length === 0} />

      {loading && posts.length > 0 && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 border-b-2 border-violet-500"></div>
        </div>
      )}

      {hasMore && !loading && posts.length > 0 && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-400 py-8">No more pins to load</p>
      )}

      {!loading && postsToRender.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No posts found. Try a different category or search term.</p>
          {(category !== 'all' || search) && (
            <button onClick={resetFilters} className="mt-4 text-pink-400 hover:underline">Clear filters</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;