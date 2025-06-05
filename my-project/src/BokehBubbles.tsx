import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface BokehBubblesProps {
  count?: number
}

const BokehBubbles: React.FC<BokehBubblesProps> = ({ count = 5000 }) => {
  const ref = useRef<THREE.Points>(null!)
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // Wellness color palette
    const wellnessColors = [
      new THREE.Color('#E8D5E5'), // Soft lavender pink
      new THREE.Color('#C5D1E8'), // Gentle periwinkle
      new THREE.Color('#D1E2F0'), // Calm sky blue
      new THREE.Color('#F0EDE0'), // Warm cream
      new THREE.Color('#F0E5E0'), // Soft peach
    ]
    
    for (let i = 0; i < count; i++) {
      // Position particles in a sphere
      const radius = Math.random() * 25 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Assign wellness colors
      const color = wellnessColors[Math.floor(Math.random() * wellnessColors.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [count])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })
  
  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  )
}

export default BokehBubbles
