"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SafeImage from "./content/SafeImage";
import { normalizeImageSrc } from "../lib/img";

/**
 * DynamicPinnedImageOverlay
 *
 * A dynamic scroll section where a full-bleed image stays pinned while article content
 * scrolls on top of it. Uses data from the Article with Images editor.
 *
 * Works great in Next.js (App Router). Uses no external deps and respects
 * `prefers-reduced-motion`.
 *
 * @param {Object} props
 * @param {Object} props.articleSection - Article section data from CMS
 * @param {string} props.articleSection.title - Article title
 * @param {string} props.articleSection.content - Article content (HTML)
 * @param {Array} props.articleSection.changingImages - Array of images for crossfade
 * @param {Object} props.articleSection.pinnedImage - Pinned image data
 * @param {Object} props.articleSection.layout - Layout configuration
 * @param {Object} props.articleSection.animation - Animation configuration
 * @param {number} props.viewportVh - Viewport height percentage (default: 100)
 * @param {boolean} props.scrim - Whether to show gradient overlay (default: true)
 * @param {React.ReactNode} props.lead - Optional lead content
 */
export default function DynamicPinnedImageOverlay({
  articleSection,
  viewportVh = 100,
  scrim = true,
  lead,
}) {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const vh = Math.max(40, Math.min(140, viewportVh));

  // Extract data from article section with safe defaults
  const {
    title = '',
    content = '',
    changingImages = [],
    pinnedImage = { url: '', altText: '', caption: '' },
    layout = { imageSize: 'medium', showPinnedImage: true, showChangingImages: true },
    animation = { enabled: true, type: 'fadeIn', duration: 0.5, delay: 0 }
  } = articleSection || {};

  // Prepare images for crossfade effect
  const imageList = React.useMemo(() => {
    const images = [];
    
    // Add pinned image if available and enabled
    if (layout.showPinnedImage && pinnedImage?.url) {
      const normalizedUrl = normalizeImageSrc(pinnedImage.url);
      if (normalizedUrl) {
        images.push(normalizedUrl);
      }
    }
    
    // Add changing images if available and enabled
    if (layout.showChangingImages && changingImages.length > 0) {
      const validImages = changingImages
        .filter(img => img?.url)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(img => normalizeImageSrc(img.url))
        .filter(Boolean);
      images.push(...validImages);
    }
    
    return images;
  }, [pinnedImage, changingImages, layout]);

  // State for article chunks
  const [articleChunks, setArticleChunks] = React.useState([]);

  // Function to apply static styling to content
  const applyStaticStyling = (htmlContent) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return htmlContent;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const paragraphs = tempDiv.querySelectorAll('p');
    
    paragraphs.forEach((p, index) => {
      // Apply the static styling classes
      p.className = "text-gray-900 sm:text-gray-800 leading-normal mb-4 sm:mb-8 text-base sm:text-lg md:text-xl";
      p.style.fontFamily = "Inter";
      
      // Add drop cap to the first paragraph of each chunk
      if (index === 0) {
        const text = p.textContent || '';
        if (text.length > 0) {
          const firstLetter = text.charAt(0);
          const restOfText = text.slice(1);
          
          // Create the styled paragraph with drop cap
          p.innerHTML = `
            <span class="float-left mr-3 text-6xl sm:text-7xl lg:text-8xl font-semibold leading-none text-gray-900">
              ${firstLetter}
            </span>
            ${restOfText}
          `;
        }
      }
    });
    
    return tempDiv.innerHTML;
  };

  // Parse content into article chunks for scrolling
  React.useEffect(() => {
    if (!content) {
      setArticleChunks([]);
      return;
    }
    
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Server-side rendering: create a simple chunk with the full content
      setArticleChunks([{
        id: 'chunk-0',
        content: content,
        type: 'content'
      }]);
      return;
    }
    
    // Client-side: Split content by paragraphs and create chunks
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const paragraphs = Array.from(tempDiv.querySelectorAll('p'));
    
    const chunks = [];
    let currentChunk = '';
    
    paragraphs.forEach((p, index) => {
      const text = p.textContent || '';
      
      // If this is a short paragraph or we're starting a new chunk
      if (text.length < 200 || currentChunk.length === 0) {
        currentChunk += p.outerHTML;
      } else {
        // Save current chunk and start new one
        if (currentChunk) {
          chunks.push({
            id: `chunk-${chunks.length}`,
            content: applyStaticStyling(currentChunk),
            type: 'paragraph'
          });
        }
        currentChunk = p.outerHTML;
      }
      
      // If this is the last paragraph, add the current chunk
      if (index === paragraphs.length - 1 && currentChunk) {
        chunks.push({
          id: `chunk-${chunks.length}`,
          content: applyStaticStyling(currentChunk),
          type: 'paragraph'
        });
      }
    });
    
    // If no chunks were created, create one with the full content
    if (chunks.length === 0 && content) {
      chunks.push({
        id: 'chunk-0',
        content: applyStaticStyling(content),
        type: 'content'
      });
    }
    
    setArticleChunks(chunks);
  }, [content]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Find the scrollable content container
    const scrollContainer = scrollContainerRef.current;
    const mobileArticleContainer = el.querySelector('.h-screen.overflow-y-auto');

    function onScroll() {
      if (prefersReduced) return; // keep static for reduced motion
      if (raf) return;
      raf = requestAnimationFrame(updateProgress);
    }

    function updateProgress() {
      raf = 0;
      
      // For mobile, use window scroll; for desktop, use container scroll
      let p = 0;
      
      if (window.innerWidth < 1024 && mobileArticleContainer) {
        // Mobile: Use article container scroll progress for crossfade
        const scrollTop = mobileArticleContainer.scrollTop;
        const scrollHeight = mobileArticleContainer.scrollHeight - mobileArticleContainer.clientHeight;
        p = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      } else if (scrollContainer) {
        // Desktop: Use container scroll progress
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        p = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      }
      
      el.style.setProperty("--p", p.toString());
      
      // Update image crossfade based on scroll progress
      if (imageList.length > 1) {
        // Use a smoother calculation for more responsive crossfade
        const totalImages = imageList.length;
        const currentImageFloat = p * (totalImages - 1);
        const currentImageIndex = Math.floor(currentImageFloat);
        const nextImageIndex = Math.min(currentImageIndex + 1, totalImages - 1);
        const localProgress = currentImageFloat - currentImageIndex;
        
        // Apply easing for smoother transitions
        const easedProgress = localProgress * localProgress * (3 - 2 * localProgress); // smoothstep
        
        // Update opacity for all images
        imageList.forEach((_, index) => {
          const imageElement = el.querySelector(`[data-image-index="${index}"]`);
          if (imageElement) {
            if (index === currentImageIndex) {
              imageElement.style.opacity = 1 - easedProgress;
            } else if (index === nextImageIndex) {
              imageElement.style.opacity = easedProgress;
            } else {
              imageElement.style.opacity = 0;
            }
          }
        });
      }
    }

    updateProgress();
    
    // Add appropriate scroll listeners based on screen size
    if (window.innerWidth < 1024 && mobileArticleContainer) {
      // Mobile: Listen to article container scroll
      mobileArticleContainer.addEventListener("scroll", onScroll, { passive: true });
    } else if (scrollContainer) {
      // Desktop: Listen to container scroll
      scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    }
    
    window.addEventListener("resize", updateProgress);
    return () => {
      if (mobileArticleContainer) {
        mobileArticleContainer.removeEventListener("scroll", onScroll);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", updateProgress);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [imageList]);

  // Don't render if no images are available
  if (imageList.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        // CSS var --p is driven by the effect above (0 -> 1 as you scroll through the section)
        // You can use it to subtly scale/zoom or fade the background as progression increases.
        // Using CSS vars keeps style calculation on the compositor thread.
        "--vh": `${vh}vh`,
      }}
    >
       {/* Section background with crossfade effect */}
       <div
         className="absolute inset-0 w-full h-full z-0"
         aria-hidden
       >
         {imageList.map((img, index) => (
           <div
             key={index}
             data-image-index={index}
             className="absolute inset-0 h-full w-full transition-opacity duration-300 ease-out"
             style={{
               backgroundImage: `url(${img})`,
               backgroundSize: "cover",
               backgroundPosition: "center",
               opacity: index === 0 ? 1 : 0,
               zIndex: imageList.length - index,
             }}
             role="img"
             aria-label={pinnedImage?.altText || title || 'Article background'}
           />
         ))}
         {scrim && (
           <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55 z-10" />
         )}
       </div>

       {/* Mobile: Full background with sliding content overlay */}
       <div className="block lg:hidden">
         {/* Mobile content that slides up from bottom */}
         <div className="relative z-20 min-h-screen">
           {/* Spacer to show background image first - reduced height */}
           <div className="h-[60vh]"></div>
           
           {/* Article content that slides up */}
           <div className="relative bg-white rounded-t-3xl shadow-2xl -mt-16 min-h-screen">
              {/* Article title as lead content */}
              {title && (
                <div className="px-6 pt-8 pb-8 text-left text-gray-800">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
                    {title}
                  </h2>
                </div>
              )}

              {/* Optional lead content */}
              {lead && (
                <div className="px-6 pb-8 text-left text-gray-800">
                  {lead}
                </div>
              )}

             {/* Article content chunks */}
             {articleChunks.length > 0 ? (
               <div className="px-6 pb-8 h-screen overflow-y-auto">
                 {articleChunks.map((chunk, idx) => (
                    <motion.div
                      key={chunk.id}
                      className="mb-6 sm:mb-12"
                      initial={animation.enabled ? { opacity: 0, y: 30 } : {}}
                      whileInView={animation.enabled ? { opacity: 1, y: 0 } : {}}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ 
                        duration: animation.duration || 0.3, 
                        delay: animation.delay || 0.1 
                      }}
                    >
                      <div 
                        className="max-w-xl"
                        dangerouslySetInnerHTML={{ __html: chunk.content }}
                      />
                    </motion.div>
                 ))}
               </div>
             ) : (
               <div className="px-6 py-12 text-gray-600">
                 <p>No content to show.</p>
               </div>
             )}
           </div>
         </div>
       </div>

        {/* Desktop: Original overlay layout */}
        <div className="hidden lg:block relative z-20 h-full overflow-y-auto" ref={scrollContainerRef}>
           {/* Single white box containing heading and all articles */}
           <div className="max-w-2xl relative z-20 bg-white/95 backdrop-blur-sm shadow-lg mx-0 ml-8 mr-auto px-8 py-6">
             <div className="max-w-xl mx-auto">
             {/* Article title as lead content */}
             {title && (
               <div className="text-left text-gray-800 mb-12">
                 <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
                   {title}
                 </h2>
               </div>
             )}

             {/* Optional lead content */}
             {lead && (
               <div className="text-left text-gray-800 mb-12">
                 {lead}
               </div>
             )}

             {/* Article content chunks */}
             {articleChunks.length > 0 ? (
               <div>
                 {articleChunks.map((chunk, idx) => (
                   <motion.div
                     key={chunk.id}
                     className="mb-6 sm:mb-12"
                     initial={animation.enabled ? { opacity: 0, y: 30 } : {}}
                     whileInView={animation.enabled ? { opacity: 1, y: 0 } : {}}
                     viewport={{ once: true, amount: 0.3 }}
                     transition={{ 
                       duration: animation.duration || 0.3, 
                       delay: animation.delay || 0.1 
                     }}
                   >
                     <div 
                       className="max-w-xl"
                       dangerouslySetInnerHTML={{ __html: chunk.content }}
                     />
                   </motion.div>
                 ))}
               </div>
             ) : (
               <div className="py-12 text-gray-600">
                 <p>No content to show.</p>
               </div>
             )}
             </div>
           </div>
        </div>

      {/* Basic styles */}
      <style jsx>{`
        /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for Firefox */
        .overflow-y-auto {
          scrollbar-width: none;
        }
        
        /* Ensure scrolling still works */
        .overflow-y-auto {
          -ms-overflow-style: none;
        }
        
        @media (prefers-reduced-motion: reduce) {
          section { --p: 0 !important; }
        }
      `}</style>
    </section>
  );
}
