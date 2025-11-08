"use client";
import { useState, useEffect } from 'react';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import Comments from "../../../components/Comments";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Share2, Facebook, Twitter, Linkedin, Copy, Heart, MessageCircle, Clock, User, Calendar } from "lucide-react";
import { postsApi } from '../../../lib/api';
import type { Post } from '../../../types';

interface ContentPageClientProps {
  post: Post;
}

export default function ContentPageClient({ post }: ContentPageClientProps) {
  // Debug logging
  console.log('📄 Individual post data from backend:', post);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isSharing, setIsSharing] = useState(false);

  // Handle like functionality
  const handleLike = async () => {
    try {
      if (isLiked) {
        await postsApi.unlikePost(post._id);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await postsApi.likePost(post._id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle share functionality
  const handleShare = async (platform: string) => {
    try {
      setIsSharing(true);
      
      const url = window.location.href;
      const title = post.title;
      const description = post.excerpt;

      let shareUrl = '';
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          // You could show a toast notification here
          break;
        default:
          return;
      }

      if (shareUrl && platform !== 'copy') {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      // Track share in analytics
      await postsApi.sharePost(post._id, platform);
      
    } catch (error) {
      console.error('Error sharing post:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden"
        style={{ y, opacity }}
      >
        <motion.div
          style={{ scale }}
          className="w-full h-full"
        >
          <Image
            src={post.featuredImage?.url || '/images/placeholder.jpg'}
            alt={post.featuredImage?.alt || post.title}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author?.name || 'Unknown Author'}</span>
              </div>
              <span className="hidden md:block">•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <span className="hidden md:block">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readingTimeText || `${post.readingTime} min read`}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Share Icons */}
        <div className="absolute bottom-8 right-8 flex gap-3">
          <motion.button
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('facebook')}
            disabled={isSharing}
          >
            <Facebook className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('twitter')}
            disabled={isSharing}
          >
            <Twitter className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('linkedin')}
            disabled={isSharing}
          >
            <Linkedin className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('copy')}
            disabled={isSharing}
          >
            <Copy className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.section>

      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            {post.breadcrumb?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-400">&gt;</span>
                {index === (post.breadcrumb?.length || 0) - 1 ? (
                  <span className="text-gray-900 font-medium">
                    {item.title}
                  </span>
                ) : (
                  <Link 
                    href={item.url} 
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.article
                className="prose mx-auto max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Post Content */}
                <div 
                  className="prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </motion.article>

              {/* Post Actions */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Share:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    disabled={isSharing}
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                    disabled={isSharing}
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                    disabled={isSharing}
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Author Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {post.author?.avatar && (
                      <Image
                        src={post.author.avatar.url}
                        alt={post.author?.name || 'Author'}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author?.name || 'Unknown Author'}</h3>
                      <p className="text-sm text-gray-600">Author</p>
                    </div>
                  </div>
                  {post.author?.bio && (
                    <p className="text-sm text-gray-600 mb-4">{post.author.bio}</p>
                  )}
                  <div className="flex gap-3">
                    {post.author?.socialLinks?.twitter && (
                      <a
                        href={`https://twitter.com/${post.author?.socialLinks?.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {post.author?.socialLinks?.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${post.author?.socialLinks?.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/category/${category.slug}`}
                          className="px-3 py-1 bg-white text-sm rounded-full hover:bg-gray-100 transition-colors"
                          style={{ color: category.color }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white text-sm rounded-full text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      {post.allowComments && (
        <Comments />
      )}

      <Newsletter />
      <Footer />
    </main>
  );
}
