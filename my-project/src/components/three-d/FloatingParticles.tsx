import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingParticlesProps {
  mouse: THREE.Vector2
}

export function FloatingParticles({ mouse }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!)  // Reduced particle count for better performance and visibility
  const particleCount = 16000
  
  // Store initial positions for wind reset boundaries
  const initialPositions = useRef<Float32Array | null>(null)
  
  // Create particle geometry with wind simulation support
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const posArray = new Float32Array(particleCount * 3)
      // Generate random positions within a larger boundary for wind drift
    // Position particles behind the pebble (negative Z values)
    for(let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 8     // X position
      posArray[i + 1] = (Math.random() - 0.5) * 24 // Y position  
      posArray[i + 2] = (Math.random() - 0.5) * 12 - 6 // Z position: behind pebble (-12 to 0)
    }
    
    // Store initial positions for boundary checking
    initialPositions.current = new Float32Array(posArray)
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    return geometry
  }, [])  // Create rounded square texture for particles with dark purple color
  const roundedSquareTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')!
    
    // Clear canvas
    context.clearRect(0, 0, 64, 64)
    
    // Create rounded square with dark purple
    const size = 48 // Size of the square
    const x = (64 - size) / 2 // Center horizontally
    const y = (64 - size) / 2 // Center vertically
    const radius = 8 // Border radius
    
    // Create gradient for smooth edges
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 24)
    gradient.addColorStop(0, 'rgba(107, 33, 168, 1)') // Dark purple center
    gradient.addColorStop(0.8, 'rgba(107, 33, 168, 0.8)') // Fade to edges
    gradient.addColorStop(1, 'rgba(107, 33, 168, 0)') // Transparent edge
    
    // Draw rounded rectangle
    context.beginPath()
    context.moveTo(x + radius, y)
    context.lineTo(x + size - radius, y)
    context.quadraticCurveTo(x + size, y, x + size, y + radius)
    context.lineTo(x + size, y + size - radius)
    context.quadraticCurveTo(x + size, y + size, x + size - radius, y + size)
    context.lineTo(x + radius, y + size)
    context.quadraticCurveTo(x, y + size, x, y + size - radius)
    context.lineTo(x, y + radius)
    context.quadraticCurveTo(x, y, x + radius, y)
    context.closePath()
    
    context.fillStyle = gradient
    context.fill()
    
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])// Dark purple material with enhanced visibility
  const particlesMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.012, // Larger for better visibility
      color: 0x6b21a8, // Dark purple color directly
      transparent: true,
      opacity: 0.8, // Much higher opacity
      blending: THREE.NormalBlending, // Normal blending instead of additive
      sizeAttenuation: true, // Makes particles smaller with distance
      vertexColors: false, // Ensures consistent color
      // Remove texture to see if that's causing the issue
    })
  }, [])  // Realistic wind simulation with accurate mathematical models
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Breathing cycle synchronization
    const breathCycle = 19 // 4-7-8 breathing pattern
    const breathPhase = (time % breathCycle) / breathCycle
    const breathIntensity = Math.sin(breathPhase * Math.PI * 2) * 0.3
    
    // Wind simulation parameters
    const baseWindSpeed = 0.0008 // Very slow base movement
    const turbulenceStrength = 0.12
    const gustPeriod = 8.0 // Gust every 8 seconds
    const boundarySize = 10 // Reset boundary
    
    // Update each particle position with wind forces
    for (let i = 0; i < particleCount; i++) {
      const index = i * 3
      const x = positions[index]
      const y = positions[index + 1]
      const z = positions[index + 2]
      
      // Multi-octave noise for natural turbulence (Perlin-like)
      const noiseScale = 0.1
      const windForceX = 
        Math.sin(time * 0.3 + x * noiseScale) * 0.15 +
        Math.sin(time * 0.7 + x * noiseScale * 2) * 0.08 +
        Math.sin(time * 1.1 + x * noiseScale * 4) * 0.04
      
      const windForceY = 
        Math.cos(time * 0.2 + y * noiseScale * 0.8) * 0.1 +
        Math.cos(time * 0.5 + y * noiseScale * 1.5) * 0.05 +
        Math.sin(time * 0.9 + y * noiseScale * 3) * 0.03
      
      const windForceZ = 
        Math.sin(time * 0.25 + z * noiseScale * 1.2) * 0.12 +
        Math.cos(time * 0.6 + z * noiseScale * 2.2) * 0.06 +
        Math.sin(time * 0.8 + z * noiseScale * 3.5) * 0.03
        // Periodic wind gusts with realistic intensity curves
      const gustPhase = (time % gustPeriod) / gustPeriod
      const gustIntensity = Math.pow(Math.sin(gustPhase * Math.PI), 2) * 0.8
      
      // Breath-synchronized movement
      const breathInfluenceY = breathIntensity * 0.4 // Vertical breathing movement
      const breathInfluenceX = Math.sin(breathPhase * Math.PI) * 0.2 // Gentle horizontal sway
      
      // Rotational wind components (vortices)
      const rotation = time * 0.1
      const distance = Math.sqrt(x * x + z * z)
      const rotationStrength = Math.max(0, 1 - distance * 0.1) * gustIntensity
      
      const windRotationX = Math.cos(rotation) * rotationStrength * 0.3
      const windRotationZ = Math.sin(rotation) * rotationStrength * 0.3
      
      // Combine all forces including breath synchronization
      const totalWindX = (windForceX + windRotationX + breathInfluenceX) * turbulenceStrength + baseWindSpeed
      const totalWindY = (windForceY + breathInfluenceY) * turbulenceStrength * 0.6
      const totalWindZ = (windForceZ + windRotationZ) * turbulenceStrength
      
      // Apply wind forces to particle positions
      positions[index] += totalWindX
      positions[index + 1] += totalWindY
      positions[index + 2] += totalWindZ
        // Boundary wrapping for continuous flow
      if (Math.abs(positions[index]) > boundarySize) {
        positions[index] = positions[index] > 0 ? -boundarySize : boundarySize
      }
      if (Math.abs(positions[index + 1]) > boundarySize) {
        positions[index + 1] = positions[index + 1] > 0 ? -boundarySize : boundarySize
      }
      // Different boundary for Z (particles stay behind pebble)
      if (positions[index + 2] > 0) {
        positions[index + 2] = -12 // Reset to back if too far forward
      }
      if (positions[index + 2] < -12) {
        positions[index + 2] = 0 // Reset to front boundary if too far back
      }
    }
    
    // Mark positions as needing update
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Gentle overall rotation with mouse influence
    pointsRef.current.rotation.y += 0.0005 // Slower rotation
    pointsRef.current.rotation.x = mouse.y * 0.1 // Reduced mouse influence
  })

  return (
    <points
      ref={pointsRef}
      geometry={particlesGeometry}      material={particlesMaterial}
    />
  )
}