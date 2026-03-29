# Design: Study Orbit

## System
- React client for goal input and dashboard rendering
- Express server for OpenRouter calls
- Structured JSON response contract
- Deterministic progress ring and lesson cards from AI output

## Layout mapping from wireframe
- Circle: progress ring / streak indicator
- Top card: current lesson to resume now
- Lower card: next lesson or stretch task

## Flow
1. User enters a topic, level, and hours per week.
2. Server asks OpenRouter free model for a compact weekly plan in JSON.
3. Client renders overview, ring progress, current lesson, next lesson, and coach notes.
