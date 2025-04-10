import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import './styles/theme.css';
import BitcoinChart from './components/BitcoinChart';
import BitcoinConverter from './components/BitcoinConverter';
import ThemeToggle from './components/ThemeToggle';
import FAQ from './components/FAQ';
import Header from './components/Header';
import BitcoinNews from './components/BitcoinNews';
import BitcoinQuiz from './components/BitcoinQuiz';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { text } from './data/translations';

function AppContent() {
  const { isDarkMode } = useTheme();
  const [language, setLanguage] = useState('french');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isPriceUpdating, setIsPriceUpdating] = useState(false);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('price');
  const languageMenuRef = useRef(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [priceChanges, setPriceChanges] = useState({
    '24h': 0,
    '7d': 0,
    '30d': 0
  });
  const [fetchError, setFetchError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const languageNames = {
    french: 'Français',
    wolof: 'Wolof',
    english: 'English'
  };

  // Memoize the fetchBitcoinPrice function
  const fetchBitcoinPrice = useCallback(async (retryCount = 0) => {
    try {
      // Only show loading state on initial load
      if (isInitialLoad) {
        setFetchError(null);
      }
      setIsFetching(true);
      
      // Check if we're on a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Fetch current price and 24h change from Binance
      const currentPriceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      }).then(res => res.json());
      
      // Fetch historical klines (candlestick) data for the past 30 days
      const endTime = Date.now();
      const startTime = endTime - (30 * 24 * 60 * 60 * 1000); // 30 days ago
      
      const marketChartResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=${startTime}&endTime=${endTime}`, {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      }).then(res => res.json());
      
      if (!currentPriceResponse.lastPrice || !marketChartResponse || marketChartResponse.length === 0) {
        throw new Error('Invalid data from Binance API');
      }
      
      const currentPrice = parseFloat(currentPriceResponse.lastPrice);
      const change24h = parseFloat(currentPriceResponse.priceChangePercent);
      const usdToFcfa = 655.957;
      const priceInFcfa = Math.round(currentPrice * usdToFcfa);
      
      // Ensure bitcoinPrice is set correctly
      setBitcoinPrice(priceInFcfa);

      // Update more frequently on mobile devices
      const priceDiff = Math.abs((priceInFcfa - bitcoinPrice) / bitcoinPrice * 100);
      if (!isInitialLoad && priceDiff < (isMobile ? 0.05 : 0.1)) {
        setIsFetching(false);
        return {
          price: priceInFcfa,
          timestamp: new Date()
        };
      }
      
      // Calculate percentage changes for 7d and 30d
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      
      // Process klines data to get price history
      const priceHistory = marketChartResponse.map(kline => [
        kline[0], // timestamp
        parseFloat(kline[4]) // closing price
      ]);
      
      const findClosestPrice = (timestamp) => {
        return priceHistory.reduce((closest, [time, price]) => {
          return Math.abs(time - timestamp) < Math.abs(closest[0] - timestamp) ? [time, price] : closest;
        })[1];
      };
      
      const sevenDayPrice = findClosestPrice(sevenDaysAgo);
      const thirtyDayPrice = findClosestPrice(thirtyDaysAgo);
      
      const change7d = ((currentPrice - sevenDayPrice) / sevenDayPrice) * 100;
      const change30d = ((currentPrice - thirtyDayPrice) / thirtyDayPrice) * 100;
      
      const newPriceChanges = {
        '24h': Number(change24h.toFixed(2)),
        '7d': Number(change7d.toFixed(2)),
        '30d': Number(change30d.toFixed(2)),
        '1y': priceChanges['1y']
      };

      // Batch state updates to reduce renders
      const updates = () => {
        setLastUpdated(new Date());
        setIsPriceUpdating(true);
        setPriceChanges(newPriceChanges);
        if (timeframe !== '1y') {
          setPriceChange(newPriceChanges[timeframe]);
        }
        
        // Reset the update animation after a delay
        setTimeout(() => setIsPriceUpdating(false), 1500);
      };
      
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(updates);
      
      setIsInitialLoad(false);
      setIsFetching(false);
      
      return {
        price: priceInFcfa,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      if (isInitialLoad) {
        setFetchError(error.message);
      }
      
      if (retryCount < 3) {
        const retryDelay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchBitcoinPrice(retryCount + 1);
      }
      
      if (isInitialLoad) {
        setBitcoinPrice(null);
        setPriceChange(null);
      }
      setIsFetching(false);
      throw error;
    }
  }, [timeframe, isInitialLoad, priceChanges, bitcoinPrice]);

  // Memoize the validatePriceChange function
  const validatePriceChange = useCallback((value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 0;
    }
    return Number(value.toFixed(2));
  }, []);

  useEffect(() => {
    if (priceChanges[timeframe] !== undefined) {
      setPriceChange(validatePriceChange(priceChanges[timeframe]));
    }
  }, [timeframe, priceChanges, validatePriceChange]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    let retryCount = 0;
    const maxRetries = 5;
    
    const updatePrice = async () => {
      try {
        const data = await fetchBitcoinPrice();
        if (isMounted) {
          console.log('Price updated successfully:', data);
          retryCount = 0; // Reset retry count on success
        }
      } catch (error) {
        console.error('Failed to update price:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          timeoutId = setTimeout(updatePrice, retryDelay);
        }
      }
    };

    // Initial load
    updatePrice();
    
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Update more frequently on mobile devices
    const updateInterval = isMobile ? 5 * 60 * 1000 : 20 * 60 * 1000; // 5 minutes for mobile, 20 minutes for desktop
    
    const interval = setInterval(() => {
      // Clear any pending updates
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Add a small random delay to prevent all clients from hitting the API at the same time
      timeoutId = setTimeout(updatePrice, Math.random() * 2000); // Reduced random delay
    }, updateInterval);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchBitcoinPrice]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  const handleTimeframeChange = useCallback((newTimeframe, newPercentChange) => {
    setTimeframe(newTimeframe);
    setPriceChange(newPercentChange);
    setPriceChanges(prev => ({
      ...prev,
      [newTimeframe]: newPercentChange
    }));
  }, []);

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      {isDarkMode && (
        <div className="floating-elements">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="floating-element"></div>
          ))}
        </div>
      )}
      {!isDarkMode && (
        <div className="bitcoin-circles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bitcoin-circle"></div>
          ))}
        </div>
      )}
      <Header 
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        text={text}
        isLanguageMenuOpen={isLanguageMenuOpen}
        toggleLanguageMenu={toggleLanguageMenu}
        selectLanguage={selectLanguage}
        languageMenuRef={languageMenuRef}
        languageNames={languageNames}
      />
      <main className="price-container">
        {activeTab === 'price' && (
          <>
            <div className="price-box">
              <h2>{text?.[language]?.currentPrice ?? ''}</h2>
              <p className={`price ${isPriceUpdating ? 'price-update' : ''}`}>
                {isInitialLoad ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <span>{new Intl.NumberFormat('fr-FR').format(bitcoinPrice)}</span>
                    <span className="currency">FCFA</span>
                    <div className={`price-change ${priceChange < 0 ? 'negative' : 'positive'}`}>
                      {priceChange >= 0 ? '+' : ''}{priceChange ? priceChange.toFixed(2) : '0.00'}%
                    </div>
                  </>
                )}
              </p>
              <p className="update-time">
                {text?.[language]?.lastUpdated ?? 'Last updated:'} {lastUpdated ? lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                }).replace(':', 'h') : '--h--'}
              </p>
            </div>
            <BitcoinChart language={language} text={text[language]} onTimeframeChange={handleTimeframeChange} />
          </>
        )}

        {activeTab === 'converter' && (
          <div className="converter-container">
            <BitcoinConverter language={language} text={text[language]} bitcoinPrice={bitcoinPrice} />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="faq-container">
            <FAQ language={language} text={text[language]} />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="news-container">
            <BitcoinNews language={language} text={text[language]} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="quiz-container">
            <BitcoinQuiz language={language} text={text[language]} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 