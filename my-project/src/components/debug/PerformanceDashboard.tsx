import { useState, useEffect } from 'react'
import { globalPerformanceMonitor } from '../../utils/PerformanceMonitor'
import { globalAnimationScheduler } from '../../utils/AnimationScheduler'

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  performanceLevel: 'low' | 'medium' | 'high'
  schedulerEfficiency: number
  activeTasks: number
}

/**
 * Performance Dashboard - Development tool for monitoring optimization metrics
 * Only shows in development mode
 */
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    performanceLevel: 'medium',
    schedulerEfficiency: 0,
    activeTasks: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {    // Only show in development
    // if (!import.meta.env.DEV) return

    const updateMetrics = () => {
      const perfLevel = globalPerformanceMonitor.getPerformanceLevel()
      const schedulerStats = globalAnimationScheduler.getFrameStats()
      
      setMetrics({
        fps: Math.round(1000 / (performance.now() - (window as any).lastFrameTime || 16.67)),
        frameTime: performance.now() - (window as any).lastFrameTime || 16.67,
        memoryUsage: (performance as any).memory?.usedJSHeapSize 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0,
        performanceLevel: perfLevel,
        schedulerEfficiency: schedulerStats.efficiency,
        activeTasks: globalAnimationScheduler.getTaskCount()
      })
      
      ;(window as any).lastFrameTime = performance.now()
    }

    const interval = setInterval(updateMetrics, 1000)
    updateMetrics() // Initial update

    return () => clearInterval(interval)
  }, [])  // Don't render in production
  // if (!import.meta.env.DEV) return null

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency > 0.9) return 'text-green-400'
    if (efficiency > 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-mono hover:bg-black/70 transition-colors"
        title="Toggle Performance Dashboard"
      >
        🔧 PERF
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed top-16 right-4 z-40 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs font-mono text-sm">
          <h3 className="text-lg font-bold mb-3 text-blue-400">Performance Monitor</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span className={metrics.fps > 50 ? 'text-green-400' : metrics.fps > 30 ? 'text-yellow-400' : 'text-red-400'}>
                {metrics.fps}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Frame Time:</span>
              <span className={metrics.frameTime < 16.67 ? 'text-green-400' : 'text-yellow-400'}>
                {metrics.frameTime.toFixed(1)}ms
              </span>
            </div>
            
            {metrics.memoryUsage > 0 && (
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={metrics.memoryUsage < 100 ? 'text-green-400' : 'text-yellow-400'}>
                  {metrics.memoryUsage}MB
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className={getPerformanceColor(metrics.performanceLevel)}>
                {metrics.performanceLevel.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Scheduler:</span>
              <span className={getEfficiencyColor(metrics.schedulerEfficiency)}>
                {Math.round(metrics.schedulerEfficiency * 100)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Tasks:</span>
              <span className="text-blue-400">{metrics.activeTasks}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400">
              🚀 Optimizations Active
            </p>
            <ul className="text-xs text-gray-300 mt-1 space-y-1">
              <li>• Animation Scheduler</li>
              <li>• Frustum Culling</li>
              <li>• Object Pooling</li>
              <li>• LRU Cache</li>
              <li>• Spatial Hash Grid</li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
