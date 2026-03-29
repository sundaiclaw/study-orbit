import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(distDir));
app.use('/reference', express.static(path.join(rootDir, 'public', 'reference')));

async function generatePlan(payload) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!apiKey || !model) throw new Error('Missing OpenRouter env.');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an AI study coach. Return valid JSON only with keys: trackName, progress, coachLine, coachNote, milestones, currentLesson, nextLesson. progress is 1-100. milestones is array of 3 strings. currentLesson and nextLesson must each contain title, summary, duration.',
        },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json?.error?.message || 'OpenRouter request failed.');
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter returned no content.');
  return JSON.parse(content);
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/generate-plan', async (req, res) => {
  const topic = String(req.body?.topic || '').trim();
  const level = String(req.body?.level || '').trim();
  const hoursPerWeek = Number(req.body?.hoursPerWeek || 0);
  if (!topic || !level || !hoursPerWeek) {
    return res.status(400).json({ error: 'Need topic, level, and hours.' });
  }
  try {
    const result = await generatePlan({ topic, level, hoursPerWeek });
    return res.json({ model: process.env.OPENROUTER_MODEL, result });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Generation failed.' });
  }
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Study Orbit listening on ${port}`);
});
