// client/src/components/ui/SkeletonCard.jsx
import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white/10 rounded-2xl aspect-square w-full"></div>
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-3 bg-white/10 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;