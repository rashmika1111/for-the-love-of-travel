"use client";

import React, { useEffect, useRef } from "react";

/**
 * PinnedImageOverlay
 *
 * A scroll section where a full-bleed image stays pinned while article cards
 * scroll on top of it.
 *
 * Works great in Next.js (App Router). Uses no external deps and respects
 * `prefers-reduced-motion`.
 *
 * NOTE: This component is resilient if `articles` is undefined/null.
 * It safely defaults to an empty array and will not throw.
 *
 * Usage (simplified):
 * <PinnedImageOverlay
 *    imageUrl="/hero.jpg"
 *    imageAlt="Snowy mountain range at sunrise"
 *    articles={[
 *      { title: "Chapter One", body: "Lorem ipsum…" },
 *      { title: "Chapter Two", body: "Dolor sit amet…" },
 *    ]}
 * />
 */

// PropTypes removed for JSX compatibility

export default function PinnedImageOverlay({
  imageUrl,
  imageAlt = "",
  viewportVh = 100,
  scrim = true,
  articles = [], // <-- default to an empty array to avoid `.map` on undefined
  lead,
  images = [], // Array of images for crossfade effect
}) {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const vh = Math.max(40, Math.min(140, viewportVh));
  const list = Array.isArray(articles) ? articles : [];
  const imageList = Array.isArray(images) && images.length > 0 ? images : [imageUrl];

  // DEV warning to help catch incorrect prop wiring
  useEffect(() => {
    if (!Array.isArray(articles)) {
      console.warn(
        "PinnedImageOverlay: expected `articles` to be an array; received",
        articles
      );
    }
  }, [articles]);

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

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        // CSS var --p is driven by the effect above (0 -> 1 as you scroll through the section)
        // You can use it to subtly scale/zoom or fade the background as progression increases.
        // Using CSS vars keeps style calculation on the compositor thread.
        // @ts-ignore – custom properties are fine
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
             aria-label={imageAlt}
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
             {/* Optional lead content */}
             {lead && (
               <div className="px-6 pt-8 pb-4 text-left text-gray-800">
                 {lead}
               </div>
             )}

             {/* Only render the list if there are items */}
             {list.length > 0 ? (
               <div className="px-6 pb-8 h-screen overflow-y-auto">
                 {list.map((a, idx) => (
                   <div key={a.id ?? idx} className="py-4">
                     {a.body}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="px-6 py-12 text-gray-600">
                 <p>No articles to show.</p>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Desktop: Original overlay layout */}
       <div className="hidden lg:block relative z-20 h-full overflow-y-auto" ref={scrollContainerRef}>
          {/* Single white box containing heading and all articles */}
          <div className="max-w-2xl relative z-20 bg-white/95 backdrop-blur-sm shadow-lg mx-0 ml-8 mr-auto px-8 py-6">
            {/* Optional lead content */}
            {lead && (
              <div className="text-left text-gray-800 mb-6">
                {lead}
              </div>
            )}

            {/* Only render the list if there are items */}
            {list.length > 0 ? (
              <div>
                {list.map((a, idx) => (
                  <div key={a.id ?? idx}>
                    {a.body}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-gray-600">
                {/* Empty state kept subtle; remove if you prefer nothing. */}
                <p>No articles to show.</p>
              </div>
            )}
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


/**
 * --- DEV EXAMPLES / TEST CASES ---
 * These are simple components you can mount in a test page to validate behavior.
 * They are not required in production but help ensure no runtime errors.
 */

export function Example_WithArticles() {
  return (
    <PinnedImageOverlay
      imageUrl="/hero.jpg"
      imageAlt="Snowy mountain range at sunrise"
      articles={[
        { title: "Article One", body: "Body text one." },
        { title: "Article Two", body: <>Body <strong>two</strong> with JSX.</> },
        { title: "Article Three", body: "Body text three." },
      ]}
      lead={<h1 className="text-4xl font-semibold">With Articles</h1>}
    />
  );
}

// Should NOT crash; shows empty state gracefully
export function Example_UndefinedArticles() {
  // Intentionally omit the `articles` prop
  // @ts-expect-error testing runtime resilience
  return (
    <PinnedImageOverlay
      imageUrl="/hero.jpg"
      imageAlt="Snowy mountain range at sunrise"
      lead={<h1 className="text-4xl font-semibold">Undefined Articles</h1>}
    />
  );
}

// Should NOT crash; renders the empty state
export function Example_EmptyArticles() {
  return (
    <PinnedImageOverlay
      imageUrl="/hero.jpg"
      imageAlt="Snowy mountain range at sunrise"
      articles={[]}
      lead={<h1 className="text-4xl font-semibold">Empty Articles</h1>}
    />
  );
}
