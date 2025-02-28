import React from 'react';

const OptimizedImage = ({ src, alt, className, width, height, priority = false }) => {
  const imagePath = src.startsWith('http') ? src : `/${src}`;
  
  return (
    <img
      src={imagePath}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      width={width}
      height={height}
      onError={(e) => {
        e.target.onerror = null;
        console.error(`Failed to load image: ${src}`);
      }}
    />
  );
};

export default OptimizedImage; 