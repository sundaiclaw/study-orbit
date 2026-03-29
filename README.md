# Study Orbit

Study Orbit is an AI learning dashboard built from the supplied wireframe spec.

The sketch mapped cleanly to:
- a circular progress anchor
- a primary card for the current lesson
- a secondary card for the next lesson

So the shipped product is a compact study coach that turns a learning goal into a weekly plan, current lesson, next lesson, and AI coaching notes.

## Live demo

- Demo: https://study-orbit-859414203684.us-central1.run.app
- Repo: https://github.com/sundaiclaw/study-orbit

## What it does

1. You enter a topic, current level, and hours per week.
2. The AI generates a structured study orbit.
3. The UI renders a progress ring, current lesson card, next lesson card, milestones, and a coach note.

## Tech

- React + Vite
- Express
- OpenRouter free model (`arcee-ai/trinity-large-preview:free`)
- OpenSpec + Fabro workflow artifacts

## Run locally

```bash
cd app
npm install
cp .env.example .env
npm run build
npm run start
```

Required env vars:

```bash
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free
OPENROUTER_API_KEY=your_key_here
PORT=8080
```

## Known limits

- This MVP focuses on planning and guidance, not long-term account persistence.
- Sundai publish is still blocked by the same workspace auth failure during automated create/edit.
