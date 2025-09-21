'use client'

import { useEffect, useState } from 'react'
import { PerformanceMonitor, usePerformanceMonitor } from '@/lib/performance'

interface PerformanceMonitorProps {
  showInDevelopment?: boolean
  className?: string
}

export function PerformanceMonitorComponent({ 
  showInDevelopment = false, 
  className = '' 
}: PerformanceMonitorProps) {
  const { getMetrics, getCoreWebVitals, reportPerformance } = usePerformanceMonitor()
  const [metrics, setMetrics] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' && showInDevelopment) {
      setIsVisible(true)
    }

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(getMetrics())
    }, 1000)

    return () => clearInterval(interval)
  }, [getMetrics, showInDevelopment])

  const coreWebVitals = getCoreWebVitals()

  if (!isVisible) {
    return null
  }

  const getVitalColor = (value: number | undefined, thresholds: { good: number; poor: number }) => {
    if (value === undefined) return 'text-gray-500'
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {/* Core Web Vitals */}
        <div>
          <h4 className="font-medium text-gray-600 mb-1">Core Web Vitals</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className={getVitalColor(coreWebVitals.lcp, { good: 2500, poor: 4000 })}>
                {coreWebVitals.lcp ? `${coreWebVitals.lcp.toFixed(0)}ms` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span className={getVitalColor(coreWebVitals.fid, { good: 100, poor: 300 })}>
                {coreWebVitals.fid ? `${coreWebVitals.fid.toFixed(0)}ms` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className={getVitalColor(coreWebVitals.cls, { good: 0.1, poor: 0.25 })}>
                {coreWebVitals.cls ? coreWebVitals.cls.toFixed(3) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Custom Metrics */}
        {Object.keys(metrics).length > 0 && (
          <div>
            <h4 className="font-medium text-gray-600 mb-1">Custom Metrics</h4>
            <div className="space-y-1">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-gray-600">{value.toFixed(2)}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={reportPerformance}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            Report to Console
          </button>
        </div>
      </div>
    </div>
  )
}

// Performance overlay for development
export function PerformanceOverlay() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<Record<string, number>>({})

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const monitor = PerformanceMonitor.getInstance()
    
    const updateMetrics = () => {
      setMetrics(monitor.getMetrics())
    }

    const interval = setInterval(updateMetrics, 1000)
    updateMetrics()

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-xs z-50"
      >
        Perf
      </button>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">Performance</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>{key}:</span>
            <span className="text-green-400">{value.toFixed(2)}ms</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Bundle size analyzer component
export function BundleAnalyzer() {
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/performance').then(({ analyzeBundleSize }) => {
        setAnalysis(analyzeBundleSize())
      })
    }
  }, [])

  if (!analysis) return null

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Bundle Analysis</h3>
      <div className="text-xs space-y-1">
        <div>Scripts: {analysis.totalScripts}</div>
        <div>Stylesheets: {analysis.totalStylesheets}</div>
      </div>
    </div>
  )
}
