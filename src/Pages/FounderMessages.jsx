import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './FounderDashboard.css'; // reuse styles

export default function FounderMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          profiles:sender_id ( name ),
          ideas:idea_id ( title )
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setMessages(data || []);
      }

      setLoading(false);
    }

    loadMessages();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading messages…</p>;

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <header className="top-header">
          <h1>Messages from Investors</h1>
          <p>All communication related to your startups</p>
        </header>

        <section className="content-section">
          {messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            <div className="ideas-grid">
              {messages.map(msg => (
                <div key={msg.id} className="idea-card">
                  <h3>{msg.profiles?.name || 'Investor'}</h3>
                  <p>
                    <strong>Startup:</strong>{' '}
                    {msg.ideas?.title || 'Unknown'}
                  </p>
                  <p>{msg.content}</p>
                  <small style={{ color: '#6b7280' }}>
                    {new Date(msg.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
