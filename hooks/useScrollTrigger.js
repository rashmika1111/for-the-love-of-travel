"use client";
import { useState, useEffect } from 'react';

export function useScrollTrigger(triggerPoint = 0.3, ctaDelay = 1000) {
  const [showCTA, setShowCTA] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownCTA, setHasShownCTA] = useState(false);

  useEffect(() => {
    // Check if CTA has already been shown in this session
    const hasShownCTABefore = sessionStorage.getItem('auth-cta-shown');
    if (hasShownCTABefore === 'true') {
      setHasShownCTA(true);
      return;
    }

    let ctaTimeoutId;
    let hasTriggered = false;

    const handleScroll = () => {
      if (hasTriggered || hasShownCTA) return;

      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollTop / documentHeight;

      // Trigger when user scrolls past the specified percentage
      if (scrollPercentage >= triggerPoint) {
        hasTriggered = true;
        
        // Show CTA after a delay when scroll threshold is reached
        ctaTimeoutId = setTimeout(() => {
          setShowCTA(true);
          setHasShownCTA(true);
          sessionStorage.setItem('auth-cta-shown', 'true');
        }, ctaDelay);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ctaTimeoutId) {
        clearTimeout(ctaTimeoutId);
      }
    };
  }, [triggerPoint, ctaDelay, hasShownCTA]);

  const closeCTA = () => {
    setShowCTA(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const showAuthPopup = () => {
    setShowCTA(false);
    setShowPopup(true);
  };

  const resetCTA = () => {
    setShowCTA(false);
    setShowPopup(false);
    setHasShownCTA(false);
    sessionStorage.removeItem('auth-cta-shown');
  };

  return {
    showCTA,
    showPopup,
    closeCTA,
    closePopup,
    showAuthPopup,
    resetCTA,
    hasShownCTA
  };
}
