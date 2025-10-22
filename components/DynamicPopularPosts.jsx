"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Calendar, Heart, MessageCircle, ArrowRight } from 'lucide-react';

// Loading skeleton component
const PopularPostsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
    ))}
  </div>
);

// Grid layout component
const PopularPostsGrid = ({ posts, config }) => {
  const { columns = 3, spacing = 'md', cardStyle = 'default' } = config;
  
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns]} ${spacingClasses[spacing]}`}>
      {posts.map((post, index) => (
        <motion.div
          key={post._id || index}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <PostCard post={post} config={config} />
        </motion.div>
      ))}
    </div>
  );
};

// Carousel layout component
const PopularPostsCarousel = ({ posts, config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { showCategories = true, showReadTime = true, showPublishDate = true } = config;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {posts.map((post, index) => (
            <div key={post._id || index} className="w-full flex-shrink-0">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={post.featuredImage?.url || '/images/placeholder.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-white/90 mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    {showReadTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTimeText || '5 min read'}</span>
                      </div>
                    )}
                    {showPublishDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
      >
        <ArrowRight className="w-5 h-5 text-white rotate-180" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
      >
        <ArrowRight className="w-5 h-5 text-white" />
      </button>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Featured layout component (large featured post + smaller side posts)
const PopularPostsFeatured = ({ posts, config }) => {
  const { showCategories = true, showReadTime = true, showPublishDate = true } = config;
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Featured post */}
      <div className="lg:col-span-2">
        <motion.div
          className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden group cursor-pointer"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={featuredPost?.featuredImage?.url || '/images/placeholder.jpg'}
            alt={featuredPost?.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            {showCategories && featuredPost?.categories?.[0] && (
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-3">
                {featuredPost.categories[0].name}
              </span>
            )}
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 line-clamp-2">
              {featuredPost?.title}
            </h2>
            {featuredPost?.excerpt && (
              <p className="text-white/90 mb-4 line-clamp-3 text-lg">
                {featuredPost.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-white/80">
              {showReadTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{featuredPost?.readingTimeText || '5 min read'}</span>
                </div>
              )}
              {showPublishDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(featuredPost?.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Side posts */}
      <div className="space-y-4">
        {sidePosts.map((post, index) => (
          <motion.div
            key={post._id || index}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex h-24">
              <div className="relative w-24 h-full flex-shrink-0">
                <Image
                  src={post.featuredImage?.url || '/images/placeholder.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-3">
                <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {showReadTime && (
                    <span>{post.readingTimeText || '5 min read'}</span>
                  )}
                  {showPublishDate && (
                    <span>• {new Date(post.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Individual post card component
const PostCard = ({ post, config }) => {
  const { 
    showCategories = true, 
    showReadTime = true, 
    showPublishDate = true, 
    showAuthor = false,
    showExcerpt = true,
    cardStyle = 'default'
  } = config;

  const cardStyles = {
    default: 'bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300',
    minimal: 'bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-300',
    elevated: 'bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300',
    outlined: 'bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors duration-300'
  };

  return (
    <Link href={`/content/${post.slug}`} className="block">
      <motion.article 
        className={`${cardStyles[cardStyle]} cursor-pointer group`}
        whileHover={{ 
          scale: 1.02,
          y: -5,
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 20
          }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image */}
        <div className="h-48 sm:h-56 rounded-t-xl overflow-hidden">
          <Image
            src={post.featuredImage?.url || '/images/placeholder.jpg'}
            alt={post.title}
            width={300}
            height={224}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Category Tag */}
          {showCategories && post.categories?.[0] && (
            <div className="mb-3 sm:mb-4">
              <span 
                className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full"
                style={{ 
                  backgroundColor: post.categories[0].color ? `${post.categories[0].color}20` : '#E5E9FF',
                  color: post.categories[0].color || '#4A64E6'
                }}
              >
                {post.categories[0].name}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-tight mb-3 sm:mb-4 line-clamp-2">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          
          {/* Author */}
          {showAuthor && post.author && (
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{post.author.fullname}</span>
            </div>
          )}
          
          {/* Metadata */}
          <div className="text-gray-600 text-xs sm:text-sm space-y-1">
            {showReadTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readingTimeText || '5 min read'}</span>
              </div>
            )}
            {showPublishDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

// Main component
export default function DynamicPopularPosts({ section }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { limit, timeframe, algorithm, postType } = section.config;
        
        // Build query parameters
        const params = new URLSearchParams({
          limit: limit.toString(),
          timeframe,
          algorithm,
          postType
        });

        const response = await fetch(`/api/v1/analytics/popular-posts?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch popular posts');
        }
      } catch (error) {
        console.error('Error fetching popular posts:', error);
        setError(error.message);
        // Fallback to empty array
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (section?.config) {
      fetchPopularPosts();
    }
  }, [section?.config]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {section?.title || 'Popular Posts'}
            </h2>
            {section?.description && (
              <p className="text-gray-600 mt-4">{section.description}</p>
            )}
          </div>
          <PopularPostsSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {section?.title || 'Popular Posts'}
            </h2>
            <p className="text-red-600">Error loading posts: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {section?.title || 'Popular Posts'}
            </h2>
            <p className="text-gray-600">No popular posts available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            {section?.title || 'Popular Posts'}
          </h2>
          {section?.description && (
            <p className="text-gray-600 mt-4">{section.description}</p>
          )}
        </div>

        {/* Content based on layout */}
        {section?.config?.layout === 'grid' && (
          <PopularPostsGrid posts={posts} config={section.config} />
        )}
        {section?.config?.layout === 'carousel' && (
          <PopularPostsCarousel posts={posts} config={section.config} />
        )}
        {section?.config?.layout === 'featured' && (
          <PopularPostsFeatured posts={posts} config={section.config} />
        )}
        {!section?.config?.layout && (
          <PopularPostsGrid posts={posts} config={section.config} />
        )}
      </div>
    </section>
  );
}



