import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Group } from 'three'
import { ProceduralPebble } from '../three-d/ProceduralPebble'
import { WaterShaderBackground } from '../three-d/WaterShaderBackground'
import { FloatingParticles } from '../three-d/FloatingParticles'
import { BreathingGuide } from '../three-d/BreathingGuide'
import { useMouseTracking } from '../../hooks/useMouseTracking'
import ThreeDErrorBoundary from '../ui/ThreeDErrorBoundary'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  isMobile: boolean
}

// Create a rotating wrapper component
function RotatingPebble({ children, speed = 1 }: { children: React.ReactNode, speed?: number }) {
  const groupRef = useRef<Group>(null)
    useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed * 0.8 // Slow rotation
      // groupRef.current.rotation.x += delta * speed * 0.05 // Very subtle wobble - removed for cleaner rotation
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

export function HeroSection({ isMobile }: HeroSectionProps) {
  const mouse = useMouseTracking()
  
  return (
    <div className={`${styles.heroWrapper} ambient-glow`}>      {/* 3D Canvas Layer - positioned to center pebble above CTA button */}      <Canvas 
        className={styles.heroCanvas} 
        camera={{ position: [0, 0, 3.5], fov: 45, far: 100 }}
      >
        {/* Water shader background - same as reference code */}
        <WaterShaderBackground />
          {/* Floating particles - same as reference code */}
        <FloatingParticles mouse={mouse} />
        
        {/* Breathing guide for meditation */}
        <BreathingGuide intensity={0.8} />

        {/* Enhanced lighting for clean Apple-inspired design */}
        <pointLight color="#ffffff" intensity={2.5} distance={60} position={[0, 0, 20]} />
        <pointLight color="#ffffff" intensity={2} distance={40} position={[10, 10, 15]} />
        <pointLight color="#ffffff" intensity={2} distance={40} position={[-10, -10, 15]} />
        <ambientLight color="#ffffff" intensity={0.8} />
        <directionalLight position={[4, 6, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, 4, 3]} color="#ffffff" intensity={0.6} />
          <ThreeDErrorBoundary componentName="ProceduralPebble">
          {/* Main pebble with gentle float - centered horizontally, positioned above CTA */}
          <Suspense fallback={null}>            <Float floatIntensity={1.0} rotationIntensity={0.4} speed={0.6}>              <RotatingPebble speed={0.6}>                <group 
                  scale={isMobile ? [0.496, 0.248, 0.496] : [0.868, 0.434, 0.868]} /* Increased by 24% */
                  position={[0, 0.1, 0]} /* Moved up and centered */
                >                  <ProceduralPebble 
                    distance={5} 
                    quality="high" 
                    enableTextures={true}
                  />
                </group>
              </RotatingPebble>
            </Float>
          </Suspense>
        </ThreeDErrorBoundary>
      </Canvas>{/* Sliding ROOT text with meditation icons positioned above the pebble */}
      <div className={styles.rootTextBackground}>
        <div className={styles.slidingRootContainer}>
          <div className={styles.slidingRootTrack}>            {/* First set of ROOT + icons */}
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
              </svg>
            </div>
            <div className={styles.rootWithIcon}>
              <span className={styles.rootText}>ROOT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 1rem', opacity: 0.7 }}>
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>{/* Main Content with CTA button */}
      <div className={styles.mainContent}>
        <button 
          className={`${styles.ctaButton} btn-futuristic focus-ring`}
          aria-label="Start your wellness journey"
        >
          Buy Me :)
        </button>
      </div>      {/* Bottom-left positioned text where ROOT was */}
      <p className={`${styles.subtitleBottomLeft} ${isMobile ? styles.mobile : ''}`}>
        Companion for Emotional Embracing
      </p>      {/* Right side subtitle - updated text */}
      <p className={`${styles.subtitleRightSide} ${isMobile ? styles.mobile : ''}`}>
        The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
      </p>

      {/* App Store Buttons */}
      <div className={`${styles.appButtons} ${isMobile ? styles.mobile : ''}`}>
        <a 
          href="#" 
          className={`${styles.appButton} ${styles.appStore}`}
          aria-label="Download on the App Store"
        >
          <div className={styles.appButtonContent}>
            <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className={styles.appButtonText}>
              <span className={styles.downloadText}>Download on the</span>
              <span className={styles.storeText}>App Store</span>
            </div>
          </div>
        </a>
        <a 
          href="#" 
          className={`${styles.appButton} ${styles.googlePlay}`}
          aria-label="Get it on Google Play"
        >
          <div className={styles.appButtonContent}>
            <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <div className={styles.appButtonText}>
              <span className={styles.downloadText}>GET IT ON</span>
              <span className={styles.storeText}>Google Play</span>
            </div>
          </div>
        </a>
      </div>

      {/* Scroll indicator */}
      <svg className={styles.scrollCue} viewBox="0 0 24 36" role="img" aria-label="Scroll down">
        <path d="M12 4 v20" />
        <polyline points="6 18 12 24 18 18" />
      </svg>
    </div>
  )
}
