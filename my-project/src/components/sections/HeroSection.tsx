import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { ProceduralPebble } from '../three-d/ProceduralPebble'
import ThreeDErrorBoundary from '../ui/ThreeDErrorBoundary'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  isMobile: boolean
}

export function HeroSection({ isMobile }: HeroSectionProps) {
  return (
    <div className={`${styles.heroWrapper} ambient-glow`}>
      {/* 3D Canvas Layer */}
      <Canvas 
        className={styles.heroCanvas} 
        camera={{ position: [0, 0, 3.2], fov: 40 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={0.5} />
        <directionalLight position={[-2, 3, 3]} color="#e1d6ff" intensity={0.3} />
        
        <ThreeDErrorBoundary componentName="ProceduralPebble">
          {/* Main pebble with gentle float - lazy loaded */}
          <Suspense fallback={null}>
            <Float floatIntensity={0.8} rotationIntensity={0.3} speed={0.8}>
              <group 
                scale={isMobile ? [0.5, 0.25, 0.5] : [0.85, 0.425, 0.85]} 
                position={[0, 0.05, 0]}
              >
                <ProceduralPebble 
                  distance={5} 
                  quality="high" 
                  animate={false}
                  enableTextures={true}
                />
              </group>
            </Float>
          </Suspense>
        </ThreeDErrorBoundary>
      </Canvas>

      {/* ROOT text positioned behind everything */}
      <div className={styles.rootTextBackground}>
        <h1 className={`${styles.rootText} gradient-text-primary`} aria-hidden="true">ROOT</h1>
      </div>

      {/* Main Content with pebble and text */}
      <div className={styles.mainContent}>
        <div className={styles.pebbleSpace}>
          {/* Pebble space positioned to touch bottom of ROOT text */}
        </div>
        
        <div className={styles.pebbleSpaceLarge}>
          {/* Pebble space */}
        </div>

        <p className={`${styles.subtitle} ${isMobile ? styles.mobile : ''} gradient-text-accent`}>
          Companion for Emotional Embracing
        </p>

        <button 
          className={`${styles.ctaButton} btn-futuristic focus-ring`}
          aria-label="Start your wellness journey"
        >
          Buy Me :)
        </button>
      </div>

      {/* Scroll indicator */}
      <svg className={styles.scrollCue} viewBox="0 0 24 36" role="img" aria-label="Scroll down">
        <path d="M12 4 v20" />
        <polyline points="6 18 12 24 18 18" />
      </svg>
    </div>
  )
}
