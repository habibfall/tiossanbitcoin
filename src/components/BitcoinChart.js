import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [dataCache, setDataCache] = useState({});
  const [lastFetchTime, setLastFetchTime] = useState({});
  const [yAxisDomain, setYAxisDomain] = useState(['auto', 'auto']);

  // Memoize helper functions
  const getCacheTimeout = useCallback((tf) => {
    switch (tf) {
      case '24h': return 1 * 60 * 1000; // 1 minute
      case '7d': return 5 * 60 * 1000; // 5 minutes
      case '30d': return 15 * 60 * 1000; // 15 minutes
      case '1y': return 30 * 60 * 1000; // 30 minutes
      default: return 5 * 60 * 1000;
    }
  }, []);

  const isCacheValid = useCallback((tf) => {
    const now = Date.now();
    const lastFetch = lastFetchTime[tf];
    if (!lastFetch) return false;
    return now - lastFetch < getCacheTimeout(tf);
  }, [lastFetchTime, getCacheTimeout]);

  const formatDate = useCallback((date, timeframe) => {
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
  }, [language]);

  const shouldShowKeyPoint = useCallback((date, timeframe) => {
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
  }, []);

  const calculateYAxisDomain = useCallback((data) => {
    if (!data || data.length === 0) return ['auto', 'auto'];
    
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // Calculate a nice interval that's divisible by 1M for better readability
    const range = max - min;
    const roughInterval = range / 5; // We want about 5 intervals
    const interval = Math.ceil(roughInterval / 1000000) * 1000000; // Round up to nearest million
    
    // Calculate the min and max bounds that are divisible by our interval
    const lowerBound = Math.floor(min / interval) * interval;
    const upperBound = Math.ceil(max / interval) * interval;
    
    return [lowerBound, upperBound];
  }, []);

  const fetchPriceData = async (timeframe) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the appropriate Coinbase API endpoint and granularity based on timeframe
      const getEndpointConfig = () => {
        switch (timeframe) {
          case '24h':
            return {
              granularity: 3600, // 1 hour intervals
              startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            };
          case '7d':
            return {
              granularity: 14400, // 4 hour intervals
              startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            };
          case '30d':
            return {
              granularity: 86400, // 1 day intervals
              startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            };
          case '1y':
            return {
              granularity: 86400, // 1 day intervals
              startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
            };
          default:
            return {
              granularity: 3600,
              startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            };
        }
      };

      const config = getEndpointConfig();
      const endTime = new Date().toISOString();
      
      const response = await fetch(
        `https://api.pro.coinbase.com/products/BTC-USD/candles?granularity=${config.granularity}&start=${config.startTime}&end=${endTime}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format from Coinbase API');
      }

      const usdToFcfa = 655.957;
      
      // Coinbase candle format: [timestamp, open, high, low, close, volume]
      const processedData = data.reverse().map((candle) => {
        const timestamp = candle[0] * 1000; // Convert to milliseconds
        const closePrice = parseFloat(candle[4]) * usdToFcfa;
        
        return {
          timestamp,
          price: Math.round(closePrice),
          percentChange: 0 // Will be calculated below
        };
      });

      // Calculate percentage changes
      const startPrice = processedData[0].price;
      const endPrice = processedData[processedData.length - 1].price;
      const totalPercentChange = ((endPrice - startPrice) / startPrice) * 100;

      // Apply the total percent change to all points for consistent coloring
      return processedData.map(point => ({
        ...point,
        percentChange: totalPercentChange
      }));

    } catch (error) {
      console.error('Error fetching price data:', error);
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateChartData = useCallback(async (newTimeframe) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isCacheValid(newTimeframe) && dataCache[newTimeframe]) {
        setChartData(dataCache[newTimeframe]);
        setYAxisDomain(calculateYAxisDomain(dataCache[newTimeframe]));
        setIsLoading(false);
        return;
      }

      const data = await fetchPriceData(newTimeframe);
      setDataCache(prev => ({ ...prev, [newTimeframe]: data }));
      setLastFetchTime(prev => ({ ...prev, [newTimeframe]: Date.now() }));
      setChartData(data);
      setYAxisDomain(calculateYAxisDomain(data));
    } catch (err) {
      console.error('Error updating chart data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isCacheValid, dataCache, calculateYAxisDomain]);

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
  
  // Effect for timeframe changes
  useEffect(() => {
    setIsTransitioning(true);
    const updateData = async () => {
      const data = await updateChartData(timeframe);
      if (onTimeframeChange && data && data.length > 0) {
        // For 1-year view, use the YTD change stored in percentChange
        // For other timeframes, calculate the total change from start to end
        let changePercent;
        if (timeframe === '1y') {
          changePercent = data[0].percentChange;
        } else {
          const startPrice = data[0].price;
          const endPrice = data[data.length - 1].price;
          changePercent = ((endPrice - startPrice) / startPrice) * 100;
        }
        onTimeframeChange(timeframe, Number(changePercent.toFixed(2)));
      }
    };
    updateData();
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [timeframe, updateChartData, onTimeframeChange]);

  // Effect for live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      updateChartData(timeframe);
    }, getCacheTimeout(timeframe));

    return () => clearInterval(interval);
  }, [isLive, timeframe, updateChartData, getCacheTimeout]);

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
      const percentChange = payload[0].payload.percentChange;
      const timestamp = payload[0].payload.timestamp;
      const priceColor = percentChange >= 0 ? '#22c55e' : '#ef4444';
      const arrowIcon = percentChange >= 0 ? '↗' : '↘';
      
      const date = new Date(timestamp);
      
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
              fontSize: '14px',
              color: priceColor,
              marginLeft: '8px'
            }}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}% {arrowIcon}
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
            onClick={() => {
              setTimeframe(tf.value);
              updateChartData(tf.value);
            }}
            disabled={isLoading}
          >
            {text[language].timeRanges[tf.value]}
          </button>
        ))}
      </div>
      
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
        <ResponsiveContainer width="100%" height={400}>
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
              stroke="#666"
              tick={false}
              axisLine={{ stroke: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)" }}
            />
            <YAxis 
              domain={yAxisDomain}
              tickFormatter={(value) => {
                // Format to millions with 1 decimal place
                const millions = (value / 1000000).toFixed(1);
                // Ensure consistent width by padding with spaces
                return `${millions.padStart(5, ' ')}M `;
              }}
              tick={{ 
                fontSize: 12, 
                fill: isDarkMode ? '#b3b3b3' : '#666',
                fontFamily: 'JetBrains Mono',
                dx: -5
              }}
              axisLine={false}
              tickLine={false}
              width={75}
              // Add interval to ensure equal spacing
              interval={0} // Show all ticks
              ticks={(() => {
                if (!chartData || chartData.length === 0) return [];
                const [min, max] = yAxisDomain;
                const interval = (max - min) / 5;
                return Array.from({ length: 6 }, (_, i) => min + interval * i);
              })()}
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
              fill={`url(#${(timeframe === '1y' ? chartData[0]?.percentChange : chartData[chartData.length - 1]?.percentChange) >= 0 ? 'greenGradient' : 'redGradient'})`}
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={(timeframe === '1y' ? chartData[0]?.percentChange : chartData[chartData.length - 1]?.percentChange) >= 0 ? '#22c55e' : '#ef4444'}
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
              animationDuration={750}
              animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default BitcoinChart; 