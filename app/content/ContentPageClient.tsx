"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* --- Shared UI (Fix/UI-fixes) --- */
import DynamicNavbar from "../../components/DynamicNavbar";
import Footer from "../../components/Footer";
import Newsletter from "../../components/Newsletter";
import ArticleWithPinnedImage from "../../components/ArticleWithPinnedImage";
import Comments from "../../components/Comments";

/* --- Next / Motion / Icons --- */
import Image from "next/image";
import Link from "next/link";
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
import { postsApi, categoriesApi, tagsApi } from "../../lib/api";
import type { Post, Category, Tag } from "../../types";
import type {
  ContentPageProps,
  ShareButtonProps,
} from "../../types/content";

interface ContentPageClientProps {
  content?: ContentPageProps;
}

export default function ContentPageClient({ content }: ContentPageClientProps) {
  /* ---------- UI-Fixes: default hero/article content ---------- */
  const defaultContent: ContentPageProps = {
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: "John Smith",
    publishDate: "May 28, 2019",
    readTime: "5 min read",
    heroImage: "/images/07734c5955830a5ec32606611af0eba2c88b8f45.png",
    content:
      "Embarking on the journey through the significant trends in recreation for designers...",
    category: "Technology",
    tags: ["technology", "workplace", "innovation"],
  };

  /* ---------- main: posts/filters/featured ---------- */
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

  // Prefer first featured post for hero; fallback to provided content/default
  const [articleContent, setArticleContent] = useState<ContentPageProps>(
    content || defaultContent
  );

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
          setPosts(postsResponse.data || []);
          setTotalPages(postsResponse.meta?.pagination?.pages || 1);
        } else {
          // Support both shapes (with/without success)
          const data = (postsResponse as any)?.data ?? [];
          const pages =
            (postsResponse as any)?.meta?.pagination?.pages ?? 1;
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

      // Featured posts -> hydrate hero
      try {
        const featuredResponse = await postsApi.getFeaturedPosts(3);
        const fp = (featuredResponse as any)?.data || [];
        setFeaturedPosts(Array.isArray(fp) ? fp : []);

        const first = fp?.[0];
        if (first) {
          setArticleContent((prev) => ({
            title: first.title || prev.title,
            author: first.author?.name || prev.author,
            publishDate: formatDate(first.publishedAt) || prev.publishDate,
            readTime:
              first.readingTimeText || `${first.readingTime || 5} min read`,
            heroImage: first.featuredImage?.url || prev.heroImage,
            content: prev.content,
            category: first.categories?.[0]?.name || prev.category,
            tags: prev.tags,
          }));
        }
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

  /* ---------- Share actions (UI-fixes) ---------- */
  const handleShare = async (platform: ShareButtonProps["platform"]) => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = articleContent.title;

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
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
            title
          )}`,
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

  /* ================== RENDER ================== */

  return (
    <main className="overflow-x-hidden">
      <DynamicNavbar />

      {/* Hero Section - UPSCALED */}
      <motion.section
        className="relative h-[calc(100vh+150px)] md:h-[90vh] lg:h-[95vh] overflow-hidden"
        style={{ y, opacity }}
      >
        <motion.div style={{ scale }} className="w-full h-full">
          <Image
            src={articleContent.heroImage}
            alt={articleContent.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />

        {/* Content Overlay - UPSCALED */}
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
              {articleContent.title}
            </motion.h1>

            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-xl md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span>By {articleContent.author}</span>
              <span className="hidden md:block">•</span>
              <span>{articleContent.publishDate}</span>
              <span className="hidden md:block">•</span>
              <span>{articleContent.readTime}</span>
            </motion.div>
          </div>
        </div>

        {/* Share Icons - STYLED */}
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
      </motion.section>

      {/* Breadcrumb Navigation - UPSCALED */}
      <section className="py-6 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center space-x-3 text-base">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">&gt;</span>
            {/* Hash link is fine to remain an <a> */}
            <a
              href="#destinations"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {articleContent.category || "Destinations"}
            </a>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-900 font-medium">
              {articleContent.title.length > 30
                ? `${articleContent.title.substring(0, 30)}...`
                : articleContent.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Article Content with Pinned Image Overlay */}
      <ArticleWithPinnedImage />

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
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/content/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage?.url || "/images/placeholder.jpg"}
                        alt={post.featuredImage?.alt || post.title}
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
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.author?.name || "Unknown Author"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {post.readingTimeText || `${post.readingTime} min`}
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

      {/* All Posts */}
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
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/content/${post.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={
                            post.featuredImage?.url || "/images/placeholder.jpg"
                          }
                          alt={post.featuredImage?.alt || post.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {post.isPinned && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Pinned
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories?.slice(0, 2).map((category) => (
                            <span
                              key={
                                category?._id ||
                                `${post._id}-${category?.slug || "cat"}`
                              }
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${
                                  category?.color || "#3B82F6"
                                }20`,
                                color: category?.color || "#3B82F6",
                              }}
                            >
                              {category?.name || "Uncategorized"}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author?.name || "Unknown Author"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {post.readingTimeText ||
                                `${post.readingTime} min`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likeCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.commentCount}</span>
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      const isNearCurrentPage =
                        Math.abs(page - currentPage) <= 2;
                      const isFirstOrLast = page === 1 || page === totalPages;

                      if (
                        !isCurrentPage &&
                        !isNearCurrentPage &&
                        !isFirstOrLast
                      ) {
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
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
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

      {/* Keep comments section from Fix/UI-fixes */}
      <Comments />

      <Newsletter />
      <Footer />
    </main>
  );
}
