import { useMemo, useState } from 'react';

const defaultGoal = {
  topic: 'Learn product design systems',
  level: 'intermediate',
  hoursPerWeek: 6,
};

function ProgressRing({ progress }) {
  const degrees = Math.round((progress / 100) * 360);
  return (
    <div className="ring" style={{ background: `conic-gradient(#22d3ee ${degrees}deg, rgba(148,163,184,.18) ${degrees}deg)` }}>
      <div className="ring-inner">
        <p>Progress</p>
        <strong>{progress}%</strong>
      </div>
    </div>
  );
}

function App() {
  const [form, setForm] = useState(defaultGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);

  const readySummary = useMemo(
    () => `${form.topic} · ${form.level} · ${form.hoursPerWeek}h/week`,
    [form],
  );

  async function generatePlan() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not generate plan.');
      setPlan(json.result);
    } catch (err) {
      setError(err.message || 'Could not generate plan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell">
      <section className="hero card">
        <div>
          <p className="eyebrow">AI learning dashboard</p>
          <h1>Study Orbit</h1>
          <p className="lede">
            Turn one learning goal into a compact study dashboard with a progress anchor, current lesson,
            next lesson, and an AI coach keeping you on track.
          </p>
        </div>
        <button className="primary" onClick={generatePlan} disabled={loading}>
          {loading ? 'Generating orbit…' : 'Generate study orbit'}
        </button>
      </section>

      <section className="grid layout">
        <div className="card form-card">
          <h2>Your goal</h2>
          <label>
            Topic
            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </label>
          <label>
            Level
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option>beginner</option>
              <option>intermediate</option>
              <option>advanced</option>
            </select>
          </label>
          <label>
            Hours per week
            <input type="number" min="1" max="20" value={form.hoursPerWeek} onChange={(e) => setForm({ ...form, hoursPerWeek: Number(e.target.value) })} />
          </label>
          <p className="muted">{readySummary}</p>
          <img src="/reference/wireframe.png" alt="Original wireframe" className="wireframe" />
        </div>

        <div className="dashboard-column">
          <div className="ring-wrap card">
            <div>
              <p className="eyebrow">Weekly orbit</p>
              <h2>{plan?.trackName || 'Generate a plan'}</h2>
              <p className="muted">{plan?.coachLine || 'The progress ring and two-card hierarchy mirror the supplied wireframe.'}</p>
            </div>
            <ProgressRing progress={plan?.progress || 42} />
          </div>

          <div className="card lesson primary-lesson">
            <p className="eyebrow">Current lesson</p>
            <h3>{plan?.currentLesson?.title || 'Today’s focused lesson appears here'}</h3>
            <p>{plan?.currentLesson?.summary || 'Generate the orbit to get a specific lesson summary and target outcome.'}</p>
            {plan?.currentLesson ? <span className="pill">{plan.currentLesson.duration}</span> : null}
          </div>

          <div className="card lesson secondary-lesson">
            <p className="eyebrow">Next lesson</p>
            <h3>{plan?.nextLesson?.title || 'Next lesson appears here'}</h3>
            <p>{plan?.nextLesson?.summary || 'The second card is the next move, stretch task, or reinforcement lesson.'}</p>
            {plan?.nextLesson ? <span className="pill">{plan.nextLesson.duration}</span> : null}
          </div>
        </div>
      </section>

      {error ? <div className="error card">{error}</div> : null}

      <section className="grid lower">
        <div className="card">
          <h2>Milestones</h2>
          <ul>
            {(plan?.milestones || ['Clear the first checkpoint', 'Build repetition into the week', 'Ship a tiny proof-of-learning artifact']).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Coach note</h2>
          <p>{plan?.coachNote || 'Study Orbit keeps the dashboard tiny on purpose: one meaningful progress anchor and two immediate actions.'}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
