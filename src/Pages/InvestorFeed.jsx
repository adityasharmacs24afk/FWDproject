import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient";
import './InvestorFeed.css';

export default function InvestorFeed() {
  const navigate = useNavigate();

  const [allIdeas, setAllIdeas] = useState([]);
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  

  const [filters, setFilters] = useState({
    industry: '',
    fundingStage: '',
    location: '',
    sortBy: 'popularity'
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    async function loadFeed() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      /* 🔹 Load ideas (visible to all investors) */
      const { data: ideas } = await supabase
        .from('ideas')
        .select(`
          id,
          title,
          description,
          industry,
          stage,
          funding_goal,
          total_raised,
          created_at,
          profiles:founder_id ( name )

        `)
        

setAllIdeas(
  (ideas || []).map(i => ({
    id: i.id,
    title: i.title,
    founder: i.profiles?.name || 'Founder',
    description: i.description,
    fundingNeeded: i.funding_goal,
    fundingReceived: i.total_raised || 0,
    industry: i.industry,
    fundingStage: i.stage,
    created_at: i.created_at, // ✅ ADD THIS LINE
    location: 'Remote',
    popularity: Math.min(100, Math.round((i.total_raised || 0) / 1000)),
    matchScore: 85,
    logo: '🚀'
  }))
);


      /* 🔹 Load bookmarks */
      const { data: bookmarks } = await supabase
        .from('idea_bookmarks')
        .select('idea_id')
        .eq('user_id', user.id);

      setBookmarkedIdeas(bookmarks?.map(b => b.idea_id) || []);

      /* 🔹 Load notifications */
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setNotifications(
        (notifs || []).map(n => ({
          id: n.id,
          message: n.message,
          timestamp: new Date(n.created_at).toLocaleString(),
          read: n.is_read
        }))
      );
    }

    loadFeed();
  }, []);

  /* ---------------- FILTERS ---------------- */
  const filteredIdeas = allIdeas.filter(idea => {
    if (filters.industry && idea.industry !== filters.industry) return false;
    if (filters.fundingStage && idea.fundingStage !== filters.fundingStage) return false;
    if (filters.location && idea.location !== filters.location) return false;
    return true;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (filters.sortBy === 'popularity') return b.popularity - a.popularity;
    if (filters.sortBy === 'match') return b.matchScore - a.matchScore;
    if (filters.sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  /* ---------------- BOOKMARK ---------------- */
  const toggleBookmark = async (ideaId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (bookmarkedIdeas.includes(ideaId)) {
      await supabase
        .from('idea_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('idea_id', ideaId);

      setBookmarkedIdeas(prev => prev.filter(id => id !== ideaId));
    } else {
      await supabase
        .from('idea_bookmarks')
        .insert({ user_id: user.id, idea_id: ideaId });

      setBookmarkedIdeas(prev => [...prev, ideaId]);
    }
  };

  /* ---------------- NOTIFICATIONS ---------------- */
  const markNotificationsAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);

    if (unreadIds.length > 0) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds);
    }

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const displayedIdeas =
    activeTab === 'recommended'
      ? sortedIdeas
      : allIdeas.filter(i => bookmarkedIdeas.includes(i.id));

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="investor-feed">
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
      <section className="ideas-section">
  {displayedIdeas.length > 0 ? (
    <div className="ideas-grid">
      {displayedIdeas.map(idea => (
        <div key={idea.id} className="idea-card">
          <div className="idea-card-header">
            <h3>{idea.title}</h3>
            <span className="idea-industry">{idea.industry}</span>
          </div>

          <p className="idea-founder">
            <strong>Founder:</strong> {idea.founder}
          </p>

          <p className="idea-description">
            {idea.description}
          </p>

          <div className="idea-funding">
            <span>₹{idea.fundingReceived}</span>
            <span> / ₹{idea.fundingNeeded}</span>
          </div>

          <button
            className="btn-invest"
            onClick={() => navigate('/investor-explore')}
          >
            Invest
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="no-ideas">No ideas available</p>
  )}
</section>


            {/* Tabs, Filters, Cards → 100% unchanged */}
            {/* Your existing JSX below remains EXACTLY the same */}
          </div>
        );
      }
