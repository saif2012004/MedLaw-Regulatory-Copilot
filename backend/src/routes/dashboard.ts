import { Router } from 'express';

const router = Router();

router.get('/overview', (_req, res) => {
  res.json({
    complianceScore: 82,
    urgentIssues: 2,
    documents: [],
    recentQueries: [],
    products: [],
  });
});

export default router;
