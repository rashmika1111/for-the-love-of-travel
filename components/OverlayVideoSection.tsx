'use client';

import * as React from 'react';
import Image from 'next/image';
import { normalizeImageSrc } from '@/lib/img';
import type { ContentSection } from '@/lib/cms';

interface OverlayVideoSectionProps {
  section: ContentSection & { type: 'video' };
}

export default function OverlayVideoSection({ section }: OverlayVideoSectionProps) {
  const videoSrc = section.videoUrl && section.videoUrl.trim() !== '' ? section.videoUrl : null;
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  return (
    <section className="relative w-full -mt-[45vh] z-30">
      {/* Overlapping video content - positioned to overlap main hero section */}
      <div 
        className="relative flex items-center justify-center pointer-events-none w-full"
        style={{
          height: section.height?.desktop || '80vh',
          paddingBottom: '120px', // Add extra space below the video section
        }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center text-white pointer-events-auto">
            {/* White rounded card with soft shadow */}
            <div className="max-w-5xl mx-auto bg-white rounded-[20px] md:rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <div className="p-5 md:p-10">
                {/* Hero-style video container with play button overlay */}
                <div className="relative w-full aspect-[16/9] rounded-[12px] md:rounded-[14px] overflow-hidden bg-black shadow-[0_10px_24px_rgba(0,0,0,0.18)] min-h-[520px]">
                  {videoSrc ? (
                    <>
                      {/* Video background */}
                      {section.poster ? (
                        <Image
                          src={normalizeImageSrc(section.poster)}
                          alt="Video thumbnail"
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <video
                          src={normalizeImageSrc(videoSrc)}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          muted={section.muted}
                          loop={section.loop}
                          preload="metadata"
                        />
                      )}
                      
                      {/* Dark overlay / vignette */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `
                            radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.55) 100%),
                            linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.45))
                          `
                        }}
                      />
                      
                      {/* Video player (hidden when paused) */}
                      {section.controls && (
                        <video
                          src={normalizeImageSrc(videoSrc)}
                          poster={section.poster ? normalizeImageSrc(section.poster) : undefined}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                          controls
                          autoPlay={section.autoplay}
                          muted={section.muted}
                          loop={section.loop}
                          preload="metadata"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                        />
                      )}
                      
                      {/* Hero-style play button - only show when not playing */}
                      {!isPlaying && (
                        <button 
                          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[88px] h-[54px] sm:w-[120px] sm:h-[72px] rounded-[12px] sm:rounded-[16px] bg-black/35 backdrop-blur-[2px] flex items-center justify-center border border-white/12 shadow-[0_12px_28px_rgba(0,0,0,0.35)] hover:bg-black/50 hover:scale-[1.04] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-all duration-[180ms] ease-out z-[2] cursor-pointer"
                          aria-label="Play video"
                          onClick={() => {
                            const video = document.querySelector('video');
                            if (video) {
                              video.play();
                            }
                          }}
                        >
                          {/* White triangle play icon */}
                          <span 
                            className="inline-block w-0 h-0 border-l-[16px] sm:border-l-[22px] border-t-[10px] sm:border-t-[14px] border-b-[10px] sm:border-b-[14px] border-l-white border-t-transparent border-b-transparent ml-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                          />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center">
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
                
                {/* Video title inside the card */}
                {section.title && (
                  <h1 className="mt-[18px] mb-2 font-extrabold text-[32px] md:text-[44px] leading-[1.2] text-[#111] font-[system-ui,-apple-system,'Segoe_UI',Roboto,Arial]">
                    {section.title}
                  </h1>
                )}
                
                {/* Video caption inside the card */}
                {section.caption && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 italic text-center">
                      {section.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
