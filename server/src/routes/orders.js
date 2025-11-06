import express from 'express';
import { pool } from '../db/pool.js';
import { emitStatusProgression } from '../ws/orders.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { restaurantId, customer, items, paymentIntent } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Empty cart' });
  }
  const { rows: priced } = await pool.query(
    'SELECT id, price_cents FROM menu_items WHERE id = ANY($1::int[])',
    [items.map(i => i.menuItemId)]
  );
  const priceMap = new Map(priced.map(r => [r.id, r.price_cents]));
  let total = 0;
  for (const i of items) total += (priceMap.get(i.menuItemId) || 0) * i.qty;

  const insert = await pool.query(
    `INSERT INTO orders (restaurant_id, customer_name, customer_phone, address_line, total_cents, payment_intent)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, status`,
    [restaurantId, customer?.name || '', customer?.phone || '', customer?.address || '', total, paymentIntent || null]
  );
  const orderId = insert.rows[0].id;

  for (const i of items) {
    await pool.query(
      'INSERT INTO order_items (order_id, menu_item_id, qty, price_cents) VALUES ($1,$2,$3,$4)',
      [orderId, i.menuItemId, i.qty, priceMap.get(i.menuItemId) || 0]
    );
  }

  emitStatusProgression(orderId);
  res.status(201).json({ orderId, status: 'PLACED', total_cents: total });
});

export default router;
