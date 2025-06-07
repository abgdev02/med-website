import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Group } from 'three'
import { ProceduralPebble } from '../three-d/ProceduralPebble'
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
      groupRef.current.rotation.y += delta * speed * 0.5 // Slow rotation
      // groupRef.current.rotation.x += delta * speed * 0.05 // Very subtle wobble - removed for cleaner rotation
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

export function HeroSection({ isMobile }: HeroSectionProps) {
  return (
    <div className={`${styles.heroWrapper} ambient-glow`}>      {/* 3D Canvas Layer - positioned to center pebble above CTA button */}
      <Canvas 
        className={styles.heroCanvas} 
        camera={{ position: [0, 0, 3.5], fov: 45 }}
      >        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 5]} intensity={0.6} />
        <directionalLight position={[-3, 4, 3]} color="#f0f4f8" intensity={0.4} />
        <directionalLight position={[0, -2, 2]} color="#e8f2ff" intensity={0.2} />
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
      </Canvas>      {/* ROOT text positioned above the pebble */}
      <div className={styles.rootTextBackground}>
        <h1 className={styles.rootText} aria-hidden="true">ROOT</h1>
      </div>      {/* Main Content with CTA button */}
      <div className={styles.mainContent}>
        <button 
          className={`${styles.ctaButton} btn-futuristic focus-ring`}
          aria-label="Start your wellness journey"
        >
          Buy Me :)
        </button>
      </div>      {/* Bottom-left positioned text where ROOT was */}
      <p className={`${styles.subtitleBottomLeft} ${isMobile ? styles.mobile : ''}`}>
        Companion for Emotional Embracing: ROOT
      </p>

      {/* Right side subtitle - updated text */}
      <p className={`${styles.subtitleRightSide} ${isMobile ? styles.mobile : ''}`}>
        The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
      </p>

      {/* Scroll indicator */}
      <svg className={styles.scrollCue} viewBox="0 0 24 36" role="img" aria-label="Scroll down">
        <path d="M12 4 v20" />
        <polyline points="6 18 12 24 18 18" />
      </svg>
    </div>
  )
}
