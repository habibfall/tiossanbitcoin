import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import './BitcoinNews.css';
import OptimizedImage from './OptimizedImage';
import heartOfCheetahImage from '../assets/images/heart-of-cheetah.jpg';
import bitcoinStandardImage from '../assets/images/bitcoin-standard.jpg';
import mattKratteImage from '../assets/images/matt-kratter.jpg';
import { bitcoinTerms } from '../data/bitcoinTerms';
import { text } from '../data/translations';

const englishTerms = [
  {
    term: "Lightning Network",
    definition: "A 'second layer' payment protocol that operates on top of Bitcoin, enabling instant transactions with very low fees.",
    example: "Using the Lightning Network, you can send Bitcoin as easily as sending a text message!"
  },
  {
    term: "Wallet",
    definition: "A digital tool that allows you to store, send, and receive Bitcoin securely.",
    example: "Your Bitcoin wallet is like a digital bank account that you fully control."
  },
  {
    term: "Block",
    definition: "A package of Bitcoin transactions that gets added to the blockchain every 10 minutes on average.",
    example: "When you send Bitcoin, your transaction is included in a block with other transactions."
  },
  {
    term: "Peer-to-Peer (P2P)",
    definition: "Direct trading between two people without a middleman or central authority.",
    example: "P2P Bitcoin trading lets you buy Bitcoin directly from other people in your community."
  },
  {
    term: "Private Key",
    definition: "A secret code that proves you own your Bitcoin and allows you to spend it.",
    example: "Keep your private key safe and never share it - it's like the password to your Bitcoin!"
  }
];

const newsTranslations = {
  french: {
    // Markets and Trading
    'Bitcoin': 'Bitcoin',
    'ETF': 'ETF',
    'market': 'marché',
    'markets': 'marchés',
    'price': 'prix',
    'trading': 'trading',
    'volume': 'volume',
    'volatility': 'volatilité',
    'bull market': 'marché haussier',
    'bear market': 'marché baissier',
    'rally': 'rallye',
    'correction': 'correction',
    
    // Financial Terms
    'billion': 'milliards',
    'million': 'millions',
    'investment': 'investissement',
    'investors': 'investisseurs',
    'traders': 'traders',
    'funds': 'fonds',
    'outflows': 'sorties de fonds',
    'inflows': 'entrées de fonds',
    'gains': 'gains',
    'losses': 'pertes',
    
    // Analysis
    'analysis': 'analyse',
    'analysts': 'analystes',
    'report': 'rapport',
    'forecast': 'prévision',
    'prediction': 'prédiction',
    'outlook': 'perspectives',
    'trend': 'tendance',
    'potential': 'potentiel',
    'performance': 'performance',
    
    // Market Movement
    'increase': 'augmentation',
    'decrease': 'diminution',
    'rise': 'hausse',
    'fall': 'baisse',
    'surge': 'forte hausse',
    'plunge': 'chute',
    'recovery': 'reprise',
    'reversal': 'renversement',
    
    // Time and Events
    'today': 'aujourd\'hui',
    'yesterday': 'hier',
    'week': 'semaine',
    'month': 'mois',
    'year': 'année',
    'breaking': 'dernière minute',
    'update': 'mise à jour',
    'news': 'actualités',
    
    // Common Phrases
    'amid': 'au milieu de',
    'due to': 'en raison de',
    'according to': 'selon',
    'reports': 'rapporte',
    'suggests': 'suggère',
    'indicates': 'indique',
    'announces': 'annonce',
    'warns': 'avertit',
    'says': 'dit',
    'claims': 'affirme'
  },
  wolof: {
    // Markets and Trading
    'Bitcoin': 'Bitcoin',
    'ETF': 'ETF',
    'market': 'marché bi',
    'markets': 'marché yi',
    'price': 'prix bi',
    'trading': 'trading',
    'volume': 'volume bi',
    'volatility': 'changement yi',
    'bull market': 'marché bu yéeg',
    'bear market': 'marché bu wàcc',
    
    // Financial Terms
    'billion': 'milliard',
    'million': 'million',
    'investment': 'investissement',
    'investors': 'investisseur yi',
    'traders': 'trader yi',
    'funds': 'xaalis',
    'outflows': 'génne xaalis',
    'inflows': 'dugg xaalis',
    'gains': 'bénéfis yi',
    'losses': 'perte yi',
    
    // Analysis
    'analysis': 'analyse',
    'analysts': 'analystes yi',
    'report': 'rapport bi',
    'forecast': 'prévision bi',
    'prediction': 'wax-dëgg bi',
    'outlook': 'perspectives yi',
    'trend': 'tendance bi',
    'potential': 'potentiel bi',
    
    // Market Movement
    'increase': 'yokku',
    'decrease': 'wàññi',
    'rise': 'yéeg',
    'fall': 'wàcc',
    'surge': 'yéeg bu rey',
    'plunge': 'daanu bu rey',
    'recovery': 'ndawi gi',
    'reversal': 'walbatiku bi',
    
    // Time and Events
    'today': 'tey',
    'yesterday': 'démb',
    'week': 'ayubés',
    'month': 'weer',
    'year': 'at',
    'breaking': 'xibaar bu yees',
    'update': 'yeesal',
    'news': 'xibaar',
    
    // Common Phrases
    'amid': 'ci biir',
    'due to': 'ndax',
    'according to': 'ci li',
    'reports': 'wax na',
    'suggests': 'di wonee',
    'indicates': 'won na',
    'announces': 'yégle na',
    'warns': 'artu na',
    'says': 'wax na',
    'claims': 'wax na ni'
  }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT = 10000; // 10 seconds

const BitcoinNews = ({ language = 'french' }) => {
  const { isDarkMode } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsCache, setNewsCache] = useState({});
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);

  // Pre-compile translations for better performance
  const translationMap = useMemo(() => {
    const map = new Map();
    if (language !== 'english' && newsTranslations[language]) {
      Object.entries(newsTranslations[language]).forEach(([key, value]) => {
        map.set(key.toLowerCase(), value);
      });
    }
    return map;
  }, [language]);

  // Optimized translation function
  const translateNewsText = useCallback((text, targetLanguage) => {
    if (targetLanguage === 'english') return text;
    if (!text) return '';
    
    const words = text.split(' ');
    const translatedWords = words.map(word => {
      const lowerWord = word.toLowerCase();
      return translationMap.get(lowerWord) || word;
    });
    
    return translatedWords.join(' ');
  }, [translationMap]);

  const fetchNews = useCallback(async () => {
    try {
      // Check cache first
      const now = Date.now();
      if (lastFetchTime && (now - lastFetchTime < CACHE_DURATION) && newsCache[language]) {
        setNews(newsCache[language]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const response = await fetch(
        'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=BTC,Bitcoin&excludeCategories=Sponsored,ICO&feeds=coindesk,cointelegraph,bitcoinmagazine,reuters,bloomberg&sortOrder=popular',
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
      const newsItems = data.Data
        .filter(item => 
          item.published_on * 1000 > last24Hours && 
          item.imageurl && 
          item.imageurl.startsWith('http')
        )
        .sort((a, b) => b.published_on - a.published_on)
        .slice(0, 3)
        .map(item => ({
          id: item.id,
          headline: item.title,
          summary: item.body.length > 150 ? item.body.substring(0, 150) + '...' : item.body,
          date: new Date(item.published_on * 1000).toLocaleDateString(
            language === 'french' ? 'fr-FR' : 
            language === 'wolof' ? 'fr-SN' : 'en-US',
            { day: 'numeric', month: 'short' }
          ),
          image: item.imageurl,
          sourceUrl: item.url,
          source: item.source_info?.name || item.source
        }));
      
      // Update cache
      setNewsCache(prev => ({
        ...prev,
        [language]: newsItems
      }));
      setLastFetchTime(now);
      setNews(newsItems);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      if (err.name === 'AbortError') {
        setError(text[language].timeout || 'Request timed out. Please try again.');
      } else {
        setError(text[language].error);
      }
      if (newsCache[language]) {
        setNews(newsCache[language]);
      }
      setLoading(false);
    }
  }, [language, newsCache, lastFetchTime, text, CACHE_DURATION, FETCH_TIMEOUT]);

  useEffect(() => {
    // Set term of the day
    const today = new Date().getDate();
    const terms = bitcoinTerms[language] || bitcoinTerms.english;
    const termIndex = today % terms.length;
    setCurrentTerm(terms[termIndex]);

    // Fetch initial news
    fetchNews();

    // Set up periodic refresh
    const refreshInterval = setInterval(fetchNews, CACHE_DURATION);
    return () => clearInterval(refreshInterval);
  }, [language, fetchNews, CACHE_DURATION]);

  if (loading) {
    return (
      <div className={`bitcoin-news-container ${isDarkMode ? 'dark' : 'light'}`}>
        <h2 className="section-title">{text[language].sectionTitle}</h2>
        <div className="news-grid">
          {[1, 2, 3].map(key => (
            <div key={key} className="news-card loading">
              <div className="news-image skeleton"></div>
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-date skeleton"></span>
                  <span className="news-source skeleton"></span>
                </div>
                <h3 className="skeleton"></h3>
                <p className="skeleton"></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bitcoin-news-container ${isDarkMode ? 'dark' : 'light'}`}>
        <h2 className="section-title">{text[language].sectionTitle}</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bitcoin-news-container ${isDarkMode ? 'dark' : 'light'}`}>
      <h2 className="section-title">{text[language].sectionTitle}</h2>
      
      {/* Term of the Day */}
      <div className="term-of-day">
        <h3>{text[language].termOfDay}</h3>
        <div className="term-content">
          <h4>{currentTerm?.term}</h4>
          <p>{currentTerm?.definition}</p>
          <p className="term-example">{currentTerm?.example}</p>
        </div>
      </div>

      {/* News Grid */}
      <div className="news-grid">
        {news.map((item) => (
          <a 
            key={item.id} 
            href={item.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="news-card"
          >
            <OptimizedImage
              src={item.image}
              alt={item.headline}
              className="news-image"
              width={400}
              height={225}
            />
            <div className="news-content">
              <h3>{translateNewsText(item.headline, language)}</h3>
              <p>{translateNewsText(item.summary, language)}</p>
              <div className="news-footer">
                <span className="news-source">{item.source}</span>
                <span className="read-more">
                  {language === 'french' ? 'Lire plus' : language === 'wolof' ? 'Gëna jàng' : 'Read more'}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Resources Section */}
      <div className="resources-section">
        <h2 className="section-title">{text[language].resourcesTitle || "Bitcoin Resources"}</h2>
        
        {/* Videos Section */}
        <h3 className="subsection-title">{text[language].videosTitle || "Educational Videos"}</h3>
        <div className="video-grid" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
          <div className="video-container">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/KnLXtNrgciU"
              title="Bitcoin Explained"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-container">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/mOYtoL5gzzo"
              title="Bitcoin Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-container">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/Qi3GOm1MhN0"
              title="Bitcoin Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Books Section */}
        <h3 className="subsection-title" style={{ marginTop: '2rem' }}>{text[language].booksTitle || "Recommended Books"}</h3>
        <div className="books-grid">
          <div className="book-card">
            <a href="https://magattewade.com/book" target="_blank" rel="noopener noreferrer" className="book-link">
              <div className="book-cover">
                <OptimizedImage
                  src={heartOfCheetahImage}
                  alt="Heart of a Cheetah Book"
                  loading="lazy"
                  className="book-image"
                  width={300}
                  height={450}
                />
              </div>
              <h4>The Heart of a Cheetah</h4>
              <p className="book-author">Magatte Wade</p>
            </a>
          </div>
          <div className="book-card">
            <a href="https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861" target="_blank" rel="noopener noreferrer" className="book-link">
              <div className="book-cover">
                <OptimizedImage
                  src={bitcoinStandardImage}
                  alt="The Bitcoin Standard Book"
                  loading="lazy"
                  className="book-image"
                  width={300}
                  height={450}
                />
              </div>
              <h4>The Bitcoin Standard</h4>
              <p className="book-author">Saifedean Ammous</p>
            </a>
          </div>
          <div className="book-card">
            <a href="https://www.amazon.ca/Beginners-Guide-Bitcoin-Matthew-Kratter/dp/B08RRKNNBK" target="_blank" rel="noopener noreferrer" className="book-link">
              <div className="book-cover">
                <OptimizedImage
                  src={mattKratteImage}
                  alt="Matt Kratter Book"
                  loading="lazy"
                  className="book-image"
                  width={300}
                  height={450}
                />
              </div>
              <h4>A Beginner's Guide To Bitcoin</h4>
              <p className="book-author">Matthew R. Kratter</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinNews; 
