// src/App.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'
import BokehBubbles from './BokehBubbles'
import './App.css'

function ProceduralPebble() {
  const mesh = useRef<THREE.Mesh>(null!)
  const simplex = useRef(new SimplexNoise())

  // Create realistic pebble material with textures
  const material = useMemo(() => {
    // Create subtle noise texture for surface variation
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext('2d')!
    
    const imageData = context.createImageData(512, 512)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random()
      const value = Math.floor(220 + noise * 15) // Very light grey with minimal variation
      imageData.data[i] = value - 1     // R
      imageData.data[i + 1] = value     // G  
      imageData.data[i + 2] = value + 1 // B
      imageData.data[i + 3] = 255       // A
    }
    context.putImageData(imageData, 0, 0)
    
    const colorTexture = new THREE.CanvasTexture(canvas)
    colorTexture.wrapS = THREE.RepeatWrapping
    colorTexture.wrapT = THREE.RepeatWrapping
    colorTexture.repeat.set(1.5, 1.5)
    
    // Create normal map for surface bumps
    const normalCanvas = document.createElement('canvas')
    normalCanvas.width = 256
    normalCanvas.height = 256
    const normalContext = normalCanvas.getContext('2d')!
    
    const normalImageData = normalContext.createImageData(256, 256)
    for (let i = 0; i < normalImageData.data.length; i += 4) {
      normalImageData.data[i] = Math.floor(128 + (Math.random() - 0.5) * 15)     // R - subtle
      normalImageData.data[i + 1] = Math.floor(128 + (Math.random() - 0.5) * 15) // G - subtle
      normalImageData.data[i + 2] = Math.floor(220 + Math.random() * 35)         // B - smooth surface
      normalImageData.data[i + 3] = 255   // A
    }
    normalContext.putImageData(normalImageData, 0, 0)
    
    const normalTexture = new THREE.CanvasTexture(normalCanvas)
    normalTexture.wrapS = THREE.RepeatWrapping
    normalTexture.wrapT = THREE.RepeatWrapping
    normalTexture.repeat.set(1, 1)
    
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(1,1,1), // Bright white color
      roughness: 0.8,
      metalness: 0.02,
      envMapIntensity: 0.15,
      map: colorTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.4, 0.4),
    })
  }, [])

  useEffect(() => {
    const g = mesh.current.geometry as THREE.BufferGeometry
    const pos = g.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)

      // Very subtle noise for natural river stone
      const bump = 0.015
      const n1 = simplex.current.noise3d(x * 0.4, y * 0.4, z * 0.4) * 0.8
      const n2 = simplex.current.noise3d(x * 1.2, y * 1.2, z * 1.2) * 0.2
      
      const totalNoise = n1 + n2
      
      // Natural river stone shape - more rounded
      const flattenFactor = 0.92 // Much more rounded

      pos.setXYZ(
        i,
        x + totalNoise * bump * Math.abs(x),
        y * flattenFactor + totalNoise * bump * 0.1,
        z + totalNoise * bump * Math.abs(z)
      )
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
  }, [])

  useFrame((_s, dt) => {
    mesh.current.rotation.y += dt * 0.25
  })
  
  return (
    <mesh ref={mesh} material={material} castShadow receiveShadow>
      <sphereGeometry args={[1, 128, 128]} />
    </mesh>
  )
}

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="heroWrapper">
      {/* Navigation */}
      <nav className="nav">
        <div className="logo">iembraceland</div>
        <div className="links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
        </div>
      </nav>

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
            <ProceduralPebble />
          </group>
        </Float>
      </Canvas>      {/* ROOT text positioned behind everything */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, calc(-50% - 160px))',
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontFamily: '"Source Sans Pro", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
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
        </div>
          <p style={{ 
          position: 'relative', 
          zIndex: '15',
          marginTop: '2rem',
          color: '#003b5e',
          fontSize: isMobile ? '0.75rem' : '0.85rem',
          fontWeight: '200',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          maxWidth: '400px',
          margin: '2rem auto 0',
          lineHeight: 1.6,
          opacity: 0.9
        }}>COMPANION FOR EMOTIONAL EMBRACING</p>        <button
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
            WebkitBackdropFilter: 'blur(20px)'
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

export default App