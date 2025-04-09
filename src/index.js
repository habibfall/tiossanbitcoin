import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Performance optimization: Use React.lazy for code splitting
const root = ReactDOM.createRoot(document.getElementById('root'));

// Performance optimization: Remove StrictMode in production
const isDevelopment = process.env.NODE_ENV === 'development';

root.render(
  isDevelopment ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);

// Register service worker for offline support and caching
serviceWorker.register();

// Performance optimization: Preload critical resources
const preloadLinks = [
  { rel: 'preload', as: 'style', href: '/static/css/main.chunk.css' },
  { rel: 'preload', as: 'script', href: '/static/js/main.chunk.js' }
];

preloadLinks.forEach(({ rel, as, href }) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}); 