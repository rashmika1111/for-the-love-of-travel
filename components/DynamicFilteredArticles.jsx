"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { categoriesApi } from '../lib/api';

export default function DynamicFilteredArticles({ selectedCategory, onCategorySelect }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        // Fetch posts with category filter
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const params = new URLSearchParams({
          limit: '8',
          status: 'published',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        if (selectedCategory) {
          // Get category ID from slug
          const categoriesResponse = await fetch(`${base}/api/v1/categories/tree?t=${Date.now()}`);
          const categoriesData = await categoriesResponse.json();
          
          if (categoriesData.success) {
            const category = categoriesData.data.find(cat => cat.slug === selectedCategory);
            if (category) {
              params.append('categories', category._id);
            }
          }
        }
        
        const fetchResponse = await fetch(`${base}/api/v1/posts?${params}&t=${Date.now()}`);
        const data = await fetchResponse.json();
        response = data;
        
        if (response.success) {
          console.log('Fetched posts for category:', selectedCategory, response.data);
          
          // Transform the API data to match PostCard component expectations
          const transformedPosts = response.data.map(post => {
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
            console.log('========================');
            
            return {
              _id: post._id,
              title: post.title,
              excerpt: post.excerpt || post.description || 'No description available',
              image: imageUrl,
              category: categoryName,
              categories: post.categories, // Keep the full categories array
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
          
          setPosts(transformedPosts || []);
        } else {
          throw new Error(response.message || 'Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const getMediaUrl = (post) => {
    // First check featuredMedia.url (this is the correct/current media)
    if (post.featuredMedia && post.featuredMedia.url) {
      // Transform media URLs from admin frontend (port 3002) to backend (port 5000)
      let imageUrl = post.featuredMedia.url;
      if (imageUrl.includes('localhost:3002/api/admin/media/serve/')) {
        imageUrl = imageUrl.replace('localhost:3002/api/admin/media/serve/', 'localhost:5000/api/v1/media/serve/');
      }
      return imageUrl;
    }
    // Then check featuredImage (fallback for older posts)
    if (post.featuredImage && typeof post.featuredImage === 'string' && post.featuredImage.trim() !== '') {
      // Transform media URLs from admin frontend (port 3002) to backend (port 5000)
      let imageUrl = post.featuredImage;
      if (imageUrl.includes('localhost:3002/api/admin/media/serve/')) {
        imageUrl = imageUrl.replace('localhost:3002/api/admin/media/serve/', 'localhost:5000/api/v1/media/serve/');
      }
      return imageUrl;
    }
    // Fallback to a proper image that exists
    return '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
  };

  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi');
  };

  const isVideoPost = (post) => {
    // Check if featuredMedia indicates it's a video
    const isVideoFromMedia = post.featuredMedia && post.featuredMedia.type === 'video';
    
    // Check if featuredMedia URL is a video (even if type is not set)
    const isVideoFromMediaUrl = post.featuredMedia && post.featuredMedia.url && isVideoUrl(post.featuredMedia.url);
    
    // Check if featuredImage URL is a video (fallback for older posts)
    const isVideoFromImage = post.featuredImage && post.featuredImage.url && isVideoUrl(post.featuredImage.url);
    
    return isVideoFromMedia || isVideoFromMediaUrl || (!post.featuredMedia && isVideoFromImage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 sm:h-56 bg-gray-300"></div>
            <div className="p-4 sm:p-5">
              <div className="mb-3 sm:mb-4">
                <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="mt-3 sm:mt-4 space-y-1">
                <div className="h-3 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Error loading articles: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 mb-4">
          {selectedCategory ? `No articles found in this category.` : 'No articles available.'}
        </p>
        {selectedCategory && (
          <button 
            onClick={() => onCategorySelect && onCategorySelect(null)}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Show All Articles
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
      {posts.map((post, index) => {
        const mediaUrl = getMediaUrl(post);
        const category = post.categories && post.categories.length > 0 ? post.categories[0] : null;
        const isVideo = isVideoPost(post);
        const videoUrl = isVideo ? mediaUrl : null;
        const imageUrl = !isVideo ? mediaUrl : null;
        
        // Debug logging for video posts
        if (isVideo) {
          console.log('Video post detected:', {
            title: post.title,
            mediaUrl,
            videoUrl,
            featuredMedia: post.featuredMedia,
            featuredImage: post.featuredImage,
            isVideoFromMedia: post.featuredMedia && post.featuredMedia.type === 'video',
            isVideoFromMediaUrl: post.featuredMedia && post.featuredMedia.url && isVideoUrl(post.featuredMedia.url),
            isVideoFromImage: post.featuredImage && post.featuredImage.url && isVideoUrl(post.featuredImage.url)
          });
        }
        
        
        return (
          <Link key={post._id || index} href={`/content/${post.slug}`}>
            <motion.article 
              className="bg-white rounded-xl overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20
                }
              }}
            >
              {/* Media */}
              <div className="h-48 sm:h-56 rounded-t-xl overflow-hidden relative">
                {isVideo && videoUrl ? (
                  <>
                    {/* Loading placeholder */}
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-500 text-sm">Loading video...</div>
                    </div>
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover relative z-10"
                      muted
                      preload="metadata"
                      onLoadStart={() => {
                        console.log('Video loading started:', videoUrl);
                      }}
                      onLoadedData={(e) => {
                        console.log('Video loaded successfully:', videoUrl);
                        // Hide loading placeholder
                        const placeholder = e.target.previousElementSibling;
                        if (placeholder) {
                          placeholder.style.display = 'none';
                        }
                      }}
                      onError={(e) => {
                        console.warn('Video load error, falling back to image:', {
                          src: e.target.src,
                          error: e.target.error,
                          networkState: e.target.networkState,
                          readyState: e.target.readyState
                        });
                        e.target.style.display = 'none';
                        // Hide loading placeholder
                        const placeholder = e.target.previousElementSibling;
                        if (placeholder) {
                          placeholder.style.display = 'none';
                        }
                        // Show fallback image
                        const fallbackImg = e.target.nextElementSibling;
                        if (fallbackImg) {
                          fallbackImg.style.display = 'block';
                        }
                      }}
                    />
                  </>
                ) : null}
                
                {imageUrl && (
                  <Image 
                    src={imageUrl} 
                    alt={post.title || 'Article'} 
                    width={300} 
                    height={224} 
                    className="w-full h-full object-cover" 
                    style={{ display: isVideo ? 'none' : 'block' }}
                    onError={(e) => {
                      console.warn('Image load error, using fallback:', e.target.src);
                      e.target.src = '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
                    }}
                  />
                )}
                
                {/* Fallback image for video posts when video fails */}
                {isVideo && (
                  <Image 
                    src="/images/3969146248009e641f454298f62e13de84ac0a09.jpg"
                    alt={post.title || 'Video Article'} 
                    width={300} 
                    height={224} 
                    className="w-full h-full object-cover" 
                    style={{ display: 'none' }}
                    onError={(e) => {
                      console.warn('Fallback image also failed to load');
                    }}
                  />
                )}
                
                {/* Video indicator */}
                {isVideo && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                    Video
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-5 pb-6">
                {/* Category Tag */}
                <div className="mb-3 sm:mb-4">
                  <span 
                    className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full"
                    style={{ 
                      backgroundColor: category?.color ? `${category.color}20` : '#E5E9FF', 
                      color: category?.color || '#4A64E6' 
                    }}
                  >
                    {category?.name || post.category || 'Uncategorized'}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-tight mb-3 sm:mb-4 line-clamp-2">
                  {post.title || 'Untitled Article'}
                </h3>
                
                {/* Metadata */}
                <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-2" style={{ marginBottom: '20px' }}>
                  <span>{post.readTime || '5 min read'}</span>
                  <span>•</span>
                  <span>{post.date || 'Recent'}</span>
                </div>
              </div>
            </motion.article>
          </Link>
        );
      })}
    </div>
  );
}
