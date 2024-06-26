import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS for all origins
const port = process.env.PORT || 3000;

// In-memory storage for price history
const priceHistory = {
    bitcoin: [],
    ethereum: [],
    dogecoin: []
};


app.get('/api/prices', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                x_cg_api_key: process.env.API_KEY,
                ids: 'bitcoin,ethereum,dogecoin',
                vs_currencies: 'usd'
            }
        });

        const prices = response.data;
        const timestamp = new Date().toISOString();

        // Update price history
        priceHistory.bitcoin.push({ price: prices.bitcoin.usd, timestamp });
        priceHistory.ethereum.push({ price: prices.ethereum.usd, timestamp });
        priceHistory.dogecoin.push({ price: prices.dogecoin.usd, timestamp });

        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from CoinGecko');
    }
});

app.get('/api/price/:symbol', (req, res) => {
    const { symbol } = req.params;
    const { minutes = 60 } = req.query;

    const symbolKey = symbol.toLowerCase();
    if (!priceHistory[symbolKey]) {
        return res.status(404).send('Symbol not found');
    }

    const currentTime = new Date();
    const history = priceHistory[symbolKey].filter(entry => {
        const entryTime = new Date(entry.timestamp);
        return (currentTime - entryTime) / 60000 <= minutes;
    });

    const latest = history.length > 0 ? history[history.length - 1].price : null;
    const average = history.reduce((acc, entry) => acc + entry.price, 0) / history.length || null;
    const count = history.length;

    res.json({
        latest,
        average,
        history,
        count
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});