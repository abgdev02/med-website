import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import BokehBubbles from '../../BokehBubbles'
import { ProceduralPebble } from '../three-d/ProceduralPebble'

interface HeroSectionProps {
  isMobile: boolean
}

export function HeroSection({ isMobile }: HeroSectionProps) {
  return (
    <div className="heroWrapper">
      {/* 3D Canvas Layer */}
      <Canvas 
        className="heroCanvas" 
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        style={{ zIndex: 5, position: 'relative' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={0.5} />
        <directionalLight position={[-2, 3, 3]} color="#e1d6ff" intensity={0.3} />
        
        {/* Bokeh background particles */}
        <BokehBubbles count={3000} />
          {/* Main pebble with gentle float */}
        <Float floatIntensity={0.8}>
          <group 
            scale={isMobile ? [0.5, 0.25, 0.5] : [0.85, 0.425, 0.85]} 
            position={[0, 0.05, 0]}
          >
            <ProceduralPebble 
              distance={5} 
              quality="high" 
              animate={true}
              enableTextures={true}
            />
          </group>
        </Float>
      </Canvas>

      {/* ROOT text positioned behind everything */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, calc(-50% - 160px))',
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
        pointerEvents: 'none'
      }}>        <h1 style={{
          fontFamily: '"Source Sans Pro", sans-serif',
          fontSize: 'clamp(8rem, 12vw, 16rem)',
          fontWeight: '900',
          opacity: '0.08',
          margin: '0',
          position: 'relative',
          lineHeight: '0.85',
          color: '#2a2a2a',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>ROOT</h1>
      </div>

      {/* Main Content with pebble and text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
        width: '100%'
      }}>
        <div style={{ height: '8rem', position: 'relative', marginBottom: '4rem' }}>
          {/* Pebble space positioned to touch bottom of ROOT text */}
        </div>
        
        <div style={{ height: '12rem', position: 'relative', zIndex: '15' }}>
          {/* Pebble space */}
        </div>        <p style={{ 
          position: 'relative', 
          zIndex: '15',
          marginTop: '2rem',
          color: '#003b5e',
          fontSize: isMobile ? '0.75rem' : '0.9rem',
          fontWeight: '100',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          maxWidth: '600px',
          margin: '2rem auto 0',
          lineHeight: 1.6,
          opacity: 0.9,
          fontFamily: '"Source Sans Pro", sans-serif',
          textAlign: 'center',
          wordSpacing: '0.1em'
        }}>COMPANION FOR EMOTIONAL EMBRACING</p>
        
        <button
          style={{ 
            position: 'relative', 
            zIndex: '15',
            marginTop: '1.5rem',
            padding: '14px 28px',
            backgroundColor: '#003b5e',
            border: '1px solid #003b5e',
            borderRadius: '30px',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 2px 8px rgba(0, 59, 94, 0.3)',
            WebkitBackdropFilter: 'blur(20px)',
            fontFamily: '"Source Sans Pro", sans-serif'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.03) translateY(-2px)'
            ;(e.target as HTMLButtonElement).style.backgroundColor = '#004d77'
            ;(e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 59, 94, 0.4)'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1) translateY(0)'
            ;(e.target as HTMLButtonElement).style.backgroundColor = '#003b5e'
            ;(e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 59, 94, 0.3)'
          }}
        >Buy Me :)</button>
      </div>

      {/* Scroll indicator */}
      <svg className="scrollCue" viewBox="0 0 24 36">
        <path d="M12 4 v20" />
        <polyline points="6 18 12 24 18 18" />
      </svg>
    </div>
  )
}
