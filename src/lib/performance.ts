/**
 * Performance monitoring utilities for conversion pages
 */

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  resourceLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  interactionToNextPaint: number;
}

/**
 * Measures various performance metrics for a page
 */
export function measurePerformance(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    // Start measuring from navigation start
    const startTimestamp = performance.timeOrigin || performance.timing.navigationStart;
    
    // Initialize metrics with default values
    let metrics: PerformanceMetrics = {
      pageLoadTime: 0,
      domContentLoaded: 0,
      resourceLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      interactionToNextPaint: 0
    };
    
    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      calculateMetrics();
    } else {
      window.addEventListener('load', calculateMetrics);
    }
    
    function calculateMetrics() {
      // Page load time
      metrics.pageLoadTime = performance.now();
      
      // DOM content loaded
      const domContentLoadedEvent = performance.getEntriesByType('navigation')[0];
      if (domContentLoadedEvent) {
        metrics.domContentLoaded = domContentLoadedEvent['domContentLoadedEventEnd'] - domContentLoadedEvent['fetchStart'];
      }
      
      // Resource load time
      const resources = performance.getEntriesByType('navigation');
      if (resources.length > 0) {
        metrics.resourceLoadTime = resources[0].loadEventEnd - resources[0].fetchStart;
      }
      
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          } else if (entry.entryType === 'largest-contentful-paint') {
            metrics.largestContentfulPaint = entry.startTime;
          } else if (entry.entryType === 'layout-shift') {
            // CLS is cumulative, so add all layout shifts
            metrics.cumulativeLayoutShift += entry.value;
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      
      // Resolve after a short delay to ensure all metrics are captured
      setTimeout(() => {
        resolve(metrics);
      }, 1000);
    }
  });
}

/**
 * Optimizes resource loading for conversion pages
 */
export function optimizeResourceLoading() {
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize image loading
  optimizeImages();
  
  // Optimize script loading
  optimizeScripts();
}

/**
 * Preloads critical resources for conversion pages
 */
function preloadCriticalResources() {
  // Preload conversion-specific CSS
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.href = '/_app/immutable/assets/ConversionPanel-critical.css';
  preloadLink.as = 'style';
  document.head.appendChild(preloadLink);
  
  // Preload commonly used format icons
  const formatIcons = [
    '/_app/immutable/assets/jpeg-icon.svg',
    '/_app/immutable/assets/png-icon.svg',
    '/_app/immutable/assets/mp3-icon.svg',
    '/_app/immutable/assets/pdf-icon.svg'
  ];
  
  formatIcons.forEach(icon => {
    const iconLink = document.createElement('link');
    iconLink.rel = 'preload';
    iconLink.href = icon;
    iconLink.as = 'image';
    document.head.appendChild(iconLink);
  });
}

/**
 * Optimizes images on conversion pages
 */
function optimizeImages() {
  // Make sure all images have loading="lazy" where appropriate
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add srcset for responsive images
    if (img.src && !img.hasAttribute('srcset')) {
      // This is a simplified version - in a real implementation, you'd need to generate actual responsive sizes
      const baseSrc = img.src.replace(/\.[^/.]+$/, '');
      const ext = img.src.split('.').pop();
      img.setAttribute('srcset', `${baseSrc}-small.${ext} 480w, ${baseSrc}-medium.${ext} 768w, ${baseSrc}-large.${ext} 1200w`);
    }
  });
}

/**
 * Optimizes script loading
 */
function optimizeScripts() {
  // Defer non-critical scripts
  document.querySelectorAll('script[data-critical="false"]').forEach(script => {
    script.setAttribute('defer', '');
  });
}

/**
 * Implements component lazy loading
 */
export function lazyLoadComponent(componentPath: string, container: HTMLElement) {
  return new Promise((resolve, reject) => {
    // Dynamically import component
    import(componentPath)
      .then(module => {
        const component = module.default;
        // Render component in container
        // Implementation would depend on your specific component system
        resolve(component);
      })
      .catch(err => {
        console.error(`Failed to load component: ${componentPath}`, err);
        reject(err);
      });
  });
}