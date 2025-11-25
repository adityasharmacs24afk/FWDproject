import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvestorFeed.css';

export default function InvestorFeed() {
  const navigate = useNavigate();
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' or 'bookmarked'
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New promising AI startup matching your interests', timestamp: '2 hours ago', read: false },
    { id: 2, message: 'Blockchain fintech idea in your investment range', timestamp: '5 hours ago', read: false },
  ]);

  const [filters, setFilters] = useState({
    industry: '',
    fundingStage: '',
    location: '',
    sortBy: 'popularity'
  });

  const [showNotifications, setShowNotifications] = useState(false);

  // Sample ideas data
  const allIdeas = [
    {
      id: 1,
      title: 'AI-Powered Customer Service Platform',
      founder: 'Sarah Johnson',
      description: 'Revolutionary AI chatbot that learns from customer interactions',
      fundingNeeded: 500000,
      fundingReceived: 150000,
      industry: 'AI/Tech',
      fundingStage: 'Series A',
      location: 'San Francisco, CA',
      popularity: 98,
      matchScore: 95,
      logo: '🤖'
    },
    {
      id: 2,
      title: 'Green Energy Battery Storage',
      founder: 'Mike Chen',
      description: 'Next-gen lithium-free battery technology for renewable energy',
      fundingNeeded: 2000000,
      fundingReceived: 800000,
      industry: 'Green Tech',
      fundingStage: 'Series B',
      location: 'Austin, TX',
      popularity: 87,
      matchScore: 88,
      logo: '🔋'
    },
    {
      id: 3,
      title: 'Decentralized Finance Protocol',
      founder: 'Alex Kumar',
      description: 'Secure DeFi platform for cross-chain transactions',
      fundingNeeded: 1500000,
      fundingReceived: 600000,
      industry: 'Blockchain',
      fundingStage: 'Series A',
      location: 'New York, NY',
      popularity: 92,
      matchScore: 92,
      logo: '⛓️'
    },
    {
      id: 4,
      title: 'Telemedicine for Remote Areas',
      founder: 'Emily Davis',
      description: 'Mobile health platform for rural healthcare access',
      fundingNeeded: 1000000,
      fundingReceived: 400000,
      industry: 'Healthcare',
      fundingStage: 'Seed',
      location: 'Denver, CO',
      popularity: 85,
      matchScore: 90,
      logo: '🏥'
    },
    {
      id: 5,
      title: 'EdTech Learning Analytics',
      founder: 'Lisa Wong',
      description: 'AI-powered platform for personalized learning paths',
      fundingNeeded: 1200000,
      fundingReceived: 500000,
      industry: 'Education',
      fundingStage: 'Series A',
      location: 'Boston, MA',
      popularity: 88,
      matchScore: 87,
      logo: '📚'
    },
    {
      id: 6,
      title: 'Sustainable E-commerce Platform',
      founder: 'James Wilson',
      description: 'Eco-friendly marketplace with carbon-neutral shipping',
      fundingNeeded: 800000,
      fundingReceived: 300000,
      industry: 'E-commerce',
      fundingStage: 'Seed',
      location: 'Portland, OR',
      popularity: 79,
      matchScore: 84,
      logo: '🛍️'
    },
  ];

  // Filter ideas based on selected filters
  const filteredIdeas = allIdeas.filter(idea => {
    if (filters.industry && idea.industry !== filters.industry) return false;
    if (filters.fundingStage && idea.fundingStage !== filters.fundingStage) return false;
    if (filters.location && idea.location !== filters.location) return false;
    return true;
  });

  // Sort ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (filters.sortBy === 'popularity') return b.popularity - a.popularity;
    if (filters.sortBy === 'match') return b.matchScore - a.matchScore;
    if (filters.sortBy === 'recent') return b.id - a.id;
    return 0;
  });

  const toggleBookmark = (ideaId) => {
    setBookmarkedIdeas(prev =>
      prev.includes(ideaId)
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const displayedIdeas = activeTab === 'recommended'
    ? sortedIdeas
    : allIdeas.filter(idea => bookmarkedIdeas.includes(idea.id));

  const markNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="investor-feed">
      {/* Header with Notifications */}
      <header className="feed-header">
        <div className="header-content">
          <h1>Discover Ideas</h1>
          <p>Explore startup ideas matching your investment criteria</p>
        </div>
        <div className="header-actions">
          <div className="notification-bell">
            <button 
              className="bell-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                markNotificationsAsRead();
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notification-panel">
                <h3>Notifications</h3>
                {notifications.length > 0 ? (
                  <div className="notifications-list">
                    {notifications.map(notif => (
                      <div key={notif.id} className="notification-item">
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.timestamp}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>
            )}
          </div>
          <button 
            className="btn btn-profile"
            onClick={() => navigate('/investor-profile')}
          >
            👤 Profile
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-section">
        <button
          className={`tab ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended Feed
        </button>
        <button
          className={`tab ${activeTab === 'bookmarked' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarked')}
        >
          Bookmarked ({bookmarkedIdeas.length})
        </button>
      </div>

      <div className="feed-container">
        {/* Filters Sidebar */}
        {activeTab === 'recommended' && (
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              >
                <option value="">All Industries</option>
                <option value="AI/Tech">AI/Tech</option>
                <option value="Green Tech">Green Tech</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Funding Stage</label>
              <select
                value={filters.fundingStage}
                onChange={(e) => setFilters({ ...filters, fundingStage: e.target.value })}
              >
                <option value="">All Stages</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All Locations</option>
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="Austin, TX">Austin, TX</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Denver, CO">Denver, CO</option>
                <option value="Boston, MA">Boston, MA</option>
                <option value="Portland, OR">Portland, OR</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="popularity">Popularity</option>
                <option value="match">Match Score</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            <button 
              className="btn btn-reset"
              onClick={() => setFilters({
                industry: '',
                fundingStage: '',
                location: '',
                sortBy: 'popularity'
              })}
            >
              Reset Filters
            </button>
          </aside>
        )}

        {/* Ideas Feed */}
        <main className="ideas-feed">
          {displayedIdeas.length > 0 ? (
            <div className="ideas-list">
              {displayedIdeas.map(idea => (
                <div key={idea.id} className="idea-item">
                  <div className="idea-card">
                    <div className="idea-top">
                      <div className="idea-logo">{idea.logo}</div>
                      <button
                        className={`bookmark-btn ${bookmarkedIdeas.includes(idea.id) ? 'bookmarked' : ''}`}
                        onClick={() => toggleBookmark(idea.id)}
                        title="Bookmark idea"
                      >
                        {bookmarkedIdeas.includes(idea.id) ? '⭐' : '☆'}
                      </button>
                    </div>

                    <h3>{idea.title}</h3>
                    <p className="founder">By {idea.founder}</p>
                    <p className="description">{idea.description}</p>

                    <div className="idea-meta">
                      <span className="industry-tag">{idea.industry}</span>
                      <span className="stage-tag">{idea.fundingStage}</span>
                      <span className="location-tag">📍 {idea.location}</span>
                    </div>

                    <div className="funding-progress">
                      <div className="progress-info">
                        <span>Funding Progress</span>
                        <span className="progress-percent">
                          {Math.round((idea.fundingReceived / idea.fundingNeeded) * 100)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(idea.fundingReceived / idea.fundingNeeded) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="funding-amount">
                        ${(idea.fundingReceived / 1000).toFixed(0)}K / ${(idea.fundingNeeded / 1000).toFixed(0)}K
                      </div>
                    </div>

                    <div className="scores">
                      <div className="score">
                        <span className="score-label">Popularity</span>
                        <span className="score-value">{idea.popularity}%</span>
                      </div>
                      <div className="score">
                        <span className="score-label">Match with You</span>
                        <span className="score-value match">{idea.matchScore}%</span>
                      </div>
                    </div>

                    <button className="btn btn-invest">
                      View & Invest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-ideas">
              <p>No ideas found matching your filters.</p>
              <button 
                className="btn btn-reset"
                onClick={() => setFilters({
                  industry: '',
                  fundingStage: '',
                  location: '',
                  sortBy: 'popularity'
                })}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
