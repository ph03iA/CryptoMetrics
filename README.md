# KoinX Backend Internship Assignment

A distributed system for collecting and analyzing cryptocurrency data in real-time.

## Project Structure

The project consists of two main components:

1. **API Server** (`/api-server`)
   - REST API service
   - Collects cryptocurrency data from CoinGecko
   - Provides data analysis endpoints
   - Stores data in MongoDB

2. **Worker Server** (`/worker-server`)
   - Background service
   - Publishes update events every 15 minutes
   - Uses NATS for event publishing

## Features

- Real-time cryptocurrency data collection
- Automated data updates every 15 minutes
- Price and market cap tracking
- Price deviation analysis
- Event-driven architecture
- Scalable design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NATS Server

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/ph03iA/KoinX---Backend-Internship-Take-home-Assignment.git
   cd KoinX---Backend-Internship-Take-home-Assignment
   ```

2. Set up the API Server:
   ```bash
   cd api-server
   npm install
   # Create .env file with required environment variables
   npm start
   ```

3. Set up the Worker Server:
   ```bash
   cd worker-server
   npm install
   # Create .env file with required environment variables
   npm start
   ```

## Environment Variables

### API Server (.env)
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

### Worker Server (.env)
```
NATS_URL=nats://localhost:4222
NATS_SUBJECT=crypto.update
```

## API Endpoints

### GET /stats
Get latest cryptocurrency statistics.

### GET /deviation
Get price deviation analysis.

For detailed API documentation, see the API server README.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- NATS
- CoinGecko API
- Docker (optional)

## License

This project is part of the KoinX Backend Internship Assignment. 