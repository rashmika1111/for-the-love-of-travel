"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { safePlayVideo, safePauseAndResetVideo } from '../lib/video-utils';

export default function VideoAwarePostCard({ post, width, height, variant = "latest" }) {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const getMediaUrl = () => {
    // First check featuredMedia.url (this is the correct/current media)
    if (post.featuredMedia && post.featuredMedia.url) {
      return post.featuredMedia.url;
    }
    // Then check featuredImage (fallback for older posts)
    if (post.featuredImage && typeof post.featuredImage === 'string' && post.featuredImage.trim() !== '') {
      return post.featuredImage;
    }
    if (post.featuredImage && post.featuredImage.url) {
      return post.featuredImage.url;
    }
    // Fallback to a proper image that exists
    return '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
  };

  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi');
  };

  // Check if this is a video post - prioritize featuredMedia.type (authoritative source)
  const isVideoFromMedia = post.featuredMedia && post.featuredMedia.type === 'video';
  const isVideoFromImage = post.featuredImage && post.featuredImage.url && isVideoUrl(post.featuredImage.url);
  // Only use featuredImage video detection if featuredMedia.type is not available
  const isVideoPost = isVideoFromMedia || (!post.featuredMedia && isVideoFromImage);
  
  // Get the media URL that will actually be used
  const mediaUrl = getMediaUrl();
  const videoUrl = isVideoPost ? mediaUrl : null;
  const isValidVideoUrl = videoUrl && isVideoUrl(videoUrl);
  
  // For image posts, make sure we don't try to use video URLs
  const imageUrl = !isVideoPost ? mediaUrl : null;

  const handleMouseEnter = () => {
    if (videoRef.current && isVideoPost && isValidVideoUrl) {
      setIsVideoPlaying(true);
      safePlayVideo(videoRef.current, {
        onError: (error) => {
          console.warn('Video play error:', error);
          setIsVideoPlaying(false);
        },
        onSuccess: () => console.log('Video playing successfully')
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && isVideoPost) {
      setIsVideoPlaying(false);
      safePauseAndResetVideo(videoRef.current, {
        onError: (error) => console.warn('Video pause/reset error:', error),
        onSuccess: () => console.log('Video paused and reset successfully')
      });
    }
  };

  // New LatestPostCard variant with inline styles (matching original PostCard structure)
  if (variant === "latest") {
    return (
      <Link href={`/content/${post.slug}`}>
        <motion.div 
          className="w-full lg:w-auto"
          style={{
            width: width === '100%' ? '100%' : (width || '450px'),
            height: height || '180px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            cursor: 'pointer',
            // Remove minHeight to prevent stretching, use fixed height instead
            maxHeight: height || '180px'
          }}
          initial={{ scale: 1, y: 0 }}
          whileHover={{ 
            scale: 1.02,
            y: -5,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.3
            }
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        {/* Background Media with Zoom Effect */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1
          }}
          initial={{ scale: 1 }}
          whileHover={{ 
            scale: 1.1,
            transition: { 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              duration: 0.4
            }
          }}
        >
          {isVideoPost && isValidVideoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                // Ensure video maintains aspect ratio and doesn't stretch
                minHeight: '100%',
                minWidth: '100%'
              }}
              muted
              preload="metadata"
              onError={(e) => {
                console.warn('Video load error, falling back to image:', {
                  src: e.target.src,
                  error: e.target.error,
                  networkState: e.target.networkState,
                  readyState: e.target.readyState
                });
                // Fallback to image if video fails
                e.target.style.display = 'none';
                const img = e.target.nextElementSibling;
                if (img) {
                  img.style.display = 'block';
                }
              }}
            />
          ) : null}
          
          {/* Image fallback or primary image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              style={{
                display: isVideoPost && isValidVideoUrl ? 'none' : 'block',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={(e) => {
                e.target.src = '/images/3969146248009e641f454298f62e13de84ac0a09.jpg';
              }}
            />
          )}
          
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }} />
        </motion.div>

        {/* Top Section with Category Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginBottom: 'auto'
        }}>
          <button style={{
            width: width === '100%' ? '70px' : '90px',
            height: width === '100%' ? '24px' : '30px',
            border: '1px solid #FFFFFF',
            borderRadius: '12px',
            padding: width === '100%' ? '4px 8px' : '8px',
            gap: '8px',
            background: 'transparent',
            color: '#FFFFFF',
            fontSize: width === '100%' ? '9px' : '11px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {post.category}
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: 'auto',
          // Limit text width to prevent stretching on very wide cards
          maxWidth: '100%'
        }}>
          <h3 style={{
            fontSize: width === '100%' ? '14px' : '16px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: '1.3',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            // Prevent text from stretching too wide
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}>
            {post.title}
          </h3>
          <p style={{
            fontSize: width === '100%' ? '10px' : '12px',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: '1.5',
            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)',
            // Prevent text from stretching too wide
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}>
            {post.excerpt}
          </p>
        </div>

        {/* Bottom Section with Metadata */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}>
          <div style={{
            width: width === '100%' ? '140px' : '180px',
            height: '20px',
            gap: width === '100%' ? '8px' : '16px',
            display: 'flex',
            alignItems: 'center',
            fontSize: width === '100%' ? '9px' : '11px',
            color: '#FFFFFF',
            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)'
          }}>
            <span>{post.readTime}</span>
            <span>|</span>
            <span>{post.category}</span>
            <span>|</span>
            <span>{post.date}</span>
          </div>
        </div>
        </motion.div>
      </Link>
    );
  }

  // Fallback to basic PostCard for other variants
  return (
    <div style={{ width: width, height: height }}>
      <div className="bg-gray-200 rounded-xl h-full flex items-center justify-center">
        <span className="text-gray-500">Post Card</span>
      </div>
    </div>
  );
}
