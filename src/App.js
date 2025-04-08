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

  const languageNames = {
    french: 'Français',
    wolof: 'Wolof',
    english: 'English'
  };

  // Memoize the fetchBitcoinPrice function
  const fetchBitcoinPrice = useCallback(async (retryCount = 0) => {
    try {
      setFetchError(null);
      
      const [currentPriceResponse, historyResponse] = await Promise.all([
        fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD').then(res => res.json()),
        fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30').then(res => res.json())
      ]);
      
      if (!currentPriceResponse.USD || !historyResponse.Data?.Data) {
        throw new Error('Invalid data from CryptoCompare API');
      }
      
      const currentPrice = currentPriceResponse.USD;
      const historyData = historyResponse.Data.Data;
      const usdToFcfa = 655.957;
      const priceInFcfa = Math.round(currentPrice * usdToFcfa);
      
      // Calculate percentage changes
      const oneDayAgo = historyData[historyData.length - 2].close;
      const sevenDaysAgo = historyData[historyData.length - 8].close;
      const thirtyDaysAgo = historyData[0].close;
      
      const change24h = ((currentPrice - oneDayAgo) / oneDayAgo) * 100;
      const change7d = ((currentPrice - sevenDaysAgo) / sevenDaysAgo) * 100;
      const change30d = ((currentPrice - thirtyDaysAgo) / thirtyDaysAgo) * 100;
      
      const newPriceChanges = {
        '24h': Number(change24h.toFixed(2)),
        '7d': Number(change7d.toFixed(2)),
        '30d': Number(change30d.toFixed(2)),
        '1y': priceChanges['1y']
      };

      // Always update the price and timestamp
      setLastUpdated(new Date());
      setIsPriceUpdating(true);
      setBitcoinPrice(priceInFcfa);
      setPriceChanges(newPriceChanges);
      if (timeframe !== '1y') {
        setPriceChange(newPriceChanges[timeframe]);
      }
      
      // Reset the update animation after a delay
      setTimeout(() => setIsPriceUpdating(false), 800);
      
      setIsInitialLoad(false);
      
      return {
        price: priceInFcfa,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setFetchError(error.message);
      
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
      throw error;
    }
  }, [timeframe, isInitialLoad, priceChanges]);

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
    
    const updatePrice = async () => {
      try {
        const data = await fetchBitcoinPrice();
        if (isMounted) {
          console.log('Price updated successfully:', data);
        }
      } catch (error) {
        console.error('Failed to update price:', error);
      }
    };

    updatePrice();
    // Update price every 30 seconds to match Binance API's update frequency
    const interval = setInterval(updatePrice, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
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
      />
      <main className="price-container">
        {activeTab === 'price' && (
          <>
            <div className="price-box">
              <h2>{text?.[language]?.currentPrice ?? <div className="loading-spinner" />}</h2>
              <p className={`price ${isPriceUpdating ? 'price-update' : ''}`}>
                {bitcoinPrice ? (
                  <>
                    <span>{new Intl.NumberFormat('fr-FR').format(bitcoinPrice)}</span>
                    <span className="currency">FCFA</span>
                    <div className={`price-change ${priceChange < 0 ? 'negative' : 'positive'}`}>
                      {priceChange >= 0 ? '+' : ''}{priceChange ? priceChange.toFixed(2) : '0.00'}%
                    </div>
                  </>
                ) : (
                  <div className="loading-spinner" />
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
      <footer className="footer">
        <p>{text?.[language]?.footerRights?.replace('{year}', new Date().getFullYear()) ?? ''}</p>
      </footer>
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