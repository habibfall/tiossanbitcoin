import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

const Header = ({ language, onLanguageChange, activeTab, onTabChange, text }) => {
  const { isDarkMode } = useTheme();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const burgerMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const languageNames = {
    french: 'Français',
    wolof: 'Wolof',
    english: 'English'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      
      if (mobileMenuRef.current && 
          burgerMenuRef.current &&
          !mobileMenuRef.current.contains(event.target) && 
          !burgerMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsLanguageMenuOpen(false);
    }
  };

  const renderTabs = () => (
    <>
      <button 
        className={`header-tab ${activeTab === 'price' ? 'active' : ''}`}
        onClick={() => handleTabClick('price')}
      >
        {text[language].priceTab}
      </button>
      <button 
        className={`header-tab ${activeTab === 'converter' ? 'active' : ''}`}
        onClick={() => handleTabClick('converter')}
      >
        {text[language].converterTab}
      </button>
      <button 
        className={`header-tab ${activeTab === 'faq' ? 'active' : ''}`}
        onClick={() => handleTabClick('faq')}
      >
        {text[language].faqTab}
      </button>
      <button 
        className={`header-tab ${activeTab === 'news' ? 'active' : ''}`}
        onClick={() => handleTabClick('news')}
      >
        {text[language].newsTab}
      </button>
      <button 
        className={`header-tab ${activeTab === 'quiz' ? 'active' : ''}`}
        onClick={() => handleTabClick('quiz')}
      >
        {text[language].quizTab}
      </button>
    </>
  );

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-content">
        <button 
          className="header-logo" 
          onClick={() => {
            window.location.href = window.location.pathname + '?tab=price';
            window.location.reload();
          }}
          style={{ 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            height: '40px'
          }}
        >
          <img 
            src="/tiossan.png"
            alt="Tiossan Logo" 
            style={{ 
              height: '100%',
              width: 'auto',
              display: 'block',
              filter: isDarkMode ? 'invert(1)' : 'none'
            }}
            onError={(e) => {
              console.error('Failed to load logo:', e);
              e.target.onerror = null;
              e.target.src = "/bitcoin-default.png";
            }}
          />
        </button>
        
        <nav className="header-tabs">
          {renderTabs()}
        </nav>

        <div className="header-controls">
          <div className="language-dropdown" ref={languageMenuRef}>
            <button
              className="language-toggle"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              {languageNames[language]}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isLanguageMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isLanguageMenuOpen && (
              <div className="language-menu">
                {Object.entries(languageNames).map(([key, value]) => (
                  <button
                    key={key}
                    className={`language-option ${language === key ? 'active' : ''}`}
                    onClick={() => {
                      onLanguageChange(key);
                      setIsLanguageMenuOpen(false);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ThemeToggle />
          <button 
            ref={burgerMenuRef}
            className={`burger-menu ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </div>

      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        {renderTabs()}
      </div>
    </header>
  );
};

export default Header; 