import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ConverterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary-light);
  padding: 1.5rem;
  position: relative;

  .dark & {
    background: var(--bg-secondary-dark);
  }

  h2 {
    margin: 0;
    text-align: center;
    font-size: 1.75rem;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 1.5rem;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;

    h2 {
      font-size: 1.5rem;
      padding-bottom: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;

    h2 {
      font-size: 1.25rem;
      padding-bottom: 1rem;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  position: relative;
  z-index: 1;
  margin-bottom: 1rem;
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0;
  position: relative;
  z-index: 0;

  @media (max-width: 768px) {
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  input {
    width: 100%;
    padding: 1.25rem;
    border: 2px solid rgba(245, 158, 11, 0.3);
    border-radius: 16px;
    font-size: 1.25rem;
    transition: all 0.3s ease;
    cursor: text;
    font-weight: 500;
    height: 70px;
    background: white;

    &:hover {
      border-color: #f59e0b;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(245, 158, 11, 0.15);
    }

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
      transform: translateY(-2px);
    }

    .dark & {
      background: var(--bg-primary-dark);
      border-color: rgba(245, 158, 11, 0.3);
      color: var(--text-primary-dark);
    }

    @media (max-width: 768px) {
      padding: 1rem;
      font-size: 1.15rem;
      height: 65px;
    }

    @media (max-width: 480px) {
      padding: 0.875rem;
      font-size: 1.1rem;
      height: 60px;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1.25rem;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 1.5em;
  padding-right: 3.5rem;
  height: 70px;

  &:hover {
    border-color: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(245, 158, 11, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
    transform: translateY(-2px);
  }

  .dark & {
    background-color: var(--bg-primary-dark);
    border-color: rgba(245, 158, 11, 0.3);
    color: var(--text-primary-dark);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1.15rem;
    height: 65px;
    background-position: right 1.25rem center;
    background-size: 1.25em;
    padding-right: 3rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 1.1rem;
    height: 60px;
    background-position: right 1rem center;
    background-size: 1.2em;
    padding-right: 2.75rem;
  }
`;

const ResultCard = styled.div`
  width: 100%;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
  border: 1px solid rgba(245, 158, 11, 0.2);
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.4);
  }

  .dark & {
    background: var(--bg-primary-dark);
    border-color: rgba(245, 158, 11, 0.2);
  }

  h3 {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.5rem;

    .dark & {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  p {
    font-size: 1.5rem;
    font-weight: 600;
    color: #f59e0b;
    font-family: 'JetBrains Mono', monospace;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    h3 {
      font-size: 0.95rem;
    }
    
    p {
      font-size: 1.35rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    
    h3 {
      font-size: 0.9rem;
      margin-bottom: 0.375rem;
    }
    
    p {
      font-size: 1.25rem;
    }
  }
`;

const BitcoinConverter = ({ language = 'french', bitcoinPrice }) => {
  const [amount, setAmount] = useState('');
  const [inputCurrency, setInputCurrency] = useState('BTC');
  const [conversions, setConversions] = useState({
    BTC: null,
    SAT: null,
    FCFA: null,
    EUR: null,
    USD: null,
    CAD: null
  });

  const exchangeRates = {
    FCFA: bitcoinPrice,
    EUR: bitcoinPrice / 655.957, // FCFA to EUR
    USD: bitcoinPrice / 600, // Approximate FCFA to USD
    CAD: bitcoinPrice / 450, // Approximate FCFA to CAD
  };

  const text = {
    french: {
      title: "Convertisseur Multi-Devises",
      amount: "Montant",
      currencies: {
        BTC: "Bitcoin",
        SAT: "Satoshi (1/100,000,000 BTC)",
        FCFA: "Franc CFA",
        EUR: "Euro",
        USD: "Dollar US",
        CAD: "Dollar Canadien"
      }
    },
    wolof: {
      title: "Shoppe Xaalis yi",
      amount: "Lim",
      currencies: {
        BTC: "Bitcoin",
        SAT: "Satoshi (1/100,000,000 BTC)",
        FCFA: "Franc CFA",
        EUR: "Euro",
        USD: "Dollar US",
        CAD: "Dollar Kanadaa"
      }
    },
    english: {
      title: "Multi-Currency Converter",
      amount: "Amount",
      currencies: {
        BTC: "Bitcoin",
        SAT: "Satoshi (1/100,000,000 BTC)",
        FCFA: "CFA Franc",
        EUR: "Euro",
        USD: "US Dollar",
        CAD: "Canadian Dollar"
      }
    }
  };

  useEffect(() => {
    if (amount && bitcoinPrice) {
      let btcAmount;
      
      // Convert input to BTC first
      if (inputCurrency === 'BTC') {
        btcAmount = parseFloat(amount);
      } else if (inputCurrency === 'SAT') {
        btcAmount = parseFloat(amount) / 100000000; // Convert satoshis to BTC
      } else {
        btcAmount = parseFloat(amount) / exchangeRates[inputCurrency];
      }

      // Then convert BTC to all currencies
      setConversions({
        BTC: btcAmount,
        SAT: btcAmount * 100000000, // Convert BTC to satoshis
        FCFA: btcAmount * exchangeRates.FCFA,
        EUR: btcAmount * exchangeRates.EUR,
        USD: btcAmount * exchangeRates.USD,
        CAD: btcAmount * exchangeRates.CAD
      });
    } else {
      setConversions({
        BTC: null,
        SAT: null,
        FCFA: null,
        EUR: null,
        USD: null,
        CAD: null
      });
    }
  }, [amount, inputCurrency, bitcoinPrice]);

  const formatNumber = (value, currency) => {
    if (value === null) return '-';
    
    const formatter = new Intl.NumberFormat(language === 'french' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: currency === 'BTC' ? 8 : (currency === 'SAT' ? 0 : 2),
      maximumFractionDigits: currency === 'BTC' ? 8 : (currency === 'SAT' ? 0 : 2),
    });
    
    return `${formatter.format(value)} ${currency}`;
  };

  return (
    <ConverterContainer>
      <h2>{text[language].title}</h2>
      <Form>
        <InputGroup>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="any"
            min="0"
          />
          <Select
            value={inputCurrency}
            onChange={(e) => setInputCurrency(e.target.value)}
          >
            {Object.entries(text[language].currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
        </InputGroup>
      </Form>
      
      <ResultsGrid>
        {Object.entries(conversions).map(([currency, value]) => (
          currency !== inputCurrency && (
            <ResultCard key={currency}>
              <h3>{text[language].currencies[currency]}</h3>
              <p>{formatNumber(value, currency)}</p>
            </ResultCard>
          )
        ))}
      </ResultsGrid>
    </ConverterContainer>
  );
};

export default BitcoinConverter; 