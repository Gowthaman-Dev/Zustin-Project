import React, { useState, useEffect } from 'react';
import { FaPinterest } from 'react-icons/fa';

const SplashScreen = () => {
  const words = ['Welcome', 'to', 'PinClone'];
  const [displayedWords, setDisplayedWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
  if (currentIndex < words.length) {
    const timer = setTimeout(() => {
      setDisplayedWords(prev => [...prev, words[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
    }, 300); // faster animation
    return () => clearTimeout(timer);
  } else {
    const redirectTimer = setTimeout(() => {
      localStorage.setItem('splashShown', 'true');
      window.location.href = '/register';
    }, 1200); // total ~4 sec target
    return () => clearTimeout(redirectTimer);
  }
}, [currentIndex, words]);

  useEffect(() => {
    if (currentIndex === words.length) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, words.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="mb-8">
        <div className="bg-red-500 p-4 rounded-full shadow-lg">
          <FaPinterest className="text-white text-5xl" />
        </div>
      </div>
      <div className="text-center">
        {displayedWords.map((word, idx) => (
          <span key={idx} className="inline-block text-5xl md:text-7xl font-bold text-gray-900 mx-2">
            {word}
          </span>
        ))}
        {currentIndex === words.length && (
          <span className={`inline-block w-[3px] h-12 bg-gray-900 ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        )}
      </div>
      {currentIndex === words.length && (
        <p className="mt-6 text-gray-500 text-lg">Discover & share inspiration</p>
      )}
    </div>
  );
};

export default SplashScreen;