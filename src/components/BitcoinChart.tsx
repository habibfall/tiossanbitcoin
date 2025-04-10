import React, { useState, useCallback, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ChartData {
  timestamp: number;
  price: number;
  percentChange: number;
}

interface BitcoinChartProps {
  language?: 'french' | 'wolof' | 'english';
  onTimeframeChange?: (timeframe: string, percentChange: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
  label?: string;
}

const ChartContainer = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  width: 75%;
  max-width: 800px;
  margin: 1rem auto;
  height: 400px;
  position: relative;
  
  .timeframe-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .timeframe-button {
    background: transparent;
    border: none;
    color: #666;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    &.active {
      background: rgba(247, 147, 26, 0.2);
      color: #f7931a;
    }
  }

  .custom-tooltip {
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 24px;
  height: 24px;
  border: 3px solid #f7931a;
  border-top-color: transparent;
  border-radius: 50%;
  display: block;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getEndpointConfig = (timeframe) => {
  switch (timeframe) {
    case '24h':
      return {
        interval: '1h',
        limit: 24,
        startTime: Date.now() - 24 * 60 * 60 * 1000
      };
    case '7d':
      return {
        interval: '4h',
        limit: 42,
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
        interval: '1d',
        limit: 365,
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

const BitcoinChart = ({ language = 'french', onTimeframeChange }: BitcoinChartProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1y');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState(['auto', 'auto']);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dataCache, setDataCache] = useState({});
  const [lastFetchTime, setLastFetchTime] = useState({});
  const [isLive, setIsLive] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  const fetchPriceData = useCallback(async (timeframe): Promise<ChartData[]> => {
    if (dataCache[timeframe] && Date.now() - lastFetchTime[timeframe] < 60000) {
      return dataCache[timeframe];
    }

    try {
      setIsLoading(true);
      setError(null);
      const config = getEndpointConfig(timeframe);
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${config.interval}&limit=${config.limit}&startTime=${config.startTime}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format from Binance API');
      }

      const usdToFcfa = 655.957;
      let previousPrice: number | null = null;
      const processedData = data.map((item) => {
        const timestamp = parseInt(item[0]);
        const closePrice = parseFloat(item[4]) * usdToFcfa;
        const percentChange = previousPrice ? ((closePrice - previousPrice) / previousPrice) * 100 : 0;
        previousPrice = closePrice;
        return {
          timestamp,
          price: Math.round(closePrice),
          percentChange
        };
      });

      if (processedData && processedData.length > 0) {
        setDataCache((prevCache) => ({ ...prevCache, [timeframe]: processedData }));
        setLastFetchTime((prevTime) => ({ ...prevTime, [timeframe]: Date.now() }));
      }
      return processedData;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [dataCache, lastFetchTime, onTimeframeChange]);

  useEffect(() => {
    const handleResize = () => {
      if (chartWrapperRef.current) {
        const { width, height } = chartWrapperRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateYAxisDomain = useCallback((data) => {
    if (!data || data.length === 0) return ['auto', 'auto'];
    
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, []);

  const formatXAxis = useCallback((timestamp) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', 'h');
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
      case '1y':
        return date.toLocaleDateString([], { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  }, [timeframe]);

  const getTickValues = useCallback((data) => {
    if (!data || data.length === 0) return [];
    
    const interval = Math.ceil(data.length / (timeframe === '1y' ? 12 : 6));
    return data
      .filter((_, index) => index % interval === 0)
      .map(d => d.timestamp);
  }, [timeframe]);

  const updateChartData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPriceData(timeframe);
      setChartData(data);
      setYAxisDomain(calculateYAxisDomain(data));
      
      if (onTimeframeChange && data.length > 0) {
        // Use the total percentage change for the period
        const totalPercentChange = data[0].percentChange;
        console.log('Timeframe:', timeframe, 'Total Percent Change:', totalPercentChange);
        onTimeframeChange(timeframe, Number(totalPercentChange.toFixed(2)));
      }
    } catch (error) {
      console.error('Error updating chart data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, onTimeframeChange, calculateYAxisDomain]);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const formattedDate = formatXAxis(data.timestamp);
      const price = new Intl.NumberFormat(language === 'french' ? 'fr-FR' : 'en-US').format(data.price);
      const percentChange = data.percentChange;
      const color = percentChange >= 0 ? '#22c55e' : '#ef4444';

      return (
        <div className="custom-tooltip">
          <p style={{ color: '#999', marginBottom: '0.5rem' }}>{formattedDate}</p>
          <p style={{ color, fontSize: '1.1rem', fontWeight: '600' }}>
            {price} FCFA
            <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const timeframes = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: '1y', label: '1y' }
  ];

  return (
    <ChartContainer>
      <div className="timeframe-buttons">
        {timeframes.map(({ value, label }) => (
          <button
            key={value}
            className={`timeframe-button ${timeframe === value ? 'active' : ''}`}
            onClick={() => handleTimeframeChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
      
      <ChartWrapper ref={chartWrapperRef}>
        {isLoading ? (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : error ? (
          <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
            {error}
          </div>
        ) : dimensions.width > 0 && dimensions.height > 0 ? (
          <LineChart
            width={dimensions.width}
            height={dimensions.height}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f7931a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              ticks={getTickValues(chartData)}
              stroke="#666"
            />
            <YAxis
              domain={yAxisDomain}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : null}
      </ChartWrapper>
    </ChartContainer>
  );
};

export default BitcoinChart; 