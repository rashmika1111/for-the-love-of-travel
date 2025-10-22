"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

/* --- Shared UI Components --- */
import DynamicNavbar from "../../../components/DynamicNavbar";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import DynamicPinnedImageOverlay from "../../../components/DynamicPinnedImageOverlay";
import Comments from "../../../components/Comments";
import ContentSectionsRenderer from "../../../components/ContentSectionsRenderer";
import OverlayVideoSection from "../../../components/OverlayVideoSection";
import Breadcrumbs, { buildCategoryBreadcrumbs, generateBreadcrumbJsonLd } from "../../../components/Breadcrumbs";

/* --- Next / Motion / Icons --- */
import Image from "next/image";
import Link from "next/link";
import SafeImage from "../../../components/content/SafeImage";
import { normalizeImageSrc } from "../../../lib/img";
import { safePlayVideo, safePauseAndResetVideo } from '../../../lib/video-utils';
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Play,
  Clock,
  User,
  Calendar,
  Heart,
  MessageCircle,
  ArrowRight,
  Search,
  X,
} from "lucide-react";

/* --- Data / Types --- */
import { postsApi, categoriesApi, tagsApi } from "../../../lib/api";
import type { Post, Category, Tag } from "../../../types";
import type { PublicPost } from "../../../lib/cms";

interface ContentPageClientProps {
  post: PublicPost;
}

export default function ContentPageClient({ post }: ContentPageClientProps) {
  /* ---------- State Management ---------- */
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagSearchRef = useRef<HTMLDivElement>(null);

  /* ---------- Motion values for parallax hero ---------- */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.9]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.08]);

  /* ---------- Utils ---------- */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ---------- Data fetching ---------- */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (typeof window === "undefined") return;

      // Posts (with filters/search)
      try {
        const postsResponse = await postsApi.getPosts({
          page: currentPage,
          limit: 12,
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          query: searchQuery || undefined,
          sortBy: "publishedAt",
          sortOrder: "desc",
        });

        if ((postsResponse as any)?.success) {
          const postsData = postsResponse.data || [];
          console.log('Posts data received:', postsData);
          // Log the specific post we're looking for
          const videoPost = postsData.find((p: any) => p.title === 'Checking the video upload');
          if (videoPost) {
            console.log('Video post found:', videoPost);
            console.log('Video post featuredMedia:', videoPost.featuredMedia);
            console.log('Video post featuredImage:', videoPost.featuredImage);
          }
          setPosts(postsData);
          setTotalPages(postsResponse.meta?.pagination?.pages || 1);
        } else {
          const data = (postsResponse as any)?.data ?? [];
          const pages = (postsResponse as any)?.meta?.pagination?.pages ?? 1;
          console.log('Posts data received (fallback):', data);
          setPosts(Array.isArray(data) ? data : []);
          setTotalPages(Number.isFinite(pages) ? pages : 1);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
        setTotalPages(1);
      }

      // Categories
      try {
        const categoriesResponse = await categoriesApi.getCategories();
        if ((categoriesResponse as any)?.success) {
          setCategories(categoriesResponse.data || []);
      } else {
          setCategories((categoriesResponse as any)?.data || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }

      // Tags
      try {
        const tagsResponse = await tagsApi.getTags();
        if ((tagsResponse as any)?.success) {
          setTags(tagsResponse.data || []);
        } else {
          setTags((tagsResponse as any)?.data || []);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        setTags([]);
      }

      // Featured posts
      try {
        const featuredResponse = await postsApi.getFeaturedPosts(3);
        const fp = (featuredResponse as any)?.data || [];
        setFeaturedPosts(Array.isArray(fp) ? fp : []);
      } catch (err) {
        console.error("Error fetching featured posts:", err);
        setFeaturedPosts([]);
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedTag, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- Filters / Search ---------- */
  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? "" : categorySlug);
    setCurrentPage(1);
  };

  const handleTagFilter = (tagSlug: string) => {
    setSelectedTag(tagSlug === selectedTag ? "" : tagSlug);
    setCurrentPage(1);
  };

  const handleTagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagInputChange = (value: string) => {
    setTagSearchQuery(value);
    setShowTagSuggestions(value.length > 0);
  };

  const handleTagSelect = (tag: Tag) => {
    setSelectedTag(tag.slug);
    setTagSearchQuery(tag.name);
    setShowTagSuggestions(false);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Filter tags based on search query
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  // Handle click outside to close tag suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagSearchRef.current && !tagSearchRef.current.contains(event.target as Node)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* ---------- Share actions ---------- */
  const handleShare = async (platform: "facebook" | "twitter" | "linkedin" | "copy") => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = getHeroTitle();

      switch (platform) {
        case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
          break;
        case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank",
          "noopener,noreferrer"
        );
          break;
        case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
          break;
        case "copy":
        try {
          await navigator.clipboard.writeText(url);
        } catch (err) {
          console.error("Failed to copy URL: ", err);
        }
          break;
    }
  };

  /* ---------- Get hero media from content sections or fallback ---------- */
  const getHeroImage = () => {
    const heroSection = post.contentSections?.find(section => section.type === 'hero');
    
    // Prefer hero section image if present
    const heroSrc = normalizeImageSrc(heroSection?.backgroundImage) ??
      // otherwise featuredImage (string or {url})
      normalizeImageSrc(post.featuredImage) ??
      null;
    
    return heroSrc;
  };

  const getHeroMedia = () => {
    const heroSection = post.contentSections?.find(section => section.type === 'hero');
    
    // Debug logging for hero section
    console.log('Hero section debug in getHeroMedia:', {
      heroSection: heroSection,
      backgroundImage: heroSection?.backgroundImage,
      backgroundVideo: heroSection?.backgroundVideo,
      featuredMedia: post.featuredMedia,
      featuredImage: post.featuredImage
    });
    
    // Priority 1: Hero section's backgroundVideo
    if (heroSection?.backgroundVideo) {
      let videoUrl;
      if (heroSection.backgroundVideo.startsWith('http') || heroSection.backgroundVideo.startsWith('/') || heroSection.backgroundVideo.startsWith('data:')) {
        videoUrl = heroSection.backgroundVideo;
      } else {
        // For videos, use admin backend URL (port 5000) instead of website backend (port 3000)
        videoUrl = `http://localhost:5000/api/v1/media/serve/${encodeURIComponent(heroSection.backgroundVideo)}`;
      }
      
      console.log('Using hero section backgroundVideo:', videoUrl);
      return {
        url: videoUrl,
        type: 'video'
      };
    }
    
    // Priority 2: Hero section's backgroundImage
    if (heroSection?.backgroundImage) {
      const imageUrl = normalizeImageSrc(heroSection.backgroundImage);
      console.log('Using hero section backgroundImage:', imageUrl);
      return {
        url: imageUrl,
        type: 'image'
      };
    }
    
    // Priority 3: Post's featuredMedia (video)
    if (post.featuredMedia?.type === 'video' && post.featuredMedia?.url) {
      let videoUrl;
      if (post.featuredMedia.url.startsWith('http') || post.featuredMedia.url.startsWith('/') || post.featuredMedia.url.startsWith('data:')) {
        videoUrl = post.featuredMedia.url;
      } else {
        // For videos, use admin backend URL (port 5000) instead of website backend (port 3000)
        videoUrl = `http://localhost:5000/api/v1/media/serve/${encodeURIComponent(post.featuredMedia.url)}`;
      }
      
      console.log('Using post featuredMedia video:', videoUrl);
      return {
        url: videoUrl,
        type: 'video'
      };
    }
    
    // Priority 4: Post's featuredImage
    const heroSrc = normalizeImageSrc(post.featuredImage);
    console.log('Using post featuredImage:', heroSrc);
    return {
      url: heroSrc,
      type: 'image'
    };
  };

  /* ---------- Get hero section data ---------- */
  const getHeroSection = () => {
    return post.contentSections?.find(section => section.type === 'hero');
  };

  /* ---------- Get popular posts section ---------- */
  const getPopularPostsSection = () => {
    return post.contentSections?.find(section => section.type === 'popular-posts');
  };

  /* ---------- Get article with images section ---------- */
  const getArticleWithImagesSection = () => {
    return post.contentSections?.find(section => section.type === 'article');
  };

  /* ---------- Get content sections without hero, breadcrumb, and article ---------- */
  const getContentSections = () => {
    return post.contentSections?.filter(section => 
      section.type !== 'hero' && 
      section.type !== 'breadcrumb' &&
      section.type !== 'article'
    ) || [];
  };

  /* ---------- Check if video sections exist ---------- */
  const hasVideoSection = () => {
    return post.contentSections?.some(section => section.type === 'video') || false;
  };

  /* ---------- Get hero title from content sections or fallback ---------- */
  const getHeroTitle = () => {
    const heroSection = getHeroSection();
    if (heroSection && heroSection.type === 'hero' && heroSection.title) {
      return heroSection.title;
    }
    return post.title;
  };

  /* ---------- Get hero subtitle from content sections ---------- */
  const getHeroSubtitle = () => {
    const heroSection = getHeroSection();
    if (heroSection && heroSection.type === 'hero' && heroSection.subtitle) {
      return heroSection.subtitle;
    }
    return null;
  };

  /* ---------- Get hero author from content sections or fallback ---------- */
  const getHeroAuthor = (): string => {
    const heroSection = getHeroSection();
    if (heroSection && heroSection.type === 'hero' && heroSection.author) {
      return heroSection.author;
    }
    return typeof post.author === 'object' && post.author?.name 
      ? post.author.name 
      : (post.author as string) || 'Unknown Author';
  };

  /* ---------- Get hero publish date from content sections or fallback ---------- */
  const getHeroPublishDate = () => {
    const heroSection = getHeroSection();
    if (heroSection && heroSection.type === 'hero' && heroSection.publishDate) {
      return heroSection.publishDate;
    }
    return formatDate(post.publishedAt);
  };

  /* ---------- Get hero read time from content sections or fallback ---------- */
  const getHeroReadTime = () => {
    const heroSection = getHeroSection();
    if (heroSection && heroSection.type === 'hero' && heroSection.readTime) {
      return heroSection.readTime;
    }
    return "5 min read";
  };

  /* ================== RENDER ================== */

  // Build breadcrumbs from primary category
  const breadcrumbItems = buildCategoryBreadcrumbs(post.primaryCategory, post.title);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <main className="overflow-x-hidden">
      <DynamicNavbar />

      {/* Breadcrumbs */}
      {breadcrumbItems.length > 0 && (
        <section className="bg-gray-50 py-4">
          <div className="container max-w-6xl mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </section>
      )}

      {/* JSON-LD Structured Data */}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}

      {/* Hero Section - Enhanced with dynamic content */}
      <motion.section
        className="relative h-[calc(100vh+150px)] md:h-[90vh] lg:h-[95vh] overflow-hidden"
        style={{ y, opacity }}
      >
        <motion.div style={{ scale }} className="w-full h-full">
          {getHeroMedia().url ? (
            getHeroMedia().type === 'video' ? (
              <video
                src={getHeroMedia().url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <SafeImage
                src={getHeroMedia().url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{getHeroTitle()}</h1>
                {getHeroSubtitle() && (
                  <p className="text-xl opacity-90">{getHeroSubtitle()}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />

        {/* Content Overlay - Enhanced */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-6xl px-4">
            <motion.h1
              className="mb-8"
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                fontSize: "60px",
                lineHeight: "60px",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {getHeroTitle()}
            </motion.h1>

            {getHeroSubtitle() && (
              <motion.p
                className="text-xl md:text-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {getHeroSubtitle()}
              </motion.p>
            )}

            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-xl md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span>By {getHeroAuthor()}</span>
              <span className="hidden md:block">•</span>
              <span>{getHeroPublishDate()}</span>
              <span className="hidden md:block">•</span>
              <span>{getHeroReadTime()}</span>
            </motion.div>
          </div>
        </div>

        {/* Share Icons - Enhanced (hidden when video section is present) */}
        {!hasVideoSection() && (
          <div className="absolute bottom-12 right-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-4">
              <span className="text-white text-lg font-medium">Share:</span>
              <motion.button
                className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("facebook")}
                title="Share on Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("twitter")}
                title="Share on Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("linkedin")}
                title="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("copy")}
                title="Copy link"
              >
                <Copy className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.section>

      {/* Video Sections - Rendered separately to avoid document flow conflicts */}
      {(() => {
        // Check both filtered sections and all content sections for video sections
        const videoSections = [
          ...getContentSections().filter(section => section.type === 'video'),
          ...(post.contentSections?.filter(section => section.type === 'video') || [])
        ];
        // Remove duplicates
        const uniqueVideoSections = videoSections.filter((section, index, self) => 
          index === self.findIndex(s => s === section)
        );
        return uniqueVideoSections.map((section, index) => (
          <OverlayVideoSection key={index} section={section as any} />
        ));
      })()}

      {/* Breadcrumb Navigation - From Content Builder */}
      {(() => {
        const breadcrumbSection = post.contentSections?.find(section => section.type === 'breadcrumb');
        if (breadcrumbSection && breadcrumbSection.type === 'breadcrumb' && breadcrumbSection.enabled !== false) {
                return (
            <section className="py-6 bg-white">
              <div className="container max-w-6xl mx-auto px-4">
                <nav className="flex items-center space-x-3 text-base">
                  {(breadcrumbSection.items || []).map((item, index) => (
                    <React.Fragment key={index}>
                      <Link
                        href={item.href || '#'}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {item.label || '—'}
                      </Link>
                      {index < (breadcrumbSection.items?.length || 0) - 1 && (
                <span className="text-gray-400">&gt;</span>
            )}
                    </React.Fragment>
                  ))}
          </nav>
        </div>
      </section>
          );
        }
        return null;
      })()}

      {/* Dynamic Article Content with Pinned Image Overlay */}
      {(() => {
        const articleSection = getArticleWithImagesSection();
        if (articleSection && articleSection.type === 'article') {
          return (
            <DynamicPinnedImageOverlay
              articleSection={articleSection}
              viewportVh={100}
              scrim={true}
            />
          );
        }
        return null;
      })()}

      {/* Dynamic Content Sections */}
      <ContentSectionsRenderer sections={getContentSections()} />

      {/* Enhanced Search & Filter Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Discover More Content
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search and filter through our collection of travel stories, guides, and experiences
            </p>
          </motion.div>

          {/* Main Search Bar */}
          <motion.div 
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for destinations, experiences, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category Filters */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  {selectedCategory && (
                    <span className="text-sm text-gray-500">
                      ({categories.find(cat => cat.slug === selectedCategory)?.name || 'Selected'})
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={() => handleCategoryFilter("")}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === ""
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-200 transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All Categories
                  </motion.button>

                  {categories.slice(0, 10).map((category, index) => (
                    <motion.button
                      key={category._id}
                      onClick={() => handleCategoryFilter(category.slug)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category.slug
                          ? "text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:shadow-md"
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.slug ? category.color || "#3B82F6" : undefined,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tag Filters */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                  {selectedTag && (
                    <span className="text-sm text-gray-500">
                      ({tags.find(tag => tag.slug === selectedTag)?.name || 'Selected'})
                    </span>
                  )}
                </div>

                {/* Tag Search Input */}
                <div className="relative mb-4" ref={tagSearchRef}>
                  <form onSubmit={handleTagSearch}>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search tags..."
                        value={tagSearchQuery}
                        onChange={(e) => handleTagInputChange(e.target.value)}
                        onFocus={() => setShowTagSuggestions(tagSearchQuery.length > 0)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-300"
                      />
                      {tagSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setTagSearchQuery("");
                            setShowTagSuggestions(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Enhanced Tag Suggestions Dropdown */}
                  {showTagSuggestions && filteredTags.length > 0 && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filteredTags.slice(0, 8).map((tag, index) => (
                        <motion.button
                          key={tag.slug}
                          onClick={() => handleTagSelect(tag)}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex justify-between items-center border-b border-gray-100 last:border-b-0"
                          whileHover={{ backgroundColor: "#F0FDF4" }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {tag.count} posts
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Selected Tag Display */}
                {selectedTag && (
                  <motion.div 
                    className="flex items-center gap-3 mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-medium text-gray-600">Active filter:</span>
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-xl border border-green-200">
                      <span className="text-sm font-semibold">
                        {tags.find(tag => tag.slug === selectedTag)?.name || selectedTag}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTag("");
                          setTagSearchQuery("");
                          setShowTagSuggestions(false);
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Popular Tags */}
                {!selectedTag && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 8).map((tag, index) => (
                        <motion.button
                          key={tag.slug}
                          onClick={() => handleTagSelect(tag)}
                          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-800 transition-all duration-300 border border-gray-200 hover:border-green-300"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          {tag.name} <span className="text-gray-500">({tag.count})</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Active Filters Summary */}
          {(selectedCategory || selectedTag || searchQuery) && (
            <motion.div 
              className="mt-6 flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              
              {selectedCategory && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
                  <span>Category: {categories.find(cat => cat.slug === selectedCategory)?.name}</span>
                  <button
                    onClick={() => handleCategoryFilter("")}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {selectedTag && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm">
                  <span>Tag: {tags.find(tag => tag.slug === selectedTag)?.name}</span>
                  <button
                    onClick={() => {
                      setSelectedTag("");
                      setTagSearchQuery("");
                      setShowTagSuggestions(false);
                    }}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedTag("");
                  setTagSearchQuery("");
                  setSearchQuery("");
                  setShowTagSuggestions(false);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Stories
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked travel stories that inspire and captivate
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((featuredPost, index) => (
                <motion.article
                  key={featuredPost._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/content/${featuredPost.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <SafeImage
                        src={featuredPost.featuredImage}
                        alt={featuredPost.featuredImage?.alt || featuredPost.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{featuredPost.author?.name || "Unknown Author"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(featuredPost.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {featuredPost.readingTimeText || `${featuredPost.readingTime} min`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
                  </div>
                </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-gray-600">
              Discover the latest travel adventures and insights
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-xl h-80 animate-pulse"
                />
                      ))}
                    </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((postItem, index) => (
                  <motion.article
                    key={postItem._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/content/${postItem.slug}`}>
                      <div className="relative h-48 overflow-hidden group">
                        {(() => {
                          // Get the media URL and type (prioritize featuredMedia over featuredImage)
                          const rawMediaUrl = postItem.featuredMedia?.url || 
                            (typeof postItem.featuredImage === 'string' ? postItem.featuredImage : postItem.featuredImage?.url);
                          const mediaType = postItem.featuredMedia?.type || 'image';
                          
                          // Construct proper URL based on media type
                          let mediaUrl = rawMediaUrl;
                          if (mediaType === 'video' && rawMediaUrl && !rawMediaUrl.startsWith('http') && !rawMediaUrl.startsWith('/') && !rawMediaUrl.startsWith('data:')) {
                            // For videos, use admin backend URL (port 5000)
                            mediaUrl = `http://localhost:5000/api/v1/media/serve/${encodeURIComponent(rawMediaUrl)}`;
                          }
                          
          // Debug logging for video posts
          if (mediaType === 'video') {
            console.log('Rendering video post:', postItem.title);
            console.log('featuredMedia:', postItem.featuredMedia);
            console.log('featuredImage:', postItem.featuredImage);
            console.log('mediaUrl:', mediaUrl);
            console.log('mediaType:', mediaType);
            console.log('Raw mediaUrl check:', {
              startsWithHttp: mediaUrl?.startsWith('http'),
              startsWithSlash: mediaUrl?.startsWith('/'),
              startsWithData: mediaUrl?.startsWith('data:'),
              fullUrl: mediaUrl
            });
          }
                          
                          if (mediaType === 'video' && mediaUrl) {
                            return (
                              <>
                                <video
                                  src={mediaUrl}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  muted
                                  preload="metadata"
                                  onMouseEnter={(e) => {
                                    safePlayVideo(e.currentTarget, {
                                      onError: (error) => console.warn('Video play error:', error),
                                      onSuccess: () => console.log('Video playing successfully')
                                    });
                                  }}
                                  onMouseLeave={(e) => {
                                    safePauseAndResetVideo(e.currentTarget, {
                                      onError: (error) => console.warn('Video pause/reset error:', error),
                                      onSuccess: () => console.log('Video paused and reset successfully')
                                    });
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLVideoElement;
                                    console.error('Video failed to load:', {
                                      title: postItem.title,
                                      videoUrl: target.src,
                                      error: target.error,
                                      networkState: target.networkState,
                                      readyState: target.readyState,
                                      featuredMedia: postItem.featuredMedia
                                    });
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `
                                        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                          <div class="text-center text-gray-500">
                                            <div class="w-8 h-8 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                                              <div class="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
                                            </div>
                                            <div class="text-sm">Video</div>
                                          </div>
                                        </div>
                                      `;
                                    }
                                  }}
                                />
                                {/* Video badge */}
                                <div className="absolute top-2 right-2">
                                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                    <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                      <div className="w-0 h-0 border-l-[2px] border-l-black border-y-[1px] border-y-transparent"></div>
                                    </div>
                                    Video
                                  </div>
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <SafeImage
                                src={mediaUrl || postItem.featuredImage}
                                alt={postItem.featuredImage?.alt || postItem.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                              />
                            );
                          }
                        })()}
                        
                        {postItem.isPinned && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Pinned
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {postItem.categories?.slice(0, 2).map((category) => (
                        <span
                              key={category?._id || `${postItem._id}-${category?.slug || "cat"}`}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${category?.color || "#3B82F6"}20`,
                                color: category?.color || "#3B82F6",
                              }}
                            >
                              {category?.name || "Uncategorized"}
                        </span>
                      ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {postItem.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {postItem.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{postItem.author?.name || "Unknown Author"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(postItem.publishedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {postItem.readingTimeText || `${postItem.readingTime} min`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{postItem.likeCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{postItem.commentCount}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                      const isFirstOrLast = page === 1 || page === totalPages;

                      if (!isCurrentPage && !isNearCurrentPage && !isFirstOrLast) {
                        return page === 2 || page === totalPages - 1 ? (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        ) : null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            isCurrentPage
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "No posts are available at the moment"}
              </p>
            </div>
          )}
        </div>
      </section>


      {/* Comments Section */}
      <Comments />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </main>
  );
}