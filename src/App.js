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

  const text = {
    french: {
      appTitle: "Suivi du Prix Bitcoin",
      currentPrice: "Prix actuel du Bitcoin",
      lastUpdated: "Dernière mise à jour :",
      selectLanguage: "Choisir la langue",
      converter: "Convertisseur Bitcoin",
      chart: "Graphique du prix",
      footerRights: "© {year} Tiossan Academy par Magatte Wade. Tous droits réservés.",
      priceTab: "Prix & Graphique",
      converterTab: "Convertisseur",
      faqTab: "FAQ",
      newsTab: "Actualités",
      quizTab: "Quiz Bitcoin"
    },
    wolof: {
      appTitle: "Suivi Prix Bitcoin",
      currentPrice: "Prix bi léegi",
      lastUpdated: "Yeesal bi mujj:",
      selectLanguage: "Tann làkk",
      converter: "Shoppe Bitcoin",
      chart: "Nataal prix bi",
      footerRights: "© {year} Tiossan Academy ci Magatte Wade. Ay droit you kenn menul jël.",
      priceTab: "Prix ak Nataal",
      converterTab: "Shoppe",
      faqTab: "FAQ",
      newsTab: "Xibaar yi",
      quizTab: "Jàng Bitcoin"
    },
    english: {
      appTitle: "Bitcoin Price Tracker",
      currentPrice: "Current Bitcoin Price",
      lastUpdated: "Last updated:",
      selectLanguage: "Select language",
      converter: "Bitcoin Converter",
      chart: "Price Chart",
      footerRights: "© {year} Tiossan Academy by Magatte Wade. All rights reserved.",
      priceTab: "Price & Chart",
      converterTab: "Converter",
      faqTab: "FAQ",
      newsTab: "News",
      quizTab: "Bitcoin Quiz"
    }
  };

  // Memoize the fetchBitcoinPrice function
  const fetchBitcoinPrice = useCallback(async (retryCount = 0) => {
    try {
      setFetchError(null);
      console.log('Fetching Bitcoin price from Binance...');
      
      const [priceData, dayStats, klinesResponse] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then(res => res.json()),
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').then(res => res.json()),
        fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30`).then(res => res.json())
      ]);
      
      if (!priceData.price || !dayStats.priceChangePercent || !Array.isArray(klinesResponse)) {
        throw new Error('Invalid data from Binance API');
      }
      
      const currentPrice = parseFloat(priceData.price);
      const usdToFcfa = 655.957;
      const priceInFcfa = Math.round(currentPrice * usdToFcfa);
      
      const change24h = parseFloat(dayStats.priceChangePercent);
      
      const sevenDayIndex = klinesResponse.length >= 7 ? klinesResponse.length - 7 : 0;
      const sevenDaysAgo = parseFloat(klinesResponse[sevenDayIndex][1]);
      const change7d = ((currentPrice - sevenDaysAgo) / sevenDaysAgo) * 100;
      
      const thirtyDaysAgo = parseFloat(klinesResponse[0][1]);
      const change30d = ((currentPrice - thirtyDaysAgo) / thirtyDaysAgo) * 100;
      
      const newPriceChanges = {
        '24h': Number(change24h.toFixed(2)),
        '7d': Number(change7d.toFixed(2)),
        '30d': Number(change30d.toFixed(2)),
        '1y': priceChanges['1y']
      };
      
      setPriceChanges(newPriceChanges);
      if (timeframe !== '1y') {
        setPriceChange(newPriceChanges[timeframe]);
      }
      setBitcoinPrice(priceInFcfa);
      setLastUpdated(new Date());
      setIsInitialLoad(false);
      
      setIsPriceUpdating(true);
      setTimeout(() => setIsPriceUpdating(false), 800);
      
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
    const interval = setInterval(updatePrice, 600000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      console.log('Cleaning up price update interval');
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
              <h2>{text[language].currentPrice}</h2>
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
                  <span className="price">Loading...</span>
                )}
              </p>
              <p className="update-time">
                {text[language].lastUpdated} {lastUpdated ? lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                }).replace(':', 'h') : '--h--'}
              </p>
            </div>
            <BitcoinChart language={language} onTimeframeChange={handleTimeframeChange} />
          </>
        )}

        {activeTab === 'converter' && (
          <div className="converter-container">
            <BitcoinConverter language={language} bitcoinPrice={bitcoinPrice} />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="faq-container">
            <FAQ language={language} />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="news-container">
            <BitcoinNews language={language} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="quiz-container">
            <BitcoinQuiz language={language} />
          </div>
        )}
      </main>
      <footer className="footer">
        <p>{text[language].footerRights.replace('{year}', new Date().getFullYear())}</p>
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