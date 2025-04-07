import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

// Define a breakpoint for switching to mobile view
const MOBILE_BREAKPOINT = 768;

const Header = ({ language, onLanguageChange, activeTab, onTabChange, text }) => {
  const { isDarkMode } = useTheme();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Initialize with current width
  const languageMenuRef = useRef(null);
  const burgerMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const languageNames = {
    french: 'Français',
    wolof: 'Wolof',
    english: 'English'
  };

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu if window becomes wider than breakpoint
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Call handler right away so state is correct on initial mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures this effect runs only on mount and unmount

  // Effect to handle clicks outside menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }

      // Only close mobile menu if clicking outside both the menu and the burger icon
      if (mobileMenuRef.current &&
          burgerMenuRef.current &&
          !mobileMenuRef.current.contains(event.target) &&
          !burgerMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Dependencies are correct here

  const handleTabClick = (tab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when a tab is clicked
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Optionally close language menu when opening mobile menu
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
        {text[language]?.priceTab || 'Price'} {/* Add fallback text */}
      </button>
      <button
        className={`header-tab ${activeTab === 'converter' ? 'active' : ''}`}
        onClick={() => handleTabClick('converter')}
      >
        {text[language]?.converterTab || 'Converter'} {/* Add fallback text */}
      </button>
      <button
        className={`header-tab ${activeTab === 'faq' ? 'active' : ''}`}
        onClick={() => handleTabClick('faq')}
      >
        {text[language]?.faqTab || 'FAQ'} {/* Add fallback text */}
      </button>
      <button
        className={`header-tab ${activeTab === 'news' ? 'active' : ''}`}
        onClick={() => handleTabClick('news')}
      >
        {text[language]?.newsTab || 'News'} {/* Add fallback text */}
      </button>
      <button
        className={`header-tab ${activeTab === 'quiz' ? 'active' : ''}`}
        onClick={() => handleTabClick('quiz')}
      >
        {text[language]?.quizTab || 'Quiz'} {/* Add fallback text */}
      </button>
    </>
  );

  // Determine if we are in mobile view based on window width
  const isMobileView = windowWidth <= MOBILE_BREAKPOINT;

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-content">
        <button
          className="header-logo"
          onClick={() => {
            // Consider updating state instead of full reload if possible
            window.location.href = window.location.pathname + '?tab=price';
            // window.location.reload(); // Reload might cause flashes, maybe update state instead
            handleTabClick('price'); // Update active tab state
          }}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            // Let CSS handle height based on content/rules
            // height: '40px'
          }}
        >
          <img
            src="/static/images/tiossan.png" // Ensure path is correct relative to public folder
            alt="Tiossan Logo"
            style={{
              // Let CSS handle height/width
              // height: '100%',
              // width: 'auto',
              display: 'block',
              filter: isDarkMode ? 'invert(1)' : 'none'
            }}
            onError={(e) => {
              console.error('Failed to load logo:', e);
              e.target.onerror = null; // Prevent infinite loop if fallback fails
              e.target.src = "/static/images/bitcoin-default.png"; // Ensure fallback path is correct
            }}
          />
        </button>

        {/* Conditionally render tabs or nothing based on screen size */}
        {!isMobileView && (
          <nav className="header-tabs">
            {renderTabs()}
          </nav>
        )}

        <div className="header-controls">
          <div className="language-dropdown" ref={languageMenuRef}>
            <button
              className="language-toggle"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              aria-haspopup="true"
              aria-expanded={isLanguageMenuOpen}
            >
              {languageNames[language] || 'Language'} {/* Add fallback */}
              <svg /* SVG content */ >
                 {/* ... SVG path ... */}
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
              <div className="language-menu" role="menu">
                {Object.entries(languageNames).map(([key, value]) => (
                  <button
                    key={key}
                    role="menuitem"
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

          {/* Conditionally render burger menu only on mobile view */}
          {isMobileView && (
            <button
              ref={burgerMenuRef}
              className={`burger-menu ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-content" // Link to the menu it controls
            >
              <span className="burger-line"></span>
              <span className="burger-line"></span>
              <span className="burger-line"></span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu panel - render based on JS state, control visibility with CSS */}
      <div
        id="mobile-menu-content" // Add ID for aria-controls
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Render tabs inside mobile menu only when it's supposed to be open */}
        {isMobileView && renderTabs()}
      </div>
    </header>
  );
};

export default Header; 