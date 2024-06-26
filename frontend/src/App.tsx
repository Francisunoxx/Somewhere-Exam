import React, { useState, useEffect } from 'react';
import useCryptoData from './UseCryptoData'; // Adjust path as necessary

interface CoinData {
  usd: number;
}

interface CoinPrices {
  bitcoin: CoinData;
  dogecoin: CoinData;
  ethereum: CoinData;
  [key: string]: CoinData; // Index signature allowing any string key
}

const App: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('bitcoin'); // Default symbol is bitcoin
  const refreshIntervalMinutes = 1; // Example refresh interval in minutes
  const [historicData, setHistoricData] = useState<number[]>([]);

  const coinPrices = useCryptoData(symbol, refreshIntervalMinutes);

  // Mock function to generate historic data (for demonstration purposes)
  const generateHistoricData = () => {
    const data: number[] = [];
    for (let i = 0; i < 10; i++) {
      data.push(Math.random() * 10000); // Example: Random historical prices
    }
    return data;
  };

  useEffect(() => {
    // Generate and set mock historical data
    const data = generateHistoricData();
    setHistoricData(data);
  }, [symbol]); // Update historic data when symbol changes

  // Function to calculate average price
  const calculateAveragePrice = () => {
    let sum = 0;
    Object.keys(coinPrices).forEach(key => {
      sum += coinPrices[key].usd;
    });
    return sum / Object.keys(coinPrices).length;
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  return (
    <div>
      <h1>Cryptocurrency Prices</h1>

      {/* Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleSymbolChange('bitcoin')}>Bitcoin</button>
        <button onClick={() => handleSymbolChange('ethereum')}>Ethereum</button>
        <button onClick={() => handleSymbolChange('dogecoin')}>Dogecoin</button>
      </div>

      {/* Display Prices */}
      <div>
        <h2>{symbol.toUpperCase()}</h2>
        <ul>
          <li>Latest Price: ${coinPrices[symbol]?.usd}</li>
          <li>Average Price: ${calculateAveragePrice().toFixed(2)}</li>
        </ul>
      </div>

      {/* Historic Data */}
      <div>
        <h2>Historical Prices</h2>
        <ul>
          {historicData.map((price, index) => (
            <li key={index}>Day {index + 1}: ${price.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;