import React, { useEffect } from 'react';
import '../styles/Stars.css';

const Stars = () => {
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size (slightly increased range)
      const size = Math.random() * 2.5 + 0.8;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random colors (slightly brighter)
      const colors = ['rgba(255, 255, 255, 0.5)', 'rgba(247, 243, 211, 0.4)', 'rgba(198, 226, 255, 0.4)'];
      star.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Random animation duration
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      
      document.querySelector('.stars-container').appendChild(star);
      
      // Remove star after animation
      setTimeout(() => {
        star.remove();
      }, 5000);
    };

    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Random starting position (always from top of screen)
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = '0';
      
      document.querySelector('.stars-container').appendChild(star);
      
      // Remove shooting star after animation
      setTimeout(() => {
        star.remove();
      }, 1000);
    };

    // Create initial batch of stars (increased number)
    for (let i = 0; i < 35; i++) {
      createStar();
    }

    // Regular stars interval (slightly increased frequency)
    const starsInterval = setInterval(() => {
      createStar();
    }, 150);

    // Shooting stars interval (slightly increased frequency)
    const shootingStarsInterval = setInterval(() => {
      createShootingStar();
    }, 6000);

    return () => {
      clearInterval(starsInterval);
      clearInterval(shootingStarsInterval);
    };
  }, []);

  return <div className="stars-container" />;
};

export default Stars; 