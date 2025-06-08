// Test version with highly visible colors to debug rendering
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function TestWaterBackground() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Simple test shader with visible colors
  const testShader = useMemo(() => ({
    uniforms: {
      time: { value: 0.0 }
    },
    
    vertexShader: `
      varying vec2 vUv;
      void main(){  
        vUv = uv; 
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
    
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {  
        // Simple animated gradient that should be clearly visible
        vec2 uv = vUv;
        float wave = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
        
        // Bright purple gradient for testing
        vec3 color1 = vec3(0.6, 0.3, 0.8); // Purple
        vec3 color2 = vec3(0.4, 0.2, 0.9); // Blue-purple
        
        vec3 color = mix(color1, color2, wave);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [])
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: testShader.uniforms,
    vertexShader: testShader.vertexShader,
    fragmentShader: testShader.fragmentShader,
    transparent: false,
    side: THREE.DoubleSide
  }), [testShader])
  
  useFrame(() => {
    if (meshRef.current && material.uniforms) {
      material.uniforms.time.value += 0.05
    }
  })
  
  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, -8]} 
      scale={[40, 40, 1]}
      material={material}
      renderOrder={-1}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
