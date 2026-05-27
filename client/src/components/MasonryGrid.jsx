import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';
import SkeletonCard from './ui/SkeletonCard';

const MasonryGrid = ({ posts, loading, onLikeToggle, onSaveToggle }) => {
  if (!loading && (!posts || posts.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-300">No pins yet</h3>
        <p className="text-gray-500 mt-2">Be the first to create a pin!</p>
      </div>
    );
  }

  if (loading && (!posts || posts.length === 0)) {
    return (
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post._id || post.url || post.image || index}
            layout
            className="break-inside-avoid mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard post={post} onLikeToggle={onLikeToggle} onSaveToggle={onSaveToggle} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MasonryGrid;