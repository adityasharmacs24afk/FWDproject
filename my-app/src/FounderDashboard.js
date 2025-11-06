import React, { useState } from 'react';
import './Dashboard.css';

export default function FounderDashboard() {
  const [ideas, setIdeas] = useState([
    { id: 1, title: 'Smart Recycling App', desc: 'Automated pickup scheduling.', upvotes: 12, views: 230, interest: 3 },
    { id: 2, title: 'Plant-based Packaging', desc: 'Compostable containers for food.', upvotes: 8, views: 142, interest: 1 },
  ]);
  const [newIdea, setNewIdea] = useState({ title: '', desc: '' });

  function addIdea(e) {
    e.preventDefault();
    if (!newIdea.title) return;
    const id = Date.now();
    setIdeas((p) => [{ id, title: newIdea.title, desc: newIdea.desc, upvotes: 0, views: 0, interest: 0 }, ...p]);
    setNewIdea({ title: '', desc: '' });
  }

  function removeIdea(id) {
    setIdeas((p) => p.filter((i) => i.id !== id));
  }

  function bumpStat(id, key) {
    setIdeas((p) => p.map((it) => (it.id === id ? { ...it, [key]: it[key] + 1 } : it)));
  }

  return (
    <div className="dash-page">
      <header className="dash-header">
        <h2>Founder Dashboard</h2>
        <div>
          <button className="btn-cta" onClick={() => window.scrollTo(0, 9999)}>Pitch New Idea</button>
        </div>
      </header>

      <section className="dash-grid">
        <div className="panel">
          <h3>Your Posted Ideas</h3>
          <form className="new-idea" onSubmit={addIdea}>
            <input className="pill" placeholder="Idea title" value={newIdea.title} onChange={(e) => setNewIdea((s) => ({ ...s, title: e.target.value }))} />
            <input className="pill" placeholder="Short description" value={newIdea.desc} onChange={(e) => setNewIdea((s) => ({ ...s, desc: e.target.value }))} />
            <button className="btn-proceed" type="submit">Add</button>
          </form>

          <ul className="idea-list">
            {ideas.map((it) => (
              <li key={it.id} className="idea-item">
                <div className="idea-main">
                  <strong>{it.title}</strong>
                  <p className="muted">{it.desc}</p>
                </div>
                <div className="idea-meta">
                  <div>👍 {it.upvotes}</div>
                  <div>👁️ {it.views}</div>
                  <div>💼 {it.interest}</div>
                </div>
                <div className="idea-actions">
                  <button onClick={() => bumpStat(it.id, 'upvotes')}>Upvote</button>
                  <button onClick={() => bumpStat(it.id, 'views')}>Add View</button>
                  <button onClick={() => bumpStat(it.id, 'interest')}>Add Interest</button>
                  <button className="danger" onClick={() => removeIdea(it.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Analytics (summary)</h3>
          <div className="analytics">
            <div className="stat">
              <div className="stat-title">Total Upvotes</div>
              <div className="stat-value">{ideas.reduce((s, i) => s + i.upvotes, 0)}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Views</div>
              <div className="stat-value">{ideas.reduce((s, i) => s + i.views, 0)}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Investor Interest</div>
              <div className="stat-value">{ideas.reduce((s, i) => s + i.interest, 0)}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
