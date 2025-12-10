import axios from 'axios';

type Provider = 'openai' | 'anthropic' | 'stub';

interface GenerateParams {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

class LlmService {
  private provider: Provider;

  constructor() {
    const envProvider = (process.env.LLM_PROVIDER || 'stub').toLowerCase();
    if (envProvider === 'openai' || envProvider === 'anthropic') {
      this.provider = envProvider;
    } else {
      this.provider = 'stub';
    }
  }

  async generate({ prompt, temperature = 0.1, max_tokens = 500 }: GenerateParams) {
    if (this.provider === 'openai') {
      const { OpenAI } = await import('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.responses.create({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        input: prompt,
        max_output_tokens: max_tokens,
        temperature,
      });
      return response.output[0].content[0].text;
    }

    if (this.provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      const resp = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: process.env.LLM_MODEL || 'claude-3-haiku-20240307',
          max_tokens,
          temperature,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        }
      );
      return resp.data?.content?.[0]?.text || '';
    }

    return (
      'Stubbed LLM response. Provide concise regulatory guidance. ' +
      'Set LLM_PROVIDER=openai or anthropic with API keys for real outputs.'
    );
  }

  async classify(query: string) {
    const lower = query.toLowerCase();
    if (lower.includes('template') || lower.includes('dhf') || lower.includes('sop')) {
      return { flow: 'C', intendedPage: 'templates', entities: { templateType: query }, confidence: 0.8 };
    }
    if (lower.includes('alert') || lower.includes('update') || lower.includes('recall')) {
      return { flow: 'C', intendedPage: 'alerts', entities: {}, confidence: 0.75 };
    }
    return { flow: 'A', intendedPage: 'chat', entities: {}, confidence: 0.6 };
  }

  async extractEntities(query: string) {
    return {
      regulations: [],
      deviceTypes: [],
      dateRange: null,
      raw: query,
    };
  }
}

export const llmService = new LlmService();
