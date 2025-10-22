"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';

// Video Modal Component
const VideoModal = ({ video, isOpen, onClose, onTrackView, onTrackClick }) => {
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
      if (video && onTrackView) {
        console.log('Tracking featured video view');
        onTrackView();
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
        await fetch(`http://localhost:5000/api/v1/homepage-content/featured-video/playtime`, {
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
        console.error('Error tracking featured video play time:', error);
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
              // Track play time when video is seeked
              const currentTime = e.target.currentTime;
              const duration = e.target.duration;
              if (currentTime > 0) {
                trackPlayTime(currentTime, duration);
              }
            }}
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-600 mb-4">{video.description}</p>
          )}
          {video.duration && (
            <div className="text-sm text-gray-500">
              Duration: {video.duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DynamicFeaturedVideo() {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track video interactions
  const trackVideoClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/homepage-content/featured-video/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to track featured video click:', response.status);
      }
    } catch (error) {
      console.error('Error tracking featured video click:', error);
    }
  };

  const trackVideoView = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/homepage-content/featured-video/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to track featured video view:', response.status);
      }
    } catch (error) {
      console.error('Error tracking featured video view:', error);
    }
  };

  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/v1/homepage-content/featured-video');
        const data = await response.json();
        
        if (data.success && data.data) {
          setFeaturedVideo(data.data.content.featuredVideo);
        } else {
          setFeaturedVideo(null);
        }
      } catch (err) {
        console.error('Error fetching featured video:', err);
        setError('Failed to load featured video');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVideo();
  }, []);

  const handleVideoClick = () => {
    trackVideoClick();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container px-4 sm:px-0">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-smooth bg-gray-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredVideo || !featuredVideo.isActive) {
    return null; // Don't render the section if there's no featured video or error
  }

  return (
    <>
      <section className="section">
        <div className="container px-4 sm:px-0">
          <motion.div 
            className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-smooth group cursor-pointer"
            onClick={handleVideoClick}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title || 'Featured video'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        video={featuredVideo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTrackView={trackVideoView}
        onTrackClick={trackVideoClick}
      />
    </>
  );
}
