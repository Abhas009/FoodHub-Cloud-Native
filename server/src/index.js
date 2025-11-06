import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import restaurantsRouter from './routes/restaurants.js';
import ordersRouter from './routes/orders.js';
import stripeRouter from './routes/stripe.js';
import pricingRouter from './routes/pricing.js';
import { withEtag } from './lib/etag.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(withEtag);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', pricingRouter);
app.use('/api/stripe', stripeRouter);

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

import { attachWs } from './ws/orders.js';
attachWs(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`API listening on :${PORT}`));
