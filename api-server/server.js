const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const cryptoSchema = new mongoose.Schema({
    coinId: String,
    price: Number,
    marketCap: Number,
    change24h: Number,
    timestamp: { type: Date, default: Date.now }
});

const CryptoStats = mongoose.model('CryptoStats', cryptoSchema);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto_stats')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

function calculateStandardDeviation(prices) {
    const n = prices.length;
    if (n === 0) return 0;

    const mean = prices.reduce((sum, price) => sum + price, 0) / n;

    const variance = prices.reduce((sum, price) => {
        const diff = price - mean;
        return sum + (diff * diff);
    }, 0) / n;

    return Math.sqrt(variance);
}

async function storeCryptoStats() {
    try {
        const coins = ['bitcoin', 'ethereum', 'matic-network'];
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
        );

        const stats = [];
        for (const coinId of coins) {
            const coinData = response.data[coinId];
            stats.push({
                coinId,
                price: coinData.usd,
                marketCap: coinData.usd_market_cap,
                change24h: coinData.usd_24h_change
            });
        }

        await CryptoStats.insertMany(stats);
        console.log('Crypto stats stored successfully');
        return stats;
    } catch (error) {
        console.error('Error storing crypto stats:', error.message);
        throw error;
    }
}

app.post('/api/store-crypto-stats', async (req, res) => {
    try {
        const stats = await storeCryptoStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/crypto-stats', async (req, res) => {
    try {
        const stats = await CryptoStats.find().sort({ timestamp: -1 }).limit(3);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/stats', async (req, res) => {
    try {
        const { coin } = req.query;

        const validCoins = ['bitcoin', 'ethereum', 'matic-network'];
        if (!coin || !validCoins.includes(coin)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid coin parameter. Must be one of: bitcoin, ethereum, matic-network'
            });
        }

        const latestStats = await CryptoStats.findOne({ coinId: coin })
            .sort({ timestamp: -1 });

        if (!latestStats) {
            return res.status(404).json({
                success: false,
                error: `No data found for ${coin}`
            });
        }

        const response = {
            price: latestStats.price,
            marketCap: latestStats.marketCap,
            "24hChange": latestStats.change24h
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/deviation', async (req, res) => {
    try {
        const { coin } = req.query;

        const validCoins = ['bitcoin', 'ethereum', 'matic-network'];
        if (!coin || !validCoins.includes(coin)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid coin parameter. Must be one of: bitcoin, ethereum, matic-network'
            });
        }

        const records = await CryptoStats.find({ coinId: coin })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('price');

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No data found for ${coin}`
            });
        }

        const prices = records.map(record => record.price);
        const deviation = calculateStandardDeviation(prices);

        const response = {
            deviation: Number(deviation.toFixed(2))
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 