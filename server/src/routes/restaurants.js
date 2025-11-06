import { pool } from '../db/pool.js';
import express from 'express';
const router = express.Router();

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT id, name, cuisine, rating, image_url FROM restaurants ORDER BY rating DESC');
  res.json(rows);
});

router.get('/:id/menu', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'SELECT id, name, price_cents, image_url, is_veg FROM menu_items WHERE restaurant_id=$1',
    [id]
  );
  res.json(rows);
});

export default router;
