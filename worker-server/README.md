# Crypto Worker Server

Background worker service that publishes cryptocurrency update events every 15 minutes.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

## Features
- NATS event publishing
- 15-minute update interval
- Error handling
- Graceful shutdown 