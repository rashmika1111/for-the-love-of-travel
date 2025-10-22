'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import DynamicNavbar from '../../components/DynamicNavbar'
import HeroSection from '../../components/HeroSection.jsx'
import NewSection from '../../components/NewSection.jsx'
import NewsCard from '../../components/NewsCard.jsx'
import DestinationGrid from '../../components/DestinationGrid.jsx'
import LatestPostCard from '../../components/LatestPostCard.jsx'
import PopularPostCard from '../../components/PopularPostCard.jsx'
import FramerCard from '../../components/FramerCard.jsx'
import VideoCard from '../../components/VideoCard.jsx'
import Newsletter from '../../components/Newsletter.jsx'
import Footer from '../../components/Footer.jsx'
import { postsApi, videosApi } from '../../lib/api.ts'



export default function TourPage() {
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
    { id: 1, image: "/tour/tou3.jpg", title: "Tropical Paradise", description: "Escape to pristine beaches and crystal-clear waters", category: "Beach", readTime: "8 min read", date: "Dec 15, 2024" },
    { id: 2, image: "/tour/tou5.jpg", title: "Mountain Retreat", description: "Recharge in serene mountain landscapes", category: "Mountains", readTime: "6 min read", date: "Dec 12, 2024" },
    { id: 3, image: "/tour/tou7.jpg", title: "City Break", description: "Explore vibrant cities and urban adventures", category: "Urban", readTime: "7 min read", date: "Dec 10, 2024" },
  ];

  // Mock data for popular posts as fallback
  const mockPopularPosts = [
    {
      id: "mock-1",
      image: "/tour/tou3.jpg",
      title: "Top 10 All-Inclusive Beach Resorts for the Perfect Vacation",
      description: "Discover the world's most luxurious all-inclusive beach resorts where every detail is taken care of. From the Maldives to the Caribbean, find your perfect tropical paradise getaway.",
      category: "Beach",
      readTime: "8 min read",
      date: "Dec 20, 2024"
    },
    {
      id: "mock-2", 
      image: "/tour/tou4.jpg",
      title: "Family Vacation Ideas: 15 Destinations Perfect for Kids",
      description: "Plan the ultimate family vacation with our curated list of kid-friendly destinations. From theme parks to national parks, create memories that will last a lifetime.",
      category: "Family",
      readTime: "12 min read", 
      date: "Dec 18, 2024"
    },
    {
      id: "mock-3",
      image: "/tour/tou5.jpg", 
      title: "Romantic Getaways: Honeymoon Destinations Around the World",
      description: "Celebrate your love with these enchanting honeymoon destinations. From overwater bungalows to mountain cabins, find the perfect romantic escape for your special trip.",
      category: "Romance",
      readTime: "6 min read",
      date: "Dec 16, 2024"
    },
    {
      id: "mock-4",
      image: "/tour/tou6.jpg",
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
      thumbnail: "/tour/tou5.jpg",
      title: "Tropical Paradise Escapes: Best Beach Vacation Destinations",
      description: "Discover the world's most stunning tropical destinations perfect for your dream beach vacation. From crystal-clear waters to pristine white sands.",
      duration: "9:30",
      content: "Explore breathtaking tropical locations including the Maldives, Bora Bora, and Seychelles. Learn about the best times to visit, accommodation options, and must-do activities.",
      metadata: "Views: 2.8M • Likes: 67K • 1 day ago"
    },
    {
      id: "video-mock-2",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      thumbnail: "/tour/tou6.jpg",
      title: "Family Vacation Planning: Kid-Friendly Destinations Worldwide",
      description: "Plan the perfect family vacation with our comprehensive guide to the most family-friendly destinations around the globe.",
      duration: "11:45",
      content: "From theme parks to national parks, discover destinations that offer fun for the whole family. Get insider tips on accommodations, activities, and budget planning.",
      metadata: "Views: 1.9M • Likes: 43K • 3 days ago"
    },
    {
      id: "video-mock-3",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
      thumbnail: "/tour/tou7.jpg",
      title: "Romantic Getaways: Honeymoon Destinations for Every Budget",
      description: "Find your perfect romantic escape with our curated list of honeymoon destinations that cater to every budget and preference.",
      duration: "13:20",
      content: "From luxury overwater bungalows to cozy mountain cabins, explore romantic destinations that will create unforgettable memories for your special trip.",
      metadata: "Views: 3.5M • Likes: 89K • 5 days ago"
    },
    {
      id: "video-mock-4",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4",
      thumbnail: "/tour/tou8.jpg",
      title: "Budget Vacation Hacks: Travel More for Less",
      description: "Learn expert money-saving strategies to maximize your vacation budget and travel to more destinations without breaking the bank.",
      duration: "7:15",
      content: "Discover budget-friendly destinations, accommodation hacks, transportation tips, and dining strategies that will help you travel more for less.",
      metadata: "Views: 4.7M • Likes: 125K • 2 days ago"
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
        const mappedPopularPosts = posts.map((post, index) => ({
          id: post._id,
          image: post.featuredImage?.url || `/vacation/vac${index + 4}${index === 0 ? '.jpeg' : '.jpg'}`,
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
        const mappedVideos = posts.map((post, index) => ({
          id: post._id,
          videoSrc: post.videoUrl || "",
          thumbnail: post.featuredImage?.url || `/vacation/vac${index + 1}${index === 3 ? '.jpeg' : '.jpg'}`,
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
        <HeroSection title="Tours" backgroundImage="/tour/tou1.webp" />
      
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        {/* Content Section */}
        <motion.div 
          ref={contentRef}
          className="py-8 sm:py-12 lg:py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
        <motion.div 
          className="text-center mb-8 sm:mb-12 lg:mb-1 mt-8 sm:mt-12 lg:mt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tour News Update
          </h2>
        </motion.div>
        
        {/* Featured Content Section - Mobile First */}
        <motion.div 
          ref={newSectionRef}
          className="py-8 sm:py-12 lg:py-16"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Mobile: Stack vertically */}
          <div className="block lg:hidden space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <NewSection image="/tour/tou3.jpg" />
            </motion.div>
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
              >
                <NewsCard image="/tour/tou2.jpg" />
              </motion.div>
            ))}
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <NewSection image="/tour/tou3.jpg" />
            </motion.div>

            <motion.div 
              className="flex flex-col gap-6"
              style={{ transform: 'translateX(-15%)',marginRight: '-110px' ,marginLeft: '-40px'  }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <NewsCard image="/vacation/vac2.jpg" />
              <NewsCard image="/vacation/vac2.jpg" />
              <NewsCard image="/vacation/vac2.jpg" />
            </motion.div>
          </div>

        </motion.div>

        {/* Latest Post Title - Mobile First */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Title */}
          <motion.h2 
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-center sm:text-left"
            style={{ marginBottom: '5px' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Latest Post
          </motion.h2>

          {/* Golden Line */}
          <motion.div 
            className="w-32 sm:w-40 lg:w-48 h-1 bg-[#D2AD3F] rounded-lg"
            style={{ marginBottom: '-50px' }}
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
          </motion.div>
        </motion.div>
        
        {/* Latest Post Cards Grid - Mobile First */}
        <motion.div
          className="py-8 sm:py-12 lg:py-16"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Mobile: Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:hidden">
            {cards.slice(0, 7).map((card, i) => (
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
                <img 
                  src={card.image || "/popular1.jpg"} 
                  alt={card.title || `Latest post ${i+1}`} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">
                    {card.title || `Latest Post ${i+1}`}
                  </h3>
                  <div className="text-white/80 text-xs">
                    {card.readTime || '5 min read'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Destination Cards - Vertical Layout */}
          <div className="lg:hidden mt-8">
            <motion.div
              className="flex flex-col gap-6 px-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Debug info */}
              {console.log('Cards length:', cards.length)}
              {console.log('Cards data:', cards)}
              
              {/* Fallback data if cards is empty */}
              {(cards.length === 0 ? [
                { id: 'fallback-1', image: '/lt1.png', title: 'Tropical Paradise', description: 'Discover amazing tropical destinations', readTime: '5 min read', category: 'Beach', publishedDate: 'Dec 15, 2024' },
                { id: 'fallback-2', image: '/lt2.png', title: 'Mountain Adventure', description: 'Explore breathtaking mountain landscapes', readTime: '7 min read', category: 'Mountains', publishedDate: 'Dec 12, 2024' },
                { id: 'fallback-3', image: '/lt3.png', title: 'City Exploration', description: 'Experience vibrant city life and culture', readTime: '6 min read', category: 'Urban', publishedDate: 'Dec 10, 2024' },
                { id: 'fallback-4', image: '/lt4.png', title: 'Cultural Heritage', description: 'Immerse yourself in rich cultural experiences', readTime: '8 min read', category: 'Culture', publishedDate: 'Dec 8, 2024' }
              ] : cards).slice(0, 4).map((card, i) => (
                <motion.div
                  key={`mobile-dest-${card.id || i}`}
                  className="w-full max-w-sm mx-auto"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + (i * 0.1),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
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
                  <LatestPostCard 
                    width="100%" 
                    height="200px" 
                    image={card.image || "/lt1.png"} 
                    title={card.title || `Destination ${i+1}`}
                    description={card.description || `Amazing destination ${i+1} description`}
                    readTime={card.readTime || '5 min read'}
                    category={card.category || 'Travel'}
                    publishedDate={card.publishedDate || 'Dec 15, 2024'}
                    onClick={() => console.log(`Mobile destination card ${i+1} clicked`)} 
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop: DestinationGrid component */}
          <div className="hidden lg:block" style={{ transform: 'translate(-100px, 100px)' }}>
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
            className="flex justify-center items-center gap-2 sm:gap-4 -mt-16 sm:-mt-20 lg:mt-8 mb-8 lg:-mb-1 px-4"
            style={{ marginTop: '10px', marginBottom: '10px' }}
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

      {/* Popular Post Section with Gradient Background - Mobile First */}
      <motion.div 
        ref={popularPostRef}
        className="py-16 lg:py-24 my-0 mb-16 lg:mb-24 mt-16 lg:mt-1 w-full"
        style={{
          background: 'linear-gradient(102.91deg, rgba(247, 236, 213, 0.45) 1.8%, rgba(238, 201, 249, 0.45) 99.54%)',
          minHeight: '150vh',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)'
        }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 lg:mb-12 -mt-20 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Title */}
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-center sm:text-left"
              style={{ marginTop: '-100px' }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Popular Post
            </motion.h2>

            {/* Golden Line */}
            <motion.div 
              className="w-32 sm:w-40 lg:w-48 h-1 bg-[#D2AD3F] rounded-lg"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
            </motion.div>
          </motion.div>

          {/* Popular Post Cards - Mobile First */}
          <motion.div 
            className="py-8 sm:py-12 lg:py-16"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Mobile: Vertical layout */}
            <div className="block lg:hidden">
              <motion.div 
                className="flex flex-col items-center px-4 sm:px-6 lg:px-0 popular-post-cards"
                style={{ gap: '40px' }}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {popularPosts.slice(0, 4).map((post, index) => (
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
            </div>

            {/* Desktop: Vertical layout */}
            <div className="hidden lg:block">
              <motion.div 
                className="flex flex-col items-center px-4 sm:px-6 lg:px-0 popular-post-cards"
                style={{ gap: '180px' }}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {popularPosts.slice(0, 4).map((post, index) => (
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
            </div>
          </motion.div>
        </div>
        
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
        style={{ 
          marginTop: '-50px',
          marginBottom: '-105px',
          marginRight: '70px',
          marginLeft: '-60px',
          transform: 'translate(5px, 10px)'
        }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Content Section - Left Side */}
        <motion.div 
          className="hidden sm:flex flex-col gap-4 max-w-full lg:max-w-md order-2 lg:order-1 framer-content"
          initial={{ opacity: 0, x: -100, y: 70, rotateY: -15 }}
          whileInView={{ opacity: 1, x: -60, y: 70, rotateY: 0 }}
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
            Ultimate Tour Experiences: Where Adventures Begin
          </motion.h1>
          <motion.p 
            className="font-inter font-normal text-xs sm:text-sm leading-5 tracking-wide text-gray-600 mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Discover your perfect adventure with our curated collection of tour experiences. From guided city walks to wilderness expeditions, find the ideal tour that matches your adventure style.
          </motion.p>
        </motion.div>

        {/* FramerCard Section - Right Side */}
        <motion.div 
          className="flex flex-col sm:flex-row lg:flex-row gap-4 lg:gap-6 order-1 lg:order-2 w-full lg:w-auto framer-cards"
          initial={{ opacity: 0, x: 100, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 60, rotateY: 0 }}
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
        className="py-8 lg:py-12 my-0 mb-0 video-section w-full"
        style={{
          background: 'linear-gradient(102.91deg, rgba(247, 236, 213, 0.45) 1.8%, rgba(238, 201, 249, 0.45) 99.54%)',
          marginTop: '6rem',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)'
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-8 lg:mt-12 mb-8 lg:mb-12 px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-5 video-container" style={{ gap: '20px' }}>
          {/* Left Side - 3 Video Cards Vertical */}
          <div 
            className="flex flex-col gap-4 lg:gap-6 w-full lg:w-auto lg:max-w-md video-sidebar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              marginRight: '1250px',
              marginLeft: '-150px',
              width: '600px',
              maxWidth: '5000px',
              marginRight: '50px',
              marginBottom: '20px',
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
              maxWidth: '300px',
              marginLeft: '-20px',
              marginRight: '400px',
              marginBottom: '20px',
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