'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import DynamicNavbar from '../../components/DynamicNavbar'
import HeroSection from '../../components/HeroSection.jsx'
import NewSection from '../../components/NewSection.jsx'
import NewsCard from '../../components/NewsCard.jsx'
import DestinationGrid from '../../components/DestinationGrid.jsx'
import PopularPostCard from '../../components/PopularPostCard.jsx'
import FramerCard from '../../components/FramerCard.jsx'
import VideoCard from '../../components/VideoCard.jsx'
import Newsletter from '../../components/Newsletter.jsx'
import Footer from '../../components/Footer.jsx'
import { postsApi } from '../../lib/api'



export default function DestinationPage() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [cards, setCards] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  
  // Refs for scroll animations
  const contentRef = useRef(null);
  const newSectionRef = useRef(null);
  const popularPostRef = useRef(null);
  const videoSectionRef = useRef(null);
  const framerCardRef = useRef(null);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const framerCards = [
    { id: 1, image: "/framer1.png", title: "Explore Destinations", description: "Discover amazing places", category: "Tour", readTime: "8 min read", date: "Dec 15, 2024" },
    { id: 2, image: "/framer2.png", title: "Adventure Guide", description: "Thrilling activities await", category: "Adventure", readTime: "6 min read", date: "Dec 12, 2024" },
    { id: 3, image: "/framer3.png", title: "Cultural Experiences", description: "Immerse in local traditions", category: "Culture", readTime: "7 min read", date: "Dec 10, 2024" },
  ];

  // Mock data for popular posts as fallback
  const mockPopularPosts = [
    {
      id: "mock-1",
      image: "/popular1.jpg",
      title: "Hidden Gems of Southeast Asia: 10 Secret Destinations You Must Visit",
      description: "Discover breathtaking locations off the beaten path that most travelers never see. From pristine beaches to ancient temples, explore the untouched beauty of Southeast Asia.",
      category: "Adventure",
      readTime: "8 min read",
      date: "Dec 20, 2024"
    },
    {
      id: "mock-2", 
      image: "/popular2.jpg",
      title: "The Ultimate Guide to Solo Travel: Safety Tips and Must-Visit Places",
      description: "Everything you need to know about traveling alone safely and confidently. Learn essential tips, best destinations for solo travelers, and how to make meaningful connections on the road.",
      category: "Travel",
      readTime: "12 min read", 
      date: "Dec 18, 2024"
    },
    {
      id: "mock-3",
      image: "/popular3.jpg", 
      title: "Culinary Adventures: Street Food Tours Around the World",
      description: "Embark on a delicious journey through the world's most vibrant street food scenes. From Bangkok's night markets to Mexico City's taco stands, taste authentic flavors that define cultures.",
      category: "Food",
      readTime: "6 min read",
      date: "Dec 16, 2024"
    },
    {
      id: "mock-4",
      image: "/popular1.jpg",
      title: "Sustainable Travel: How to Explore the World Responsibly",
      description: "Learn how to minimize your environmental impact while traveling. Discover eco-friendly accommodations, carbon offset programs, and sustainable tourism practices that help preserve our planet.",
      category: "Sustainability", 
      readTime: "10 min read",
      date: "Dec 14, 2024"
    }
  ];

  // Mock data for popular videos as fallback
  const mockPopularVideos = [
    {
      id: "video-mock-1",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      thumbnail: "/vi.png",
      title: "Amazing Waterfalls of Iceland: A Cinematic Journey",
      description: "Experience the raw power and beauty of Iceland's most spectacular waterfalls through stunning cinematography and immersive storytelling.",
      duration: "8:45",
      content: "Join us on an epic adventure through Iceland's most breathtaking waterfalls, from the mighty Gullfoss to the hidden gems of the Highlands.",
      metadata: "Views: 2.3M • Likes: 45K • 2 days ago"
    },
    {
      id: "video-mock-2",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      thumbnail: "/vi.png",
      title: "Tokyo Street Food Adventure: 24 Hours of Delicious Discoveries",
      description: "Dive into Tokyo's vibrant street food scene as we explore hidden alleys and taste authentic Japanese flavors that will blow your mind.",
      duration: "12:30",
      content: "From sizzling takoyaki to fresh sushi, discover the best street food spots in Tokyo that locals don't want tourists to know about.",
      metadata: "Views: 1.8M • Likes: 32K • 5 days ago"
    },
    {
      id: "video-mock-3",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
      thumbnail: "/vi.png",
      title: "Safari in Kenya: Close Encounters with Africa's Big Five",
      description: "Get up close and personal with Africa's most magnificent wildlife in this thrilling safari adventure through Kenya's national parks.",
      duration: "15:20",
      content: "Witness lions, elephants, rhinos, and more in their natural habitat as we explore the vast savannas of Kenya's most famous wildlife reserves.",
      metadata: "Views: 3.1M • Likes: 67K • 1 week ago"
    },
    {
      id: "video-mock-4",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4",
      thumbnail: "/vi.png",
      title: "Santorini Sunset Magic: A Greek Island Paradise",
      description: "Experience the legendary sunsets of Santorini as we explore this iconic Greek island's white-washed villages and crystal-clear waters.",
      duration: "6:15",
      content: "From Oia's famous sunset views to hidden beaches and traditional villages, discover why Santorini is considered one of the world's most romantic destinations.",
      metadata: "Views: 4.2M • Likes: 89K • 3 days ago"
    }
  ];

  // Fetch data from backend using postsApi
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await postsApi.getLatestPostCards(7); // Get 7 latest post cards for the grid
        const posts = response.data || [];
        
        // Debug: Log the first post to see the data structure
        if (posts.length > 0) {
          console.log('Sample post data:', posts[0]);
        }
        
        // Map backend Post data to card format expected by DestinationGrid
        const mappedCards = posts.map((post) => ({
          id: post._id,
          slug: post.slug, // Add slug for dynamic routing
          image: post.featuredImage, // featuredImage is already a base64 string
          featuredMedia: post.featuredMedia, // Add featuredMedia for video support
          title: post.title,
          description: post.excerpt || post.body?.replace(/<[^>]*>/g, '').substring(0, 150) + '...', // Use excerpt or strip HTML from body
          readTime: post.readingTimeText || (post.readingTime ? `${post.readingTime} min read` : '5 min read'),
          categories: post.categories || [], // Pass all categories instead of just the first one
          category: post.categories?.[0]?.name || 'Travel', // Keep for backward compatibility
          publishedDate: post.formattedPublishedDate || (post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) : new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }))
        }));
        
        setCards(mappedCards);
      } catch (err) {
        console.error("Error fetching cards:", err);
        // Set empty array as fallback to prevent errors
        setCards([]);
      }
    };

    fetchCards();
  }, []);

  // Fetch popular posts
  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await postsApi.getPopularPosts(4, '30d'); // Get 4 popular posts from last 30 days
        const posts = response.data || [];
        
        // Map backend Post data to popular post format
        const mappedPopularPosts = posts.map((post) => ({
          id: post._id,
          image: post.featuredImage || "/popular1.jpg", // featuredImage is already a base64 string
          title: post.title,
          description: post.excerpt || post.body?.replace(/<[^>]*>/g, '').substring(0, 150) + '...', // Use excerpt or strip HTML from body
          category: post.categories?.[0]?.name || 'Travel',
          readTime: post.readingTimeText || (post.readingTime ? `${post.readingTime} min read` : '5 min read'),
          date: post.formattedPublishedDate || new Date(post.publishedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        }));
        
        // Use backend data if available, otherwise use mock data
        setPopularPosts(mappedPopularPosts.length > 0 ? mappedPopularPosts : mockPopularPosts);
      } catch (err) {
        console.error("Error fetching popular posts:", err);
        // Use mock data as fallback when API fails
        setPopularPosts(mockPopularPosts);
      }
    };

    fetchPopularPosts();
  }, []);

  // Fetch popular videos (using posts as videos for now)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await postsApi.getPopularPosts(4, '30d'); // Get 4 popular posts as videos
        const posts = response.data || [];
        
        // Map backend Post data to video format
        const mappedVideos = posts.map((post) => ({
          id: post._id,
          videoSrc: "", // No video URL for now
          thumbnail: post.featuredImage || "/vi.png", // featuredImage is already a base64 string
          title: post.title,
          description: post.excerpt || post.body?.replace(/<[^>]*>/g, '').substring(0, 150) + '...', // Use excerpt or strip HTML from body
          duration: "5:30", // Default duration
          content: post.excerpt || post.body?.replace(/<[^>]*>/g, '').substring(0, 150) + '...', // Use excerpt or strip HTML from body
          metadata: `Views: ${post.viewCount || 0} • Likes: ${post.likeCount || 0} • ${post.formattedPublishedDate || new Date(post.publishedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} ago`
        }));
        
        // Use backend data if available, otherwise use mock data
        setVideos(mappedVideos.length > 0 ? mappedVideos : mockPopularVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
        // Use mock data as fallback when API fails
        setVideos(mockPopularVideos);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <style jsx>{`
      
        .container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

       
        .news-section,
        .hero-section,
        .content-section,
        .popular-post-section,
        .framer-section,
        .video-section {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 1rem;
        }

      
        .new-section {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important; 
          padding: 0 1rem !important;
        }

        .main-video {
          width: 100% !important;
          max-width: 100% !important;
          margin: 10px auto !important;
          transform: scale(1.45) !important;
        }

        /* ==============================
           Responsive (Tablet: ≤1024px)
        ================================ */
        @media (max-width: 1024px) {
          .container {
            padding: 0 1rem;
          }

          .news-section {
            flex-direction: column !important;
            gap: 2rem !important;
          }

          .news-cards,
          .new-section {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
        }

        /* ==============================
           Responsive (Mobile: ≤768px)
        ================================ */
        @media (max-width: 768px) {
          .container {
            padding: 0 0.5rem;
          }

          .hero-section {
            margin: 0 auto !important;
            padding: 0 1rem !important;
          }

          .content-section {
            padding: 1rem !important;
          }

          .news-section {
            margin-top: 2rem !important;
            gap: 1.5rem !important;
          }

          .news-cards,
          .new-section {
            margin: 0 auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }

          .latest-post-title {
            flex-direction: column !important;
            align-items: center !important;
            gap: 1rem !important;
            margin: 2rem auto 0 !important;
            display: flex !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* More specific selector to override Tailwind */
          .flex.latest-post-title {
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* Target the h2 element specifically for mobile centering */
          .latest-post-title h2 {
            text-align: center !important;
            margin: 0 auto !important;
          }

          .destination-grid {
            margin: 1rem 0 2rem !important;
          }

          .popular-post-section {
            padding: 2rem 1rem !important;
            min-height: auto !important;
            margin-top: 6rem !important;
          }

          .popular-post-title {
            margin: 0 0 2rem 0 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .popular-post-cards {
            gap: 2rem !important;
          }

          /* Hide 5th card in popular posts on mobile */
          .popular-post-cards > div:nth-child(5) {
            display: none !important;
          }

          .framer-section {
            flex-direction: column !important;
            min-height: auto !important;
            padding: 2rem 1rem !important;
            margin-top: 4rem !important;
          }

          /* Override inline style for mobile */
          .framer-section[style*="marginTop"] {
            margin-top: 4rem !important;
          }

          .framer-content {
            order: 2 !important;
            max-width: 100% !important;
            margin-top: 2rem !important;
          }

          .framer-cards {
            order: 1 !important;
            width: 100% !important;
          }

          .video-section {
            padding: 2rem 1rem !important;
            margin-top: 6rem !important;
          }

          .video-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }

          .video-sidebar {
            grid-template-rows: repeat(3, auto) !important;
            gap: 1rem !important;
          }

          .main-video {
            margin: 1rem auto !important;
            width: 100% !important;
            max-width: 100% !important;
            transform: none !important;
          }
        }

        /* ==============================
           Responsive (Small Mobile: ≤480px)
        ================================ */
        @media (max-width: 480px) {
          .container {
            padding: 0 0.25rem;
          }

          .content-section {
            padding: 0.5rem !important;
          }

          .news-section {
            margin-top: 1rem !important;
            gap: 1rem !important;
          }

          .news-cards,
          .new-section {
            margin: 0 auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }

          .latest-post-title h2 {
            font-size: 1.5rem !important;
          }

          .latest-post-title {
            align-items: center !important;
            display: flex !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* More specific selector to override Tailwind */
          .flex.latest-post-title {
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* Target the h2 element specifically for mobile centering */
          .latest-post-title h2 {
            text-align: center !important;
            margin: 0 auto !important;
          }

          .popular-post-section {
            padding: 1rem 0.5rem !important;
            margin-top: 7.5rem !important;
          }

          .popular-post-title h2 {
            font-size: 1.5rem !important;
          }

          /* Hide 5th card in popular posts on small mobile */
          .popular-post-cards > div:nth-child(5) {
            display: none !important;
          }

          .framer-section {
            padding: 1rem 0.5rem !important;
            margin-top: 5rem !important;
          }

          /* Override inline style for small mobile */
          .framer-section[style*="marginTop"] {
            margin-top: 5rem !important;
          }

          .video-section {
            padding: 1rem 0.5rem !important;
            margin-top: 6rem !important;
          }

          .main-video {
            margin: 0.5rem auto !important;
            width: 100% !important;
            transform: none !important;
          }
        }
      `}</style>
      <main className="min-h-screen overflow-x-hidden">
      <div 
        className="w-full h-full"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          transformOrigin: 'top left'
        }}
      >
        <DynamicNavbar />
        <HeroSection title="Destinations" />
      
      {/* Content Section */}
      <motion.div 
        ref={contentRef}
        className="p-4 sm:p-6 lg:p-10 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Destination Page
          </h2>
        </motion.div>
        
        {/* NewSection and NewsCards - Responsive Layout */}
        <motion.div 
          ref={newSectionRef}
          className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6 mt-8 lg:mt-12 news-section"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* NewSection Component - Left side */}
          <motion.div
            className="w-full lg:w-auto lg:flex-shrink-0 new-section new-section-desktop"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
              gap: '1200px'
            }}
          >
            <NewSection />
          </motion.div>

          {/* NewsCards - Merged Section */}
          <motion.div 
            className="flex flex-col gap-4 lg:gap-6 w-full lg:w-auto items-start news-cards news-cards-desktop"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              maxWidth: '450px',
              margin: '0 auto',
              gap: '35px'
            }}
          >
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </motion.div>
        </motion.div>

        {/* Latest Post Title - Below NewsCards */}
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-0 latest-post-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            marginTop: '2rem',
            display: 'flex !important',
            justifyContent: 'center !important',
            alignItems: 'center !important',
            textAlign: 'center !important'
          }}
        >
          {/* Title */}
          <motion.h2 
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-center sm:text-left ml-0 sm:ml-6 lg:ml-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Latest Post
          </motion.h2>

          {/* Golden Line */}
          <motion.div 
            className="w-32 sm:w-40 lg:w-48 h-0 border-t-4 border-[#D2AD3F] rounded-lg"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
          </motion.div>
        </motion.div>

        {/* LatestPostCard Grid with Data Fetching and Pagination */}
        <motion.div
          className="destination-grid"
          style={{ marginTop: "220px", marginBottom: "60px" }}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Pass fetched data as props */}
          <DestinationGrid
            card1={cards[0]}
            card2={cards[1]}
            card3={cards[2]}
            card4={cards[3]}
            card5={cards[4]}
            card6={cards[5]}
            card7={cards[6]}
          />

          {/* Pagination */}
          <motion.div
            className="flex justify-center items-center gap-2 sm:gap-4 -mt-16 sm:-mt-20 lg:-mt-20 mb-8 lg:mb-12 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* left arrow */}
            <motion.button
              className="bg-transparent border-none text-gray-600 text-sm sm:text-lg cursor-pointer p-2 hover:text-[#D2AD3F]"
              whileHover={{ scale: 1.2, color: "#D2AD3F" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {"<"}
            </motion.button>

            {/* numbers */}
            <motion.div
              className="flex gap-2 sm:gap-4 items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.span
                className="text-gray-600 text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.2, color: "#D2AD3F" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                1
              </motion.span>
              <motion.span
                className="text-gray-600 text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.2, color: "#D2AD3F" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                2
              </motion.span>
              <motion.span
                className="text-black text-sm sm:text-base font-bold bg-[#D2AD3F] px-2 py-1 rounded cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                3
              </motion.span>
              <motion.span
                className="text-gray-600 text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.2, color: "#D2AD3F" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                4
              </motion.span>
              <motion.span
                className="text-gray-600 text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.2, color: "#D2AD3F" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                5
              </motion.span>
              <motion.span
                className="text-gray-600 text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.2, color: "#D2AD3F" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                6
              </motion.span>
            </motion.div>

            {/* right arrow */}
            <motion.button
              className="bg-transparent border-none text-gray-600 text-sm sm:text-lg cursor-pointer p-2 hover:text-[#D2AD3F]"
              whileHover={{ scale: 1.2, color: "#D2AD3F" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {">"}
            </motion.button>
          </motion.div>
        </motion.div>
        
      </motion.div>

      {/* Popular Post Section with Gradient Background */}
      <motion.div 
        ref={popularPostRef}
        className="py-16 lg:py-24 my-0 mb-16 lg:mb-24 popular-post-section"
        style={{
          background: 'linear-gradient(102.91deg, rgba(247, 236, 213, 0.45) 1.8%, rgba(238, 201, 249, 0.45) 99.54%)',
          minHeight: '150vh',
          marginTop: '6rem'
        }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 lg:mb-12 px-4 sm:px-6 lg:px-0 popular-post-title"
          style={{ marginTop: '-80px', marginBottom: '80px' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Title  popular post*/}
          <motion.h2 
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-left ml-0 sm:ml-6 lg:ml-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Popular Post
          </motion.h2>

          {/* Golden Line */}
          <motion.div 
            className="w-32 sm:w-40 lg:w-48 h-0 border-t-4 border-[#D2AD3F] rounded-lg"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
          </motion.div>
        </motion.div>

        {/* Popular Post Cards */}
        <motion.div 
          className="flex flex-col items-center px-4 sm:px-6 lg:px-0 popular-post-cards"
          style={{ gap: '180px' }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {popularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.6 + (index * 0.1), ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <PopularPostCard 
                image={post.image}
                title={post.title}
                description={post.description}
                category={post.category}
                readTime={post.readTime}
                date={post.date}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* View More Button */}
        <motion.div 
          className="flex items-end px-4 sm:px-6 lg:px-0"
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            marginTop: '50px',
            marginBottom: '-50px',
            marginRight: '-50px',
            marginLeft: '350px',
            paddingTop: '40px',
            justifyContent: 'center',
            paddingLeft: '50%'
          }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.button 
            className="w-40 sm:w-48 lg:w-52 h-12 lg:h-14 px-4 lg:px-6 py-2 lg:py-3 gap-2 lg:gap-3 rounded-2xl bg-[#3514EE] border-none text-white text-sm lg:text-base font-semibold cursor-pointer flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              y: -3,
              boxShadow: '0 8px 20px rgba(53, 20, 238, 0.4)',
              background: '#2A0FCC'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            View More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Framer Card Section with Left Content */}
      <motion.div 
        ref={framerCardRef}
        className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-start items-center min-h-screen lg:h-screen px-4 sm:px-6 lg:px-14 py-8 lg:py-0 framer-section"
        style={{ marginTop: '-150px',marginBottom: '-105px' }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Content Section - Left Side */}
        <motion.div 
          className="flex flex-col gap-4 max-w-full lg:max-w-md order-2 lg:order-1 framer-content"
          initial={{ opacity: 0, x: -100, rotateY: -15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h1 
            className="font-inter font-semibold text-sm sm:text-base lg:text-xl leading-tight tracking-wide text-black -mt-0 lg:-mt-32"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Waves & Whispers: Sri Lanka's Hidden Coves
          </motion.h1>
          <motion.p 
            className="font-inter font-normal text-xs sm:text-sm leading-5 tracking-wide text-gray-600 mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            A barefoot journey through quiet blue shores   A barefoot journey through quiet blue shores
            A barefoot journey through quiet blue shores
          </motion.p>
        </motion.div>

        {/* FramerCard Section - Right Side */}
        <motion.div 
          className="flex flex-col sm:flex-row lg:flex-row gap-4 lg:gap-6 order-1 lg:order-2 w-full lg:w-auto framer-cards"
          initial={{ opacity: 0, x: 100, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {framerCards.map((card, index) => (
            <FramerCard
              key={card.id}
              id={card.id}
              image={card.image}
              title={card.title}
              description={card.description}
              category={card.category}
              readTime={card.readTime}
              date={card.date}
              selected={selected}
              setSelected={setSelected}
              hovered={hovered}
              setHovered={setHovered}
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Popular Videos Section with Gradient Background */}
      <motion.div 
        ref={videoSectionRef}
        className="py-8 lg:py-12 my-0 mb-0 video-section"
        style={{
          background: 'linear-gradient(102.91deg, rgba(247, 236, 213, 0.45) 1.8%, rgba(238, 201, 249, 0.45) 99.54%)',
          marginTop: '6rem'
        }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 lg:mb-12 px-4 sm:px-6 lg:px-0"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Title Popular Videos */}
          <motion.h2 
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-left ml-0 sm:ml-6 lg:ml-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Popular Videos
          </motion.h2>

          {/* Golden Line */}
          <motion.div 
            className="w-32 sm:w-40 lg:w-48 h-0 border-t-4 border-[#D2AD3F] rounded-lg"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
          </motion.div>
        </motion.div>

        {/* Video Card Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-8 lg:mt-12 mb-8 lg:mb-12 px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8 video-container">
          {/* Left Side - 3 Video Cards Vertical */}
          <div 
            className="flex flex-col gap-4 lg:gap-6 w-full lg:w-auto lg:max-w-md video-sidebar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginRight: '1250px',
              marginLeft: '-130px',
              width: '600px',
              maxWidth: '5000px',
              marginRight: '50px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {videos.slice(0, 3).map((video, index) => (
              <VideoCard 
                key={video.id}
                videoSrc={video.videoSrc}
                thumbnail={video.thumbnail}
                title={video.title}
                
                duration={video.duration}
                
                metadata={video.metadata}
                size="small"
              />
            ))}
          </div>

          {/* Right Side - Main Video Card */}
          <div 
            className="w-full lg:w-auto lg:flex-1 flex justify-center lg:justify-end main-video"
            style={{ 
              display: 'flex',
              transform: 'scale(1.45)',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              maxWidth: '800px',
              marginLeft: '-200px',
              marginRight: '90px',
              padding: '20px',
              position: 'relative'
            }}
          >
            {videos.slice(3, 4).map((video, index) => (
              <VideoCard 
                key={video.id}
                videoSrc={video.videoSrc}
                thumbnail={video.thumbnail}
                title={video.title}
                description={video.description}
                duration={video.duration}
                content={video.content}
                metadata={video.metadata}
                size="large"
              />
            ))}
          </div>
        </div>
        
        {/* View More Button */}
        <motion.div 
          className="flex justify-center lg:justify-end px-4 sm:px-6 lg:px-12 xl:px-16"
          style={{ marginTop: '100px', marginBottom: '0px' }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.button 
            className="w-40 sm:w-48 lg:w-52 h-12 lg:h-14 px-4 lg:px-6 py-2 lg:py-3 gap-2 lg:gap-3 rounded-2xl bg-[#3514EE] border-none text-white text-sm lg:text-base font-semibold cursor-pointer flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              y: -3,
              boxShadow: '0 8px 20px rgba(53, 20, 238, 0.4)',
              background: '#2A0FCC'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            View More
          </motion.button>
        </motion.div>

      </motion.div>

        <Newsletter />
        <Footer />
      </div>
    </main>
    </>
  )
}