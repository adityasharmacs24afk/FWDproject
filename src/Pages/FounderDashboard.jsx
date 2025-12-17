import React, { useState, useEffect } from 'react';
import './FounderDashboard.css';
import {
  FaRocket, FaUsers, FaPlus, FaBell,
  FaUserCircle, FaLightbulb, FaTimes, FaMoneyBillWave
} from 'react-icons/fa';
import { supabase } from "../lib/supabaseClient";

const FounderDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('pitches');
  const [ideas, setIdeas] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);

  const [myInvestors, setMyInvestors] = useState([]);
  const [exploreList, setExploreList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [founderName, setFounderName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newPitch, setNewPitch] = useState({
    title: '', industry: 'FinTech', goal: '', description: ''
  });

  // -------------------------
  // LOAD DASHBOARD DATA
  // -------------------------
  useEffect(() => {
  async function checkSession() {
    const { data, error } = await supabase.auth.getSession();
    console.log("SUPABASE SESSION:", data?.session);
    console.log("SUPABASE USER:", data?.session?.user);
  }

  checkSession();
}, []);

  useEffect(() => {
    async function loadFounderDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Founder profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      setFounderName(profile?.name || 'Founder');

      // My ideas
      const { data: myIdeas } = await supabase
        .from('ideas')
        .select('*')
        .eq('founder_id', user.id);

      setIdeas(myIdeas || []);
      if (myIdeas && myIdeas.length > 0) {
  const { data: investments, error } = await supabase
    .from('investments')
    .select('amount')
    .in('idea_id', myIdeas.map(i => i.id))
    .eq('payment_status', 'success');

  if (!error) {
    const sum = (investments || []).reduce(
      (total, inv) => total + Number(inv.amount || 0),
      0
    );
    setTotalRaised(sum);
  }
}


      // My investors (from investments table)
      if (myIdeas && myIdeas.length > 0) {
const { data: investors, error } = await supabase
  .from('investments')
  .select('*')
  .in('idea_id', myIdeas.map(i => i.id));

console.log("RAW INVESTORS:", investors);


if (error) {
  console.error('INVESTOR FETCH ERROR:', error);
}


if (!error) {
  setMyInvestors(
    (investors || []).map((inv) => ({
      id: inv.id,
      name: inv.investor?.name,
      startup: inv.idea?.title,
      amount: inv.amount,
      date: new Date(inv.created_at).toDateString()
    }))
  );
}

      } else {
        setMyInvestors([]);
      }

      // Explore (other founders’ ideas)
      const { data: exploreIdeas } = await supabase
        .from('ideas')
        .select('id, title, industry')
        .neq('founder_id', user.id)
        .limit(6);

      setExploreList(
        (exploreIdeas || []).map(i => ({
          id: i.id,
          name: i.title,
          industry: i.industry,
          lookingFor: 'Collaboration'
        }))
      );

      // Notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setNotificationsList(
        (notifs || []).map(n => ({
          id: n.id,
          text: n.message,
          time: new Date(n.created_at).toLocaleString()
        }))
      );
    }

    loadFounderDashboard();
  }, []);

  // -------------------------
  // HELPERS
  // -------------------------
  const formatRupee = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPitch({ ...newPitch, [name]: value });
  };

  // -------------------------
  // SUBMIT NEW PITCH
  // -------------------------
const handleSubmit = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    alert("User not logged in");
    return;
  }

  const { error } = await supabase.from('ideas').insert({
    founder_id: user.id,              // REQUIRED
    title: newPitch.title,            // REQUIRED
    description: newPitch.description || '',
    industry: newPitch.industry,
    funding_goal: Number(newPitch.goal),

    // 🔥 THESE ARE REQUIRED BY YOUR TABLE
    stage: 'idea',
    status: 'review',
    total_raised: 0
  });

  if (error) {
    console.error('INSERT ERROR:', error);
    alert(error.message);
    return;
  }

  // close modal + refresh
  setShowModal(false);
};


  // -------------------------
  // RENDER CONTENT (UNCHANGED UI)
  // -------------------------
  const renderContent = () => {
    switch (activeTab) {
      case 'pitches':
        return (
          <>
            <section className="stats-row">
              <div className="stat-card">
                <h3>Total Ideas Posted</h3>
                <p className="stat-number">{ideas.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Funds Raised</h3>
                <p className="stat-number highlight">
  {formatRupee(totalRaised)}
</p>

              </div>
              <div className="stat-card">
                <h3>Investor Interest</h3>
                <p className="stat-number">High 🚀</p>
              </div>
            </section>

            <section className="content-section">
              <div className="section-header"><h2>Your Active Pitches</h2></div>
              <div className="ideas-grid">
                {ideas.map((idea) => (
                  <div key={idea.id} className="idea-card">
                    <div className="card-top">
                      <span className={`badge ${idea.status.toLowerCase()}`}>{idea.status}</span>
                      <span className="industry">{idea.industry}</span>
                    </div>
                    <h3>{idea.title}</h3>
                    <p className="stage">Current Stage: <strong>{idea.stage}</strong></p>

                    <div className="funding-bar">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280' }}>
                        <span>{formatRupee(idea.total_raised)}</span>
                        <span>{formatRupee(idea.funding_goal)}</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(
                              100,
                              (idea.total_raised / idea.funding_goal) * 100
                            )}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="card-footer">
                      <span style={{ fontWeight: '600', color: '#6d28d9' }}>Live</span>
                      <button className="btn-outline">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );

      case 'investors':
        return (
          <section className="content-section">
            <div className="section-header"><h2>Your Backers (Investors)</h2></div>
            <div className="ideas-grid">
              {myInvestors.map(inv => (
                <div key={inv.id} className="idea-card" style={{ borderLeft: '5px solid #6d28d9' }}>
                  <div className="card-top">
                    <span className="industry" style={{ background: '#d1fae5', color: '#065f46' }}>
                      <FaMoneyBillWave /> Funded
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{inv.date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem' }}>{inv.name}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '15px' }}>
                    Invested in:<br /><strong>{inv.startup}</strong>
                  </p>

                  <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280' }}>Amount Invested</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6d28d9' }}>
                      {formatRupee(inv.amount)}
                    </span>
                  </div>

                  <div className="card-footer" style={{ justifyContent: 'center' }}>
                    <button className="btn-outline" style={{ width: '100%' }}>
                      Message Investor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'explore':
        return (
          <section className="content-section">
            <div className="section-header"><h2>Collaborate with Startups</h2></div>
            <div className="ideas-grid">
              {exploreList.map(item => (
                <div key={item.id} className="idea-card">
                  <div className="card-top"><span className="industry">{item.industry}</span></div>
                  <h3>{item.name}</h3>
                  <p style={{ color: '#6b7280' }}>
                    Looking for: <strong>{item.lookingFor}</strong>
                  </p>
                  <div className="card-footer" style={{ justifyContent: 'center' }}>
                    <button className="btn-outline" style={{ width: '100%' }}>
                      Request Collab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'notifications':
        return (
          <section className="content-section">
            <div className="section-header"><h2>Recent Activity</h2></div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              {notificationsList.map(notif => (
                <div
                  key={notif.id}
                  style={{
                    padding: '15px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ background: '#f3e8ff', padding: '10px', borderRadius: '50%', color: '#6d28d9' }}>
                    <FaBell />
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '4px' }}>{notif.text}</p>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // -------------------------
  // JSX (UNCHANGED)
  // -------------------------
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-circle"><div className="inner-circle"></div></div>
          <h2>Pitch Sphere</h2>
        </div>

        <nav className="nav-links">
          <button className={`nav-btn ${activeTab === 'pitches' ? 'active' : ''}`} onClick={() => setActiveTab('pitches')}>
            <FaRocket /> My Pitches
          </button>
          <button className={`nav-btn ${activeTab === 'investors' ? 'active' : ''}`} onClick={() => setActiveTab('investors')}>
            <FaUsers /> My Investors
          </button>
          <button className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
            <FaLightbulb /> Explore
          </button>
          <button className={`nav-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <FaBell /> Notifications
          </button>
        </nav>

        <div className="user-profile-mini">
          <FaUserCircle size={28} color="#6d28d9" />
          <span>{founderName}</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 style={{ color: '#1f2937', fontSize: '2.5rem' }}>
              {activeTab === 'pitches'
                ? 'Founder Dashboard'
                : activeTab === 'investors'
                ? 'Investment Portfolio'
                : activeTab === 'explore'
                ? 'Explore & Collaborate'
                : 'Notifications'}
            </h1>
            <p style={{ color: '#6b7280' }}>Welcome back, oversee your startups here.</p>
          </div>

          <div className="header-actions">
            {activeTab === 'pitches' && (
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus /> Pitch New Idea
              </button>
            )}
          </div>
        </header>

        {renderContent()}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>🚀 Pitch Your Startup</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <form className="pitch-form">
                <div className="form-group">
                  <label>Startup Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newPitch.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <select
                    name="industry"
                    value={newPitch.industry}
                    onChange={handleInputChange}
                  >
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="AgriTech">AgriTech</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Funding Goal (₹)</label>
                  <input
                    type="number"
                    name="goal"
                    value={newPitch.goal}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Elevator Pitch</label>
                  <textarea
                    rows="4"
                    name="description"
                    value={newPitch.description}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleSubmit}
                >
                  Submit Pitch
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FounderDashboard;
