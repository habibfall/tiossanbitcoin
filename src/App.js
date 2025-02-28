import React, { useState, useRef, useEffect } from 'react';
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
  const [priceChanges, setPriceChanges] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  // Fetch Bitcoin price from CoinGecko API with retry mechanism
  const fetchBitcoinPrice = async (retryCount = 0) => {
    try {
      setFetchError(null);
      console.log('Fetching Bitcoin price...');
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
        { timeout: 10000 } // 10 second timeout
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data.market_data || typeof data.market_data.current_price.usd !== 'number') {
        throw new Error('Invalid data format received from API');
      }
      
      // Convert USD to FCFA (use a consistent exchange rate)
      const usdToFcfa = 655.957;
      const priceInFcfa = Math.round(data.market_data.current_price.usd * usdToFcfa);
      
      // Store all relevant price changes with proper validation
      const changes = {
        '24h': validatePriceChange(data.market_data.price_change_percentage_24h),
        '7d': validatePriceChange(data.market_data.price_change_percentage_7d),
        '30d': validatePriceChange(data.market_data.price_change_percentage_30d),
        '1y': validatePriceChange(data.market_data.price_change_percentage_1y)
      };
      
      // Update state atomically to prevent visual inconsistencies
      const now = new Date();
      setBitcoinPrice(priceInFcfa);
      setPriceChanges(changes);
      setPriceChange(changes[timeframe]);
      setLastUpdated(now);
      setIsInitialLoad(false);
      
      // Trigger price update animation
      setIsPriceUpdating(true);
      setTimeout(() => setIsPriceUpdating(false), 800);
      
      return {
        price: priceInFcfa,
        changes,
        timestamp: now
      };
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      setFetchError(error.message);
      
      // Implement exponential backoff for retries
      if (retryCount < 3) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchBitcoinPrice(retryCount + 1);
      }
      
      // Don't clear existing price on error if we already have data
      if (isInitialLoad) {
        setBitcoinPrice(null);
        setPriceChange(null);
      }
      throw error;
    }
  };

  // Validate price change values
  const validatePriceChange = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 0;
    }
    return Number(value.toFixed(2));
  };

  // Update price change when timeframe changes
  useEffect(() => {
    if (priceChanges[timeframe] !== undefined) {
      setPriceChange(priceChanges[timeframe]);
    }
  }, [timeframe, priceChanges]);

  // Set up periodic price updates with proper cleanup
  useEffect(() => {
    let isMounted = true;
    
    const updatePrice = async () => {
      try {
        const data = await fetchBitcoinPrice();
        if (isMounted) {
          // State updates are handled within fetchBitcoinPrice
          console.log('Price updated successfully:', data);
        }
      } catch (error) {
        console.error('Failed to update price:', error);
      }
    };

    // Initial fetch
    updatePrice();
    
    // Set up interval for updates
    const interval = setInterval(updatePrice, 600000); // 10 minutes
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(interval);
      console.log('Cleaning up price update interval');
    };
  }, []); // Empty dependency array for initial setup only

  // Close language menu when clicking outside
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
                  <span>Loading...</span>
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
            <BitcoinChart language={language} onTimeframeChange={setTimeframe} />
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