import React from 'react';
import './BitcoinPrice.css';

interface BitcoinPriceProps {
  price: number;
  percentageChange: number;
  lastUpdate: string;
}

const BitcoinPrice = ({ price, percentageChange, lastUpdate }: BitcoinPriceProps) => {
  const formattedPrice = new Intl.NumberFormat('fr-FR').format(price);
  const isPositive = percentageChange >= 0;

  return (
    <div className="bitcoin-price-container">
      <h2 className="price-header">Prix actuel du Bitcoin</h2>
      
      <div className="price-row">
        <span className="price-label">Bitcoin</span>
        <div className="price-value">
          {formattedPrice}
          <span className="currency">FCFA</span>
        </div>
      </div>

      <div className="price-row">
        <span className="price-label">Variation</span>
        <span className={`percentage-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
        </span>
      </div>

      <div className="price-row">
        <span className="price-label">Dernière mise à jour</span>
        <span className="last-update">{lastUpdate}</span>
      </div>
    </div>
  );
};

export default BitcoinPrice; 