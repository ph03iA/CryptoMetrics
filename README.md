# CryptoStats

A real-time cryptocurrency statistics tracking and monitoring service that provides price, market cap, and 24-hour change data for various cryptocurrencies.

## Features

- Real-time cryptocurrency price tracking
- Market cap monitoring
- 24-hour price change tracking
- Price deviation calculations
- NATS integration for real-time updates
- RESTful API endpoints

## Supported Cryptocurrencies

- Bitcoin (BTC)
- Ethereum (ETH)
- Matic Network (MATIC)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NATS Server

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crypto-stats
NATS_URL=nats://localhost:4222
NATS_SUBJECT=crypto.update
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cryptostats.git
cd cryptostats
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Get Latest Stats
```
GET /stats?coin=<coin_name>
```
Returns the latest price, market cap, and 24-hour change for the specified cryptocurrency.

### Get Price Deviation
```
GET /deviation?coin=<coin_name>
```
Returns the standard deviation of the last 100 price points for the specified cryptocurrency.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 