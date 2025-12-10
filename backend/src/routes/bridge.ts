import { Router } from 'express';
import axios from 'axios';

const router = Router();
const RAG_URL = process.env.PYTHON_RAG_URL || 'http://localhost:5001';

router.post('/upload', async (_req, res) => {
  res.status(501).json({ error: 'Upload not implemented in backend stub. Use pipeline ingestion directly.' });
});

router.post('/analyze', async (req, res) => {
  try {
    const { query, docIds, k = 5 } = req.body || {};
    if (!query) return res.status(400).json({ error: 'query is required' });

    const response = await axios.post(
      ${RAG_URL}/vector/search,
      { query, k, filters: docIds?.length ? { doc_id: docIds[0] } : undefined },
      { timeout: 15000 }
    );

    res.json({
      query,
      results: response.data?.results || [],
      count: response.data?.count || 0,
    });
  } catch (err) {
    console.error('RAG analyze error', err);
    res.status(502).json({ error: 'Failed to call Python RAG service' });
  }
});

export default router;
