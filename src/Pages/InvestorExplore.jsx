import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './InvestorExplore.css';

export default function InvestorExplore() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 LOAD IDEAS
  useEffect(() => {
    async function loadIdeas() {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          title,
          industry,
          stage,
          funding_goal,
          profiles:founder_id ( name )
        `);

      if (!error) setIdeas(data || []);
      setLoading(false);
    }

    loadIdeas();
  }, []);

  // 🔹 INVEST HANDLER (NEW)
  const handleInvest = async (ideaId) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please login to invest');
      return;
    }

    const amount = prompt('Enter investment amount (₹)');

    if (!amount || isNaN(amount)) {
      alert('Invalid amount');
      return;
    }

    const { error } = await supabase.from('investments').insert({
      idea_id: ideaId,
      investor_id: user.id,
      amount: Number(amount)
    });

    if (error) {
      console.error('INVEST ERROR:', error);
      alert(error.message);
    } else {
      alert('Investment successful 🚀');
    }
  };

  if (loading) return <p className="loading">Loading ideas…</p>;

  return (
    <div className="investor-explore">
      <h1>Available Ideas to Invest In</h1>

      <div className="ideas-grid">
        {ideas.map((idea) => (
          <div key={idea.id} className="idea-card">
            <h3>{idea.title}</h3>
            <p><strong>Founder:</strong> {idea.profiles?.name || 'Unknown'}</p>
            <p><strong>Industry:</strong> {idea.industry}</p>
            <p><strong>Stage:</strong> {idea.stage}</p>
            <p><strong>Funding Goal:</strong> ₹{idea.funding_goal}</p>

            {/* 🔹 INVEST BUTTON NOW WORKS */}
            <button
              className="btn-invest"
              onClick={() => handleInvest(idea.id)}
            >
              Invest
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
