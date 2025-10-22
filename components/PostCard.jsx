"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PostCard({ post, width, height, variant = "default" }) {
  // New LatestPostCard variant with inline styles
  if (variant === "latest") {
    return (
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
          minHeight: width === '100%' ? '200px' : '240px'
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
      >
        {/* Background Image with Zoom Effect */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%), url('${post.image}')`,
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
        {/* Top Section with Tour Button */}
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
          marginBottom: 'auto'
        }}>
          <h3 style={{
            fontSize: width === '100%' ? '14px' : '16px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: '1.3',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            {post.title}
          </h3>
          <p style={{
            fontSize: width === '100%' ? '10px' : '12px',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: '1.5',
            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.7)'
          }}>
            {post.excerpt}
          </p>
        </div>

        {/* Bottom Section with Metadata - Right */}
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
    );
  }

  // Original PostCard design
  return (
    <article className="relative overflow-hidden rounded-2xl shadow-smooth group h-full">
      <div className="relative h-full min-h-[360px]">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Category Badge */}
      <div className="absolute left-5 top-5">
        <span className="inline-block px-4 py-2 text-sm font-medium text-white/80 bg-white/20 backdrop-blur-sm rounded-full uppercase tracking-wide">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
        <h3 className="text-2xl font-bold leading-tight mb-3 drop-shadow-lg">
          {post.title}
        </h3>
        <p className="text-white/90 text-base leading-relaxed mb-5 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 text-sm text-white/80">
          <span>{post.readTime}</span>
          <span className="text-white/40">|</span>
          <span>{post.date}</span>
        </div>
      </div>
    </article>
  );
}