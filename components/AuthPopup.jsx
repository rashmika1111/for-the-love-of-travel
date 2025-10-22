"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function AuthPopup({ isOpen, onClose, onSwitchMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ 
    fullname: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));

    setLoading(false);
    alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setForm({ fullname: "", email: "", password: "", confirmPassword: "" });
  };

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Card Container */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-yellow-100/10"></div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-brand-gold/20 rounded-full"
                />
                <motion.div
                  animate={{ 
                    y: [0, 8, 0],
                    rotate: [0, -15, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-400/30 rounded-full"
                />
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  type="button"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <motion.div 
                        className="w-12 h-12 mx-auto bg-gradient-to-br from-brand-gold to-yellow-600 rounded-2xl flex items-center justify-center mb-2"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </motion.div>
                      <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {isLogin ? "Welcome Back" : "Join Our Community"}
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {isLogin 
                          ? "Sign in to your account to continue" 
                          : "Create your account to start exploring"
                        }
                      </p>
                      
                      {/* Progress indicator */}
                      <div className="mt-2 flex justify-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Switch Mode Link */}
                    <div className="flex items-center justify-center text-sm">
                      <span className="text-slate-600 dark:text-slate-400 mr-2">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                      </span>
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-brand-gold hover:text-yellow-600 font-medium transition-colors"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium group-hover:text-slate-900 dark:group-hover:text-white">
                        Google
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center justify-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.96-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.03-3.11z"/>
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium group-hover:text-slate-900 dark:group-hover:text-white">
                        Apple
                      </span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3">
                    {/* Full Name Field - Only for Sign Up */}
                    {!isLogin && (
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            name="fullname"
                            value={form.fullname}
                            onChange={handleChange}
                            required={!isLogin}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Password
                        </label>
                        {isLogin && (
                          <button
                            type="button"
                            className="text-sm text-brand-gold hover:text-yellow-600 font-medium transition-colors"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-12 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-200"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field - Only for Sign Up */}
                    {!isLogin && (
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required={!isLogin}
                            className="block w-full pl-10 pr-12 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-200"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                            ) : (
                              <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remember Me - Only for Login */}
                  {isLogin && (
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-brand-gold focus:ring-brand-gold border-slate-300 dark:border-slate-600 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                        Remember me
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-gold to-yellow-600 hover:from-yellow-600 hover:to-brand-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? "Signing in..." : "Creating account..."}
                      </div>
                    ) : (
                      isLogin ? "Sign In" : "Create Account"
                    )}
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  By {isLogin ? "signing in" : "creating an account"}, you agree to our{" "}
                  <a href="#" className="text-brand-gold hover:text-yellow-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-brand-gold hover:text-yellow-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
