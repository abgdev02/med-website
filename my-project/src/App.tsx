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
  const [isTablet, setIsTablet] = useState(false)
  const [activeTab, setActiveTab] = useState<keyof typeof tabContent>('anchor-focus')
    useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 767)
      setIsTablet(width > 767 && width <= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Content for different tabs
  const tabContent = {
    'anchor-focus': {
      title: 'Strengthen focus through pulse-guided breath',
      features: [
        'Stay present in moments that overwhelm',
        'Reduce spiraling thoughts with steady rhythm'
      ],
      description: 'Let rhythmic sensations and guided breath redirect racing thoughts—helping your mind slow down and return to calm, one pulse at a time.'
    },
    'release-stress': {
      title: 'Release tension with synchronized breathing',
      features: [
        'Lower stress hormones naturally',
        'Activate your body\'s relaxation response'
      ],
      description: 'Feel physical tension melt away as guided vibrations help your nervous system shift from fight-or-flight to rest-and-digest mode.'
    },
    'enhance-sleep': {
      title: 'Prepare your mind for restorative sleep',
      features: [
        'Create calming bedtime rituals',
        'Quiet racing thoughts before bed'
      ],
      description: 'Gentle pulses and soothing sounds guide your mind into a peaceful state, making it easier to fall asleep and stay asleep.'
    },
    'sync-mind-body': {
      title: 'Harmonize mental and physical states',
      features: [
        'Align breath with heart rate variability',
        'Create coherence between mind and body'
      ],
      description: 'Experience the profound connection between mental clarity and physical wellness through synchronized breathing and biometric feedback.'
    },
    'practice-stillness': {
      title: 'Cultivate deep mindfulness practice',
      features: [
        'Develop sustained attention and awareness',
        'Build resilience through consistent practice'
      ],
      description: 'Progress from scattered attention to focused presence, creating a foundation for lasting peace and emotional stability.'
    }
  } as const
  return (
    <>
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
            opacity: 0.9,
            fontFamily: '"Source Sans Pro", sans-serif'
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

      {/* SECOND SECTION - Now OUTSIDE heroWrapper */}
      <div className="section" style={{
        width: '100%', 
        maxWidth: '100%',
        minHeight: '100vh', 
        paddingLeft: isMobile ? 20 : 80, 
        paddingRight: isMobile ? 20 : 80, 
        paddingTop: 120, 
        paddingBottom: 120, 
        background: 'white', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        gap: 80, 
        display: 'flex',
        boxSizing: 'border-box'
      }}>
        <div style={{
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          gap: 40, 
          display: 'flex'
        }}>          
        <div style={{
            width: isMobile ? '100%' : 512, 
            maxWidth: '100%',
            justifyContent: 'flex-start', 
            display: 'flex', 
            flexDirection: 'column', 
            color: '#2A2A2A', 
            fontSize: isMobile ? 32 : 48, 
            fontFamily: '"Source Sans Pro", sans-serif', 
            fontWeight: '100', 
            lineHeight: isMobile ? 1.2 : 56/48, 
            wordWrap: 'break-word',
            textAlign: 'left'
          }}>
            Measure how deeply you're grounding
          </div>
          <div style={{
            width: isMobile ? '100%' : '80%', 
            maxWidth: 818,
            justifyContent: 'flex-start', 
            display: 'flex', 
            flexDirection: 'column', 
            color: '#8A8A8A', 
            fontSize: 16, 
            fontFamily: '"Source Sans Pro", sans-serif', 
            fontWeight: '400', 
            wordWrap: 'break-word',
            textAlign: 'left'
          }}>
            Root captures your emotional and sensory engagement in real time combining audio, haptics, and AI-curated calm to give you a single, personalized Mental Immersion Score.
          </div>
        </div>
        
        <div style={{
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 64, 
          display: 'flex',
          width: '100%'
        }}>          <div style={{
            width: '100%', 
            maxWidth: '100%',
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            gap: isMobile ? 12 : 16, 
            display: 'flex',
            flexWrap: 'wrap',
            padding: isMobile ? '0 10px' : '0'
          }}><button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveTab('anchor-focus')
              }}
              style={{
                height: isMobile ? 36 : 40, 
                paddingLeft: isMobile ? 20 : 32, 
                paddingRight: isMobile ? 20 : 32, 
                paddingTop: 8, 
                paddingBottom: 8, 
                background: activeTab === 'anchor-focus' ? '#E8F4FD' : 'transparent', 
                borderRadius: 24, 
                border: 'none',
                outline: activeTab === 'anchor-focus' ? 'none' : '1px #e4e4e4 solid', 
                outlineOffset: '-1px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 10, 
                display: 'flex',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            ><div style={{
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: activeTab === 'anchor-focus' ? '#2A6EBB' : '#6A6A6A', 
                fontSize: isMobile ? 11 : 12, 
                fontFamily: '"Source Sans Pro", sans-serif', 
                fontWeight: activeTab === 'anchor-focus' ? '700' : '400', 
                textTransform: 'uppercase', 
                letterSpacing: 0.96, 
                wordWrap: 'break-word'
              }}>Anchor Focus</div>
            </button>            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveTab('release-stress')
              }}
              style={{
                height: isMobile ? 36 : 40, 
                paddingLeft: isMobile ? 20 : 32, 
                paddingRight: isMobile ? 20 : 32, 
                paddingTop: 8, 
                paddingBottom: 8, 
                background: activeTab === 'release-stress' ? '#E8F4FD' : 'transparent',
                borderRadius: 24, 
                border: 'none',
                outline: activeTab === 'release-stress' ? 'none' : '1px #e4e4e4 solid', 
                outlineOffset: '-1px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 10, 
                display: 'flex',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >              <div style={{
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: activeTab === 'release-stress' ? '#2A6EBB' : '#6A6A6A', 
                fontSize: isMobile ? 11 : 12, 
                fontFamily: '"Source Sans Pro", sans-serif', 
                fontWeight: activeTab === 'release-stress' ? '700' : '400', 
                textTransform: 'uppercase', 
                letterSpacing: 0.96, 
                wordWrap: 'break-word'
              }}>Release Stress</div>
            </button>            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveTab('enhance-sleep')
              }}
              style={{
                height: isMobile ? 36 : 40, 
                paddingLeft: isMobile ? 20 : 32, 
                paddingRight: isMobile ? 20 : 32, 
                paddingTop: 8, 
                paddingBottom: 8, 
                background: activeTab === 'enhance-sleep' ? '#E8F4FD' : 'transparent',
                borderRadius: 24, 
                border: 'none',
                outline: activeTab === 'enhance-sleep' ? 'none' : '1px #e4e4e4 solid', 
                outlineOffset: '-1px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 10, 
                display: 'flex',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              <div style={{
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: activeTab === 'enhance-sleep' ? '#2A6EBB' : '#6A6A6A', 
                fontSize: isMobile ? 11 : 12, 
                fontFamily: '"Source Sans Pro", sans-serif', 
                fontWeight: activeTab === 'enhance-sleep' ? '700' : '400', 
                textTransform: 'uppercase', 
                letterSpacing: 0.96, 
                wordWrap: 'break-word'
              }}>Enhance Sleep</div>
            </button>            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveTab('sync-mind-body')
              }}
              style={{
                height: isMobile ? 36 : 40, 
                paddingLeft: isMobile ? 20 : 32, 
                paddingRight: isMobile ? 20 : 32, 
                paddingTop: 8, 
                paddingBottom: 8, 
                background: activeTab === 'sync-mind-body' ? '#E8F4FD' : 'transparent',
                borderRadius: 24, 
                border: 'none',
                outline: activeTab === 'sync-mind-body' ? 'none' : '1px #e4e4e4 solid', 
                outlineOffset: '-1px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 10, 
                display: 'flex',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              <div style={{
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: activeTab === 'sync-mind-body' ? '#2A6EBB' : '#6A6A6A', 
                fontSize: isMobile ? 11 : 12, 
                fontFamily: '"Source Sans Pro", sans-serif', 
                fontWeight: activeTab === 'sync-mind-body' ? '700' : '400', 
                textTransform: 'uppercase', 
                letterSpacing: 0.96, 
                wordWrap: 'break-word'
              }}>Sync Mind & Body</div>
            </button>            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveTab('practice-stillness')
              }}
              style={{
                height: isMobile ? 36 : 40, 
                paddingLeft: isMobile ? 20 : 32, 
                paddingRight: isMobile ? 20 : 32, 
                paddingTop: 8, 
                paddingBottom: 8, 
                background: activeTab === 'practice-stillness' ? '#E8F4FD' : 'transparent',
                borderRadius: 24, 
                border: 'none',
                outline: activeTab === 'practice-stillness' ? 'none' : '1px #e4e4e4 solid', 
                outlineOffset: '-1px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 10, 
                display: 'flex',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              <div style={{
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: activeTab === 'practice-stillness' ? '#2A6EBB' : '#6A6A6A', 
                fontSize: isMobile ? 11 : 12, 
                fontFamily: '"Source Sans Pro", sans-serif', 
                fontWeight: activeTab === 'practice-stillness' ? '700' : '400', 
                textTransform: 'uppercase', 
                letterSpacing: 0.96, 
                wordWrap: 'break-word'
              }}>Practice Stillness</div>
            </button>
          </div>

          <div style={{
            width: '100%', 
            maxWidth: '100%',
            justifyContent: 'flex-start', 
            alignItems: 'flex-start', 
            gap: isMobile ? 40 : 128, 
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row'
          }}>            <div style={{
              width: isMobile ? '100%' : '45%', 
              maxWidth: isMobile ? '100%' : 484,
              alignSelf: 'stretch',
              paddingTop: 24, 
              paddingBottom: 24, 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              alignItems: 'flex-start', 
              gap: 40, 
              display: 'flex',
              transition: 'all 0.3s ease',
              opacity: 1            }}>
              {/* Main title */}
              <div style={{
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: '#6A6A6A', 
                fontSize: 14, 
                fontFamily: '"Source Sans Pro", sans-serif', 
                fontWeight: '400', 
                wordWrap: 'break-word',
                transition: 'all 0.3s ease'
              }}>
                {tabContent[activeTab].title}
              </div>
              
              {/* Icon placeholders */}
              <div style={{width: 12, height: 12, borderRadius: 9999, border: '1px #4A4A4A solid'}} />
              <div style={{width: 24, height: 24, borderRadius: 9999, border: '0.50px #D2D2D2 solid'}} />
              <div style={{width: '100%', height: 0, outline: '0.50px #D2D2D2 solid', outlineOffset: '-0.25px'}}></div>
                {/* First feature */}
              <div style={{
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                gap: 24, 
                display: 'flex',
                transition: 'all 0.3s ease'
              }}>
                <div style={{width: 24, height: 24, backgroundColor: '#f0f0f0', borderRadius: '50%'}} />
                <div style={{
                  justifyContent: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  color: '#6A6A6A', 
                  fontSize: 14, 
                  fontFamily: '"Source Sans Pro", sans-serif', 
                  fontWeight: '400', 
                  wordWrap: 'break-word',
                  transition: 'all 0.3s ease'
                }}>
                  {tabContent[activeTab].features[0]}
                </div>
              </div>
              
              <div style={{width: '100%', height: 0, outline: '0.50px #D2D2D2 solid', outlineOffset: '-0.25px'}}></div>
              
              {/* Main highlighted feature with description */}
              <div style={{
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'flex-start', 
                gap: 24, 
                display: 'flex',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  justifyContent: 'flex-start', 
                  alignItems: 'center', 
                  gap: 24, 
                  display: 'flex'
                }}>
                  <div style={{width: 24, height: 24, backgroundColor: '#f0f0f0', borderRadius: '50%'}} />
                  <div style={{
                    justifyContent: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    color: '#4A4A4A', 
                    fontSize: 14, 
                    fontFamily: '"Source Sans Pro", sans-serif', 
                    fontWeight: '700', 
                    wordWrap: 'break-word',
                    transition: 'all 0.3s ease'
                  }}>
                    {tabContent[activeTab].features[1]}
                  </div>
                </div>
                <div style={{
                  width: '100%', 
                  justifyContent: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  color: '#4A4A4A', 
                  fontSize: 14, 
                  fontFamily: '"Source Sans Pro", sans-serif', 
                  fontWeight: '400', 
                  wordWrap: 'break-word',
                  transition: 'all 0.3s ease'
                }}>
                  {tabContent[activeTab].description}
                </div>
              </div>
            </div>

            <div style={{
              width: isMobile ? '100%' : '50%', 
              maxWidth: isMobile ? '100%' : 600,
              height: isMobile ? 250 : 400, 
              borderRadius: 16,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '14px',
              fontFamily: '"Source Sans Pro", sans-serif'
            }}>
              [Image Placeholder 600x400]
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App