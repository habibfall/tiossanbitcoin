import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, width, height, priority = false, style = {} }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const imagePath = src.startsWith('http') ? src : `/${src}`;
  
  return (
    <div className={`image-container ${className || ''}`} style={{ position: 'relative', ...style }}>
      <img
        src={imagePath}
        alt={alt}
        className={`optimized-image ${isLoading ? 'loading' : ''} ${error ? 'error' : ''}`}
        loading={priority ? "eager" : "lazy"}
        width={width}
        height={height}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          e.target.onerror = null;
          setError(true);
          setIsLoading(false);
          console.error(`Failed to load image: ${src}`);
        }}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {isLoading && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#f0f0f0',
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage; 