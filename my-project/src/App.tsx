// src/App.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'
import BokehBubbles from './BokehBubbles'
import './App.css'

function ProceduralPebble() {
  const mesh = useRef<THREE.Mesh>(null!)
  const simplex = useRef(new SimplexNoise())

  useEffect(() => {
    const g = mesh.current.geometry as THREE.BufferGeometry
    const pos = g.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)

      const bump = 0.03
      const n = simplex.current.noise3d(x * 0.8, y * 0.3, z * 0.8)

      pos.setXYZ(
        i,
        x + n * bump * x,
        y + n * bump * 0.4,
        z + n * bump * z
      )
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
  }, [])

  useFrame((_s, dt) => {
    mesh.current.rotation.y += dt * 0.25
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial
        color="#d4d4d4"
        roughness={0.85}
        metalness={0.05}
        envMapIntensity={0.3}
      />
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
        <div className="logo">Jeton</div>
        <div className="links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
        </div>
      </nav>

      {/* 3D Canvas Layer */}      <Canvas className="heroCanvas" camera={{ position: [0, 0, 3.2], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={0.5} />
        <directionalLight position={[-2, 3, 3]} color="#e1d6ff" intensity={0.3} />
        
        {/* Bokeh background particles */}
        <BokehBubbles count={3000} />
        
        {/* Main pebble with gentle float */}
        <Float floatIntensity={0.8}>
          <group 
            scale={isMobile ? [0.45, 0.22, 0.45] : [0.75, 0.37, 0.75]} 
            position={[0, 0.15, -0.75]}
          >
            <ProceduralPebble />
          </group>
        </Float>
      </Canvas>

      {/* Main Content */}
      <div className="heroContent">
        <h1>ROOT</h1>
        <p>What does calm <strong>feel</strong> like? Scroll to learn more.</p>
        <button
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.transform = 'scale(1)'}
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
