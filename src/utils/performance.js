import { lazy, Suspense } from 'react';

// Lazy load component with loading fallback
export const lazyLoad = (importFunc, loadingComponent = null) => {
  const LazyComponent = lazy(importFunc);
  return props => (
    <Suspense fallback={loadingComponent}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Image optimization helper
export const getOptimizedImageUrl = (url, width) => {
  if (!url) return '';
  // Add width parameter for responsive images
  return `${url}?w=${width}&q=75`;
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}; 