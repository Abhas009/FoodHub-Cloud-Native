## Note on Repository Scope

This repository represents the **architecture, structure, and implementation approach**
of a cloud-native food ordering platform.

Some internal modules, configurations, or services are intentionally excluded
as this project was built for learning and demonstration purposes.

# FoodHub – Cloud-Native Food Ordering Platform

**Timeline:** Mar 2024 – Jun 2024  
**Stack:** React, Node.js, Express, PostgreSQL, Stripe API (mocked)

This repository mirrors a production-style food ordering platform: React SPA, Express API, PostgreSQL schema + seed data, mocked Stripe checkout, and WebSocket-based real-time order tracking.

---

## Highlights
- Multi-restaurant platform (10+ seeded restaurants).
- ~1,500+ orders, 99.2% payment success (mocked analytics).
- PostgreSQL schema with indexes for fast lookups.
- WebSocket status updates: PLACED → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED.
- 95+ Lighthouse perf target via PWA, code-splitting, caching.
- Stripe create-payment-intent mocked for local dev.

---

## Structure
```
client/        React (Vite)
server/        Express + Socket.IO
db/            schema.sql + seed.sql
```

## Quickstart
### DB
Enable pgcrypto (for UUIDs) and load schema+seed:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```
```bash
psql -U postgres -d foodhub -f db/schema.sql
psql -U postgres -d foodhub -f db/seed.sql
```

### Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

---

## API
- GET /api/restaurants
- GET /api/restaurants/:id/menu
- POST /api/cart/price
- POST /api/orders
- GET /api/orders/:id
- POST /api/stripe/create-payment-intent   (mock)

**WebSocket**
- emit: subscribeOrder, { orderId }
- receive: orderStatus, { orderId, status }

---

## Diagram
```mermaid
graph TD
  A[React Client] -->|REST| B[Express API]
  A -->|WebSocket| C[Socket.IO]
  B --> D[(PostgreSQL)]
  B --> E[Stripe (mock)]
  C --> B
```
