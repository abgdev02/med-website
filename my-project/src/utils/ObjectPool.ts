import * as THREE from 'three'

/**
 * Object Pool pattern implementation for THREE.js objects
 * Reduces garbage collection pressure by reusing objects
 */
export class ObjectPool<T extends THREE.Object3D> {
  private pool: T[] = []
  private active: Set<T> = new Set()
  private createFn: () => T
  private resetFn?: (obj: T) => void
  private maxSize: number

  constructor(
    createFn: () => T, 
    resetFn?: (obj: T) => void, 
    maxSize: number = 1000
  ) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.maxSize = maxSize
  }

  acquire(): T {
    let obj = this.pool.pop()
    
    if (!obj) {
      obj = this.createFn()
    }
    
    obj.visible = true
    this.active.add(obj)
    return obj
  }

  release(obj: T): void {
    if (this.active.has(obj)) {
      obj.visible = false
      this.active.delete(obj)
      
      // Reset object properties
      if (this.resetFn) {
        this.resetFn(obj)
      } else {
        // Default reset
        obj.position.set(0, 0, 0)
        obj.rotation.set(0, 0, 0)
        obj.scale.setScalar(1)
      }
      
      // Only keep objects if under max size
      if (this.pool.length < this.maxSize) {
        this.pool.push(obj)
      } else {
        // Dispose of excess objects
        this.disposeObject(obj)
      }
    }
  }

  releaseAll(): void {
    const objectsToRelease = Array.from(this.active)
    objectsToRelease.forEach(obj => this.release(obj))
  }

  preAllocate(count: number): void {
    for (let i = 0; i < count && this.pool.length < this.maxSize; i++) {
      const obj = this.createFn()
      obj.visible = false
      this.pool.push(obj)
    }
  }

  getStats(): { poolSize: number; activeCount: number; totalAllocated: number } {
    return {
      poolSize: this.pool.length,
      activeCount: this.active.size,
      totalAllocated: this.pool.length + this.active.size
    }
  }

  dispose(): void {
    // Dispose all objects
    this.active.forEach(obj => this.disposeObject(obj))
    this.pool.forEach(obj => this.disposeObject(obj))
    
    this.active.clear()
    this.pool = []
  }
  private disposeObject(obj: T): void {
    // Dispose geometry and materials if they exist
    if ('geometry' in obj && obj.geometry && typeof obj.geometry === 'object' && 'dispose' in obj.geometry) {
      (obj.geometry as any).dispose()
    }
    
    if ('material' in obj && obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(material => {
          if (material && typeof material === 'object' && 'dispose' in material) {
            (material as any).dispose()
          }
        })
      } else if (typeof obj.material === 'object' && 'dispose' in obj.material) {
        (obj.material as any).dispose()
      }
    }
  }
}

/**
 * Particle Pool specifically for THREE.js Points/Meshes
 */
export class ParticlePool extends ObjectPool<THREE.Mesh> {
  constructor(
    geometry: THREE.BufferGeometry, 
    material: THREE.Material, 
    maxSize: number = 5000
  ) {
    super(
      () => new THREE.Mesh(geometry, material),
      (mesh) => {
        // Custom reset for particles
        mesh.position.set(0, 0, 0)
        mesh.rotation.set(0, 0, 0)
        mesh.scale.setScalar(1)
        mesh.visible = false
      },
      maxSize
    )
  }
}
