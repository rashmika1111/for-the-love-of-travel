'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Copy, Heart, MessageCircle, Clock, User, Calendar } from 'lucide-react';

// Hero Section Component
const HeroSection = ({ section, post }) => {
  const {
    backgroundImage,
    title,
    subtitle,
    author,
    publishDate,
    readTime,
    overlayOpacity = 0.3,
    height = { mobile: '70vh', tablet: '80vh', desktop: '90vh' },
    titleSize = { mobile: 'text-3xl', tablet: 'text-5xl', desktop: 'text-6xl' },
    parallaxEnabled = true,
    parallaxSpeed = 0.5,
    backgroundPosition = 'center',
    backgroundSize = 'cover',
    animation = { enabled: true, type: 'fadeIn', duration: 0.8, delay: 0 },
    socialSharing = { enabled: true, platforms: ['facebook', 'twitter', 'linkedin', 'copy'], position: 'bottom-right', style: 'glass' }
  } = section.data || {};

  // Use post data as fallback
  const heroTitle = title || post.title;
  const heroAuthor = author || post.author?.name || 'Unknown Author';
  const heroPublishDate = publishDate || post.formattedPublishedDate || new Date(post.publishedAt).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const heroReadTime = readTime || post.readingTimeText || `${post.readingTime || 5} min read`;
  const heroBackgroundImage = backgroundImage || post.featuredImage;

  const handleShare = async (platform) => {
    const url = window.location.href;
    const shareText = `${heroTitle} - ${post.excerpt || ''}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
        break;
    }
  };

  return (
    <motion.section
      className="relative overflow-hidden"
      style={{ 
        height: height.desktop,
        minHeight: height.desktop 
      }}
      initial={animation.enabled ? { opacity: 0 } : {}}
      animate={animation.enabled ? { opacity: 1 } : {}}
      transition={{ 
        duration: animation.duration || 0.8, 
        delay: animation.delay || 0 
      }}
    >
      {/* Background Image */}
      <motion.div 
        className="w-full h-full"
        style={{ 
          backgroundImage: `url("${heroBackgroundImage}")`,
          backgroundPosition,
          backgroundSize,
          backgroundRepeat: 'no-repeat'
        }}
        animate={parallaxEnabled ? { 
          scale: [1, 1.1, 1],
          transition: { 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }
        } : {}}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` 
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-6xl px-4">
          <motion.h1
            className={`font-bold mb-4 sm:mb-6 leading-tight ${titleSize.desktop}`}
            initial={animation.enabled ? { opacity: 0, y: 30 } : {}}
            animate={animation.enabled ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: animation.duration || 0.8, 
              delay: (animation.delay || 0) + 0.2 
            }}
          >
            {heroTitle}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="text-xl md:text-2xl mb-6"
              initial={animation.enabled ? { opacity: 0, y: 20 } : {}}
              animate={animation.enabled ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: animation.duration || 0.8, 
                delay: (animation.delay || 0) + 0.4 
              }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 text-sm sm:text-base md:text-lg"
            initial={animation.enabled ? { opacity: 0, y: 20 } : {}}
            animate={animation.enabled ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: animation.duration || 0.8, 
              delay: (animation.delay || 0) + 0.6 
            }}
          >
            <span className="flex items-center gap-1">
              <User size={16} />
              {heroAuthor}
            </span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {heroPublishDate}
            </span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {heroReadTime}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Social Sharing */}
      {socialSharing.enabled && (
        <div className={`absolute ${socialSharing.position === 'bottom-right' ? 'bottom-6 right-6' : 
          socialSharing.position === 'bottom-left' ? 'bottom-6 left-6' :
          socialSharing.position === 'top-right' ? 'top-6 right-6' : 'top-6 left-6'}`}>
          <div className={`flex flex-col gap-2 ${socialSharing.style === 'glass' ? 'bg-black/20 backdrop-blur-sm rounded-lg p-2' : 
            socialSharing.style === 'solid' ? 'bg-white/10 rounded-lg p-2' : 'border border-white/30 rounded-lg p-2'}`}>
            {socialSharing.platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="text-white hover:text-yellow-400 transition-colors p-2"
                title={`Share on ${platform}`}
              >
                {platform === 'facebook' && <Facebook size={20} />}
                {platform === 'twitter' && <Twitter size={20} />}
                {platform === 'linkedin' && <Linkedin size={20} />}
                {platform === 'copy' && <Copy size={20} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};

// Text Section Component
const TextSection = ({ section }) => {
  const {
    content,
    hasDropCap = false,
    alignment = 'left',
    fontSize = 'base',
    fontFamily = 'inter',
    lineHeight = 'relaxed',
    dropCap = { enabled: false, size: 'text-4xl', color: 'text-gray-900', fontWeight: 'semibold', float: true },
    animation = { enabled: true, type: 'fadeIn', duration: 0.3, delay: 0.1 }
  } = section.data || {};

  if (!content) return null;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const fontFamilyClasses = {
    inter: 'font-inter',
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  };

  const lineHeightClasses = {
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  return (
    <motion.section
      className={`py-8 px-4 max-w-4xl mx-auto ${alignmentClasses[alignment]} ${fontSizeClasses[fontSize]} ${fontFamilyClasses[fontFamily]} ${lineHeightClasses[lineHeight]}`}
      initial={animation.enabled ? { opacity: 0, y: 20 } : {}}
      whileInView={animation.enabled ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: animation.duration || 0.3, 
        delay: animation.delay || 0.1 
      }}
    >
      {hasDropCap && dropCap.enabled ? (
        <div className="flex">
          <span className={`${dropCap.size} ${dropCap.color} ${dropCap.fontWeight} ${dropCap.float ? 'float-left mr-2' : ''}`}>
            {content.charAt(0)}
          </span>
          <div dangerouslySetInnerHTML={{ __html: content.slice(1) }} />
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </motion.section>
  );
};

// Image Section Component
const ImageSection = ({ section }) => {
  const {
    imageUrl,
    altText,
    caption,
    width,
    height,
    alignment = 'center',
    rounded = true,
    shadow = true
  } = section.data || {};

  if (!imageUrl) return null;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <motion.section
      className={`py-8 px-4 max-w-4xl mx-auto ${alignmentClasses[alignment]}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${rounded ? 'rounded-lg' : ''} ${shadow ? 'shadow-lg' : ''} overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={altText || ''}
          width={width || 800}
          height={height || 600}
          className="w-full h-auto"
        />
        {caption && (
          <p className="text-sm text-gray-600 mt-2 italic">{caption}</p>
        )}
      </div>
    </motion.section>
  );
};

// Gallery Section Component
const GallerySection = ({ section }) => {
  const {
    images = [],
    layout = 'grid',
    columns = 3,
    spacing = 'md',
    responsive = { mobile: { layout: 'grid', columns: 2 }, desktop: { layout: 'grid', columns: 3 } },
    hoverEffects = { enabled: true, scale: 1.03, shadow: true, overlay: true },
    animation = { enabled: true, type: 'fadeIn', duration: 0.5, stagger: 0.1 }
  } = section.data || {};

  if (!images.length) return null;

  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  return (
    <motion.section
      className="py-8 px-4 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: animation.duration || 0.5 }}
    >
      <div className={`grid ${gridColsClasses[columns]} ${spacingClasses[spacing]}`}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`${hoverEffects.enabled ? 'group cursor-pointer' : ''} ${hoverEffects.shadow ? 'shadow-lg' : ''} overflow-hidden rounded-lg`}
            initial={animation.enabled ? { opacity: 0, y: 20 } : {}}
            whileInView={animation.enabled ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: animation.duration || 0.5, 
              delay: (animation.delay || 0) + (index * (animation.stagger || 0.1))
            }}
            whileHover={hoverEffects.enabled ? { 
              scale: hoverEffects.scale,
              transition: { duration: 0.2 }
            } : {}}
          >
            <div className="relative">
              <Image
                src={image.url}
                alt={image.altText || ''}
                width={image.width || 400}
                height={image.height || 300}
                className="w-full h-auto"
              />
              {hoverEffects.overlay && hoverEffects.enabled && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              )}
              {image.caption && (
                <p className="text-sm text-gray-600 mt-2 p-2">{image.caption}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// Article Section Component
const ArticleSection = ({ section }) => {
  const {
    title,
    content,
    changingImages = [],
    pinnedImage,
    layout = { imageSize: 'medium', showPinnedImage: true, showChangingImages: true },
    animation = { enabled: true, type: 'fadeIn', duration: 0.5, delay: 0 }
  } = section.data || {};

  return (
    <motion.section
      className="py-8 px-4 max-w-4xl mx-auto"
      initial={animation.enabled ? { opacity: 0, y: 20 } : {}}
      whileInView={animation.enabled ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: animation.duration || 0.5, 
        delay: animation.delay || 0 
      }}
    >
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {content && (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
          
          {/* Images sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pinned Image */}
            {layout.showPinnedImage && pinnedImage?.url && (
              <div className="sticky top-8">
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                  <Image
                    src={pinnedImage.url}
                    alt={pinnedImage.altText || title || 'Article image'}
                    fill
                    className="object-cover"
                  />
                </div>
                {pinnedImage.caption && (
                  <p className="text-sm text-gray-600 mt-2">{pinnedImage.caption}</p>
                )}
              </div>
            )}
            
            {/* Changing Images */}
            {layout.showChangingImages && changingImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gallery</h3>
                {changingImages.map((image, index) => (
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
    </motion.section>
  );
};

// Popular Posts Section Component
const PopularPostsSection = ({ section, popularPosts = [] }) => {
  const {
    title = 'Popular Posts',
    description,
    featuredPost,
    sidePosts = []
  } = section.data || {};

  return (
    <motion.section
      className="py-12 px-4 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        {description && (
          <p className="text-lg text-gray-600">{description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Post */}
        {featuredPost && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {featuredPost.imageUrl && (
                <Image
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{featuredPost.readTime}</span>
                  <span>{featuredPost.publishDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Side Posts */}
        <div className="space-y-4">
          {sidePosts.map((post, index) => (
            <div key={index} className="flex gap-4 bg-white rounded-lg shadow-md overflow-hidden">
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={120}
                  height={80}
                  className="w-24 h-20 object-cover flex-shrink-0"
                />
              )}
              <div className="p-4 flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{post.title}</h4>
                <p className="text-gray-600 text-xs mb-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.readTime}</span>
                  <span>{post.publishDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Breadcrumb Section Component
const BreadcrumbSection = ({ section }) => {
  const {
    enabled = true,
    items = [],
    style = { separator: '>', textSize: 'sm', showHomeIcon: false, color: 'gray' }
  } = section.data || {};

  if (!enabled || !items.length) return null;

  const textSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  const colorClasses = {
    gray: 'text-gray-600',
    blue: 'text-blue-600',
    black: 'text-black'
  };

  return (
    <motion.nav
      className={`py-4 px-4 max-w-4xl mx-auto ${textSizeClasses[style.textSize]} ${colorClasses[style.color]}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2">
        {style.showHomeIcon && (
          <Link href="/" className="hover:text-gray-800">
            🏠
          </Link>
        )}
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2">{style.separator}</span>
            )}
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

// Main Dynamic Content Renderer
const DynamicContentRenderer = ({ post, popularPosts = [] }) => {
  const { contentSections = [] } = post;

  if (!contentSections || contentSections.length === 0) {
    // Fallback to default content if no sections are defined
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {contentSections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={index} section={section} post={post} />;
          case 'text':
            return <TextSection key={index} section={section} />;
          case 'article':
            return <ArticleSection key={index} section={section} />;
          case 'image':
            return <ImageSection key={index} section={section} />;
          case 'gallery':
            return <GallerySection key={index} section={section} />;
          case 'popular-posts':
            return <PopularPostsSection key={index} section={section} popularPosts={popularPosts} />;
          case 'breadcrumb':
            return <BreadcrumbSection key={index} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default DynamicContentRenderer;

