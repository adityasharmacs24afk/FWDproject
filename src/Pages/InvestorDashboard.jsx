// src/InvestorDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// new (correct)
import { supabase } from "../lib/supabaseClient";


import './InvestorDashboard.css';

export default function InvestorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // portfolioData mirrors the original structure your UI expects.
  const [portfolioData, setPortfolioData] = useState({
    totalInvestment: 0,
    currentValue: 0,
    gain: 0,
    gainPercentage: 0,
    investments: [], // small funds / pooled investments (optional)
    investedIdeas: [], // ideas the investor invested in
    recentTransactions: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: format numeric safe
  const safeNumber = (v) => (typeof v === 'number' ? v : Number(v) || 0);

  useEffect(() => {
    let mounted = true;

    async function loadInvestorData() {
      setLoading(true);
      setError(null);

      try {
        // Get current user (from Supabase Auth)
        const {
          data: { user },
          error: userErr
        } = await supabase.auth.getUser();

        if (userErr) throw userErr;
        if (!user) throw new Error('No authenticated user found.');

        const userId = user.id;

        // 1) Get investor profile (optional fields)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, name, company, interests')
          .eq('id', userId)
          .single();

        // 2) Get investor_interest rows for this investor
        const { data: interests, error: interestsErr } = await supabase
          .from('investor_interest')
          .select('id, idea_id, status, amount, created_at, updated_at')
          .eq('investor_id', userId);

        if (interestsErr) throw interestsErr;

        // Collect idea ids
        const ideaIds = interests?.map((r) => r.idea_id).filter(Boolean) ?? [];

        // 3) Fetch idea details for those ids
        let ideasById = {};
        if (ideaIds.length > 0) {
          const { data: ideas, error: ideasErr } = await supabase
            .from('ideas')
            .select('id, title, founder_id, industry, stage, pitch_deck_url')
            .in('id', ideaIds);

          if (ideasErr) throw ideasErr;

          ideasById = (ideas || []).reduce((acc, it) => {
            acc[it.id] = it;
            return acc;
          }, {});
        }

        // 4) Optionally fetch founder names for the ideas
        const founderIds = Array.from(
          new Set(
            Object.values(ideasById)
              .map((i) => i?.founder_id)
              .filter(Boolean)
          )
        );

        let foundersById = {};
        if (founderIds.length > 0) {
          const { data: founders } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', founderIds);

          foundersById = (founders || []).reduce((acc, f) => {
            acc[f.id] = f;
            return acc;
          }, {});
        }

        // 5) Compute the investedIdeas array
        const investedIdeas = (interests || []).map((intr) => {
          const idea = ideasById[intr.idea_id] || {};
          const founderProfile = foundersById[idea.founder_id] || {};
          return {
            id: idea.id ?? intr.idea_id,
            title: idea.title ?? 'Untitled Idea',
            founder: founderProfile.name ?? 'Unknown Founder',
            category: idea.industry ?? 'Unknown',
            investedAmount: safeNumber(intr.amount),
            status: intr.status ?? 'interested'
          };
        });

        // 6) Build investments array (mapped from investedIdeas)
        const investments = investedIdeas.map((it, idx) => ({
          id: idx + 1,
          name: it.title,
          amount: it.investedAmount,
          currentValue: it.investedAmount,
          status: it.status === 'interested' ? 'Pending' : it.status
        }));

        // 7) recentTransactions
        const recentTransactions = (interests || [])
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
          .map((t, i) => ({
            id: t.id ?? i + 1,
            type: t.status === 'invested' ? 'Investment' : 'Activity',
            description:
              (ideasById[t.idea_id]?.title ? `Activity on "${ideasById[t.idea_id].title}"` : 'Investment activity'),
            amount: safeNumber(t.amount),
            date: t.created_at ? new Date(t.created_at).toISOString().slice(0, 10) : ''
          }));

        // 8) Totals calculations
        const totalInvestment = investments.reduce((s, it) => s + safeNumber(it.amount), 0);
        const currentValue = investments.reduce((s, it) => s + safeNumber(it.currentValue), 0);
        const gain = currentValue - totalInvestment;
        const gainPercentage = totalInvestment > 0 ? Math.round((gain / totalInvestment) * 100) : 0;

        const assembled = {
          totalInvestment,
          currentValue,
          gain,
          gainPercentage,
          investments,
          investedIdeas,
          recentTransactions
        };

        if (mounted) setPortfolioData(assembled);
      } catch (err) {
        console.error('Error loading investor data:', err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadInvestorData();

    return () => {
      mounted = false;
    };
  }, []);

  // Filter ideas based on search query (keeps same logic)
  const filteredIdeas = portfolioData.investedIdeas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="investor-dashboard">
      <header className="dashboard-header">
        <h1>Investor Dashboard</h1>
        <p>Welcome back! Here's your investment overview.</p>
      </header>

      {/* show a small loading / error notification but not changing design */}
      {loading && <p style={{ padding: '0 16px' }}>Loading your portfolio…</p>}
      {error && <p style={{ color: 'crimson', padding: '0 16px' }}>Error: {error}</p>}

      {/* Portfolio Summary Cards */}
      <section className="summary-cards">
        <div className="card">
          <h3>Total Investment</h3>
          <p className="amount">${portfolioData.totalInvestment.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Current Value</h3>
          <p className="amount">${portfolioData.currentValue.toLocaleString()}</p>
        </div>
        <div className="card gain">
          <h3>Total Gain</h3>
          <p className="amount">${portfolioData.gain.toLocaleString()}</p>
          <p className="percentage">+{portfolioData.gainPercentage}%</p>
        </div>
      </section>

      <section className="actions-section">
        <button className="btn btn-primary">Make New Investment</button>
        <button className="btn btn-secondary">Withdraw Funds</button>
        <button className="btn btn-secondary">View Reports</button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/investor-feed')}
        >
          Browse Ideas
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/investor-profile')}
        >
          Edit Profile
        </button>
      </section>

      {/* Invested Ideas Section */}
      <section className="invested-ideas-section">
        <h2>Your Invested Ideas</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by idea title, founder name, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {filteredIdeas.length > 0 ? (
          <div className="ideas-grid">
            {filteredIdeas.map(idea => (
              <div key={idea.id} className="idea-card">
                <div className="idea-header">
                  <h3>{idea.title}</h3>
                  <span className={`idea-status ${idea.status.toLowerCase()}`}>{idea.status}</span>
                </div>
                <p className="founder"><strong>Founder:</strong> {idea.founder}</p>
                <p className="category"><strong>Category:</strong> {idea.category}</p>
                <div className="idea-footer">
                  <div className="invested-amount">
                    <p className="label">Invested</p>
                    <p className="amount">${idea.investedAmount.toLocaleString()}</p>
                  </div>
                  <button className="btn-view-idea">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No ideas found matching "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Investments Table */}
      <section className="investments-section">
        <h2>Your Investments</h2>
        <table className="investments-table">
          <thead>
            <tr>
              <th>Investment Name</th>
              <th>Invested Amount</th>
              <th>Current Value</th>
              <th>Returns</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.investments.map(inv => (
              <tr key={inv.id}>
                <td>{inv.name}</td>
                <td>${inv.amount.toLocaleString()}</td>
                <td>${inv.currentValue.toLocaleString()}</td>
                <td className="gain-cell">${(inv.currentValue - inv.amount).toLocaleString()}</td>
                <td><span className={`status ${inv.status.toLowerCase()}`}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Recent Transactions */}
      <section className="transactions-section">
        <h2>Recent Transactions</h2>
        <div className="transactions-list">
          {portfolioData.recentTransactions.map(trans => (
            <div key={trans.id} className="transaction-item">
              <div className="transaction-info">
                <p className="type">{trans.type}</p>
                <p className="description">{trans.description}</p>
              </div>
              <div className="transaction-amount">
                <p className="amount">${trans.amount.toLocaleString()}</p>
                <p className="date">{trans.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
