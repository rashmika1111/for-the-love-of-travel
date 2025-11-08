"use client";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
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
import { featuredPosts, latestPosts, videos } from "../lib/data";

export default function HomePageClient() {
  const { 
    showCTA, 
    showPopup, 
    closeCTA, 
    closePopup, 
    showAuthPopup,
    resetCTA
  } = useScrollTrigger(0.2, 1000); // Trigger at 20% scroll, 1 second delay


  return (
    <main>
      <Navbar />
      <Hero />

      {/* Featured Stories Grid - Mobile Responsive Layout */}
      <section id="stories" className="section pt-16 md:pt-20 lg:pt-24">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Mobile: Stack all cards vertically */}
          <div className="block lg:hidden space-y-6 max-w-4xl mx-auto">
            {featuredPosts.slice(0, 6).map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PostCard post={post} variant="latest" />
              </motion.div>
            ))}
          </div>

          {/* Desktop: Original complex layout */}
          <div className="hidden lg:block" style={{ 
            maxWidth: '92%', 
            margin: '0 auto', 
            marginTop: '40px', 
            marginLeft: '8%',
            position: 'relative',
            minHeight: '110vh'
          }}>
            {/* Row 1 - Absolute positioned cards */}
            <div style={{ position: 'relative', height: '480px', marginBottom: '72px' }}>
              <div style={{
                position: 'absolute',
                top: '-60px',
                left: '6px',
                zIndex: 2,
                gap: '12px',
                marginRight: '24px'
              }}>
                <PostCard post={featuredPosts[0]} variant="latest" width="624px" height="240px" />
              </div>
              <div style={{
                position: 'absolute',
                top: '-60px',
                left: '642px',
                zIndex: 1,
                marginLeft: '24px'
              }}>
                <PostCard post={featuredPosts[1]} variant="latest" width="624px" height="240px" />
              </div>
            </div>

            {/* Row 2 - Grid layout */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 2fr', 
              gap: '18px',
              marginTop: '-348px',
              marginBottom: '24px'
            }}>
              <PostCard post={featuredPosts[2]} variant="latest" width="540px" height="300px" />
              <PostCard post={featuredPosts[3]} variant="latest" width="420px" height="300px" />
              <PostCard post={featuredPosts[4]} variant="latest" width="300px" height="240px" />
            </div>

            {/* Row 3 - Custom layout with absolute positioning */}
            <div style={{ 
              position: 'relative',
              height: '480px',
              marginTop: '18px'
            }}>
              <PostCard post={featuredPosts[5]} variant="latest" width="984px" height="336px" />
              <div style={{
                position: 'absolute',
                top: '-60px',
                left: '1002px',
                zIndex: 1
              }}>
                <PostCard post={featuredPosts[6]} variant="latest" width="300px" height="396px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Post thumbnails */}
      <section className="section bg-white">
        <div className="container">
          {/* Custom Latest Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900">Latest Post</h2>
              <div className="w-96 h-1 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Mobile: Grid layout, Desktop: Staggered layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:hidden">
            {latestPosts.map((src, i) => (
              <motion.div 
                key={i} 
                className="relative rounded-xl overflow-hidden shadow-lg h-80 w-full group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20
                  }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Image 
                  src={src} 
                  alt={`Latest post ${i+1}`} 
                  fill 
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:opacity-0 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Original staggered layout */}
          <div className="hidden lg:flex gap-6 w-full items-start">
            <div className="w-0 sm:w-4"></div>
            <div className="flex gap-6 flex-1 justify-center">
             {latestPosts.map((src, i) => (
               <motion.div 
                 key={i} 
                 className={`relative rounded-xl overflow-hidden shadow-lg h-80 w-64 group cursor-pointer flex-shrink-0 ${
                   i === 1 ? 'mt-20' : i === 3 ? 'mt-16' : ''
                 }`}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, amount: 0.3 }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 whileHover={{ 
                   scale: 1.03,
                   y: -5,
                   transition: { 
                     type: "spring", 
                     stiffness: 300, 
                     damping: 20
                   }
                 }}
                 whileTap={{ scale: 0.98 }}
               >
                <Image 
                  src={src} 
                  alt={`Latest post ${i+1}`} 
                  fill 
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                />
                {/* Dark Gradient Overlay - Removed on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:opacity-0 transition-opacity duration-300"></div>
              </motion.div>
            ))}
            </div>
            <div className="w-0 sm:w-4"></div>
          </div>
        </div>
      </section>

      {/* Filtered Articles Section */}
      <section className="section text-white py-16" style={{ backgroundColor: '#0D2436' }}>
        <div className="container">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-12 justify-center">
            <button className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg font-medium transition-colors text-sm sm:text-base" style={{ backgroundColor: '#3514EE' }}>
              Destinations
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm sm:text-base">
              Vacations
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm sm:text-base">
              Tours
            </button>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }, (_, i) => {
              // Define which images to use for specific cards
              let imageSrc = "/images/placeholder.jpg"; // default placeholder
              
              // Assign images to specific card positions
              const cardImages = [
                "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg", // Card 1 - Beach scene
                "/images/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg", // Card 2 - Venice scene
                "/images/3969146248009e641f454298f62e13de84ac0a09.jpg", // Card 3 - Woman with orange car
                "/images/3969146248009e641f454298f62e13de84ac0a09.jpg", // Card 4 - Same as card 3
                "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg", // Card 5 - Same as card 1
                "/images/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg", // Card 6 - Same as card 2
                "/images/3969146248009e641f454298f62e13de84ac0a09.jpg", // Card 7 - Same as card 3
                "/images/0ef79490733114b35273ae93b13e8ebc24870d94.png"  // Card 8 - Coastal town
              ];
              
              imageSrc = cardImages[i];
              
              return (
               <article 
                 key={i}
                 className="bg-white rounded-xl overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
               >
                {/* Image */}
                <div className="h-48 rounded-t-xl overflow-hidden">
                  <Image 
                    src={imageSrc} 
                    alt={`Article ${i + 1}`} 
                    width={300} 
                    height={192} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  {/* Category Tag */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#E5E9FF', color: '#4A64E6' }}>
                      Destinations
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-gray-900 font-semibold text-sm leading-tight mb-3 line-clamp-2">
                    The Impact of Technology on the Workplace: How Technology is Changing
                  </h3>
                  
                  {/* Metadata */}
                   <div className="text-gray-600 text-xs space-y-1">
                     <div>14 min read</div>
                     <div>May 28, 2025</div>
                   </div>
                 </div>
               </article>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="flex justify-end">
            <button 
              className="px-4 py-2 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#3514EE' }}
            >
              View More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* White gap section */}
      <section className="py-20 bg-white"></section>

      {/* Videos section */}
      <section id="videos" className="section" style={{ background: 'linear-gradient(to right, #F7ECD5, #EEC9F9)' }}>
        <div className="container">
          {/* Custom Popular Videos Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900">Popular Videos</h2>
              <div className="w-96 h-1 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          {/* Videos Grid - Same layout as filtered articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }, (_, i) => {
              // Use the same images as the filtered articles section
              const cardImages = [
                "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg", // Card 1 - Beach scene
                "/images/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg", // Card 2 - Venice scene
                "/images/3969146248009e641f454298f62e13de84ac0a09.jpg", // Card 3 - Woman with orange car
                "/images/3969146248009e641f454298f62e13de84ac0a09.jpg", // Card 4 - Same as card 3
                "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg", // Card 5 - Same as card 1
                "/images/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg", // Card 6 - Same as card 2
                "/images/3969146248009e641f454298f62e13de84ac0a09.jpg", // Card 7 - Same as card 3
                "/images/0ef79490733114b35273ae93b13e8ebc24870d94.png"  // Card 8 - Coastal town
              ];
              
              return (
              <article 
                key={i}
                className="bg-transparent rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
              >
                {/* Video Image */}
                <div className="h-48 rounded-xl overflow-hidden border-8 border-white group relative">
                  <Image 
                    src={cardImages[i]} 
                    alt={`Video ${i + 1}`} 
                    width={300} 
                    height={192} 
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110" 
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-gray-900 font-semibold text-sm leading-tight mb-3 line-clamp-2">
                    Popular Travel Video: Amazing Destinations
                  </h3>
                  
                  {/* Metadata */}
                  <div className="text-gray-600 text-xs space-y-1">
                    <div>5:30 · Dec 15, 2024</div>
                  </div>
                </div>
              </article>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="flex justify-end">
            <button 
              className="px-4 py-2 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#3514EE' }}
            >
              View More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Featured banner */}
      <section className="section">
        <div className="container">
          <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-smooth group cursor-pointer">
            <Image
              src="/images/adde8f33aed2cfe745cae2ca0e5fddb1b7cb7305.png"
              alt="Featured video"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
      
      {/* Scroll-triggered CTA */}
      <ScrollCTA 
        isVisible={showCTA} 
        onJoinClick={showAuthPopup}
        onDismiss={closeCTA}
      />
      
      {/* Authentication Popup */}
      <AuthPopup 
        isOpen={showPopup} 
        onClose={closePopup} 
      />
      
      {/* Debug buttons - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-[10001] flex flex-col gap-2">
          <button
            onClick={resetCTA}
            className="bg-red-500 text-white px-3 py-2 rounded text-xs"
          >
            Reset CTA
          </button>
          <button
            onClick={() => {
              console.log('Force showing CTA');
              // Force show CTA for testing
              sessionStorage.removeItem('auth-cta-shown');
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
