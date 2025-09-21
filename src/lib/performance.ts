// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  private observers: PerformanceObserver[] = []

  private constructor() {
    this.initializeObservers()
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.metrics.set('lcp', lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.metrics.set('fid', (entry as any).processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          })
          this.metrics.set('cls', clsValue)
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (e) {
        console.warn('CLS observer not supported')
      }
    }
  }

  // Measure custom performance marks
  mark(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name)
    }
  }

  measure(name: string, startMark: string, endMark?: string): number {
    if (typeof window === 'undefined' || !('performance' in window)) return 0

    try {
      if (endMark) {
        performance.measure(name, startMark, endMark)
      } else {
        performance.measure(name, startMark)
      }
      
      const measure = performance.getEntriesByName(name, 'measure')[0]
      const duration = measure ? measure.duration : 0
      this.metrics.set(name, duration)
      return duration
    } catch (e) {
      console.warn(`Failed to measure ${name}:`, e)
      return 0
    }
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // Get Core Web Vitals
  getCoreWebVitals(): {
    lcp?: number
    fid?: number
    cls?: number
    fcp?: number
    ttfb?: number
  } {
    const metrics = this.getMetrics()
    return {
      lcp: metrics.lcp,
      fid: metrics.fid,
      cls: metrics.cls,
      fcp: metrics.fcp,
      ttfb: metrics.ttfb,
    }
  }

  // Report performance data
  reportPerformance(): void {
    const metrics = this.getMetrics()
    const coreWebVitals = this.getCoreWebVitals()
    
    console.group('🚀 Performance Metrics')
    console.table(metrics)
    console.group('📊 Core Web Vitals')
    console.table(coreWebVitals)
    console.groupEnd()
    console.groupEnd()

    // In production, you would send this data to your analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metrics, coreWebVitals)
    }
  }

  private sendToAnalytics(metrics: Record<string, number>, coreWebVitals: any): void {
    // Example: Send to Google Analytics, Mixpanel, or your custom analytics
    console.log('Sending performance data to analytics:', { metrics, coreWebVitals })
  }

  // Cleanup observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance()

  const measureComponent = (componentName: string, fn: () => void) => {
    const startMark = `${componentName}-start`
    const endMark = `${componentName}-end`
    
    monitor.mark(startMark)
    fn()
    monitor.mark(endMark)
    return monitor.measure(`${componentName}-render`, startMark, endMark)
  }

  const measureAsync = async (name: string, fn: () => Promise<any>) => {
    const startMark = `${name}-start`
    const endMark = `${name}-end`
    
    monitor.mark(startMark)
    const result = await fn()
    monitor.mark(endMark)
    monitor.measure(name, startMark, endMark)
    return result
  }

  return {
    measureComponent,
    measureAsync,
    getMetrics: () => monitor.getMetrics(),
    getCoreWebVitals: () => monitor.getCoreWebVitals(),
    reportPerformance: () => monitor.reportPerformance(),
  }
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return

  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const analysis = {
    scripts: scripts.map(script => ({
      src: (script as HTMLScriptElement).src,
      size: 'Unknown' // Would need to fetch and measure
    })),
    stylesheets: stylesheets.map(link => ({
      href: (link as HTMLLinkElement).href,
      size: 'Unknown' // Would need to fetch and measure
    })),
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length,
  }

  console.group('📦 Bundle Analysis')
  console.table(analysis.scripts)
  console.table(analysis.stylesheets)
  console.log(`Total Scripts: ${analysis.totalScripts}`)
  console.log(`Total Stylesheets: ${analysis.totalStylesheets}`)
  console.groupEnd()

  return analysis
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null
  }

  const memory = (performance as any).memory
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}

// Network performance monitoring
export function monitorNetworkPerformance() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (!navigation) return null

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    load: navigation.loadEventEnd - navigation.loadEventStart,
    total: navigation.loadEventEnd - navigation.navigationStart,
  }
}
