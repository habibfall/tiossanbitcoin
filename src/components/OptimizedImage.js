import React, { useState, useEffect } from 'react';

const OptimizedImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    useEffect(() => {
        setIsLoaded(false);
        setError(false);
        setCurrentSrc(src);
    }, [src]);

    // Preload image
    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.src = src;
        
        img.onload = () => {
            setIsLoaded(true);
            setError(false);
        };
        
        img.onerror = () => {
            setError(true);
            setIsLoaded(true);
            // Try to load from public folder if the src was from assets
            if (src.startsWith('/static/') || src.startsWith('../assets/')) {
                const publicPath = `/images/${src.split('/').pop()}`;
                setCurrentSrc(publicPath);
            }
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, currentSrc]);

    const containerStyle = {
        position: 'relative',
        width: '100%',
        height: 'auto',
        aspectRatio: width && height ? `${width}/${height}` : '16/9',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.375rem',
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
    };

    return (
        <div style={containerStyle} className={className}>
            {/* Loading skeleton */}
            {!isLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#e5e7eb',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                />
            )}

            {/* Main image */}
            <img
                src={currentSrc}
                alt={alt}
                style={imageStyle}
                onLoad={() => setIsLoaded(true)}
                onError={() => setError(true)}
                loading={priority ? "eager" : "lazy"}
            />

            {/* Error state */}
            {error && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        fontSize: '0.875rem',
                    }}
                >
                    Unable to load image
                </div>
            )}

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: .5;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default OptimizedImage; 