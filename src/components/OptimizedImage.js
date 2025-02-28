import React from 'react';

const OptimizedImage = ({ src, alt, className }) => {
  const imagePath = src.startsWith('/') ? src : `/${src}`;
  
  return (
    <img
      src={imagePath}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/images/bitcoin-default.png';
      }}
    />
  );
};

export default OptimizedImage; 