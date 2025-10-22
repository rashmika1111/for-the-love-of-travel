"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Search, Play, Zap } from "lucide-react";

export default function DynamicHero() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolve media URLs that might be relative (e.g. from the admin media proxy)
  const resolveUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Default backend base for dev; adjust via env if needed
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    // Ensure single slash
    return `${base}/${url.startsWith('/') ? url.slice(1) : url}`;
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/homepage-content/hero`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setHeroData(data.data);
      } else {
        // Use default hero data if no data is found
        setHeroData({
          content: {
            hero: {
              title: 'Beyond the Horizon Stories That Move You',
              subtitle: '',
              backgroundImage: '/images/balloon4to.png',
              backgroundVideo: '',
              searchPlaceholder: 'Search Blog Post',
              showSearch: true,
              showPlayButton: true,
              showBoostButton: true,
              overlayOpacity: 0.5,
              titleColor: '#ffffff',
              titleSize: '74px',
              titleWeight: '600',
              textAlignment: 'center',
              height: '100vh',
              borderRadius: '86px'
            }
          },
          isActive: true
        });
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setError('Failed to load hero section');
      // Use default data on error
      setHeroData({
        content: {
          hero: {
            title: 'Beyond the Horizon Stories That Move You',
            subtitle: '',
            backgroundImage: '/images/balloon4to.png',
            backgroundVideo: '',
            searchPlaceholder: 'Search Blog Post',
            showSearch: true,
            showPlayButton: true,
            showBoostButton: true,
            overlayOpacity: 0.5,
            titleColor: '#ffffff',
            titleSize: '74px',
            titleWeight: '600',
            textAlignment: 'center',
            height: '100vh',
            borderRadius: '86px'
          }
        },
        isActive: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8">
          <div 
            className="relative overflow-hidden -mt-8 bg-gray-200 animate-pulse"
            style={{
              height: '100vh',
              borderBottomRightRadius: '86px',
              borderBottomLeftRadius: '86px'
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <div className="h-16 bg-gray-300 rounded w-3/4 mb-8"></div>
              <div className="h-12 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !heroData || !heroData.isActive) {
    // Fallback to default hero if there's an error or hero is inactive
    return (
      <section className="relative w-full overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8">
          <div 
            className="relative overflow-hidden -mt-8"
            style={{
              height: '100vh',
              borderBottomRightRadius: '86px',
              borderBottomLeftRadius: '86px'
            }}
          >
            <Image
              src="/images/balloon4to.png"
              alt="Hot air balloons over landscape"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h1 
                className="max-w-6xl text-white text-center drop-shadow-md"
                style={{
                  fontFamily: 'var(--font-roboto)',
                  fontWeight: 600,
                  fontSize: '74px',
                  lineHeight: '74px',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                Beyond the Horizon Stories<br className="hidden sm:block"/> That Move You
              </h1>
              <div className="mt-6 sm:mt-8 w-full flex justify-center relative">
                <div style={{
                  width: '518px',
                  height: '60px',
                  opacity: 1,
                  borderRadius: '14px',
                  paddingTop: '16px',
                  paddingRight: '24px',
                  paddingBottom: '16px',
                  paddingLeft: '24px',
                  gap: '10px',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Search className="h-5 w-5 text-white/80" style={{ marginRight: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search Blog Post"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'white',
                      fontSize: '16px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex gap-3 sm:gap-4">
              <button
                style={{
                  width: '54.44px',
                  height: '54.44px',
                  opacity: 1,
                  borderRadius: '31.19px',
                  paddingTop: '13.61px',
                  paddingRight: '14.18px',
                  paddingBottom: '13.61px',
                  paddingLeft: '14.18px',
                  gap: '5.67px',
                  borderWidth: '0.57px',
                  borderColor: 'rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(12px)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                }}
                aria-label="Play"
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                style={{
                  width: '54.44px',
                  height: '54.44px',
                  opacity: 1,
                  borderRadius: '31.19px',
                  paddingTop: '13.61px',
                  paddingRight: '14.18px',
                  paddingBottom: '13.61px',
                  paddingLeft: '14.18px',
                  gap: '5.67px',
                  borderWidth: '0.57px',
                  borderColor: 'rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(12px)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.25)';
                }}
                aria-label="Boost"
              >
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const hero = heroData.content.hero;
  const bgImageUrl = resolveUrl(hero.backgroundImage);
  const bgVideoUrl = resolveUrl(hero.backgroundVideo);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden -mt-8"
          style={{
            height: hero.height,
            borderBottomRightRadius: hero.borderRadius,
            borderBottomLeftRadius: hero.borderRadius
          }}
        >
          {/* Background Image */}
          {bgImageUrl && (
            <Image
              src={bgImageUrl}
              alt="Hero background"
              fill
              className="object-cover object-center"
              priority
            />
          )}

          {/* Background Video */}
          {bgVideoUrl && (
            <video
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={bgVideoUrl} type="video/mp4" />
            </video>
          )}

          {/* Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,${hero.overlayOpacity}), rgba(0,0,0,${hero.overlayOpacity * 0.4}), rgba(0,0,0,${hero.overlayOpacity * 0.2}))`
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 
              className="max-w-6xl text-white drop-shadow-md"
              style={{
                fontFamily: 'var(--font-roboto)',
                fontWeight: parseInt(hero.titleWeight),
                fontSize: hero.titleSize,
                lineHeight: hero.titleSize,
                color: hero.titleColor,
                textAlign: hero.textAlignment
              }}
            >
              {hero.title}
            </h1>

            {hero.subtitle && (
              <p className="mt-4 text-white text-lg opacity-90">
                {hero.subtitle}
              </p>
            )}

            {/* Search Bar */}
            {hero.showSearch && (
              <div className="mt-6 sm:mt-8 w-full flex justify-center relative">
                <div style={{
                  width: '518px',
                  height: '60px',
                  opacity: 1,
                  borderRadius: '14px',
                  paddingTop: '16px',
                  paddingRight: '24px',
                  paddingBottom: '16px',
                  paddingLeft: '24px',
                  gap: '10px',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Search className="h-5 w-5 text-white/80" style={{ marginRight: '10px' }} />
                  <input
                    type="text"
                    placeholder={hero.searchPlaceholder}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'white',
                      fontSize: '16px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          {(hero.showPlayButton || hero.showBoostButton) && (
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex gap-3 sm:gap-4">
              {hero.showPlayButton && (
                <button
                  style={{
                    width: '54.44px',
                    height: '54.44px',
                    opacity: 1,
                    borderRadius: '31.19px',
                    paddingTop: '13.61px',
                    paddingRight: '14.18px',
                    paddingBottom: '13.61px',
                    paddingLeft: '14.18px',
                    gap: '5.67px',
                    borderWidth: '0.57px',
                    borderColor: 'rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(12px)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  aria-label="Play"
                >
                  <Play className="h-4 w-4" />
                </button>
              )}
              {hero.showBoostButton && (
                <button
                  style={{
                    width: '54.44px',
                    height: '54.44px',
                    opacity: 1,
                    borderRadius: '31.19px',
                    paddingTop: '13.61px',
                    paddingRight: '14.18px',
                    paddingBottom: '13.61px',
                    paddingLeft: '14.18px',
                    gap: '5.67px',
                    borderWidth: '0.57px',
                    borderColor: 'rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(12px)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.25)';
                  }}
                  aria-label="Boost"
                >
                  <Zap className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
