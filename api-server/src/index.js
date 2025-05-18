const express = require('express');
const mongoose = require('mongoose');
const { connect } = require('nats');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const cryptoSchema = new mongoose.Schema({
    coin: { type: String, required: true },
    price: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    change24h: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-stats')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to fetch and store crypto stats
async function storeCryptoStats() {
    const coins = ['bitcoin', 'ethereum', 'matic-network'];
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
        );

        for (const coin of coins) {
            const data = response.data[coin];
            if (data) {
                await Crypto.create({
                    coin,
                    price: data.usd,
                    marketCap: data.usd_market_cap,
                    change24h: data.usd_24h_change
                });
            }
        }
        console.log('Crypto stats updated successfully');
    } catch (error) {
        console.error('Error fetching crypto stats:', error);
    }
}

// NATS connection and subscription
async function connectNats() {
    try {
        const nc = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
        console.log('Connected to NATS server');

        const sub = nc.subscribe(process.env.NATS_SUBJECT || 'crypto.update');
        for await (const msg of sub) {
            const data = JSON.parse(msg.data);
            if (data.trigger === 'update') {
                await storeCryptoStats();
            }
        }
    } catch (error) {
        console.error('Error connecting to NATS:', error);
    }
}

// API Endpoints
app.get('/stats', async (req, res) => {
    try {
        const { coin } = req.query;
        if (!coin) {
            return res.status(400).json({ error: 'Coin parameter is required' });
        }

        const latestStats = await Crypto.findOne({ coin })
            .sort({ timestamp: -1 })
            .select('price marketCap change24h');

        if (!latestStats) {
            return res.status(404).json({ error: 'No data found for the specified coin' });
        }

        res.json({
            price: latestStats.price,
            marketCap: latestStats.marketCap,
            '24hChange': latestStats.change24h
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/deviation', async (req, res) => {
    try {
        const { coin } = req.query;
        if (!coin) {
            return res.status(400).json({ error: 'Coin parameter is required' });
        }

        const prices = await Crypto.find({ coin })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('price');

        if (prices.length === 0) {
            return res.status(404).json({ error: 'No data found for the specified coin' });
        }

        // Calculate standard deviation
        const values = prices.map(p => p.price);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squareDiffs = values.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        const stdDev = Math.sqrt(avgSquareDiff);

        res.json({ deviation: Number(stdDev.toFixed(2)) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server and connect to NATS
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectNats();
    // Initial data fetch
    storeCryptoStats();
}); 