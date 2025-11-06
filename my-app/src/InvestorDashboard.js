import React, { useState, useMemo } from 'react';
import './Dashboard.css';

const sample = [
  { id: 1, title: 'Smart Recycling App', industry: 'Sustainability', stage: 'Seed', location: 'Remote', popularity: 95 },
  { id: 2, title: 'AI Tutor', industry: 'EdTech', stage: 'Pre-seed', location: 'USA', popularity: 80 },
  { id: 3, title: 'Farm-to-Table Logistics', industry: 'AgriTech', stage: 'Series A', location: 'India', popularity: 60 },
];

export default function InvestorDashboard() {
  const [feed] = useState(sample);
  const [filters, setFilters] = useState({ industry: 'All', stage: 'All', location: 'All' });
  const [bookmarks, setBookmarks] = useState([]);

  const industries = useMemo(() => ['All', ...Array.from(new Set(feed.map((f) => f.industry)))], [feed]);
  const stages = useMemo(() => ['All', ...Array.from(new Set(feed.map((f) => f.stage)))], [feed]);
  const locations = useMemo(() => ['All', ...Array.from(new Set(feed.map((f) => f.location)))], [feed]);

  function toggleBookmark(id) {
    setBookmarks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  const filtered = feed.filter((f) =>
    (filters.industry === 'All' || f.industry === filters.industry) &&
    (filters.stage === 'All' || f.stage === filters.stage) &&
    (filters.location === 'All' || f.location === filters.location)
  );

  return (
    <div className="dash-page">
      <header className="dash-header">
        <h2>Investor Dashboard</h2>
      </header>

      <section className="dash-grid">
        <div className="panel">
          <h3>Recommended Ideas</h3>
          <div className="filters">
            <select value={filters.industry} onChange={(e) => setFilters((s) => ({ ...s, industry: e.target.value }))}>
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={filters.stage} onChange={(e) => setFilters((s) => ({ ...s, stage: e.target.value }))}>
              {stages.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={filters.location} onChange={(e) => setFilters((s) => ({ ...s, location: e.target.value }))}>
              {locations.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <ul className="idea-list">
            {filtered.map((it) => (
              <li key={it.id} className="idea-item">
                <div className="idea-main">
                  <strong>{it.title}</strong>
                  <p className="muted">{it.industry} • {it.stage} • {it.location}</p>
                </div>
                <div className="idea-meta">⭐ {it.popularity}</div>
                <div className="idea-actions">
                  <button onClick={() => toggleBookmark(it.id)}>{bookmarks.includes(it.id) ? 'Bookmarked' : 'Bookmark'}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Bookmarked Ideas</h3>
          <ul className="idea-list">
            {feed.filter((f) => bookmarks.includes(f.id)).map((it) => (
              <li key={it.id} className="idea-item">
                <div className="idea-main"><strong>{it.title}</strong><p className="muted">{it.industry}</p></div>
              </li>
            ))}
            {bookmarks.length === 0 && <div className="muted">No bookmarks yet</div>}
          </ul>

          <h3 style={{ marginTop: 20 }}>Notifications</h3>
          <ul className="muted">
            <li>New promising idea added in Sustainability</li>
            <li>Your bookmarked idea received interest</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
