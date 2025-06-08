import { useState, useEffect } from 'react'
import styles from './Navigation.module.css'

interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  const [activeSection, setActiveSection] = useState('home')
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'how-it-works']
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const threshold = windowHeight * 0.5 // 50% of viewport height as threshold
      
      let newActiveSection = 'home' // Default to home
      
      // Check each section to find which one is most prominently visible
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = scrollPosition + rect.top
          const elementBottom = elementTop + rect.height
          
          // If the section's top is above the threshold line (middle of screen)
          // and the section's bottom is below the threshold line
          if (elementTop <= scrollPosition + threshold && 
              elementBottom > scrollPosition + threshold) {
            newActiveSection = section
            break
          }
          
          // Special case for home section when at very top
          if (section === 'home' && scrollPosition < threshold) {
            newActiveSection = 'home'
            break
          }
        }
      }
      
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection)
      }
    }

    // Set initial active section and call handleScroll immediately
    handleScroll()

    // Use throttling for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [activeSection])

  const isActive = (section: string) => activeSection === section

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className={styles.skipToMain}>
        Skip to main content
      </a>
      
      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        <a href="#home" className={styles.logo} aria-label="iembraceland home">
          iembraceland
        </a>        <ul className={styles.links} role="list">
          <li>
            <a 
              href="#home" 
              className={`${styles.navLink} ${isActive('home') ? styles.active : ''}`}
              aria-current={isActive('home') ? 'page' : undefined}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className={`${styles.navLink} ${isActive('about') ? styles.active : ''}`}
              aria-current={isActive('about') ? 'page' : undefined}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#how-it-works" 
              className={`${styles.navLink} ${isActive('how-it-works') ? styles.active : ''}`}
              aria-current={isActive('how-it-works') ? 'page' : undefined}
            >
              How it works
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}
