"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { safePlayVideo, safePauseAndResetVideo } from '@/lib/video-utils';

export default function LatestPostCard({ width = '382px', height = '146px', image, featuredMedia, title, description, readTime, categories = [], category, publishedDate, slug, onClick }) {
  const href = slug ? `/content/${slug}` : '/content';
  const videoRef = useRef(null);
  
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className="latest-post-card"
        style={{
          width: width,
          height: height,
          borderRadius: '10px', // 20px * 0.5 = 10px (50% smaller)
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px', // 24px * 0.5 = 12px (50% smaller)
          cursor: 'pointer'
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
        onMouseEnter={() => {
          if (videoRef.current && featuredMedia?.type === 'video') {
            console.log('Card hover enter - playing video');
            safePlayVideo(videoRef.current, {
              onError: (error) => console.warn('Video play error:', error),
              onSuccess: () => console.log('Video playing successfully')
            });
          }
        }}
        onMouseLeave={() => {
          if (videoRef.current && featuredMedia?.type === 'video') {
            console.log('Card hover leave - pausing video');
            safePauseAndResetVideo(videoRef.current, {
              onError: (error) => console.warn('Video pause/reset error:', error),
              onSuccess: () => console.log('Video paused and reset successfully')
            });
          }
        }}
      >
      {/* Background Media with Zoom Effect */}
      {(() => {
        // Determine media URL and type (prioritize featuredMedia over image)
        const rawMediaUrl = featuredMedia?.url || image;
        const mediaType = featuredMedia?.type || 'image';
        
        // Construct proper URL based on media type
        let mediaUrl = rawMediaUrl;
        if (mediaType === 'video' && rawMediaUrl && !rawMediaUrl.startsWith('http') && !rawMediaUrl.startsWith('/') && !rawMediaUrl.startsWith('data:')) {
          // For videos, use admin backend URL (port 5000)
          mediaUrl = `http://localhost:5000/api/v1/media/serve/${encodeURIComponent(rawMediaUrl)}`;
        }
        
        if (!mediaUrl) return null;
        
        if (mediaType === 'video') {
          return (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                overflow: 'hidden'
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
              <video
                ref={videoRef}
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Video gradient overlay - make it transparent to mouse events */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              {/* Video badge - make it transparent to mouse events */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    fontSize: '8px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      background: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '0',
                        height: '0',
                        borderLeft: '2px solid black',
                        borderTop: '1px solid transparent',
                        borderBottom: '1px solid transparent'
                      }}
                    />
                  </div>
                  Video
                </div>
              </div>
            </motion.div>
          );
        } else {
          return (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%), url("${mediaUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
            />
          );
        }
      })()}
      {/* Top Section with Category Tags */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 'auto',
        flexWrap: 'wrap',
        gap: '6px'
      }}>
        {/* Category Tags - Top Left */}
        {categories && categories.length > 0 ? (
          categories.slice(0, 3).map((cat, index) => (
            <span
              key={cat._id || index}
              className="category-tag"
              style={{
                padding: '4px 8px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)',
                transition: 'all 0.2s ease',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.borderColor = '#FFFFFF';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {cat.name || cat}
            </span>
          ))
        ) : (
          <span
            className="category-tag"
            style={{
              padding: '4px 8px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF',
              fontSize: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)',
              transition: 'all 0.2s ease'
            }}
          >
            {category || 'Travel'}
          </span>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px', // 16px * 0.5 = 8px (50% smaller)
        marginBottom: 'auto'
      }}>
        <h3 className="card-title" style={{
          fontSize: '16.5px', // 15px * 1.1 = 16.5px (35% total increase)
          fontWeight: 'bold',
          color: '#FFFFFF',
          margin: 0,
          lineHeight: '1.3',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)' // 2px * 0.5 = 1px (50% smaller)
        }}>
          {title || "Discover Hidden Gems: Sri Lanka's Secret Beaches"}
        </h3>
        <p className="card-description" style={{
          fontSize: '11px', // 10px * 1.1 = 11px (35% total increase)
          color: '#FFFFFF',
          margin: 0,
          lineHeight: '1.5',
          textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)' // 1px * 0.5 = 0.5px (50% smaller)
        }}>
          {description || "Explore the untouched beauty of Sri Lanka's hidden coastal treasures. From pristine white sand beaches to crystal clear waters, discover the island's best-kept secrets that offer tranquility away from the crowds."}
        </p>
      </div>

      {/* Bottom Section with Metadata - Right */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
      }}>
        {/* Metadata Section */}
        <div className="card-metadata" style={{
          width: '127px', // 254px * 0.5 = 127px (50% smaller)
          height: '14px', // 28px * 0.5 = 14px (50% smaller)
          gap: '12px', // 24px * 0.5 = 12px (50% smaller)
          display: 'flex',
          alignItems: 'center',
          fontSize: '9px', // 14px * 0.5 = 7px (50% smaller)
          color: '#FFFFFF',
          textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)' // 1px * 0.5 = 0.5px (50% smaller)
        }}>
          <span>{readTime || "8 min read"}</span>
          <span>|</span>
          <span>{publishedDate || "Dec 15, 2024"}</span>
        </div>
      </div>

      {/* Mobile-specific CSS - Only applies to mobile, desktop remains unchanged */}
      <style jsx>{`
        @media screen and (max-width: 768px) {
          :global(.latest-post-card) {
            width: 100% !important;
            max-width: 350px !important;
            height: 200px !important;
            margin: 0 auto !important;
          }
          
          :global(.category-tag) {
            font-size: 10px !important;
            padding: 6px 10px !important;
            max-width: 100px !important;
          }
          
          :global(.card-title) {
            font-size: 19.25px !important;
            margin-bottom: 8px !important;
          }
          
          :global(.card-description) {
            font-size: 15.125px !important;
            line-height: 1.4 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          
          :global(.card-metadata) {
            width: auto !important;
            height: auto !important;
            font-size: 12.375px !important;
            gap: 8px !important;
          }
        }
        
        @media screen and (max-width: 480px) {
          :global(.latest-post-card) {
            max-width: 100% !important;
            height: 180px !important;
            margin: 0 10px !important;
          }
          
          :global(.category-tag) {
            font-size: 9px !important;
            padding: 5px 8px !important;
            max-width: 90px !important;
          }
          
          :global(.card-title) {
            font-size: 17.875px !important;
          }
          
          :global(.card-description) {
            font-size: 13.75px !important;
            -webkit-line-clamp: 2 !important;
          }
          
          :global(.card-metadata) {
            font-size: 11px !important;
            gap: 6px !important;
          }
        }
        
        /* Ensure desktop framer motion is preserved */
        @media screen and (min-width: 769px) {
          :global(.latest-post-card) {
            /* Desktop styles remain unchanged - framer motion works normally */
          }
        }
      `}</style>
      </motion.div>
    </Link>
  );
}
