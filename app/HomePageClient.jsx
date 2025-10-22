"use client";
import DynamicNavbar from "../components/DynamicNavbar";
import DynamicHero from "../components/DynamicHero";
import SectionHeader from "../components/SectionHeader";
import PostCard from "../components/PostCard";
import VideoCard from "../components/VideoCard";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import AuthPopup from "../components/AuthPopup";
import ScrollCTA from "../components/ScrollCTA";
import { useScrollTrigger } from "../hooks/useScrollTrigger";
import Image from "next/image";
import { motion } from "framer-motion";
import { videos } from "../lib/data";
import DynamicPopularVideos from "../components/DynamicPopularVideos";
import DynamicLatestPosts from "../components/DynamicLatestPosts";
import DynamicCategories from "../components/DynamicCategories";
import DynamicFilteredArticles from "../components/DynamicFilteredArticles";
import DynamicFeaturedVideo from "../components/DynamicFeaturedVideo";
import DynamicFeaturedPosts from "../components/DynamicFeaturedPosts";
import { useState } from "react";

export default function HomePageClient() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const {
    showCTA,
    showPopup,
    closeCTA,
    closePopup,
    showAuthPopup,
    resetCTA,
  } = useScrollTrigger(0.2, 1000); // Trigger at 20% scroll, 1 second delay

  const handleCategorySelect = (category) => {
    if (category === null) {
      setSelectedCategory(null);
      console.log('Show all categories selected');
    } else {
      setSelectedCategory(category.slug);
      console.log('Category selected:', category);
    }
  };

  return (
    <main>
      <DynamicNavbar />
      <DynamicHero />

      {/* Dynamic Featured Stories Grid */}
      <DynamicFeaturedPosts />

      {/* Dynamic Latest Posts */}
      <DynamicLatestPosts />

      {/* Filtered Articles Section */}
      <section className="section text-white py-16" style={{ backgroundColor: '#0D2436' }}>
        <div className="container">
          {/* Dynamic Category Filter Buttons */}
          <DynamicCategories 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />

          {/* Dynamic Articles Grid */}
          <DynamicFilteredArticles 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* View More Button */}
          <div className="flex justify-end">
            <motion.button 
              className="px-6 py-3 text-white rounded-2xl font-medium transition-colors flex items-center gap-3 text-lg"
              style={{ backgroundColor: '#3514EE' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View More
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </section>

      {/* White gap section (unchanged) */}
      <section className="py-20 bg-white"></section>

      {/* Dynamic Videos section */}
      <DynamicPopularVideos />

      {/* Dynamic Featured Video */}
      <DynamicFeaturedVideo />

      <Newsletter />
      <Footer />

      {/* Scroll-triggered CTA */}
      <ScrollCTA isVisible={showCTA} onJoinClick={showAuthPopup} onDismiss={closeCTA} />

      {/* Authentication Popup */}
      <AuthPopup isOpen={showPopup} onClose={closePopup} />

      {/* Debug buttons - only in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 z-[10001] flex flex-col gap-2">
          <button onClick={resetCTA} className="bg-red-500 text-white px-3 py-2 rounded text-xs">
            Reset CTA
          </button>
          <button
            onClick={() => {
              console.log("Force showing CTA");
              // Force show CTA for testing
              sessionStorage.removeItem("auth-cta-shown");
              window.location.reload();
            }}
            className="bg-blue-500 text-white px-3 py-2 rounded text-xs"
          >
            Show CTA
          </button>
        </div>
      )}
    </main>
  );
}
