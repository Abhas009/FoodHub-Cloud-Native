import express from 'express';
import { pool } from '../db/pool.js';
const router = express.Router();

router.post('/price', async (req, res) => {
  const { items } = req.body;
  const ids = items?.map(i => i.menuItemId) || [];
  const { rows } = await pool.query('SELECT id, price_cents FROM menu_items WHERE id = ANY($1::int[])', [ids]);
  const priceMap = new Map(rows.map(r => [r.id, r.price_cents]));
  const total = items.reduce((sum, i) => sum + (priceMap.get(i.menuItemId) || 0) * i.qty, 0);
  res.json({ total_cents: total });
});

export default router;
