"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Users, Heart } from "lucide-react";

export default function ScrollCTA({ isVisible, onJoinClick, onDismiss }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  const handleJoinClick = () => {
    onJoinClick();
  };

  if (isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5 
          }}
          className="fixed bottom-6 right-6 z-[9998] max-w-sm"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-yellow-100/20"></div>
            
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Join Our Community</h3>
                  <p className="text-slate-600 text-sm">Connect with fellow travelers</p>
                </div>
              </div>
              
              <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                Get exclusive travel tips, early access to new content, and connect with a community of passionate travelers like you.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleJoinClick}
                  className="flex-1 bg-gradient-to-r from-brand-gold to-yellow-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-yellow-600 hover:to-brand-gold transition-all duration-200 transform hover:scale-105"
                >
                  Join Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
            />
            <motion.div
              animate={{ 
                y: [0, 3, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-1 -left-1 w-4 h-4 bg-brand-gold rounded-full opacity-40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
