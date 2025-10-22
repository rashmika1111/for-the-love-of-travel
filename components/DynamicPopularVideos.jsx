"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Play } from 'lucide-react';

// Placeholder for skeleton loader
const VideoSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
    ))}
  </div>
);

// Video Modal Component
const VideoModal = ({ video, isOpen, onClose, onTrackView }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [playTime, setPlayTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsLoading(true);
      setPlayTime(0);
      setVideoDuration(0);
      
      // Track video view when modal opens
      if (video && video._id && onTrackView) {
        console.log('Tracking video view for:', video._id);
        onTrackView(video._id);
      }
    }
  }, [isOpen, video, onTrackView]);

  // Track final play time when modal closes
  useEffect(() => {
    return () => {
      if (videoRef.current && playTime > 0 && videoDuration > 0) {
        trackPlayTime(playTime, videoDuration);
      }
    };
  }, [playTime, videoDuration]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleVideoEnd = () => {
    // Video ended - can add any cleanup logic here if needed
  };

  // Track play time periodically
  const trackPlayTime = async (currentTime, duration) => {
    if (currentTime > 0 && duration > 0) {
      try {
        await fetch(`http://localhost:5000/api/v1/homepage-content/videos/${video._id}/playtime`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playTime: currentTime,
            duration: duration
          }),
        });
      } catch (error) {
        console.error('Error tracking play time:', error);
      }
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-95 z-[9999] flex items-center justify-center p-4 pt-20"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video */}
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-contain"
            poster={video.thumbnail}
            controls
            controlsList="nodownload"
            onEnded={handleVideoEnd}
            onLoadedData={() => setIsLoading(false)}
            onLoadedMetadata={(e) => {
              setVideoDuration(e.target.duration);
              setIsLoading(false);
            }}
            onTimeUpdate={(e) => {
              const currentTime = e.target.currentTime;
              const duration = e.target.duration;
              setPlayTime(currentTime);
              
              // Track play time every 5 seconds
              if (Math.floor(currentTime) % 5 === 0 && currentTime > 0) {
                trackPlayTime(currentTime, duration);
              }
            }}
            onPause={(e) => {
              // Track play time when video is paused
              const currentTime = e.target.currentTime;
              const duration = e.target.duration;
              if (currentTime > 0) {
                trackPlayTime(currentTime, duration);
              }
            }}
            onSeeked={(e) => {
              // Track play time when user seeks to a different position
              const currentTime = e.target.currentTime;
              const duration = e.target.duration;
              if (currentTime > 0) {
                trackPlayTime(currentTime, duration);
              }
            }}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}


        </div>

        {/* Video Info */}
        <div className="p-6 text-gray-900">
          <h3 className="text-2xl font-bold mb-2">{video.title}</h3>
          {video.description && (
            <p className="text-gray-600 mb-4">{video.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{video.duration}</span>
            <span>•</span>
            <span>{new Date(video.publishDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DynamicPopularVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track video interactions
  const trackVideoClick = async (videoId) => {
    try {
      if (!videoId) {
        console.warn('No video ID provided for click tracking');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/v1/homepage-content/videos/${videoId}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to track video click:', response.status);
      }
    } catch (error) {
      console.error('Error tracking video click:', error);
    }
  };

  const trackVideoView = async (videoId) => {
    try {
      if (!videoId) {
        console.warn('No video ID provided for view tracking');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/v1/homepage-content/videos/${videoId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to track video view:', response.status);
      }
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Use the new popular videos endpoint that sorts by views
        const response = await fetch('http://localhost:5000/api/v1/homepage-content/videos/popular?limit=8');
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <section
        id="videos"
        className="section"
        style={{ background: "linear-gradient(to right, #F7ECD5, #EEC9F9)" }}
      >
        <div className="container mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Popular Videos
              </h2>
              <div className="w-96 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          <VideoSkeleton />
        </div>
      </section>
    );
  }

  if (error || videos.length === 0) {
    return null; // Don't render the section if there are no videos or error
  }

  return (
    <section
      id="videos"
      className="section"
      style={{ background: "linear-gradient(to right, #F7ECD5, #EEC9F9)" }}
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Popular Videos
            </h2>
            <div className="w-96 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Videos Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
          {videos.map((video, i) => (
            <motion.article
              key={video._id}
              className="bg-transparent rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20
                }
              }}
              onClick={() => {
                trackVideoClick(video._id); // Track click
                setSelectedVideo(video);
                setIsModalOpen(true);
              }}
            >
              {/* Video Image */}
              <div className="h-48 sm:h-56 rounded-xl overflow-hidden border-4 sm:border-8 border-white group relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={300}
                  height={224}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-tight mb-3 sm:mb-4 line-clamp-2">
                  {video.title}
                </h3>
                <div className="text-gray-600 text-xs sm:text-sm space-y-1">
                  <div>
                    {video.duration && video.duration !== 'Unknown duration' ? video.duration : 'Unknown duration'} · {new Date(video.publishDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-end">
          <motion.button
            className="px-6 py-3 text-white rounded-2xl font-medium transition-colors flex items-center gap-3 text-lg"
            style={{ backgroundColor: "#3514EE" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View More
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVideo(null);
        }}
        onTrackView={trackVideoView}
      />
    </section>
  );
}
