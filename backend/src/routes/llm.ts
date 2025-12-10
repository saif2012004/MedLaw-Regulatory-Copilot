import { Router } from 'express';
import { llmService } from '../services/llm.service';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { prompt, temperature = 0.1, max_tokens = 500 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    const text = await llmService.generate({ prompt, temperature, max_tokens });
    res.json({ text });
  } catch (err) {
    console.error('LLM generate error', err);
    res.status(500).json({ error: 'LLM generate failed' });
  }
});

router.post('/classify', async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: 'query is required' });
    const result = await llmService.classify(query);
    res.json(result);
  } catch (err) {
    console.error('LLM classify error', err);
    res.status(500).json({ error: 'LLM classify failed' });
  }
});

router.post('/extract-entities', async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: 'query is required' });
    const result = await llmService.extractEntities(query);
    res.json(result);
  } catch (err) {
    console.error('LLM extract error', err);
    res.status(500).json({ error: 'LLM extract failed' });
  }
});

export default router;

