import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import Image from 'next/image';
import './BitcoinNews.css';
import bitcoinDefaultImage from '../assets/images/bitcoin-default.png';
import heartOfCheetahImage from '../assets/images/heart-of-cheetah.jpg';
import bitcoinStandardImage from '../assets/images/bitcoin-standard.jpg';
import mattKratteImage from '../assets/images/matt-kratte.jpg';

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

const bitcoinTerms = {
  french: [
    {
      term: "Lightning Network",
      definition: "Un protocole de paiement de 'seconde couche' qui fonctionne sur Bitcoin, permettant des transactions instantanées à très faibles frais.",
      example: "En utilisant le Lightning Network, vous pouvez envoyer du Bitcoin aussi facilement qu'un message texte !"
    },
    {
      term: "Portefeuille",
      definition: "Un outil numérique qui vous permet de stocker, envoyer et recevoir du Bitcoin en toute sécurité.",
      example: "Votre portefeuille Bitcoin est comme un compte bancaire numérique que vous contrôlez entièrement."
    },
    {
      term: "Bloc",
      definition: "Un ensemble de transactions Bitcoin qui est ajouté à la blockchain toutes les 10 minutes en moyenne.",
      example: "Lorsque vous envoyez du Bitcoin, votre transaction est incluse dans un bloc avec d'autres transactions."
    },
    {
      term: "Pair-à-Pair (P2P)",
      definition: "Échange direct entre deux personnes sans intermédiaire ni autorité centrale.",
      example: "Le trading P2P de Bitcoin vous permet d'acheter du Bitcoin directement auprès d'autres personnes de votre communauté."
    },
    {
      term: "Clé Privée",
      definition: "Un code secret qui prouve que vous possédez votre Bitcoin et vous permet de le dépenser.",
      example: "Gardez votre clé privée en sécurité et ne la partagez jamais - c'est comme le mot de passe de votre Bitcoin !"
    }
  ],
  wolof: [
    {
      term: "Lightning Network",
      definition: "Protokol paiement bu 'ñaareel' bi dox ci kaw Bitcoin, di tax nga mën def transaction yu gaaw te frais yi néew.",
      example: "Soo jëfandikoo Lightning Network, mën nga yonnee Bitcoin ni message!"
    },
    {
      term: "Portefeuille",
      definition: "Jumtukaay numérik bi lay may nga denc, yonnee ak jot Bitcoin ci kaarange.",
      example: "Sa portefeuille Bitcoin mel na ni compte banque numérik boo kontrole sa bopp."
    },
    {
      term: "Bloc",
      definition: "Ndajee transaction Bitcoin yi ñuy yokk ci blockchain bi lu nekk 10 minutes.",
      example: "Boo yonneey Bitcoin, sa transaction dañu koy boole ak yeneen transaction yi ci biir bloc."
    },
    {
      term: "Nit-ak-Nit (P2P)",
      definition: "Échange direct diggante ñaari nit te kenn du ci dugal boppam.",
      example: "Trading P2P Bitcoin day tax nga mën jënd Bitcoin direktement ak nit ñi ci sa gox."
    },
    {
      term: "Caabi bu Sutura",
      definition: "Code secret bi lay won ni yaa moom Bitcoin bi te mën ko jëfandikoo.",
      example: "Dencal sa caabi bu sutura bu baax te bul ko jox kenn - mel na ni mot de passe sa Bitcoin!"
    }
  ],
  english: englishTerms
};

// Common Bitcoin news translations
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

const defaultImage = '/default.png';

// Curated news translations
const curatedNews = {
  french: [
    {
      id: 'curated-1',
      headline: 'Renversement potentiel du prix du Bitcoin au milieu de sorties de 3,4 milliards de dollars des ETF',
      summary: 'Au milieu d\'importantes sorties de fonds des ETF Bitcoin, les analystes sont divisés sur le potentiel d\'un renversement du marché, suggérant la prudence aux investisseurs...',
      source: 'CoinDesk',
      image: defaultImage,
      sourceUrl: 'https://www.coindesk.com/markets/2024/03/21/bitcoin-etf-outflows-hit-record-34b-as-grayscale-selling-continues/',
      fallbackImage: defaultImage
    },
    {
      id: 'curated-2',
      headline: 'Le Salvador continue de profiter de sa stratégie Bitcoin',
      summary: 'Le pays d\'Amérique centrale voit des résultats positifs de son adoption du Bitcoin comme monnaie légale, avec une augmentation du tourisme et des investissements...',
      source: 'Bitcoin Magazine',
      image: defaultImage,
      sourceUrl: 'https://bitcoinmagazine.com/el-salvador-bitcoin-news',
      fallbackImage: defaultImage
    }
  ],
  wolof: [
    {
      id: 'curated-1',
      headline: 'Walbatiku potentiel prix Bitcoin ci biir génne 3,4 milliard dollar yi ETF',
      summary: 'Ci biir génne xaalis yu bare yi ETF Bitcoin, analystes yi bokkulañu ci walbatiku potentiel marché bi, di wonee teey ngir investisseurs yi...',
      source: 'CoinDesk',
      image: defaultImage,
      sourceUrl: 'https://www.coindesk.com/markets/2024/03/21/bitcoin-etf-outflows-hit-record-34b-as-grayscale-selling-continues/',
      fallbackImage: defaultImage
    },
    {
      id: 'curated-2',
      headline: 'Salvador di continuer jariñu ci stratégie Bitcoin',
      summary: 'Réew bi ci Amérique centrale gis na risultat yu baax ci adoption Bitcoin bi, ak yokku turism ak investissement yi...',
      source: 'Bitcoin Magazine',
      image: defaultImage,
      sourceUrl: 'https://bitcoinmagazine.com/el-salvador-bitcoin-news',
      fallbackImage: defaultImage
    }
  ]
};

const BitcoinNews = ({ language = 'french' }) => {
  const { isDarkMode } = useTheme();
  const [currentTerm, setCurrentTerm] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsCache, setNewsCache] = useState({});
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  const FETCH_TIMEOUT = 10000; // 10 seconds timeout

  const text = {
    french: {
      sectionTitle: "Actualités Bitcoin",
      termOfDay: "⚡ Terme Bitcoin du Jour",
      loading: "Chargement des Actualités Bitcoin...",
      error: "Échec du chargement des actualités. Veuillez réessayer plus tard.",
      timeout: "Le chargement a pris trop de temps. Veuillez réessayer.",
      readMore: "Lire plus",
      resourcesTitle: "Ressources Bitcoin",
      videosTitle: "Vidéos Éducatives",
      booksTitle: "Livres Recommandés"
    },
    wolof: {
      sectionTitle: "Xibaar yi ci Bitcoin",
      termOfDay: "⚡ Baat Bitcoin bu Tey",
      loading: "Xibaar yi Bitcoin yay ñëw...",
      error: "Xibaar yi jotuwuñu. Jéemaatal ëllëg.",
      timeout: "Xibaar yi yéex nañu lool. Jéemaatal.",
      readMore: "Gënal jàng",
      resourcesTitle: "Njàngat yi ci Bitcoin",
      videosTitle: "Vidéo yi ngir Jàng",
      booksTitle: "Téere yi ñu Tektal"
    },
    english: {
      sectionTitle: "Bitcoin News",
      termOfDay: "⚡ Bitcoin Term of the Day",
      loading: "Loading Bitcoin News...",
      error: "Failed to load news. Please try again later.",
      timeout: "Request timed out. Please try again.",
      readMore: "Read more",
      resourcesTitle: "Bitcoin Resources",
      videosTitle: "Educational Videos",
      booksTitle: "Recommended Books"
    }
  };

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

  // Fetch and combine news with caching
  const fetchNews = useCallback(async () => {
    try {
      // Check cache first
      const now = Date.now();
      if (lastFetchTime && (now - lastFetchTime < CACHE_DURATION) && newsCache[language]) {
        setNews(newsCache[language]);
        setLoading(false);
        return;
      }

      // Create an AbortController for timeout
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
      const recentNews = data.Data
        .filter(item => item.published_on * 1000 > last24Hours)
        .sort((a, b) => b.published_on - a.published_on)
        .slice(0, 3);

      const translatedNews = recentNews.map(item => ({
        id: item.id,
        headline: language === 'english' ? item.title : translateNewsText(item.title, language),
        summary: language === 'english' ? 
          (item.body.length > 150 ? item.body.substring(0, 150) + '...' : item.body) :
          translateNewsText(item.body.substring(0, 150) + '...', language),
        date: new Date(item.published_on * 1000).toLocaleDateString(
          language === 'french' ? 'fr-FR' : 
          language === 'wolof' ? 'fr-SN' : 'en-US',
          { day: 'numeric', month: 'short' }
        ),
        image: item.imageurl,
        sourceUrl: item.url,
        source: item.source,
        fallbackImage: bitcoinDefaultImage
      }));
      
      // Update cache
      setNewsCache(prev => ({
        ...prev,
        [language]: translatedNews
      }));
      setLastFetchTime(now);
      setNews(translatedNews);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      if (err.name === 'AbortError') {
        setError(text[language].timeout || 'Request timed out. Please try again.');
      } else {
        setError(text[language].error);
      }
      // Use cached data if available when error occurs
      if (newsCache[language]) {
        setNews(newsCache[language]);
      }
      setLoading(false);
    }
  }, [language, translateNewsText, newsCache, lastFetchTime]);

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
  }, [language, fetchNews]);

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
        {news.map(item => (
          <div key={item.id} className="news-card">
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="news-link">
              <div className="news-image">
                <img 
                  src={item.image} 
                  alt={item.headline}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
              </div>
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-date">{item.date}</span>
                  <span className="news-source">{item.source}</span>
                </div>
                <h3>{item.headline}</h3>
                <p>{item.summary}</p>
                <span className="read-more">{text[language].readMore}</span>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Resources Section */}
      <div className="resources-section">
        <h2 className="section-title">{text[language].resourcesTitle || "Bitcoin Resources"}</h2>
        
        {/* Videos Section */}
        <h3 className="subsection-title">{text[language].videosTitle || "Educational Videos"}</h3>
        <div className="video-grid">
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
        <h3 className="subsection-title">{text[language].booksTitle || "Recommended Books"}</h3>
        <div className="books-grid">
          <div className="book-card">
            <a href="https://magattewade.com/book" target="_blank" rel="noopener noreferrer" className="book-link">
              <div className="book-cover">
                <img 
                  src="/static/images/heart-of-cheetah.jpg"
                  alt="Heart of a Cheetah Book"
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
              </div>
              <h4>The Heart of a Cheetah</h4>
              <p className="book-author">Magatte Wade</p>
            </a>
          </div>
          <div className="book-card">
            <a href="https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861" target="_blank" rel="noopener noreferrer" className="book-link">
              <div className="book-cover">
                <img 
                  src="/static/images/bitcoin-standard.jpg"
                  alt="The Bitcoin Standard Book"
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
              </div>
              <h4>The Bitcoin Standard</h4>
              <p className="book-author">Saifedean Ammous</p>
            </a>
          </div>
          <div className="book-card">
            <a href="https://www.amazon.ca/Beginners-Guide-Bitcoin-Matthew-Kratter/dp/B08RRKNNBK" target="_blank" rel="noopener noreferrer" className="book-link">
              <div className="book-cover">
                <img 
                  src="/static/images/matt-kratte.jpg"
                  alt="Matt Kratter Book"
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
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