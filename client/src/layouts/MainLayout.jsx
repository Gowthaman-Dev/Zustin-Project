// client/src/layouts/MainLayout.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaPinterest, 
  FaSearch, 
  FaPlus, 
  FaUserCircle, 
  FaBookmark, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import CreatePostModal from '../components/CreatePostModal';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search navigation (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else if (location.pathname === '/' && location.search) {
        navigate('/');
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, navigate, location.pathname, location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  return (
    <>
      {/* Floating Glass Navigation Bar */}
      <nav className="fixed top-3 left-4 right-4 z-50 mx-auto max-w-7xl px-6 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.12)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Glow & Hover */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 flex-shrink-0 group"
          >
            <div className="relative">
              <FaPinterest className="h-7 w-7 text-pink-500 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <div className="absolute inset-0 blur-xl bg-pink-500/30 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              PinClone
            </span>
          </Link>

          {/* Desktop Search – Premium Glass */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative group">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 group-focus-within:text-pink-400 group-hover:text-pink-400" />
                <input
                  type="text"
                  placeholder="Search high‑res inspiration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Create Button – Premium Gradient */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 px-5 py-2.5 rounded-2xl font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Create</span>
                </button>

                {/* Profile Avatar & Glass Dropdown */}
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center focus:outline-none transition-transform duration-200 hover:scale-105"
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="profile" className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20 hover:ring-pink-500/50 transition-all" />
                    ) : (
                      <FaUserCircle className="h-9 w-9 text-gray-400 hover:text-pink-400 transition-colors" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 backdrop-blur-xl bg-[#111827]/80 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                      >
                        <Link
                          to={`/profile/${user?._id}`}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-200 hover:bg-white/10 transition-colors duration-200 rounded-xl mx-1"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaUserCircle className="h-5 w-5 text-pink-400" />
                          <span className="text-sm font-medium">Profile</span>
                        </Link>
                        <Link
                          to="/saved"
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-200 hover:bg-white/10 transition-colors duration-200 rounded-xl mx-1"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaBookmark className="h-5 w-5 text-pink-400" />
                          <span className="text-sm font-medium">Saved</span>
                        </Link>
                        <button
                          onClick={() => { logout(); setIsProfileDropdownOpen(false); navigate('/'); }}
                          className="flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:bg-white/10 transition-colors duration-200 rounded-xl mx-1 w-full text-left"
                        >
                          <FaSignOutAlt className="h-5 w-5" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-white/10 transition-all duration-200 mobile-menu-button"
                >
                  {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-2 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">Sign up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isAuthenticated && (
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${isSearchExpanded ? 'max-h-24 pb-4' : 'max-h-0'}`}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search pins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                  autoFocus={isSearchExpanded}
                />
              </div>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Full‑Screen Glass Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-4 top-20 z-40 backdrop-blur-2xl bg-[#111827]/90 border border-white/10 rounded-3xl shadow-2xl md:hidden overflow-hidden"
            ref={mobileMenuRef}
          >
            <div className="flex flex-col p-6 space-y-4">
              <button
                onClick={() => { setIsSearchExpanded(!isSearchExpanded); setIsMobileMenuOpen(false); if (!isSearchExpanded) setTimeout(() => searchInputRef.current?.focus(), 200); }}
                className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-gray-200"
              >
                <FaSearch className="text-pink-400 text-xl" />
                <span className="text-base font-medium">Search</span>
              </button>
              <button
                onClick={() => { setIsCreateModalOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-gray-200"
              >
                <FaPlus className="text-pink-400 text-xl" />
                <span className="text-base font-medium">Create</span>
              </button>
              <Link to={`/profile/${user?._id}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-gray-200">
                {user?.profileImage ? <img src={user.profileImage} className="h-6 w-6 rounded-full" /> : <FaUserCircle className="text-pink-400 text-xl" />}
                <span className="text-base font-medium">Profile</span>
              </Link>
              <Link to="/saved" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-gray-200">
                <FaBookmark className="text-pink-400 text-xl" />
                <span className="text-base font-medium">Saved</span>
              </Link>
              <button onClick={() => { logout(); navigate('/'); setIsMobileMenuOpen(false); }} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-red-400">
                <FaSignOutAlt className="text-xl" />
                <span className="text-base font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [privacyConsent, setPrivacyConsent] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('privacyConsent');
    return null;
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const storedConsent = localStorage.getItem('privacyConsent');
    if (storedConsent === 'accepted') {
      setPrivacyConsent('accepted');
    }
  }, [isAuthenticated]);

  const handlePrivacyDecision = (decision) => {
    if (decision === 'accepted') {
      setPrivacyConsent('accepted');
      localStorage.setItem('privacyConsent', 'accepted');
      return;
    }

    localStorage.removeItem('privacyConsent');
    logout();
    navigate('/login');
  };

  const showPrivacyOverlay = isAuthenticated && privacyConsent !== 'accepted';

  return (
    <div className="relative min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] overflow-x-hidden">
      {/* Animated Ambient Glow Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/25 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '12s' }}></div>
<div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/10 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400/20 rounded-full blur-[2px] animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      {/* Main Content with Floating Effect */}
      <div className="relative z-10">
        <Navbar />
        {showPrivacyOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 px-4 py-6">
            <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-[#020617]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl text-white">
              <div className="flex flex-col gap-6 md:gap-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-pink-400 font-semibold mb-3">Privacy Consent Required</p>
                  <h2 className="text-3xl sm:text-4xl font-bold">Please accept our privacy policy</h2>
                  <p className="mt-4 text-gray-300 leading-relaxed text-sm sm:text-base">
                    Before you can use the app, you must agree to our privacy policy. This app only works after consent is given. If you decline, you will be signed out.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-center">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-sm text-gray-200 leading-relaxed">
                    <p className="font-medium text-white mb-2">Data use highlights</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>We store your login and profile data securely.</li>
                      <li>Your actions are used to personalize recommendations.</li>
                      <li>We do not share your private data without consent.</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <button
                      onClick={() => handlePrivacyDecision('accepted')}
                      className="w-full sm:w-auto rounded-2xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-600"
                    >
                      Accept and continue
                    </button>
                    <button
                      onClick={() => handlePrivacyDecision('declined')}
                      className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Decline and logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;