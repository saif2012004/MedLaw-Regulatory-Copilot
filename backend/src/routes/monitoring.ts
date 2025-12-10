import { Router } from 'express';

const router = Router();
const preferences: Record<string, any> = {};

router.post('/preferences', (req, res) => {
  const user = (req as any).user || {};
  preferences[user.uid || 'dev'] = req.body || {};
  res.json({ status: 'saved' });
});

router.get('/preferences', (req, res) => {
  const user = (req as any).user || {};
  res.json(preferences[user.uid || 'dev'] || {});
});

export default router;
