import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

// Cache noise instance globally to avoid recreation
const globalSimplex = new SimplexNoise()

// Create optimized textures once and cache them
const createOptimizedTextures = () => {
  // Optimized color texture - smaller canvas for better performance
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')!
  
  const imageData = context.createImageData(256, 256)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random()
    const value = Math.floor(220 + noise * 10) // Reduced variation for better performance
    imageData.data[i] = value - 1
    imageData.data[i + 1] = value
    imageData.data[i + 2] = value + 1
    imageData.data[i + 3] = 255
  }
  context.putImageData(imageData, 0, 0)
  
  const colorTexture = new THREE.CanvasTexture(canvas)
  colorTexture.wrapS = THREE.RepeatWrapping
  colorTexture.wrapT = THREE.RepeatWrapping
  colorTexture.repeat.set(1.2, 1.2)
  
  // Simplified normal map
  const normalCanvas = document.createElement('canvas')
  normalCanvas.width = 128
  normalCanvas.height = 128
  const normalContext = normalCanvas.getContext('2d')!
  
  const normalImageData = normalContext.createImageData(128, 128)
  for (let i = 0; i < normalImageData.data.length; i += 4) {
    normalImageData.data[i] = Math.floor(128 + (Math.random() - 0.5) * 10)
    normalImageData.data[i + 1] = Math.floor(128 + (Math.random() - 0.5) * 10)
    normalImageData.data[i + 2] = Math.floor(215 + Math.random() * 25)
    normalImageData.data[i + 3] = 255
  }
  normalContext.putImageData(normalImageData, 0, 0)
  
  const normalTexture = new THREE.CanvasTexture(normalCanvas)
  normalTexture.wrapS = THREE.RepeatWrapping
  normalTexture.wrapT = THREE.RepeatWrapping
  
  return { colorTexture, normalTexture }
}

// Cache textures globally to avoid recreation on every component mount
const cachedTextures = createOptimizedTextures()

interface ProceduralPebbleProps {
  distance?: number
  animate?: boolean
  quality?: 'low' | 'medium' | 'high'
  enableTextures?: boolean
}

export function ProceduralPebble({ 
  distance = 10, 
  animate = true,
  quality = 'medium',
  enableTextures = true
}: ProceduralPebbleProps = {}) {
  const mesh = useRef<THREE.Mesh>(null!)  // Dynamic geometry based on distance and quality - LOD (Level of Detail)
  const geometryArgs = useMemo((): [number, number, number] => {
    const qualityMap = {
      low: distance > 30 ? [1, 12, 8] : [1, 16, 12],
      medium: distance > 30 ? [1, 24, 16] : [1, 48, 32], 
      high: distance > 30 ? [1, 48, 32] : [1, 96, 64]
    }
    return qualityMap[quality] as [number, number, number]
  }, [distance, quality])

  // Optimized material with conditional texture loading
  const material = useMemo(() => {
    const baseProps = {
      color: new THREE.Color(0.98, 0.98, 0.98),
      roughness: 0.8,
      metalness: 0.02,
      envMapIntensity: 0.12,
    }

    // Only add textures if close enough and enabled
    if (enableTextures && distance < 25) {
      return new THREE.MeshStandardMaterial({
        ...baseProps,
        map: cachedTextures.colorTexture,
        normalMap: cachedTextures.normalTexture,
        normalScale: new THREE.Vector2(0.3, 0.3),
      })
    }

    // Simplified material for distant objects
    return new THREE.MeshStandardMaterial(baseProps)
  }, [distance, enableTextures])

  // Optimized geometry modification with memoized callback
  const modifyGeometry = useCallback(() => {
    if (!mesh.current) return
    
    const g = mesh.current.geometry as THREE.BufferGeometry
    const pos = g.attributes.position as THREE.BufferAttribute

    // Adaptive noise complexity based on distance
    const bump = distance > 25 ? 0.008 : 0.015
    const noiseScale1 = distance > 25 ? 0.3 : 0.4
    const noiseScale2 = distance > 25 ? 0.8 : 1.2
    const flattenFactor = 0.92

    // Use single loop with optimized calculations
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)

      // Simplified noise calculation - fewer layers for better performance
      let totalNoise: number
      if (distance > 25) {
        // Single noise layer for distant objects
        totalNoise = globalSimplex.noise3d(x * noiseScale1, y * noiseScale1, z * noiseScale1)
      } else {
        // Dual layer noise for close objects
        const n1 = globalSimplex.noise3d(x * noiseScale1, y * noiseScale1, z * noiseScale1) * 0.8
        const n2 = globalSimplex.noise3d(x * noiseScale2, y * noiseScale2, z * noiseScale2) * 0.2
        totalNoise = n1 + n2
      }

      pos.setXYZ(
        i,
        x + totalNoise * bump * Math.abs(x),
        y * flattenFactor + totalNoise * bump * 0.1,
        z + totalNoise * bump * Math.abs(z)
      )
    }
    
    pos.needsUpdate = true
    g.computeVertexNormals()
  }, [distance])

  // Apply geometry modifications
  useEffect(() => {
    modifyGeometry()
  }, [modifyGeometry])

  // Conditional animation with performance throttling
  useFrame((_s, dt) => {
    if (animate && mesh.current) {
      // Slower rotation for distant objects to save performance
      const rotationSpeed = distance > 25 ? 0.15 : 0.25
      mesh.current.rotation.y += dt * rotationSpeed
    }
  })
  
  return (
    <mesh ref={mesh} material={material} castShadow receiveShadow>
      <sphereGeometry args={geometryArgs} />
    </mesh>
  )
}
