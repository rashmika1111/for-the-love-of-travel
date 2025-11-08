'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx'
import HeroSection from '../../components/HeroSection.jsx'
import NewSection from '../../components/NewSection.jsx'
import NewsCard from '../../components/NewsCard.jsx'
import DestinationGrid from '../../components/DestinationGrid.jsx'
import PopularPostCard from '../../components/PopularPostCard.jsx'
import FramerCard from '../../components/FramerCard.jsx'
import VideoCard from '../../components/VideoCard.jsx'
import Newsletter from '../../components/Newsletter.jsx'
import Footer from '../../components/Footer.jsx'
import { postsApi, videosApi } from '../../lib/api'



export default function VacationPage() {
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
    { id: 1, image: "/framer1.png", title: "Tropical Paradise", description: "Escape to pristine beaches and crystal-clear waters", category: "Beach", readTime: "8 min read", date: "Dec 15, 2024" },
    { id: 2, image: "/framer2.png", title: "Mountain Retreat", description: "Recharge in serene mountain landscapes", category: "Mountains", readTime: "6 min read", date: "Dec 12, 2024" },
    { id: 3, image: "/framer3.png", title: "City Break", description: "Explore vibrant cities and urban adventures", category: "Urban", readTime: "7 min read", date: "Dec 10, 2024" },
  ];

  // Mock data for popular posts as fallback
  const mockPopularPosts = [
    {
      id: "mock-1",
      image: "/popular1.jpg",
      title: "Top 10 All-Inclusive Beach Resorts for the Perfect Vacation",
      description: "Discover the world's most luxurious all-inclusive beach resorts where every detail is taken care of. From the Maldives to the Caribbean, find your perfect tropical paradise getaway.",
      category: "Beach",
      readTime: "8 min read",
      date: "Dec 20, 2024"
    },
    {
      id: "mock-2", 
      image: "/popular2.jpg",
      title: "Family Vacation Ideas: 15 Destinations Perfect for Kids",
      description: "Plan the ultimate family vacation with our curated list of kid-friendly destinations. From theme parks to national parks, create memories that will last a lifetime.",
      category: "Family",
      readTime: "12 min read", 
      date: "Dec 18, 2024"
    },
    {
      id: "mock-3",
      image: "/popular3.jpg", 
      title: "Romantic Getaways: Honeymoon Destinations Around the World",
      description: "Celebrate your love with these enchanting honeymoon destinations. From overwater bungalows to mountain cabins, find the perfect romantic escape for your special trip.",
      category: "Romance",
      readTime: "6 min read",
      date: "Dec 16, 2024"
    },
    {
      id: "mock-4",
      image: "/popular1.jpg",
      title: "Budget Vacation Tips: How to Travel More for Less",
      description: "Learn insider secrets to planning amazing vacations without breaking the bank. Discover budget-friendly destinations, money-saving tips, and how to maximize your vacation budget.",
      category: "Budget", 
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
      title: "Maldives Paradise: Ultimate Beach Vacation Guide",
      description: "Discover the stunning beauty of the Maldives with this comprehensive guide to planning your perfect beach vacation in paradise.",
      duration: "8:45",
      content: "From overwater bungalows to pristine beaches, explore everything you need to know about vacationing in the Maldives.",
      metadata: "Views: 2.3M • Likes: 45K • 2 days ago"
    },
    {
      id: "video-mock-2",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      thumbnail: "/vi.png",
      title: "Disney World Vacation Planning: Tips for the Perfect Family Trip",
      description: "Plan the ultimate Disney World vacation with insider tips, must-see attractions, and money-saving strategies for families.",
      duration: "12:30",
      content: "Learn how to maximize your Disney experience with expert advice on dining, accommodations, and park strategies.",
      metadata: "Views: 1.8M • Likes: 32K • 5 days ago"
    },
    {
      id: "video-mock-3",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
      thumbnail: "/vi.png",
      title: "European Summer Vacation: 10 Must-Visit Cities",
      description: "Explore the most beautiful European cities perfect for your summer vacation, from Paris to Barcelona and beyond.",
      duration: "15:20",
      content: "Discover the best European destinations for summer travel, including hidden gems and popular tourist spots.",
      metadata: "Views: 3.1M • Likes: 67K • 1 week ago"
    },
    {
      id: "video-mock-4",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4",
      thumbnail: "/vi.png",
      title: "Hawaii Vacation Guide: Islands, Beaches & Adventures",
      description: "Plan your perfect Hawaii vacation with this complete guide to the islands, beaches, and unforgettable adventures.",
      duration: "6:15",
      content: "From Maui's Road to Hana to Oahu's Pearl Harbor, discover all the must-see attractions and activities in Hawaii.",
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
          image: post.featuredImage?.url,
          title: post.title,
          description: post.excerpt,
          readTime: post.readingTimeText || (post.readingTime ? `${post.readingTime} min read` : '5 min read'),
          category: post.categories?.[0]?.name || 'Travel',
          publishedDate: post.formattedPublishedDate || new Date(post.publishedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
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
          image: post.featuredImage?.url || "/popular1.jpg",
          title: post.title,
          description: post.excerpt,
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

  // Fetch popular videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await videosApi.getPopularVideos(4); // Get 4 popular videos
        const posts = response.data || [];
        
        // Map backend Post data to video format
        const mappedVideos = posts.map((post) => ({
          id: post._id,
          videoSrc: post.videoUrl || "",
          thumbnail: post.featuredImage?.url || "/vi.png",
          title: post.title,
          description: post.excerpt,
          duration: post.videoDuration || "5:30",
          content: post.excerpt,
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

        .main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          width: 100%;
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

        .content-section {
          padding: 2rem 0;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .featured-content-section {
          margin: 3rem 0;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .featured-main {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .featured-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .latest-posts-section {
          margin: 3rem 0;
        }

        .popular-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

      
        .new-section {
          width: 100% !important;
          max-width: 100% !important;
          margin: 2rem auto !important; 
          margin-top: 3rem !important;
          margin-bottom: 2rem !important;
          padding: 0 1rem !important;
        }

        /* ==============================
           Desktop View (≥1025px)
        ================================ */
        @media (min-width: 1025px) {
          .new-section {
            margin: 3rem auto !important;
            margin-top: 4rem !important;
            margin-bottom: 3rem !important;
            margin-left:12rem !important;
            margin-right: 2rem !important;
          }
        }

        /* ==============================
           Large Desktop View (≥1440px)
        ================================ */
        @media (min-width: 1440px) {
          .main-container .featured-main .new-section,
          .main-container .news-main .new-section {
            margin: 2rem auto !important;
            margin-top: 3rem !important;
            margin-bottom: 2rem !important;
            margin-left: 1120px !important;
            margin-right: 100px !important;
            padding: 1rem !important;
            border-radius: 12px !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
            width: auto !important;
            max-width: none !important;
          }
        }

        .main-video {
          width: 100% !important;
          max-width: 100% !important;
          margin: 10px auto !important;
          transform: scale(1.45) !important;
        }

        /* ==============================
           Responsive Grid Section
        ================================ */
        .responsive-grid-section {
          padding: 2rem 0;
          margin: 2rem 0;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .grid-item {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          padding: 2rem 1.5rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .grid-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
        }

        .grid-item h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .grid-item p {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        /* ==============================
           Responsive (Tablet: ≤1024px)
        ================================ */
        @media (max-width: 1024px) {
          .container {
            padding: 0 1rem;
          }

          .main-container {
            padding: 0 1rem;
          }

          .responsive-grid-section {
            padding: 1.5rem 0;
          }

          .grid-container {
            gap: 1.25rem;
          }

          .featured-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .popular-posts-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .grid-item {
            padding: 1.75rem 1.25rem;
            min-height: 140px;
          }

          .new-section {
            margin: 1.5rem auto !important;
            margin-top: 2rem !important;
            margin-bottom: 1.5rem !important;
          }

          .grid-item h3 {
            font-size: 1.125rem;
          }

          .grid-item p {
            font-size: 0.85rem;
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

          .main-container {
            padding: 0 0.5rem;
          }

          .responsive-grid-section {
            padding: 1rem 0;
            margin: 1.5rem 0;
          }

          .grid-container {
            gap: 1rem;
            grid-template-columns: 1fr;
          }

          .featured-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .popular-posts-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .posts-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .grid-item {
            padding: 1.5rem 1rem;
            min-height: 120px;
            border-radius: 12px;
          }

          .new-section {
            margin: 1rem auto !important;
            margin-top: 1.5rem !important;
            margin-bottom: 1rem !important;
          }

          .grid-item h3 {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
          }

          .grid-item p {
            font-size: 0.8rem;
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

          .main-container {
            padding: 0 0.25rem;
          }

          .responsive-grid-section {
            padding: 0.75rem 0;
            margin: 1rem 0;
          }

          .grid-container {
            gap: 0.75rem;
          }

          .featured-grid {
            gap: 0.75rem;
          }

          .popular-posts-grid {
            gap: 0.75rem;
          }

          .posts-grid {
            gap: 0.75rem;
          }

          .grid-item {
            padding: 1.25rem 0.75rem;
            min-height: 100px;
            border-radius: 10px;
          }

          .new-section {
            margin: 0.75rem auto !important;
            margin-top: 1rem !important;
            margin-bottom: 0.75rem !important;
          }

          .grid-item h3 {
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }

          .grid-item p {
            font-size: 0.75rem;
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
        <Navbar />
        <HeroSection title="Vacation" />
      
      {/* Main Container */}
      <div className="main-container">
        {/* Responsive Grid Section */}
        <section className="responsive-grid-section">
          <div className="grid-container">
            <div className="grid-item">
              <h3>Beach Destinations</h3>
              <p>Discover pristine beaches and crystal-clear waters around the world</p>
            </div>
            <div className="grid-item">
              <h3>Mountain Retreats</h3>
              <p>Escape to peaceful mountain destinations for ultimate relaxation</p>
            </div>
            <div className="grid-item">
              <h3>City Adventures</h3>
              <p>Explore vibrant cities with rich culture and exciting activities</p>
            </div>
            <div className="grid-item">
              <h3>Family Fun</h3>
              <p>Perfect destinations for memorable family vacation experiences</p>
            </div>
            <div className="grid-item">
              <h3>Romantic Getaways</h3>
              <p>Intimate destinations for couples seeking romantic escapes</p>
            </div>
            <div className="grid-item">
              <h3>Adventure Tours</h3>
              <p>Thrilling experiences for adrenaline-seeking travelers</p>
            </div>
            <div className="grid-item">
              <h3>Cultural Immersion</h3>
              <p>Deep dive into local traditions and authentic experiences</p>
            </div>
            <div className="grid-item">
              <h3>Luxury Resorts</h3>
              <p>Premium accommodations with world-class amenities and service</p>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <motion.div 
          ref={contentRef}
          className="content-section"
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
            Vacation News Update
          </h2>
        </motion.div>
        
        {/* Featured Content Section */}
        <motion.div 
          ref={newSectionRef}
          className="featured-content-section"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="featured-grid">
            <motion.div
              className="featured-main"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <NewSection 
                style={{
                  margin: '2rem auto',
                  marginTop: '3rem',
                  marginBottom: '2rem',
                  marginLeft: '112px',
                  marginRight: '2rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
            </motion.div>

            <motion.div 
              className="featured-cards"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <NewsCard />
              <NewsCard />
              <NewsCard />
            </motion.div>
          </div>
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

        {/* Latest Post Cards Grid */}
        <motion.div
          className="latest-posts-section"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="posts-grid">
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
          </div>

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
          className="popular-posts-grid"
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
            Ultimate Vacation Escapes: Where Dreams Come True
          </motion.h1>
          <motion.p 
            className="font-inter font-normal text-xs sm:text-sm leading-5 tracking-wide text-gray-600 mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Discover your perfect getaway with our curated collection of vacation destinations. From tropical beaches to mountain retreats, find the ideal escape that matches your dream vacation style.
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

        </div> {/* Close main-container */}
        
        <Newsletter />
        <Footer />
      </div>
    </main>
    </>
  )
}