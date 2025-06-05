import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface BokehBubblesProps {
  count?: number
}

const BokehBubbles: React.FC<BokehBubblesProps> = ({ count = 3500 }) => {
  const ref = useRef<THREE.Points>(null!)

  // -- Paler, gentler colors for mystical effect --
  const wellnessColors = [
    new THREE.Color('#E8D5E5'),
    new THREE.Color('#C5D1E8'),
    new THREE.Color('#D1E2F0'),
    new THREE.Color('#F0EDE0'),
    new THREE.Color('#F0E5E0'),
    new THREE.Color('#C7E6F7'),
    new THREE.Color('#e1eaf7'),
  ]

  // Memoized particle positions/colors, mostly in a soft cloud, not a big ball
  const [positions, colors, baseScales] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const baseScales = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // particles fill a gentle, misty ellipsoid (flat sphere)
      const r = 200 + Math.random() * 400 // ~closer, for denser cloud
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7 // flatter vertical
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.6 // shallow depth

      const color = wellnessColors[Math.floor(Math.random() * wellnessColors.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // assign random base scale for shimmer, all <1 for dust-like
      baseScales[i] = Math.random() * 0.4 + 0.2 // 0.2–0.6
    }
    return [positions, colors, baseScales]
  }, [count])
  // Breathing/pulsing logic with 4-7-8 pattern
  useFrame((state) => {
    if (!ref.current) return

    // 4-7-8 breathing rhythm (19s total: 4 inhale, 7 hold, 8 exhale)
    const t = state.clock.elapsedTime % 19
    let breathIntensity = 1
    let breathScale = 1
    
    if (t < 4) {
      // Inhale phase: Gentle expansion
      const progress = t / 4
      breathIntensity = 1 + 0.15 * progress
      breathScale = 1 + 0.08 * progress
    } else if (t < 11) {
      // Hold phase: Gentle shimmer at peak
      const holdProgress = (t - 4) / 7
      breathIntensity = 1.15 + 0.05 * Math.sin(holdProgress * Math.PI * 4)
      breathScale = 1.08 + 0.02 * Math.sin(holdProgress * Math.PI * 3)
    } else {
      // Exhale phase: Gradual release
      const progress = (t - 11) / 8
      breathIntensity = 1.15 - 0.2 * progress
      breathScale = 1.08 - 0.12 * progress
    }

    // Apply breathing effect to particle system
    ref.current.scale.setScalar(breathScale)

    // Update individual particle sizes with ASMR-like shimmer
    const geometry = ref.current.geometry as THREE.BufferGeometry
    if (geometry.attributes.size === undefined) {
      const sizes = new Float32Array(count)
      for (let i = 0; i < count; i++) sizes[i] = baseScales[i]
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    }
    
    const sizes = geometry.attributes.size.array as Float32Array
    for (let i = 0; i < count; i++) {
      // Each particle has its own gentle shimmer
      const localShimmer = Math.sin(state.clock.elapsedTime * 0.4 + i * 0.1)
      const breathingPulse = Math.sin(t * 0.33 + i * 0.05) // Sync with breath
      sizes[i] = baseScales[i] * breathIntensity * (0.7 + 0.4 * localShimmer + 0.2 * breathingPulse)
    }
    geometry.attributes.size.needsUpdate = true

    // Gentle, organic rotation that follows breathing
    const breathingRotation = Math.sin(t * 0.33) * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.03 + breathingRotation
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05 + breathingRotation * 0.5
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.02) * 0.01 + breathingRotation * 0.3
  })

  // Drei's PointMaterial does not use custom per-point sizes,
  // so we use vanilla points with a custom shaderMaterial,
  // or you can keep PointMaterial for simplicity (less mystical, still nice)
  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      // key prop makes sure it resets if count changes
      key={count}
    >
      <PointMaterial
        transparent
        size={1.1}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  )
}

export default BokehBubbles
