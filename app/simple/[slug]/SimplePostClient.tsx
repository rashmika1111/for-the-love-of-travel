"use client";

import React, { useState, useEffect, useCallback } from "react";

/* --- Shared UI Components --- */
import DynamicNavbar from "../../../components/DynamicNavbar";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import Comments from "../../../components/Comments";
import Breadcrumbs from "../../../components/Breadcrumbs";

/* --- Next / Motion / Icons --- */
import Image from "next/image";
import Link from "next/link";
import SafeImage from "../../../components/content/SafeImage";
import { normalizeImageSrc } from "../../../lib/img";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Clock,
  User,
  Calendar,
  Heart,
  MessageCircle,
  ArrowRight,
  Search,
} from "lucide-react";

/* --- Data / Types --- */
import { postsApi, categoriesApi } from "../../../lib/api";
import type { Post, Category } from "../../../types";

interface SimplePost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: {
    url: string;
    alt?: string;
    caption?: string;
  };
  tags: string[];
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  status: 'draft' | 'published' | 'archived';
  author?: {
    _id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    views: number;
    likes: number;
    shares: number;
  };
  readingTime?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface SimplePostClientProps {
  post: SimplePost;
}

export default function SimplePostClient({ post }: SimplePostClientProps) {
  /* ---------- State Management ---------- */
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

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
          query: searchQuery || undefined,
          sortBy: "publishedAt",
          sortOrder: "desc",
        });

        if ((postsResponse as any)?.success) {
          const postsData = postsResponse.data || [];
          setPosts(postsData);
          setTotalPages(postsResponse.meta?.pagination?.pages || 1);
        } else {
          const data = (postsResponse as any)?.data ?? [];
          const pages = (postsResponse as any)?.meta?.pagination?.pages ?? 1;
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
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- Filters / Search ---------- */
  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? "" : categorySlug);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  /* ---------- Share actions ---------- */
  const handleShare = async (platform: "facebook" | "twitter" | "linkedin" | "copy") => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = post.title;

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

  /* ---------- Build breadcrumbs ---------- */
  const breadcrumbItems = [
    { name: 'Simple Posts', url: '/simple', position: 1 },
    { name: post.title, url: `/simple/${post.slug}`, position: 2 }
  ];

  return (
    <main className="overflow-x-hidden">
      <DynamicNavbar />

      {/* Hero Section - Simple Post Style */}
      <motion.section
        className="relative h-[70vh] md:h-[80vh] overflow-hidden"
        style={{ y, opacity }}
      >
        <motion.div style={{ scale }} className="w-full h-full">
          {post.featuredImage?.url ? (
            <SafeImage
              src={normalizeImageSrc(post.featuredImage.url)}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              </div>
            </div>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <motion.h1
              className="mb-6"
              style={{
                fontFamily: "Roboto",
                fontWeight: 600,
                fontSize: "48px",
                lineHeight: "52px",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span>By {post.author?.fullname || post.author?.email || 'Unknown Author'}</span>
              <span className="hidden md:block">•</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span className="hidden md:block">•</span>
              <span>{post.readingTime || 0} min read</span>
            </motion.div>
          </div>
        </div>

        {/* Share Icons */}
        <div className="absolute bottom-8 right-8">
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

      {/* Breadcrumbs */}
      <section className="bg-gray-50 py-4">
        <div className="container max-w-6xl mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Content */}
            <div 
              className="text-gray-800 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Featured Image Caption */}
            {post.featuredImage?.caption && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 italic">
                  {post.featuredImage.caption}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.stats.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.stats.shares} shares</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.stats.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryFilter("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>

              {categories.slice(0, 12).map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category.slug
                        ? category.color
                        : undefined,
                    color:
                      selectedCategory === category.slug ? "white" : undefined,
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
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
                            {featuredPost.readingTimeText || `${featuredPost.readingTime || 0} min`}
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
      <section className="py-16 bg-gray-50">
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
                        <SafeImage
                          src={postItem.featuredImage}
                          alt={postItem.featuredImage?.alt || postItem.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
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
                              {postItem.readingTimeText || `${postItem.readingTime || 0} min`}
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

