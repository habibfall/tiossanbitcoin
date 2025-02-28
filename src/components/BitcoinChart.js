import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceDot
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ChartContainer = styled.div`
  .chart-container {
    background: ${props => props.isDarkMode ? 
      'linear-gradient(to bottom, #1A1A1A, #121212)' : 
      'linear-gradient(to bottom, #ffffff, #f8f9fa)'};
    transition: all 0.3s ease;
  }

  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
    stroke-width: 0.5;
    transition: all 0.3s ease;
  }

  .recharts-line-curve {
    filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.3));
    transition: all 0.3s ease;
  }

  .custom-tooltip {
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    animation: tooltipFade 0.2s ease-out;
  }

  @keyframes tooltipFade {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gridFade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  &.transitioning .recharts-cartesian-grid {
    animation: gridFade 0.3s ease-out;
  }

  .loading-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.isDarkMode ? '#b3b3b3' : '#666'};
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #f7931a;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }

  .loading-text {
    font-size: 14px;
    font-weight: 500;
  }

  .error-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .error-message {
    background: ${props => props.isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'};
    color: #ef4444;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    max-width: 80%;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .interpolated-point {
    opacity: 0.6;
  }
`;

const generateMockData = (timeframe) => {
  const data = [];
  const basePrice = 36500000; // Base price in FCFA
  let prevPrice = basePrice;
  const now = new Date();

  switch (timeframe) {
    case '24h':
      const start24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      for (let i = 0; i <= 24; i++) {
        const date = new Date(start24h.getTime() + i * 60 * 60 * 1000);
        if (date <= now) {
          const volatility = 0.0005; // Reduced volatility
          const randomFactor = (Math.random() - 0.5) * basePrice * volatility;
          prevPrice = prevPrice * 0.95 + (prevPrice + randomFactor) * 0.05; // More weight on previous price
          data.push({
            timestamp: date.getTime(),
            date: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', 'h'),
            price: prevPrice,
            priceDiff: data.length > 0 ? prevPrice - data[data.length - 1].price : 0,
            isKeyPoint: i % 4 === 0
          });
        }
      }
      break;

    case '7d':
      const start7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      for (let i = 0; i < 7; i++) {
        const date = new Date(start7d.getTime() + i * 24 * 60 * 60 * 1000);
        if (date <= now) {
          const volatility = 0.001;
          const randomFactor = (Math.random() - 0.5) * basePrice * volatility;
          prevPrice = prevPrice * 0.95 + (prevPrice + randomFactor) * 0.05;
          data.push({
            timestamp: date.getTime(),
            date: date.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: '2-digit' }),
            price: prevPrice,
            priceDiff: data.length > 0 ? prevPrice - data[data.length - 1].price : 0,
            isKeyPoint: true
          });
        }
      }
      break;

    case '30d':
      const start30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      for (let i = 0; i < 30; i++) {
        const date = new Date(start30d.getTime() + i * 24 * 60 * 60 * 1000);
        if (date <= now) {
          const volatility = 0.001;
          const randomFactor = (Math.random() - 0.5) * basePrice * volatility;
          prevPrice = prevPrice * 0.95 + (prevPrice + randomFactor) * 0.05;
          data.push({
            timestamp: date.getTime(),
            date: date.toLocaleDateString([], { day: '2-digit', month: 'short' }),
            price: prevPrice,
            priceDiff: data.length > 0 ? prevPrice - data[data.length - 1].price : 0,
            isKeyPoint: i % 5 === 0
          });
        }
      }
      break;

    case '1y':
      const start1y = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      for (let i = 0; i <= 12; i++) {
        const date = new Date(start1y.getTime() + i * 30 * 24 * 60 * 60 * 1000);
        if (date <= now) {
          const volatility = 0.001;
          const trend = Math.sin(i / 12 * Math.PI * 2) * 0.001;
          const randomFactor = (Math.random() - 0.5 + trend) * basePrice * volatility;
          prevPrice = prevPrice * 0.95 + (prevPrice + randomFactor) * 0.05;
          data.push({
            timestamp: date.getTime(),
            date: date.toLocaleDateString([], { month: 'short', year: 'numeric' }),
            price: prevPrice,
            priceDiff: data.length > 0 ? prevPrice - data[data.length - 1].price : 0,
            isKeyPoint: true
          });
        }
      }
      break;
  }

  const trend = data[data.length - 1].price - data[0].price;
  return data.map(point => ({ ...point, trend }));
};

const BitcoinChart = ({ language = 'french', onTimeframeChange }) => {
  const { isDarkMode } = useTheme();
  const [timeframe, setTimeframe] = useState('24h');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [dataCache, setDataCache] = useState({});
  const [lastFetchTime, setLastFetchTime] = useState({});
  const [yAxisDomain, setYAxisDomain] = useState(['auto', 'auto']);

  // Cache validation duration based on timeframe
  const getCacheTimeout = (tf) => {
    switch (tf) {
      case '24h': return 1 * 60 * 1000; // 1 minute
      case '7d': return 5 * 60 * 1000; // 5 minutes
      case '30d': return 15 * 60 * 1000; // 15 minutes
      case '1y': return 30 * 60 * 1000; // 30 minutes
      default: return 5 * 60 * 1000;
    }
  };

  // Check if cached data is still valid
  const isCacheValid = (tf) => {
    const now = Date.now();
    const lastFetch = lastFetchTime[tf];
    if (!lastFetch) return false;
    return now - lastFetch < getCacheTimeout(tf);
  };

  // Interpolate missing data points
  const interpolateData = (data) => {
    if (data.length < 2) return data;
    
    const interpolated = [];
    for (let i = 0; i < data.length - 1; i++) {
      interpolated.push(data[i]);
      
      const timeDiff = data[i + 1].timestamp - data[i].timestamp;
      const expectedInterval = getExpectedInterval(timeframe);
      
      if (timeDiff > expectedInterval * 1.5) {
        const steps = Math.floor(timeDiff / expectedInterval) - 1;
        const priceDiff = data[i + 1].price - data[i].price;
        const timeStep = timeDiff / (steps + 1);
        
        for (let j = 1; j <= steps; j++) {
          const timestamp = data[i].timestamp + timeStep * j;
          const price = data[i].price + (priceDiff * j) / (steps + 1);
          
          interpolated.push({
            timestamp,
            date: formatDate(new Date(timestamp), timeframe),
            price,
            priceDiff: price - data[i].price,
            isKeyPoint: false,
            isInterpolated: true
          });
        }
      }
    }
    interpolated.push(data[data.length - 1]);
    return interpolated;
  };

  // Get expected interval between data points based on timeframe
  const getExpectedInterval = (tf) => {
    switch (tf) {
      case '24h': return 60 * 60 * 1000; // 1 hour
      case '7d': return 24 * 60 * 60 * 1000; // 1 day
      case '30d': return 24 * 60 * 60 * 1000; // 1 day
      case '1y': return 30 * 24 * 60 * 60 * 1000; // ~1 month
      default: return 60 * 60 * 1000;
    }
  };

  const text = {
    french: {
      timeRanges: {
        "24h": "24 heures",
        "7d": "7 jours",
        "30d": "30 jours",
        "1y": "1 an"
      },
      price: "Prix",
      date: "Date"
    },
    wolof: {
      timeRanges: {
        "24h": "24 waxtu",
        "7d": "7 fan",
        "30d": "30 fan",
        "1y": "1 at"
      },
      price: "Prix",
      date: "Bés"
    },
    english: {
      timeRanges: {
        "24h": "24 hours",
        "7d": "7 days",
        "30d": "30 days",
        "1y": "1 year"
      },
      price: "Price",
      date: "Date"
    }
  };
  
  const fetchPriceData = async (timeframe) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the appropriate Binance API endpoint and interval based on timeframe
      const getEndpointConfig = () => {
        switch (timeframe) {
          case '24h':
            return {
              interval: '1h',
              limit: 24,
              startTime: Date.now() - 24 * 60 * 60 * 1000
            };
          case '7d':
            return {
              interval: '1d',
              limit: 7,
              startTime: Date.now() - 7 * 24 * 60 * 60 * 1000
            };
          case '30d':
            return {
              interval: '1d',
              limit: 30,
              startTime: Date.now() - 30 * 24 * 60 * 60 * 1000
            };
          case '1y':
            return {
              interval: '1w',
              limit: 52,
              startTime: Date.now() - 365 * 24 * 60 * 60 * 1000
            };
          default:
            return {
              interval: '1h',
              limit: 24,
              startTime: Date.now() - 24 * 60 * 60 * 1000
            };
        }
      };

      const config = getEndpointConfig();
      const endpoint = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${config.interval}&limit=${config.limit}&startTime=${config.startTime}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();
      const usdToFcfa = 655.957; // CFA Franc exchange rate

      // Transform the Binance kline data into our required format
      // Binance kline format: [openTime, open, high, low, close, volume, closeTime, ...]
      const transformedData = data.map((kline) => {
        const timestamp = kline[0];
        const price = parseFloat(kline[4]); // Using closing price
        const date = new Date(timestamp);
        const priceInFcfa = price * usdToFcfa;
        
        return {
          timestamp,
          date: formatDate(date, timeframe),
          price: priceInFcfa,
          priceDiff: 0, // Will be calculated below
          isKeyPoint: shouldShowKeyPoint(date, timeframe)
        };
      });

      // Calculate price differences
      for (let i = 1; i < transformedData.length; i++) {
        transformedData[i].priceDiff = transformedData[i].price - transformedData[i-1].price;
      }

      // Calculate overall trend
      const trend = ((transformedData[transformedData.length - 1].price - transformedData[0].price) / transformedData[0].price) * 100;
      
      setChartData(transformedData.map(point => ({ ...point, trend })));
      setIsLoading(false);
      setIsLive(true);

    } catch (error) {
      console.error('Error fetching price data:', error);
      setError('Failed to fetch price data. Using fallback data.');
      // Use mock data as fallback
      const mockData = generateMockData(timeframe);
      setChartData(mockData);
      setIsLoading(false);
      setIsLive(false);
    }
  };

  const formatDate = (date, timeframe) => {
    switch (timeframe) {
      case '24h':
        return date.toLocaleTimeString(
          language === 'french' ? 'fr-FR' : 
          language === 'wolof' ? 'fr-SN' : 'en-US',
          { hour: '2-digit', minute: '2-digit', hour12: false }
        ).replace(':', 'h');
      case '7d':
        return date.toLocaleDateString(
          language === 'french' ? 'fr-FR' : 
          language === 'wolof' ? 'fr-SN' : 'en-US',
          { weekday: 'short', day: '2-digit', month: '2-digit' }
        );
      case '30d':
        return date.toLocaleDateString(
          language === 'french' ? 'fr-FR' : 
          language === 'wolof' ? 'fr-SN' : 'en-US',
          { day: '2-digit', month: 'short' }
        );
      case '1y':
        return date.toLocaleDateString(
          language === 'french' ? 'fr-FR' : 
          language === 'wolof' ? 'fr-SN' : 'en-US',
          { month: 'short', year: 'numeric' }
        );
      default:
        return date.toLocaleDateString();
    }
  };

  const shouldShowKeyPoint = (date, timeframe) => {
    switch (timeframe) {
      case '24h':
        return date.getHours() % 4 === 0;
      case '7d':
        return true; // Show all daily points
      case '30d':
        return date.getDate() % 5 === 0;
      case '1y':
        return true; // Show all monthly points
      default:
        return false;
    }
  };

  // Update chart data when timeframe changes
  const updateChartData = async (newTimeframe) => {
    setIsTransitioning(true);
    setTimeframe(newTimeframe);
    setIsLoading(true);
    
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }

    try {
      const data = await fetchPriceData(newTimeframe);
      if (data) {
        const interpolatedData = interpolateData(data);
        const domain = calculateYAxisDomain(interpolatedData);
        setYAxisDomain(domain);
        setChartData(interpolatedData);
        setDataCache(prev => ({ ...prev, [newTimeframe]: interpolatedData }));
        setLastFetchTime(prev => ({ ...prev, [newTimeframe]: Date.now() }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsTransitioning(false);
    }
  };

  // Calculate consistent Y-axis domain
  const calculateYAxisDomain = (data) => {
    if (!data || data.length === 0) return ['auto', 'auto'];
    
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  // Initial data fetch and refresh setup
  useEffect(() => {
    fetchPriceData(timeframe);
    
    // Set up periodic refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      if (timeframe === '24h') {
        fetchPriceData(timeframe);
      }
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(refreshInterval);
  }, [timeframe]);

  const timeframes = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '1y', value: '1y' }
  ];

  // Format date based on timeframe
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case '24h':
        // Format: HH:MM (e.g., 02:27)
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }).replace(':', 'h');  // Use 'h' instead of ':' for French style
      case '7d':
        // Format: "Mon 26/02"
        const day = date.toLocaleDateString(language === 'french' ? 'fr-FR' : 
                                          language === 'wolof' ? 'fr-SN' : 'en-US', 
                                          { weekday: 'short' });
        const dayMonth = date.toLocaleDateString([], {
          day: '2-digit',
          month: '2-digit'
        });
        return `${day} ${dayMonth}`;
      case '30d':
        // Format: "01 fév."
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short'
        });
      case '1y':
        // Format: "janv."
        return date.toLocaleDateString('fr-FR', {
          month: 'short'
        });
      default:
        return date.toLocaleDateString();
    }
  };

  // Get tick values based on timeframe
  const getTickValues = (data) => {
    if (!data || data.length === 0) return [];
    
    const timestamps = data.map(d => d.timestamp);
    const start = Math.min(...timestamps);
    const end = Math.max(...timestamps);
    const ticks = [];

    switch (timeframe) {
      case '24h':
        // Show every 4 hours within the 24-hour period
        for (let i = 0; i <= 24; i += 4) {
          const tick = new Date(start + i * 60 * 60 * 1000);
          if (tick <= end) {
            ticks.push(tick.getTime());
          }
        }
        break;
      case '7d':
        // Show all 7 days
        for (let i = 0; i < 7; i++) {
          const tick = new Date(start + i * 24 * 60 * 60 * 1000);
          if (tick <= end) {
            ticks.push(tick.getTime());
          }
        }
        break;
      case '30d':
        // Show every 5 days within the month
        const daysInMonth = new Date(new Date(start).getFullYear(), new Date(start).getMonth() + 1, 0).getDate();
        for (let i = 0; i < daysInMonth; i += 5) {
          const tick = new Date(new Date(start).getFullYear(), new Date(start).getMonth(), i + 1);
          if (tick.getTime() <= end) {
            ticks.push(tick.getTime());
          }
        }
        break;
      case '1y':
        // Show all months
        const startDate = new Date(start);
        for (let i = 0; i <= 12; i++) {
          const tick = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
          if (tick.getTime() <= end) {
            ticks.push(tick.getTime());
          }
        }
        break;
    }
    return ticks;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const priceValue = payload[0].value;
      const priceDiff = payload[0].payload.priceDiff;
      const timestamp = payload[0].payload.timestamp;
      const priceColor = priceDiff >= 0 ? '#22c55e' : '#ef4444';
      const arrowIcon = priceDiff >= 0 ? '↗' : '↘';
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Format the timestamp based on timeframe
      const formattedTime = (() => {
        switch (timeframe) {
          case '24h':
            return date.toLocaleTimeString(
              language === 'french' ? 'fr-FR' : 
              language === 'wolof' ? 'fr-SN' : 'en-US',
              { hour: '2-digit', minute: '2-digit', hour12: false }
            ).replace(':', 'h');
          case '7d':
            return date.toLocaleDateString(
              language === 'french' ? 'fr-FR' : 
              language === 'wolof' ? 'fr-SN' : 'en-US',
              { weekday: 'short', day: '2-digit', month: '2-digit' }
            );
          case '30d':
            return date.toLocaleDateString(
              language === 'french' ? 'fr-FR' : 
              language === 'wolof' ? 'fr-SN' : 'en-US',
              { day: '2-digit', month: 'short' }
            );
          case '1y':
            return date.toLocaleDateString(
              language === 'french' ? 'fr-FR' : 
              language === 'wolof' ? 'fr-SN' : 'en-US',
              { month: 'short', year: 'numeric' }
            );
          default:
            return date.toLocaleDateString();
        }
      })();
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="custom-tooltip"
        >
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 8px 0',
            fontSize: '12px',
            fontWeight: '500'
          }}>{formattedTime}</p>
          <p style={{
            color: priceColor,
            margin: '0',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {new Intl.NumberFormat(
              language === 'french' ? 'fr-FR' : 
              language === 'wolof' ? 'fr-SN' : 'en-US', 
              { maximumFractionDigits: 0 }
            ).format(priceValue)} FCFA
            <span style={{ 
              fontSize: '16px',
              color: priceColor,
              marginLeft: 'auto'
            }}>
              {arrowIcon}
            </span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <ChartContainer isDarkMode={isDarkMode} className={`chart-container ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="timeframe-buttons">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            className={`timeframe-button ${timeframe === tf.value ? 'active' : ''}`}
            onClick={() => updateChartData(tf.value)}
            disabled={isLoading}
          >
            {text[language].timeRanges[tf.value]}
          </button>
        ))}
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading chart data...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">{error}</div>
          </div>
        ) : (
          <ResponsiveContainer>
            <LineChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke={isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"}
                strokeWidth={0.5}
              />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                ticks={getTickValues(chartData)}
                tick={{ 
                  fontSize: 12, 
                  fill: "transparent",
                  opacity: 0.8,
                  fontFamily: 'JetBrains Mono'
                }}
                interval={0}
                axisLine={{ stroke: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)" }}
                tickLine={false}
                allowDataOverflow={true}
                textAnchor="middle"
                height={50}
              />
              <YAxis 
                domain={yAxisDomain}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                tick={{ 
                  fontSize: 12, 
                  fill: isDarkMode ? '#b3b3b3' : '#666',
                  fontFamily: 'JetBrains Mono'
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{
                  stroke: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3"
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="none"
                fill={`url(#${chartData[0]?.trend >= 0 ? 'greenGradient' : 'redGradient'})`}
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartData[0]?.trend >= 0 ? '#22c55e' : '#ef4444'}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: isDarkMode ? '#2d2d2d' : '#ffffff',
                  strokeWidth: 2,
                  fill: (props) => {
                    const { payload } = props;
                    return payload.priceDiff >= 0 ? '#22c55e' : '#ef4444';
                  }
                }}
                animationDuration={750}
                animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
              />
              {/* Add dots at key points */}
              {chartData.map((point, index) => {
                if (point.isKeyPoint) {
                  return (
                    <ReferenceDot
                      key={`${index}-${point.date}`}
                      x={point.date}
                      y={point.price}
                      r={4}
                      fill={point.priceDiff >= 0 ? '#22c55e' : '#ef4444'}
                      stroke={isDarkMode ? '#2d2d2d' : '#ffffff'}
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartContainer>
  );
};

export default BitcoinChart; 