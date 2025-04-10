import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ConverterContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-secondary-light);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .dark & {
    background: var(--bg-secondary-dark);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  h2 {
    margin: 0;
    text-align: center;
    font-size: 1.75rem;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 1rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.25rem;

    h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;

    h2 {
      font-size: 1.25rem;
    }
  }

  input[type='number'] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: inner-spin-button;
      appearance: inner-spin-button;
      color: var(--accent-color-light);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.5rem 1rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  background-color: var(--bg-secondary-light);
  color: var(--text-primary-light);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:hover {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
  }

  .dark & {
    background-color: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Label = styled.label`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  color: #f59e0b;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  pointer-events: none;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;

  ${Input}:focus + &,
  ${Input}:not(:placeholder-shown) + & {
    top: 0.25rem;
    transform: translateY(0) scale(0.8);
    color: #f59e0b;
  }

  .dark & {
    color: #f59e0b;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background-color: var(--bg-secondary-light);
  color: var(--text-primary-light);
  font-size: 1.1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2em;
  padding-right: 2.5rem;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;

  &:hover {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
  }

  .dark & {
    background-color: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const ResultCard = styled.div`
  width: 100%;
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .dark & {
    background: var(--bg-primary-dark);
    border-color: rgba(255, 255, 255, 0.1);
  }

  h3 {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.25rem;

    .dark & {
      color: #999;
    }
  }

  p {
    font-size: 1.25rem;
    font-weight: 600;
    color: #f59e0b;
    font-family: 'JetBrains Mono', monospace;
    margin: 0;
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
    EUR: bitcoinPrice / 655.957,
    USD: bitcoinPrice / 600,
    CAD: bitcoinPrice / 450,
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

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value && !isNaN(value)) {
      handleConversion(value, inputCurrency);
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
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setInputCurrency(currency);
    if (amount && !isNaN(amount)) {
      handleConversion(amount, currency);
    }
  };

  const handleConversion = (value, fromCurrency) => {
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || !bitcoinPrice) return;

      let btcAmount;
      switch (fromCurrency) {
        case 'BTC':
          btcAmount = numericValue;
          break;
        case 'SAT':
          btcAmount = numericValue / 100000000;
          break;
        case 'FCFA':
          btcAmount = numericValue / bitcoinPrice;
          break;
        case 'EUR':
          btcAmount = (numericValue * 655.957) / bitcoinPrice;
          break;
        case 'USD':
          btcAmount = (numericValue * 600) / bitcoinPrice;
          break;
        case 'CAD':
          btcAmount = (numericValue * 450) / bitcoinPrice;
          break;
        default:
          btcAmount = 0;
      }

      setConversions({
        BTC: btcAmount,
        SAT: btcAmount * 100000000,
        FCFA: btcAmount * bitcoinPrice,
        EUR: (btcAmount * bitcoinPrice) / 655.957,
        USD: (btcAmount * bitcoinPrice) / 600,
        CAD: (btcAmount * bitcoinPrice) / 450
      });
    } catch (error) {
      console.error('Error in handleConversion:', error);
    }
  };

  useEffect(() => {
    try {
      if (!bitcoinPrice) {
        console.error('Invalid Bitcoin Price:', bitcoinPrice);
        return;
      }
      if (amount && !isNaN(amount)) {
        handleConversion(amount, inputCurrency);
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [bitcoinPrice]);

  const formatNumber = (value, currency) => {
    if (value === null) return '-';
    
    const options = {
      BTC: { minimumFractionDigits: 8, maximumFractionDigits: 8 },
      SAT: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      FCFA: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      EUR: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      USD: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      CAD: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    };

    return new Intl.NumberFormat('fr-FR', options[currency]).format(value);
  };

  return (
    <ConverterContainer>
      <h2>{text[language].title}</h2>
      <Form>
        <InputGroup>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder=" "
            step="any"
          />
          <Label htmlFor="amount">{text[language].amount}</Label>
        </InputGroup>
        <Select
          id="currency"
          value={inputCurrency}
          onChange={handleCurrencyChange}
        >
          {Object.keys(text[language].currencies).map(currency => (
            <option key={currency} value={currency}>
              {text[language].currencies[currency]}
            </option>
          ))}
        </Select>
      </Form>
      <ResultsGrid>
        {Object.keys(conversions).map(currency => (
          <ResultCard key={currency}>
            <h3>{text[language].currencies[currency]}</h3>
            <p>{formatNumber(conversions[currency], currency)}</p>
          </ResultCard>
        ))}
      </ResultsGrid>
    </ConverterContainer>
  );
};

export default BitcoinConverter; 