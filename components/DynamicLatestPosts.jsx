"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { safePlayVideo, safePauseAndResetVideo } from '../lib/video-utils';

// Individual Post Card Component
const PostCard = ({ post, index, isMobile = false }) => {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  console.log('PostCard rendering:', { title: post.title, index, isMobile });

  const handleMouseEnter = () => {
    console.log('Mouse enter - checking video play conditions:', {
      hasVideoRef: !!videoRef.current,
      isVideoPost,
      isValidVideoUrl,
      videoUrl
    });
    if (videoRef.current && isVideoPost && isValidVideoUrl) {
      console.log('Card hover enter - playing video');
      setIsVideoPlaying(true);
      safePlayVideo(videoRef.current, {
        onError: (error) => {
          console.warn('Video play error:', error);
          setIsVideoPlaying(false);
        },
        onSuccess: () => console.log('Video playing successfully')
      });
    } else {
      console.log('Video play conditions not met');
    }
  };

  const handleMouseLeave = () => {
    console.log('Mouse leave - checking video pause conditions:', {
      hasVideoRef: !!videoRef.current,
      isVideoPost
    });
    if (videoRef.current && isVideoPost) {
      console.log('Card hover leave - pausing video');
      setIsVideoPlaying(false);
      safePauseAndResetVideo(videoRef.current, {
        onError: (error) => console.warn('Video pause/reset error:', error),
        onSuccess: () => console.log('Video paused and reset successfully')
      });
    } else {
      console.log('Video pause conditions not met');
    }
  };

  const getMediaUrl = () => {
    // First check featuredMedia.url (this is the correct/current media)
    if (post.featuredMedia && post.featuredMedia.url) {
      // Transform media URLs from admin frontend (port 3002) to backend (port 5000)
      let imageUrl = post.featuredMedia.url;
      if (imageUrl.includes('localhost:3002/api/admin/media/serve/')) {
        imageUrl = imageUrl.replace('localhost:3002/api/admin/media/serve/', 'localhost:5000/api/v1/media/serve/');
      }
      console.log('Using featuredMedia.url:', imageUrl);
      return imageUrl;
    }
    
    // Then check featuredImage (fallback for older posts)
    if (post.featuredImage && typeof post.featuredImage === 'string' && post.featuredImage.trim() !== '') {
      // Transform media URLs from admin frontend (port 3002) to backend (port 5000)
      let imageUrl = post.featuredImage;
      if (imageUrl.includes('localhost:3002/api/admin/media/serve/')) {
        imageUrl = imageUrl.replace('localhost:3002/api/admin/media/serve/', 'localhost:5000/api/v1/media/serve/');
      }
      console.log('Using featuredImage:', imageUrl);
      return imageUrl;
    }
    
    console.log('Using fallback image');
    return '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
  };

      const isVideoUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi');
      };

      // Check if this is a video post - prioritize featuredMedia.type (authoritative source)
      const isVideoFromMedia = post.featuredMedia && post.featuredMedia.type === 'video';
      const isVideoFromImage = post.featuredImage && post.featuredImage.url && isVideoUrl(post.featuredImage.url);
      // Only use featuredImage video detection if featuredMedia.type is not available
      const isVideoPost = isVideoFromMedia || (!post.featuredMedia && isVideoFromImage);
      
      // Get the media URL that will actually be used
      const mediaUrl = getMediaUrl();
      const videoUrl = isVideoPost ? mediaUrl : null;
      const isValidVideoUrl = videoUrl && isVideoUrl(videoUrl);
      
      // For image posts, make sure we don't try to use video URLs
      const imageUrl = !isVideoPost ? mediaUrl : null;
  
  console.log('Video detection:', {
    title: post.title,
    isVideoFromMedia,
    isVideoFromImage,
    isVideoPost,
    mediaUrl,
    videoUrl,
    isValidVideoUrl,
    imageUrl,
    featuredImage: post.featuredImage,
    featuredMediaType: post.featuredMedia?.type
  });
  
  // Debug logging for all posts
  console.log('PostCard rendering:', {
    title: post.title,
    featuredImage: post.featuredImage,
    featuredMedia: post.featuredMedia,
    isVideoPost,
    videoUrl,
    isValidVideoUrl,
    getMediaUrl: getMediaUrl(),
    date: post.date
  });

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden shadow-lg w-full group cursor-pointer ${
        isMobile ? 'h-64 sm:h-80' : 'h-96 w-80 flex-shrink-0'
      }`}
      style={{
        width: isMobile ? '100%' : '320px',
        height: isMobile ? '256px' : '384px',
        minHeight: isMobile ? '256px' : '384px',
        maxHeight: isMobile ? '256px' : '384px'
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.03,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/content/${post.slug}`}>
        {/* Media Container */}
        <div className="relative w-full h-full">
          {isVideoPost && isValidVideoUrl ? (
            <div className="w-full h-full overflow-hidden relative z-0" style={{ width: '100%', height: '100%', minHeight: '100%' }}>
              {/* Loading placeholder to maintain dimensions */}
              <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{ width: '100%', height: '100%' }}></div>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 relative z-0"
                muted
                preload="metadata"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  minHeight: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onLoadStart={() => {
                  console.log('Video element created and loading started:', videoUrl);
                }}
                onError={(e) => {
                  console.warn('Video load error, falling back to image:', {
                    src: e.target.src,
                    error: e.target.error,
                    networkState: e.target.networkState,
                    readyState: e.target.readyState
                  });
                  // Fallback to image if video fails
                  e.target.style.display = 'none';
                  const img = e.target.nextElementSibling;
                  if (img) {
                    img.style.display = 'block';
                    img.classList.remove('hidden');
                  }
                }}
                onCanPlay={() => {
                  console.log('Video can play:', videoUrl);
                }}
                onLoadedData={(e) => {
                  console.log('Video data loaded:', videoUrl);
                  // Hide loading placeholder when video is ready
                  const placeholder = e.target.previousElementSibling;
                  if (placeholder) {
                    placeholder.style.display = 'none';
                  }
                }}
                onAbort={() => {
                  console.warn('Video load aborted:', videoUrl);
                }}
              />
            </div>
          ) : null}
          
          {/* Image fallback or primary image - only show for non-video URLs */}
          {!isVideoPost && imageUrl && (
            <div className="w-full h-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
                }}
              />
            </div>
          )}
          
          {/* Video placeholder for failed video loads */}
          {isVideoPost && !isValidVideoUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">Video Preview</p>
                <p className="text-xs text-gray-300">Click to view</p>
              </div>
            </div>
          )}

          {/* Fallback image for video posts - only show when video is invalid */}
          {isVideoPost && !isValidVideoUrl && (
            <div className="w-full h-full overflow-hidden">
              <Image
                src="/images/3969146248009e641f454298f62e13de84ac0a09.jpg"
                alt={post.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
                }}
              />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:opacity-0 transition-opacity duration-300 z-20"></div>
          
          {/* Video Play Button Overlay removed by request */}
          
          {/* Video Type Indicator */}
          {isVideoPost && isValidVideoUrl && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold z-30">
              VIDEO
            </div>
          )}
          
          {/* Post Title Overlay */}
          <div className={`absolute text-white z-40 ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-6 left-6 right-6'}`}>
            <h3 className={`font-semibold line-clamp-2 transition-colors ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>
              {post.title}
            </h3>
            <div className="flex items-center justify-between mt-1 text-sm text-gray-200">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                {isVideoPost && isValidVideoUrl && post.featuredMedia && typeof post.featuredMedia === 'object' && post.featuredMedia.duration && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(post.featuredMedia.duration / 60)}:{(post.featuredMedia.duration % 60).toString().padStart(2, '0')}
                  </span>
                )}
                <span>{post.readingTime || 1} min read</span>
              </div>
            </div>
            {!isMobile && post.categories && post.categories.length > 0 && (
              <div className="mt-2">
                <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {post.categories[0].name}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Placeholder for skeleton loader
const PostSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:hidden">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="relative rounded-xl overflow-hidden shadow-lg h-64 sm:h-80 w-full bg-gray-200 animate-pulse"></div>
    ))}
  </div>
);

const DesktopSkeleton = () => (
  <div className="hidden lg:flex gap-8 w-full items-start justify-center">
    {Array.from({ length: 4 }).map((_, i) => (
      <div 
        key={i} 
        className={`relative rounded-xl overflow-hidden shadow-lg h-96 w-80 bg-gray-200 animate-pulse flex-shrink-0 ${
          i === 1 ? "mt-24" : i === 3 ? "mt-20" : ""
        }`}
      ></div>
    ))}
  </div>
);

export default function DynamicLatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselActive, setCarouselActive] = useState(false);

  console.log('DynamicLatestPosts render - posts count:', posts.length);
  console.log('DynamicLatestPosts render - posts:', posts.map(p => ({ title: p.title, id: p._id })));

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/v1/posts?sortBy=createdAt&sortOrder=desc&limit=8&status=published&t=${Date.now()}`);
        const data = await response.json();
        
        if (data.success) {
          console.log('Raw API response:', data);
          console.log('Posts data:', data.data);
          
          // Transform the API data to match PostCard component expectations
          const transformedPosts = data.data.map(post => {
            // Get the best available image URL - prioritize featuredMedia.url over featuredImage
            let imageUrl = post.featuredMedia?.url || post.featuredImage || null;
            
            // Transform media URLs from admin frontend (port 3002) to backend (port 5000)
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('localhost:3002/api/admin/media/serve/')) {
              imageUrl = imageUrl.replace('localhost:3002/api/admin/media/serve/', 'localhost:5000/api/v1/media/serve/');
            }
            
            // Use a proper fallback image that exists
            if (!imageUrl || imageUrl === '/images/placeholder.jpg') {
              imageUrl = '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
            }
            
            // Get category name - handle both populated and unpopulated categories
            let categoryName = 'Uncategorized';
            if (post.categories && post.categories.length > 0) {
              const firstCategory = post.categories[0];
              if (typeof firstCategory === 'object' && firstCategory.name) {
                categoryName = firstCategory.name;
              } else if (typeof firstCategory === 'string') {
                // If it's just an ID, we can't resolve it here, so keep as Uncategorized
                categoryName = 'Uncategorized';
              }
            }
            
            // Get author name - handle different author data structures
            let authorName = 'Unknown Author';
            if (post.author) {
              if (typeof post.author === 'object') {
                authorName = post.author.fullname || post.author.name || post.author.email || 'Unknown Author';
              } else if (typeof post.author === 'string') {
                authorName = post.author;
              }
            }
            
            console.log('=== TRANSFORMING POST ===');
            console.log('Title:', post.title);
            console.log('Original featuredImage:', post.featuredImage);
            console.log('Original featuredMedia:', post.featuredMedia);
            console.log('Final imageUrl:', imageUrl);
            console.log('Original categories:', post.categories);
            console.log('Final categoryName:', categoryName);
            console.log('Original author:', post.author);
            console.log('Final authorName:', authorName);
            console.log('Date fields - publishedAt:', post.publishedAt, 'createdAt:', post.createdAt);
            console.log('========================');
            
            return {
              _id: post._id,
              title: post.title,
              excerpt: post.excerpt,
              image: imageUrl,
              category: categoryName,
              readTime: post.readingTime ? `${post.readingTime} min read` : '5 min read',
              date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'),
              author: authorName,
              slug: post.slug,
              // Keep original API structure for PostCard component
              featuredImage: imageUrl,
              featuredMedia: post.featuredMedia ? {
                ...post.featuredMedia,
                url: imageUrl
              } : undefined
            };
          });
          
          console.log('Transformed posts:', transformedPosts);
          
          // Temporarily show all posts to debug the filtering issue
          console.log('All transformed posts:', transformedPosts);
          console.log('Posts count:', transformedPosts.length);
          console.log('Final posts to display:', transformedPosts.slice(0, 4));
          
          setPosts(transformedPosts.slice(0, 4));
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError('Failed to load latest posts');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-4 sm:gap-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <div className="w-48 sm:w-64 lg:w-96 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>

          {/* Mobile Skeleton */}
          <PostSkeleton />
          
          {/* Desktop Skeleton */}
          <DesktopSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="container mx-auto">
          <div className="text-center text-red-500 text-lg">Error: {error}</div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="container mx-auto">
          <div className="text-center text-gray-500 text-lg">
            {loading ? 'Loading posts...' : 'No latest posts found.'}
          </div>
          {error && (
            <div className="text-center text-red-500 text-sm mt-2">
              Error: {error}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white -mt-8 sm:-mt-12 lg:-mt-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <div className="w-48 sm:w-64 lg:w-96 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Mobile: Responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:hidden">
          {posts.map((post, i) => {
            console.log('Rendering mobile post:', { title: post.title, index: i });
            return <PostCard key={post._id || i} post={post} index={i} isMobile={true} />;
          })}
        </div>

        {/* Desktop: Staggered layout (upscaled + animated on hover) */}
        <div
          className="hidden lg:flex gap-8 w-full items-start justify-center"
          onMouseEnter={() => setCarouselActive(true)}
          onMouseLeave={() => setCarouselActive(false)}
        >
          {posts.map((post, i) => {
            console.log('Rendering desktop post:', { title: post.title, index: i });
            return (
              <div
                key={post._id || i}
                className={`flex-shrink-0 ${
                  i === 1 ? "mt-24" : i === 3 ? "mt-20" : ""
                } ${
                  carouselActive ? (i % 2 === 0 ? "carousel-up" : "carousel-down") : ""
                }`}
                style={{
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <PostCard post={post} index={i} isMobile={false} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
