// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await login({ email: formData.email, password: formData.password });
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020617] bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] relative overflow-hidden selection:bg-pink-500/30">
      
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Deep Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDuration: '6s'}}></div>
        
        {/* Floating Particles Illusion */}
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-pink-400/40 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-violet-400/30 rounded-full animate-ping" style={{animationDuration: '5s'}}></div>
      </div>

      {/* Left Side - Massive Branding Section (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-center items-center text-center">
        <div className="relative max-w-lg">
          <h1 className="text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-400 mb-8 leading-[1.1] tracking-tight">
            Sign in to explore
          </h1>
          <p className="text-xl text-gray-300/80 max-w-md mx-auto mb-20 leading-relaxed">
            Access your boards, save new ideas, and connect with millions of creators around the world.
          </p>
          
          {/* Floating Abstract Glass Cards */}
          <div className="absolute -top-16 -right-20 w-36 h-52 rounded-3xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-white/10 backdrop-blur-md rotate-[6deg] shadow-2xl shadow-black/40 transition-all duration-500 hover:scale-110 hover:rotate-0 hover:border-pink-500/30"></div>
          <div className="absolute -bottom-16 -left-16 w-44 h-32 rounded-3xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-white/10 backdrop-blur-md rotate-[-8deg] shadow-2xl shadow-black/40 transition-all duration-500 hover:scale-110 hover:rotate-0 hover:border-violet-500/30"></div>
          <div className="absolute top-24 -left-28 w-28 h-40 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-white/10 backdrop-blur-md rotate-[-12deg] shadow-2xl shadow-black/40 transition-all duration-500 hover:scale-110 hover:rotate-0 hover:border-cyan-500/30"></div>
          
          {/* Abstract Geometry */}
          <div className="absolute bottom-10 right-0 w-16 h-16 rounded-full border border-white/10 animate-pulse" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-pink-500/30 blur-sm animate-pulse" style={{animationDuration: '2s'}}></div>
        </div>
        
        {/* Feature Chips */}
        <div className="flex gap-4 mt-10">
          <span className="px-5 py-2.5 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-purple-500/10">⚡ Instant Access</span>
          <span className="px-5 py-2.5 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-purple-500/10">🔒 Secure Login</span>
          <span className="px-5 py-2.5 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-purple-500/10">☁️ Cloud Sync</span>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(168,85,247,0.15)] relative overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_80px_rgba(168,85,247,0.25)]">
          
          {/* Premium Top Reflection Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 shadow-lg shadow-violet-500/25 mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-6">
              <FaLock className="text-2xl text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="mt-3 text-gray-400 text-base">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={<span className="text-sm font-medium text-gray-300">Email Address</span>}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              icon={FaEnvelope}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl h-14 px-5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 backdrop-blur-sm transition-all duration-300"
              required
            />
            <Input
              label={<span className="text-sm font-medium text-gray-300">Password</span>}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              error={errors.password}
              icon={FaLock}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl h-14 px-5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 backdrop-blur-sm transition-all duration-300"
              required
            />
            
            <Button 
              type="submit" 
              loading={loading} 
              fullWidth
              className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] active:scale-[0.98] transition-all duration-300 rounded-2xl h-14 font-semibold tracking-wide text-white border-0 mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Premium OR Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10"></div>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10"></div>
          </div>

          {/* Social Auth Placeholders */}
          <div className="grid grid-cols-3 gap-3">
            <button type="button" className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
            <button type="button" className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </button>
            <button type="button" className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-300 hover:underline underline-offset-4 decoration-pink-500/30 hover:decoration-pink-500">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;