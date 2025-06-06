import React, { useRef, useMemo, useEffect } from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import { 
  Color, 
  AdditiveBlending, 
  BufferGeometry, 
  BufferAttribute,
  Points as ThreePoints 
} from 'three'
import { globalAnimationScheduler } from './utils/AnimationScheduler'
import { usePreferredMotion } from './hooks/usePreferredMotion'

interface BokehBubblesProps {
  count?: number
}

// Cache color instances globally to avoid recreation
const wellnessColors = [
  new Color('#E8D5E5'),
  new Color('#C5D1E8'), 
  new Color('#D1E2F0'),
  new Color('#F0EDE0'),
  new Color('#F0E5E0'),
  new Color('#C7E6F7'),
  new Color('#e1eaf7'),
]

const BokehBubbles: React.FC<BokehBubblesProps> = ({ count = 3500 }) => {
  const ref = useRef<ThreePoints>(null!)
  const { prefersReducedMotion, getAnimationConfig } = usePreferredMotion()

  // Pre-computed breathing curve for better performance
  const breathingPhase = useRef(0)

  // Memoized particle data with optimized memory layout
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const baseScales = new Float32Array(count)
    const phaseOffsets = new Float32Array(count) // Pre-compute phase offsets
    
    for (let i = 0; i < count; i++) {
      // particles fill a gentle, misty ellipsoid (flat sphere)
      const r = 200 + Math.random() * 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.6

      const color = wellnessColors[Math.floor(Math.random() * wellnessColors.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      baseScales[i] = Math.random() * 0.4 + 0.2 // 0.2–0.6
      phaseOffsets[i] = Math.random() * Math.PI * 2 // Pre-compute phase for shimmer
    }
    
    return { positions, colors, baseScales, phaseOffsets }
  }, [count])
  // Use animation scheduler for better performance control
  useEffect(() => {
    const taskId = `bokeh-bubbles-${Math.random().toString(36).substr(2, 9)}`
    
    globalAnimationScheduler.addTask({
      id: taskId,
      priority: 3, // Medium priority
      updateInterval: prefersReducedMotion ? 100 : 16, // Slower updates for reduced motion
      callback: (deltaTime: number) => {
        if (!ref.current) return        // Respect motion preferences
        const animationIntensity = getAnimationConfig(1, 0.1) // 10% intensity for reduced motion

        // Update breathing phase
        breathingPhase.current += deltaTime * animationIntensity
        
        // 4-7-8 breathing rhythm (19s total)
        const t = breathingPhase.current % 19
        let breath = 1
        if (t < 4) breath = 1 + getAnimationConfig(0.1, 0.02) * (t / 4)
        else if (t < 11) breath = 1 + getAnimationConfig(0.1, 0.02)
        else breath = 1 + getAnimationConfig(0.1, 0.02) - getAnimationConfig(0.15, 0.03) * ((t - 11) / 8)// Update particle sizes efficiently
        const geometry = ref.current.geometry as BufferGeometry
        if (!geometry.attributes.size) {
          const sizes = new Float32Array(count)
          for (let i = 0; i < count; i++) sizes[i] = particleData.baseScales[i]
          geometry.setAttribute('size', new BufferAttribute(sizes, 1))
        }
        
        const sizes = geometry.attributes.size.array as Float32Array
        
        // Batch update sizes with pre-computed values
        for (let i = 0; i < count; i++) {
          const local = Math.sin(breathingPhase.current * 0.6 + particleData.phaseOffsets[i])
          sizes[i] = particleData.baseScales[i] * breath * (0.8 + 0.3 * local)
        }
        geometry.attributes.size.needsUpdate = true        // Gentle rotation with optimized trigonometry
        const time = breathingPhase.current
        ref.current.rotation.x = Math.sin(time * 0.05) * getAnimationConfig(0.05, 0.01)
        ref.current.rotation.y = Math.sin(time * 0.08) * getAnimationConfig(0.08, 0.02)  
        ref.current.rotation.z = Math.sin(time * 0.03) * getAnimationConfig(0.02, 0.005)
      }
    })

    return () => {
      globalAnimationScheduler.removeTask(taskId)
    }
  }, [count, particleData, prefersReducedMotion, getAnimationConfig])

  return (
    <Points
      ref={ref}
      positions={particleData.positions}
      colors={particleData.colors}
      key={count}
    >      <PointMaterial
        transparent
        size={1.1}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  )
}

export default BokehBubbles
