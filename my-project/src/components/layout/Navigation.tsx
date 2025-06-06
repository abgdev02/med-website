import { useState, useEffect } from 'react'
import styles from './Navigation.module.css'

interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  const [activeSection, setActiveSection] = useState('home')
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'how-it-works']
      const scrollPosition = window.scrollY + 100 // Add offset for sticky nav

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    // Set initial active section
    if (window.scrollY < 100) {
      setActiveSection('home')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
