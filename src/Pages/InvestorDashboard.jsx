import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvestorDashboard.css';

export default function InvestorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [portfolioData] = useState({
    totalInvestment: 50000,
    currentValue: 62500,
    gain: 12500,
    gainPercentage: 25,
    investments: [
      { id: 1, name: 'Tech Startup A', amount: 20000, currentValue: 28000, status: 'Active' },
      { id: 2, name: 'Green Energy Fund', amount: 15000, currentValue: 17500, status: 'Active' },
      { id: 3, name: 'Real Estate Fund', amount: 15000, currentValue: 17000, status: 'Pending' },
    ],
    investedIdeas: [
      { id: 1, title: 'AI-Powered Chatbot Platform', founder: 'Sarah Johnson', category: 'AI/Tech', investedAmount: 20000, status: 'Active' },
      { id: 2, title: 'Sustainable Packaging Solutions', founder: 'Mike Chen', category: 'Green Tech', investedAmount: 15000, status: 'Active' },
      { id: 3, title: 'Mobile Health App', founder: 'Emily Davis', category: 'Healthcare', investedAmount: 15000, status: 'Pending' },
      { id: 4, title: 'Blockchain Supply Chain', founder: 'Alex Kumar', category: 'Blockchain', investedAmount: 12000, status: 'Active' },
      { id: 5, title: 'EdTech Learning Platform', founder: 'Lisa Wong', category: 'Education', investedAmount: 8000, status: 'Active' },
    ],
    recentTransactions: [
      { id: 1, type: 'Investment', description: 'Invested in Tech Startup A', amount: 5000, date: '2025-11-20' },
      { id: 2, type: 'Dividend', description: 'Dividend received', amount: 500, date: '2025-11-18' },
      { id: 3, type: 'Withdrawal', description: 'Withdrawal request', amount: 2000, date: '2025-11-15' },
    ]
  });

  // Filter ideas based on search query
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
