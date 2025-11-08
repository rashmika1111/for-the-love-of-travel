'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { Play } from "lucide-react";

const VideoCard = ({ 
  // Props for second implementation
  videoSrc = "/video.mp4",
  thumbnail = "/vi.png",
  title = "",
  description = "",
  duration = "5:30",
  size = "small", // "small" or "large"
  metadata = null, // Additional metadata for small cards
  content = null, // Additional content field for small cards

  // Props for first implementation
  video = null
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCardClick = () => {
    setIsPlaying(!isPlaying);
  };

  // Size-based styling (for second version)
  const cardStyles = size === "large" ? {
    width: 'w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:w-[666.18px]',
    height: 'h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[540.86px]',
    borderRadius: 'rounded-2xl sm:rounded-3xl',
    playIconSize: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-[136px] xl:h-[136px]',
    contentPadding: 'p-4 sm:p-6 md:p-8 lg:p-9',
    titleFontSize: 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl',
    descriptionFontSize: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
    durationFontSize: 'text-sm sm:text-base md:text-lg lg:text-xl',
    contentMargin: 'mb-2 sm:mb-3 md:mb-4 lg:mb-5',
    durationPadding: 'px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-2',
    durationBorderRadius: 'rounded-md sm:rounded-lg'
  } : {
    width: 'w-full max-w-xs sm:w-56 lg:w-[214.51px]',
    height: 'h-32 sm:h-36 lg:h-[150px]',
    borderRadius: 'rounded-lg',
    playIconSize: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-[38.08px] lg:h-[38.08px]',
    contentPadding: 'p-2 sm:p-3 lg:p-2',
    titleFontSize: 'text-xs sm:text-sm lg:text-xs',
    descriptionFontSize: 'text-xs sm:text-sm lg:text-xs',
    durationFontSize: 'text-xs sm:text-sm lg:text-xs',
    contentMargin: 'mb-1 sm:mb-2 lg:mb-1',
    durationPadding: 'px-2 py-1 sm:px-3 sm:py-1 lg:px-2 lg:py-1',
    durationBorderRadius: 'rounded-md'
  };

  // --- If "video" prop is passed → use the first implementation ---
  if (video) {
    return (
      <article className="card overflow-hidden group">
        <div className="relative h-44">
          <Image 
            src={video.image} 
            alt={video.title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 grid place-items-center">
            <button className="h-12 w-12 rounded-full bg-white/90 grid place-items-center">
              <Play className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium">{video.title}</h3>
          <p className="text-sm text-black/60">{video.meta}</p>
        </div>
      </article>
    );
  }

  // --- Otherwise use the second implementation ---
  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className={`${cardStyles.width} ${cardStyles.height} ${cardStyles.borderRadius} overflow-hidden relative cursor-pointer flex flex-col justify-center items-center`}
        style={{
          backgroundImage: `url('${thumbnail}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: size === "large" ? '200px' : '120px'
        }}
        onClick={handleCardClick}
      >
        {/* Video Player */}
        {isPlaying && (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
            autoPlay
            controls
            onEnded={() => setIsPlaying(false)}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Play Icon Overlay */}
        {!isPlaying && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center items-center">
            <img 
              src="/viicon.png" 
              alt="Play Video"
              className={`${cardStyles.playIconSize} drop-shadow-lg`}
            />
          </div>
        )}

        {/* Dark Overlay */}
        {!isPlaying && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-0" />
        )}

        {/* Content Overlay */}
        {!isPlaying && (
          <div className={`absolute bottom-0 left-0 right-0 ${cardStyles.contentPadding} z-10 text-white`}>
            <h3 className={`${cardStyles.titleFontSize} font-bold ${cardStyles.contentMargin} text-shadow-lg`}>
              {title}
            </h3>
            <p className={`${cardStyles.descriptionFontSize} ${cardStyles.contentMargin} text-shadow-lg leading-relaxed`}>
              {description}
            </p>
            <div className="flex justify-between items-center">
              <span className={`${cardStyles.durationFontSize} bg-black/70 ${cardStyles.durationPadding} ${cardStyles.durationBorderRadius} text-shadow-lg`}>
                {duration}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content field for small cards - below the card */}
      {size === "small" && content && (
        <div className="mt-2 p-2 sm:p-3 bg-amber-50 rounded-lg text-xs sm:text-sm text-gray-800 text-center w-full font-medium leading-relaxed">
          {content}
        </div>
      )}
      
      {/* Metadata for small cards - below the content */}
      {size === "small" && metadata && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md text-xs text-gray-600 text-center w-full">
          {metadata}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
