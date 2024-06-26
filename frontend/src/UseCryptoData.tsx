import { useState, useEffect } from 'react';
import axios from 'axios';

interface CoinData {
  usd: number;
}

interface CoinPrices {
    bitcoin: CoinData;
    dogecoin: CoinData;
    ethereum: CoinData;
    [key: string]: CoinData; // Index signature allowing any string key
  }
  

const useCryptoData = (symbol: string, refreshIntervalMinutes: number): CoinPrices => {
  const [coinPrices, setCoinPrices] = useState<CoinPrices>({
    bitcoin: { usd: 0 },
    dogecoin: { usd: 0 },
    ethereum: { usd: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CoinPrices>('http://localhost:3000/api/prices');
        console.log(response.data);
        setCoinPrices(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Set interval to fetch data periodically
    const interval = setInterval(fetchData, refreshIntervalMinutes * 60000); // Convert minutes to milliseconds

    // Clean up interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [symbol, refreshIntervalMinutes]); // Depend on symbol and refreshIntervalMinutes

  return coinPrices;
};

export default useCryptoData;