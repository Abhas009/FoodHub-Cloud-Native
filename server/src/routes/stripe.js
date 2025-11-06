import express from 'express';
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  const { amount_cents } = req.body;
  if (!amount_cents || amount_cents < 50) return res.status(400).json({ error: 'Invalid amount' });
  const clientSecret = 'pi_mock_' + Math.random().toString(36).slice(2);
  res.json({ clientSecret, amount_cents });
});

export default router;
