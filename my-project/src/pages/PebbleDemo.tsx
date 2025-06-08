import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { ProceduralPebble } from '../components/three-d/ProceduralPebble'
import { OrbitControls, Environment, Effects } from '@react-three/drei'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { extend } from '@react-three/fiber'

// Extend to make UnrealBloomPass available
extend({ UnrealBloomPass })

function Scene() {
  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.2} color="#1e1e3f" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#8a2be2" />
      <pointLight position={[0, 15, 0]} intensity={0.6} color="#9370db" />
      
      {/* Environment for better reflections */}
      <Environment preset="night" />
      
      <Suspense fallback={null}>
        {/* Main mystical pebble with enhanced effects */}
        <ProceduralPebble 
          distance={5} 
          quality="high" 
          enableTextures={true}
          enableMysticalEffects={true}
        />
      </Suspense>
      
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.3}
        maxDistance={15}
        minDistance={2}
      />
      
      {/* Post-processing for bloom effect */}
      <Effects>
        {/* @ts-ignore */}
        <unrealBloomPass threshold={0.1} strength={1.5} radius={0.8} />
      </Effects>
    </>
  )
}

export function PebbleDemo() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'radial-gradient(ellipse at center, #0f0f23 0%, #000000 70%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Navigation hint */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#e6e6fa',
        fontSize: '14px',
        fontFamily: 'Source Sans Pro, sans-serif',
        zIndex: 10
      }}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
          style={{ color: '#9370db', textDecoration: 'none' }}
        >
          ← Back to Main App
        </a>
      </div>
      
      <h1 style={{ 
        color: '#e6e6fa', 
        marginBottom: '20px', 
        textAlign: 'center',
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '2.5rem',
        textShadow: '0 0 20px rgba(147, 112, 219, 0.5)',
        zIndex: 1
      }}>
        Enhanced Mystical Pebble
      </h1>
      
      <div style={{ 
        width: '90vw', 
        height: '70vh', 
        border: '2px solid rgba(138, 43, 226, 0.4)',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 0 50px rgba(138, 43, 226, 0.3), inset 0 0 50px rgba(138, 43, 226, 0.1)',
        background: 'rgba(0, 0, 0, 0.3)'
      }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>
      
      <div style={{ 
        color: '#c4c4f0', 
        marginTop: '20px', 
        textAlign: 'center',
        maxWidth: '800px',
        lineHeight: '1.6',
        fontSize: '1.1rem',
        padding: '0 20px'
      }}>
        <p style={{ marginBottom: '10px' }}>
          ✨ <strong>Enhanced Mystical Effects:</strong> Purple glow emission with trailing particles
        </p>
        <p style={{ marginBottom: '10px' }}>
          🌟 <strong>Dynamic Movement:</strong> Elliptical orbits with complex vertical motion patterns
        </p>
        <p>
          🎮 <strong>Interactive:</strong> Mouse to orbit • Scroll to zoom • Auto-rotation enabled
        </p>
      </div>
    </div>
  )
}
