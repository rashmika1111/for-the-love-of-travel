"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoAwarePostCard from './VideoAwarePostCard';

// Loading skeleton for the featured posts grid
const FeaturedPostsSkeleton = () => (
  <div className="container mx-auto">
    {/* Mobile skeleton */}
    <div className="block lg:hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
        ))}
      </div>
    </div>

    {/* Desktop skeleton */}
    <div className="hidden lg:block">
      <div className="flex justify-center">
        <div
          style={{
            width: "1400px",
            margin: "0 auto",
            marginTop: "20px",
            position: "relative",
            minHeight: "80vh",
          }}
        >
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-200 animate-pulse rounded-xl h-60"></div>
            <div className="bg-gray-200 animate-pulse rounded-xl h-60"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
            <div className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
            <div className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
            <div className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


// Transform API post data to match PostCard component expectations (same as DynamicLatestPosts)
const transformPost = (post) => {
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

  console.log('=== TRANSFORMING FEATURED POST ===');
  console.log('Title:', post.title);
  console.log('Original excerpt:', post.excerpt);
  console.log('Original description:', post.description);
  console.log('Original summary:', post.summary);
  console.log('Original body preview:', post.body?.substring(0, 100));
  console.log('Original featuredImage:', post.featuredImage);
  console.log('Original featuredMedia:', post.featuredMedia);
  console.log('Final imageUrl:', imageUrl);
  console.log('Original categories:', post.categories);
  console.log('Final categoryName:', categoryName);
  console.log('Original author:', post.author);
  console.log('Final authorName:', authorName);
  console.log('Date fields - publishedAt:', post.publishedAt, 'createdAt:', post.createdAt);
  console.log('========================');
  
  // Create a better excerpt by trying multiple fields and creating a fallback
  let excerpt = post.excerpt || post.description || post.summary || post.metaDescription || '';
  
  // If no excerpt is available, create one from body
  if (!excerpt && post.body) {
    // Remove HTML tags and get first 150 characters
    const cleanBody = post.body.replace(/<[^>]*>/g, '').trim();
    excerpt = cleanBody.length > 150 ? cleanBody.substring(0, 150) + '...' : cleanBody;
  }
  
  // If still no excerpt, try to create one from title
  if (!excerpt && post.title) {
    excerpt = `Explore ${post.title.toLowerCase()} and discover amazing travel experiences.`;
  }
  
  // Final fallback
  if (!excerpt) {
    excerpt = 'Discover more about this amazing travel destination and experience.';
  }
  
  console.log('Final excerpt for', post.title, ':', excerpt);

  return {
    _id: post._id,
    title: post.title || 'Untitled',
    excerpt: excerpt,
    image: imageUrl,
    author: authorName,
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'),
    readTime: post.readingTime ? `${post.readingTime} min read` : '5 min read',
    slug: post.slug,
    category: categoryName, // Single category for PostCard component
    categories: post.categories || [],
    // Keep original API structure for PostCard component (same as DynamicLatestPosts)
    featuredImage: imageUrl,
    featuredMedia: post.featuredMedia ? {
      ...post.featuredMedia,
      url: imageUrl
    } : undefined
  };
};

export default function DynamicFeaturedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/api/v1/posts?limit=7&status=published&sortBy=publishedAt&sortOrder=desc&t=${Date.now()}`);
        const data = await response.json();
        
        if (data.success) {
          console.log('Featured posts API response:', data);
          console.log('First post data structure:', data.data[0]);
          
          // Transform the API data to match PostCard component expectations
          const transformedPosts = data.data.map(transformPost);
          setPosts(transformedPosts);
        } else {
          throw new Error(data.message || 'Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching featured posts:', err);
        setError(err.message);
        
        // Fallback to static data if API fails
        const fallbackPosts = [
          {
            _id: 'fallback-1',
            title: "Amazing Travel Destination",
            excerpt: "Discover the beauty of this incredible place",
            image: "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg",
            author: "Travel Writer",
            date: "2024-01-15",
            readTime: "5 min read",
            slug: "amazing-travel-destination",
            category: "Travel"
          },
          {
            _id: 'fallback-2',
            title: "Hidden Gems Around the World",
            excerpt: "Explore places that most tourists never see",
            image: "/images/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg",
            author: "Adventure Seeker",
            date: "2024-01-10",
            readTime: "7 min read",
            slug: "hidden-gems-around-the-world",
            category: "Adventure"
          },
          {
            _id: 'fallback-3',
            title: "Cultural Experiences",
            excerpt: "Immerse yourself in local traditions",
            image: "/images/3969146248009e641f454298f62e13de84ac0a09.jpg",
            author: "Culture Enthusiast",
            date: "2024-01-05",
            readTime: "6 min read",
            slug: "cultural-experiences",
            category: "Culture"
          },
          {
            _id: 'fallback-4',
            title: "Budget Travel Tips",
            excerpt: "How to travel the world without breaking the bank",
            image: "/images/0ef79490733114b35273ae93b13e8ebc24870d94.png",
            author: "Budget Traveler",
            date: "2024-01-01",
            readTime: "8 min read",
            slug: "budget-travel-tips",
            category: "Budget"
          },
          {
            _id: 'fallback-5',
            title: "Solo Travel Adventures",
            excerpt: "The freedom and growth of traveling alone",
            image: "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg",
            author: "Solo Explorer",
            date: "2023-12-28",
            readTime: "9 min read",
            slug: "solo-travel-adventures",
            category: "Solo Travel"
          },
          {
            _id: 'fallback-6',
            title: "Food and Travel",
            excerpt: "Culinary adventures around the globe",
            image: "/images/3abf26dd585632b9d05dcfd0daffacedd55842f5.jpg",
            author: "Food Blogger",
            date: "2023-12-25",
            readTime: "6 min read",
            slug: "food-and-travel",
            category: "Food"
          },
          {
            _id: 'fallback-7',
            title: "Photography While Traveling",
            excerpt: "Capture memories that last a lifetime",
            image: "/images/3969146248009e641f454298f62e13de84ac0a09.jpg",
            author: "Travel Photographer",
            date: "2023-12-20",
            readTime: "7 min read",
            slug: "photography-while-traveling",
            category: "Photography"
          }
        ];
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section id="stories" className="py-12 sm:py-16 lg:py-20">
        <FeaturedPostsSkeleton />
      </section>
    );
  }

  if (error && posts.length === 0) {
    return (
      <section id="stories" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="text-center text-gray-500 text-lg">
            Failed to load featured posts. Please try again later.
          </div>
          <div className="text-center text-red-500 text-sm mt-2">
            Error: {error}
          </div>
        </div>
      </section>
    );
  }

  // Ensure we have at least 7 posts for the layout
  const displayPosts = posts.slice(0, 7);
  const paddedPosts = [...displayPosts];
  while (paddedPosts.length < 7) {
    paddedPosts.push({
      _id: `empty-${paddedPosts.length}`,
      title: "Coming Soon",
      excerpt: "More amazing content is on the way",
      image: "/images/3969146248009e641f454298f62e13de84ac0a09.jpg",
      author: "Editor",
      date: "Soon",
      readTime: "TBD",
      slug: "coming-soon",
      category: "Coming Soon",
      isEmpty: true
    });
  }

  return (
    <section id="stories" className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto">
        {/* Mobile: Responsive grid layout */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {displayPosts.slice(0, 6).map((post, index) => (
              <motion.div
                key={post._id || index}
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                 <VideoAwarePostCard 
                   post={post} 
                   variant="latest" 
                   width="100%"
                   height="280px"
                 />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: Upscaled centered 1400px canvas */}
        <div className="hidden lg:block">
          <div className="flex justify-center">
            <div
              style={{
                width: "1400px",
                margin: "0 auto",
                marginTop: "20px",
                position: "relative",
                minHeight: "80vh",
              }}
            >
              {/* Row 1 - Absolute positioned cards */}
              <div
                style={{
                  position: "relative",
                  height: "480px",
                  marginBottom: "72px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-60px",
                    left: "6px",
                    zIndex: 2,
                    gap: "12px",
                    marginRight: "24px",
                  }}
                >
                   <VideoAwarePostCard
                     post={paddedPosts[0]}
                     variant="latest"
                     width="624px"
                     height="240px"
                   />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "-60px",
                    left: "642px",
                    zIndex: 1,
                    marginLeft: "24px",
                  }}
                >
                   <VideoAwarePostCard
                     post={paddedPosts[1]}
                     variant="latest"
                     width="624px"
                     height="240px"
                   />
                </div>
              </div>

              {/* Row 2 - Grid layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2fr",
                  gap: "18px",
                  marginTop: "-348px",
                  marginBottom: "24px",
                }}
              >
                 <VideoAwarePostCard
                   post={paddedPosts[2]}
                   variant="latest"
                   width="540px"
                   height="300px"
                 />
                 <VideoAwarePostCard
                   post={paddedPosts[3]}
                   variant="latest"
                   width="420px"
                   height="300px"
                 />
                 <VideoAwarePostCard
                   post={paddedPosts[4]}
                   variant="latest"
                   width="300px"
                   height="240px"
                 />
              </div>

              {/* Row 3 - Custom layout with absolute positioning */}
              <div
                style={{ position: "relative", height: "480px", marginTop: "18px" }}
              >
                 <VideoAwarePostCard
                   post={paddedPosts[5]}
                   variant="latest"
                   width="984px"
                   height="336px"
                 />
                <div
                  style={{
                    position: "absolute",
                    top: "-60px",
                    left: "1002px",
                    zIndex: 1,
                  }}
                >
                   <VideoAwarePostCard
                     post={paddedPosts[6]}
                     variant="latest"
                     width="300px"
                     height="396px"
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
