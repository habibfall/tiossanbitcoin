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
  // Initialize width state, will be set correctly in useEffect
  const [windowWidth, setWindowWidth] = useState(0); 
  const languageMenuRef = useRef(null);
  const burgerMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // DEBUG: Log on render
  // console.log('[Header Render] isLanguageMenuOpen:', isLanguageMenuOpen, 'isMobileView:', windowWidth <= MOBILE_BREAKPOINT);

  const languageNames = {
    french: 'Français',
    wolof: 'Wolof',
    english: 'English'
  };

  // Effect to handle window resizing and set initial width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu if window becomes wider than breakpoint
      if (window.innerWidth > MOBILE_BREAKPOINT && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    // Set the initial width
    handleResize(); 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]); // Add isMobileMenuOpen dependency

  // Effect to handle clicks outside menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close language menu
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      // Close mobile menu (only if burger exists and is clicked outside)
      if (burgerMenuRef.current && // Check if burger menu exists
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !burgerMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // No dependencies needed here is generally fine for this pattern

  const handleTabClick = (tab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when a tab is clicked
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    // Close language menu when opening mobile menu
    if (!isMobileMenuOpen) { // Check previous state before toggle
       setIsLanguageMenuOpen(false);
    }
  };

  const renderTabs = () => (
    <>
      {/* Using optional chaining and nullish coalescing for safety */}
      <button
        className={`header-tab ${activeTab === 'price' ? 'active' : ''}`}
        onClick={() => handleTabClick('price')}
      >
        {text?.[language]?.priceTab ?? 'Price'}
      </button>
      <button
        className={`header-tab ${activeTab === 'converter' ? 'active' : ''}`}
        onClick={() => handleTabClick('converter')}
      >
        {text?.[language]?.converterTab ?? 'Converter'}
      </button>
      <button
        className={`header-tab ${activeTab === 'faq' ? 'active' : ''}`}
        onClick={() => handleTabClick('faq')}
      >
        {text?.[language]?.faqTab ?? 'FAQ'}
      </button>
      <button
        className={`header-tab ${activeTab === 'news' ? 'active' : ''}`}
        onClick={() => handleTabClick('news')}
      >
        {text?.[language]?.newsTab ?? 'News'}
      </button>
      <button
        className={`header-tab ${activeTab === 'quiz' ? 'active' : ''}`}
        onClick={() => handleTabClick('quiz')}
      >
        {text?.[language]?.quizTab ?? 'Quiz'}
      </button>
    </>
  );

  // Function to render language options (can be used in dropdown or mobile menu)
  const renderLanguageOptions = (isMobile = false) => (
    <>
      {Object.entries(languageNames).map(([key, value]) => (
        <button
          key={key}
          role={isMobile ? "menuitem" : undefined}
          className={`language-option ${language === key ? 'active' : ''} ${isMobile ? 'language-option-mobile' : ''}`}
          onClick={() => {
            // console.log('[Language Select] Changing language to:', key); // DEBUG
            onLanguageChange(key);
            setIsLanguageMenuOpen(false); // Close desktop dropdown
            if (isMobile) setIsMobileMenuOpen(false); // Close mobile menu too
          }}
        >
          {value}
        </button>
      ))}
    </>
  );

  // Determine if we are in mobile view based on window width (check if width is > 0)
  const isMobileView = windowWidth > 0 && windowWidth <= MOBILE_BREAKPOINT;

  // --- DEBUGGING LOGS --- 
  // console.log('[Header] Received language prop:', language);
  // console.log('[Header] Received text prop:', text); // Log full object if needed, might be large
  // console.log('[Header] text object for current language:', text?.[language]);
  // console.log('[Header] Price tab translation:', text?.[language]?.priceTab);
  // --- END DEBUGGING LOGS ---

  // Avoid rendering anything until windowWidth is properly set
  if (windowWidth === 0) {
    return null; // Or a loading state for the header
  }

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-content">
        <button
          className="header-logo"
          onClick={() => handleTabClick('price')} // Just change tab, avoid reload
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/static/images/tiossan.png" // Check this path
            alt="Tiossan Logo"
            className="header-logo-img" // Use class for styling in CSS
            style={{ filter: isDarkMode ? 'invert(1)' : 'none' }} // Keep dynamic filter
            onError={(e) => {
              console.error('Failed to load logo:', e);
              e.target.onerror = null; 
              e.target.src = "/static/images/bitcoin-default.png"; // Check this path
            }}
          />
        </button>

        {/* Desktop Tabs */}
        {!isMobileView && (
          <nav className="header-tabs">
            {renderTabs()}
          </nav>
        )}

        <div className="header-controls">
          {/* Language Dropdown - Always render the toggle button */}
          <div className="language-dropdown" ref={languageMenuRef}>
            <button
              className="language-toggle"
              onClick={() => {
                // DEBUG: Log button click
                // console.log('[Language Toggle Click] Current state:', isLanguageMenuOpen);
                setIsLanguageMenuOpen(prev => !prev)}
              }
              aria-haspopup="true"
              aria-expanded={isLanguageMenuOpen}
              title={languageNames[language]} // Keep the title for accessibility
            >
              {/* Modern Outline Globe Icon */}
              <svg
                className="globe-icon"
                width="20" // Match theme toggle SVG size
                height="20" // Match theme toggle SVG size
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            {/* DEBUG: Conditionally log menu rendering */}
            {/* {isLanguageMenuOpen && console.log('[Header Render] Rendering language menu')} */}
            {isLanguageMenuOpen && (
              <div className="language-menu" role="menu">
                {renderLanguageOptions(false)} 
                {/* NOTE: renderLanguageOptions doesn't actually use isMobile param currently */}
                {/* If needed, can adjust options based on isMobileView state */}
              </div>
            )}
          </div>
           
          {/* Theme Toggle - Always render */}
          <ThemeToggle />

          {/* Burger Menu - Conditionally render based on JS */}
          {isMobileView && (
            <button
              ref={burgerMenuRef}
              className={`burger-menu ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-content" 
            >
              <span className="burger-line"></span>
              <span className="burger-line"></span>
              <span className="burger-line"></span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel - Conditionally render content inside based on JS */}
      <div
        id="mobile-menu-content"
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Render tabs inside mobile menu only when it's open AND mobile view */}
        {isMobileView && isMobileMenuOpen && (
          <>
            <nav className="mobile-nav-tabs">
              {renderTabs()}
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 