"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DynamicNavbar from './DynamicNavbar';
import Footer from './Footer';
import Newsletter from './Newsletter';
import DynamicPopularPosts from './DynamicPopularPosts';
import AuthPopup from './AuthPopup';
import ScrollCTA from './ScrollCTA';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

// Loading skeleton for the entire homepage
const HomepageSkeleton = () => (
  <main>
    <DynamicNavbar />
    <div className="space-y-20">
      {/* Hero skeleton */}
      <div className="h-screen bg-gray-200 animate-pulse"></div>
      
      {/* Sections skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="container mx-auto px-4">
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      ))}
    </div>
    <Footer />
  </main>
);

// Hero section component
const HeroSection = ({ section }) => {
  const { 
    backgroundImage, 
    backgroundVideo, 
    title, 
    subtitle, 
    overlayOpacity = 0.3,
    height = { mobile: '70vh', tablet: '80vh', desktop: '90vh' }
  } = section.config;

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{ height: height.desktop }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden -mt-8"
          style={{
            height: '100%',
            borderBottomRightRadius: '86px',
            borderBottomLeftRadius: '86px'
          }}
        >
          {backgroundVideo ? (
            <video
              src={backgroundVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={backgroundImage || '/images/balloon4to.png'}
              alt="Hero background"
              className="w-full h-full object-cover object-center"
            />
          )}

          {/* Overlay */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            {title && (
              <h1 
                className="max-w-6xl text-white text-center drop-shadow-md"
                style={{
                  fontFamily: 'var(--font-roboto)',
                  fontWeight: 600,
                  fontSize: '74px',
                  lineHeight: '74px',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-white text-xl mt-4 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Text block section component
const TextBlockSection = ({ section }) => {
  const { content, alignment = 'left', fontSize = 'base' } = section.config;
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto ${alignmentClasses[alignment]} ${fontSizeClasses[fontSize]}`}>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  );
};

// Newsletter section component
const NewsletterSection = ({ section }) => {
  const { 
    newsletterTitle = 'Subscribe to our Newsletter',
    newsletterDescription,
    newsletterPlaceholder = 'Enter your email',
    newsletterButtonText = 'Subscribe'
  } = section.config;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {newsletterTitle}
          </h2>
          {newsletterDescription && (
            <p className="text-gray-600 mb-8">{newsletterDescription}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={newsletterPlaceholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {newsletterButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Image gallery section component
const ImageGallerySection = ({ section }) => {
  const { images = [], columns = 3, spacing = 'md' } = section.config;
  
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className={`grid ${gridCols[columns]} ${spacingClasses[spacing]}`}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Video showcase section component
const VideoShowcaseSection = ({ section }) => {
  const { videos = [], columns = 3 } = section.config;
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                    {video.description}
                  </p>
                )}
                {video.duration && (
                  <div className="text-gray-500 text-xs">
                    {video.duration}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section renderer component
const SectionRenderer = ({ section, index }) => {
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} />;
      case 'popular-posts':
      case 'featured-posts':
        return <DynamicPopularPosts section={section} />;
      case 'text-block':
        return <TextBlockSection section={section} />;
      case 'newsletter-signup':
        return <NewsletterSection section={section} />;
      case 'image-gallery':
        return <ImageGallerySection section={section} />;
      case 'video-showcase':
        return <VideoShowcaseSection section={section} />;
      default:
        return (
          <section className="py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title || 'Section'}
                </h2>
                <p className="text-gray-600">
                  Section type "{section.type}" is not yet implemented.
                </p>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <motion.div
      variants={animationVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {renderSection()}
    </motion.div>
  );
};

// Main dynamic homepage component
export default function DynamicHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    showCTA,
    showPopup,
    closeCTA,
    closePopup,
    showAuthPopup,
    resetCTA,
  } = useScrollTrigger(0.2, 1000);

  useEffect(() => {
    const fetchHomepageSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/homepage-sections/published');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSections(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch homepage sections');
        }
      } catch (error) {
        console.error('Error fetching homepage sections:', error);
        setError(error.message);
        // Fallback to empty array
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageSections();
  }, []);

  if (loading) {
    return <HomepageSkeleton />;
  }

  if (error) {
    return (
      <main>
        <DynamicNavbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Love of Travel
            </h1>
            <p className="text-red-600 mb-4">Error loading homepage: {error}</p>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <main>
        <DynamicNavbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Love of Travel
            </h1>
            <p className="text-gray-600">
              No homepage sections are currently configured. Please check back later.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <DynamicNavbar />
      
      {/* Render all sections */}
      {sections.map((section, index) => (
        <SectionRenderer 
          key={section._id || index} 
          section={section} 
          index={index}
        />
      ))}

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





