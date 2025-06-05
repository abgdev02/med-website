import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

export function ProceduralPebble() {
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
