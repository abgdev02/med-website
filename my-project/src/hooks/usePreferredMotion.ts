/**
 * Motion Preferences Hook
 * Respects user's accessibility preferences for reduced motion
 */

import { useState, useEffect } from 'react'

export function usePreferredMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if the browser supports the media query
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      
      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches)

      // Listen for changes
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches)
      }

      mediaQuery.addEventListener('change', handleChange)

      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }, [])

  return {
    prefersReducedMotion,
    // Helper methods for animation configuration
    getAnimationConfig: (normalValue: number, reducedValue: number = 0) => 
      prefersReducedMotion ? reducedValue : normalValue,
    shouldAnimate: !prefersReducedMotion
  }
}
