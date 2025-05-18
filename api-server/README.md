# Crypto API Server

REST API service for cryptocurrency data collection and analysis.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

## API Endpoints

### GET /stats
Get latest cryptocurrency statistics.

Query Parameters:
- `coin`: cryptocurrency ID (bitcoin, ethereum, matic-network)

Response:
```json
{
    "price": 40000,
    "marketCap": 800000000,
    "24hChange": 3.4
}
```

### GET /deviation
Get price deviation for last 100 records.

Query Parameters:
- `coin`: cryptocurrency ID (bitcoin, ethereum, matic-network)

Response:
```json
{
    "deviation": 4082.48
}
```

## Features
- Real-time crypto data collection
- NATS event subscription
- MongoDB data storage
- Price deviation calculation 