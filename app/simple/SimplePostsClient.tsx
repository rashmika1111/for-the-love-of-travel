"use client";

import React, { useState, useEffect, useCallback } from "react";

/* --- Shared UI Components --- */
import DynamicNavbar from "../../components/DynamicNavbar";
import Footer from "../../components/Footer";
import Newsletter from "../../components/Newsletter";
import SafeImage from "../../components/content/SafeImage";
import { normalizeImageSrc } from "../../lib/img";

/* --- Next / Motion / Icons --- */
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  Calendar,
  Heart,
  MessageCircle,
  ArrowRight,
  Search,
} from "lucide-react";

/* --- Data / Types --- */
import { categoriesApi } from "../../lib/api";
import type { Category } from "../../types";
import type { PublicSimplePost } from "../../lib/cms";

const ADMIN_BACKEND_URL = process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL || 'http://localhost:5000';

export default function SimplePostsClient() {
  /* ---------- State Management ---------- */
  const [simplePosts, setSimplePosts] = useState<PublicSimplePost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

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
  const fetchSimplePosts = useCallback(async () => {
    try {
      setLoading(true);
      if (typeof window === "undefined") return;

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        status: 'published',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { categories: selectedCategory })
      });

      const response = await fetch(`${ADMIN_BACKEND_URL}/api/v1/simple-posts?${params}`);
      const data = await response.json();

      if (data.success) {
        setSimplePosts(data.data || []);
        setTotalPages(data.pages || 1);
      } else {
        console.error('Error fetching simple posts:', data);
        setSimplePosts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching simple posts:', error);
      setSimplePosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSimplePosts();
  }, [fetchSimplePosts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ---------- Filters / Search ---------- */
  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? "" : categorySlug);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <main className="overflow-x-hidden">
      <DynamicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple Posts
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Quick and beautiful travel stories with stunning images and engaging content
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Category Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search simple posts..."
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

      {/* Simple Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : simplePosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {simplePosts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/simple/${post.slug}`}>
                      <div className="relative h-48 overflow-hidden group">
                        {post.featuredImage?.url ? (
                          <SafeImage
                            src={normalizeImageSrc(post.featuredImage.url)}
                            alt={post.featuredImage.alt || post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        
                        {/* Simple Post Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Simple Post
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Categories */}
                        {post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.categories.slice(0, 2).map((category) => (
                              <span
                                key={category._id}
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              >
                                {category.name}
                              </span>
                            ))}
                            {post.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                +{post.categories.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author?.fullname || post.author?.email || 'Unknown Author'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime} min</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.stats.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.stats.shares}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👁️</span>
                              <span>{post.stats.views}</span>
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
                No simple posts found
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "No simple posts are available at the moment"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </main>
  );
}

