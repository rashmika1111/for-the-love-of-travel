"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, User, Calendar, Heart, MessageCircle, ArrowRight, Search, Filter, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { postsApi, categoriesApi, authorsApi } from "../lib/api";
import { safePlayVideo, safePauseAndResetVideo } from '@/lib/video-utils';

// Hero Section Component
const HeroSection = ({ section, posts = [] }) => {
  return (
    <motion.section
      className={`relative overflow-hidden ${section.height?.desktop || 'h-[90vh]'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src={section.backgroundImage || '/header.jpg'}
          alt={section.title || 'Hero Background'}
          fill
          className="object-cover"
          style={{ objectPosition: section.backgroundPosition || 'center' }}
        />
      </motion.div>
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: `rgba(0,0,0,${section.overlayOpacity || 0.3})` }}
      ></div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <motion.h1 
            className={`${section.titleSize?.desktop || 'text-6xl'} font-bold mb-6 leading-tight`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: section.animation?.duration || 0.8, delay: section.animation?.delay || 0 }}
          >
            {section.title}
          </motion.h1>
          
          {section.subtitle && (
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {section.subtitle}
            </motion.p>
          )}

          {/* Author and Meta Info */}
          {(section.author || section.publishDate || section.readTime) && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {section.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{section.author}</span>
                </div>
              )}
              {section.publishDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{section.publishDate}</span>
                </div>
              )}
              {section.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{section.readTime}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Social Sharing */}
          {section.socialSharing?.enabled && (
            <motion.div
              className={`flex gap-3 justify-center ${section.socialSharing.position?.includes('bottom') ? 'mt-8' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {section.socialSharing.platforms?.map((platform) => (
                <button
                  key={platform}
                  className={`p-2 rounded-full transition-colors ${
                    section.socialSharing.style === 'glass' 
                      ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {platform === 'facebook' && <Facebook className="w-5 h-5" />}
                  {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                  {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                  {platform === 'copy' && <Copy className="w-5 h-5" />}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// Breadcrumb Section Component
const BreadcrumbSection = ({ section }) => {
  if (!section.enabled) return null;

  return (
    <section className="py-4 bg-gray-50 border-b">
      <div className="container max-w-6xl mx-auto px-4">
        <nav className="flex items-center space-x-2 text-sm">
          {section.items?.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">{section.style?.separator || '>'}</span>
              )}
              {item.href ? (
                <Link href={item.href} className="text-blue-600 hover:text-blue-800">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-600">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
};

// Text Section Component
const TextSection = ({ section }) => {
  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: section.animation?.duration || 0.6 }}
    >
      <div className="container max-w-4xl mx-auto px-4">
        <div 
          className={`prose prose-lg max-w-none ${
            section.fontFamily === 'serif' ? 'font-serif' : 
            section.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
          } ${section.fontSize === 'sm' ? 'prose-sm' : 
            section.fontSize === 'lg' ? 'prose-xl' : 
            section.fontSize === 'xl' ? 'prose-2xl' : 'prose-base'
          } ${section.lineHeight === 'tight' ? 'leading-tight' :
            section.lineHeight === 'snug' ? 'leading-snug' :
            section.lineHeight === 'loose' ? 'leading-loose' : 'leading-relaxed'
          } text-${section.alignment || 'left'}`}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    </motion.section>
  );
};

// Image Section Component
const ImageSection = ({ section }) => {
  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-4xl mx-auto px-4">
        <div className={`flex justify-${section.alignment || 'center'}`}>
          <div className={`${section.rounded ? 'rounded-xl' : ''} ${section.shadow ? 'shadow-lg' : ''} overflow-hidden`}>
            <Image
              src={section.imageUrl}
              alt={section.altText || ''}
              width={section.width || 800}
              height={section.height || 600}
              className="w-full h-auto"
            />
            {section.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {section.caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Video Section Component
const VideoSection = ({ section }) => {
  return (
    <motion.section 
      className="relative w-full -mt-[calc(100vh+150px+600px)] md:-mt-[calc(90vh+600px)] lg:-mt-[calc(95vh+600px)] z-30"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Overlapping video content - positioned to overlap main hero section */}
      <div 
        className="relative flex items-center justify-center pointer-events-none"
        style={{
          height: section.height?.desktop || '80vh',
        }}
      >
        <div className="text-center text-white max-w-4xl pointer-events-auto">
          {/* Video player or play button */}
          {section.videoUrl ? (
            <div className="relative inline-block">
              {section.controls ? (
                <div 
                  className="relative rounded-2xl shadow-2xl overflow-hidden border-2 border-white"
                  style={{
                    width: section.width ? `${section.width}px` : 'min(90vw, 800px)',
                    aspectRatio: '16/9',
                    maxWidth: '100%'
                  }}
                >
                  <video
                    src={section.videoUrl}
                    poster={section.poster || undefined}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay={section.autoplay}
                    muted={section.muted}
                    loop={section.loop}
                    preload="metadata"
                  />
                </div>
              ) : (
                <div 
                  className="relative rounded-2xl shadow-2xl overflow-hidden border-2 border-white"
                  style={{
                    width: section.width ? `${section.width}px` : 'min(90vw, 800px)',
                    aspectRatio: '16/9',
                    maxWidth: '100%'
                  }}
                >
                  {/* Video thumbnail/poster */}
                  {section.poster ? (
                    <img
                      src={section.poster}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-lg">
                      <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="relative rounded-2xl shadow-2xl overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-white"
              style={{
                width: section.width ? `${section.width}px` : 'min(90vw, 800px)',
                aspectRatio: '16/9',
                maxWidth: '100%'
              }}
            >
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full p-6 hover:bg-white/30 transition-all duration-300 mx-auto mb-4">
                  <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z" />
                  </svg>
                </div>
                <p className="text-white/80">No video selected</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Caption below the overlapping area */}
      {section.caption && (
        <div className="relative z-30 p-4 bg-white/90 backdrop-blur-sm">
          <p className="text-sm text-gray-700 italic text-center">
            {section.caption}
          </p>
        </div>
      )}
    </motion.section>
  );
};

// Gallery Section Component
const GallerySection = ({ section }) => {
  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className={`grid gap-4 ${
          section.layout === 'grid' ? `grid-cols-${section.columns || 3}` :
          section.layout === 'masonry' ? 'columns-3' : 'grid-cols-1'
        }`}>
          {section.images?.map((image, index) => (
            <motion.div
              key={index}
              className={`group relative overflow-hidden ${
                section.rounded ? 'rounded-xl' : ''
              } ${section.shadow ? 'shadow-lg' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: section.hoverEffects?.enabled ? (section.hoverEffects?.scale || 1.03) : 1,
                transition: { duration: 0.2 }
              }}
            >
              <Image
                src={image.url}
                alt={image.altText || ''}
                width={image.width || 400}
                height={image.height || 300}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Article Section Component
const ArticleSection = ({ section }) => {
  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-4xl mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {section.title && (
            <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
          )}
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {section.content && (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
            
            {/* Images sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pinned Image */}
              {section.pinnedImage?.url && (
                <div className="sticky top-8">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={section.pinnedImage.url}
                      alt={section.pinnedImage.altText || section.title || 'Article image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {section.pinnedImage.caption && (
                    <p className="text-sm text-gray-600 mt-2">{section.pinnedImage.caption}</p>
                  )}
                </div>
              )}
              
              {/* Changing Images */}
              {section.changingImages && section.changingImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Gallery</h3>
                  {section.changingImages.map((image, index) => (
                    <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.altText || `Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {image.caption && (
                        <p className="text-xs text-gray-600 mt-1">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Popular Posts Section Component
const PopularPostsSection = ({ section, posts = [] }) => {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await postsApi.getFeaturedPosts(6);
        if (response.success) {
          setFeaturedPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      }
    };
    fetchFeaturedPosts();
  }, []);

  if (featuredPosts.length === 0) return null;

  return (
    <motion.section 
      className="py-16 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Featured Stories'}
          </h2>
          {section.description && (
            <p className="text-lg text-gray-600">
              {section.description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.slice(0, 6).map((post, index) => (
            <motion.article
              key={post._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/content/${post.slug}`}>
                <div className="relative h-48 overflow-hidden group">
                  {(() => {
                    // Get the media URL and type (prioritize featuredMedia over featuredImage)
                    const rawMediaUrl = post.featuredMedia?.url || post.featuredImage?.url;
                    const mediaType = post.featuredMedia?.type || 'image';
                    
                    // Construct proper URL based on media type
                    let mediaUrl = rawMediaUrl;
                    if (mediaType === 'video' && rawMediaUrl && !rawMediaUrl.startsWith('http') && !rawMediaUrl.startsWith('/') && !rawMediaUrl.startsWith('data:')) {
                      // For videos, use admin backend URL (port 5000)
                      mediaUrl = `http://localhost:5000/api/v1/media/serve/${encodeURIComponent(rawMediaUrl)}`;
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
                              console.error('Video failed to load:', post.title);
                              const target = e.target;
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
                        <Image
                          src={mediaUrl || post.featuredImage?.url}
                          alt={post.featuredImage?.alt || post.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      );
                    }
                  })()}
                  
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
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTimeText || `${post.readingTime} min`}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Main Content Page Renderer
const ContentPageRenderer = ({ contentPage, posts = [], categories = [] }) => {
  if (!contentPage || !contentPage.sections) {
    return <div>Loading content...</div>;
  }

  return (
    <div className="content-page">
      {contentPage.sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={index} section={section} posts={posts} />;
          case 'breadcrumb':
            return <BreadcrumbSection key={index} section={section} />;
          case 'text':
            return <TextSection key={index} section={section} />;
          case 'article':
            return <ArticleSection key={index} section={section} />;
          case 'image':
            return <ImageSection key={index} section={section} />;
          case 'video':
            return <VideoSection key={index} section={section} />;
          case 'gallery':
            return <GallerySection key={index} section={section} />;
          case 'popular-posts':
            return <PopularPostsSection key={index} section={section} posts={posts} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ContentPageRenderer;

