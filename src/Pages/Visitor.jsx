// src/Pages/Visitor.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./visitor.css";
import { useNavigate } from "react-router-dom";

export default function Visitor() {
  const navigate = useNavigate();

  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [recommendedIdeas, setRecommendedIdeas] = useState([]);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVoteMap, setUserVoteMap] = useState({}); // { idea_id: vote }
  const [countsMap, setCountsMap] = useState({}); // { idea_id: { upvotes, downvotes, score } }

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);

      try {
        // 1) fetch ideas
        const { data: ideas, error: ideasErr } = await supabase
          .from("ideas")
          .select("id, title, industry, description, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        if (ideasErr) throw ideasErr;

        // 2) fetch vote counts from view
        const ideaIds = (ideas || []).map((i) => i.id);
        let counts = [];
        if (ideaIds.length > 0) {
          const { data: cntData } = await supabase
            .from("idea_vote_counts")
            .select("idea_id, upvotes, downvotes, score")
            .in("idea_id", ideaIds);
          counts = cntData || [];
        }

        const cMap = {};
        (counts || []).forEach((r) => {
          cMap[r.idea_id] = {
            upvotes: r.upvotes || 0,
            downvotes: r.downvotes || 0,
            score: r.score || 0,
          };
        });

        // 3) get current user and their votes (if signed in)
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user ?? null; // ✅ correct shape

        let voteMap = {};
        if (user && ideaIds.length > 0) {
          const { data: myVotes } = await supabase
            .from("idea_votes")
            .select("idea_id, vote")
            .in("idea_id", ideaIds)
            .eq("user_id", user.id);

          (myVotes || []).forEach((v) => {
            voteMap[v.idea_id] = v.vote;
          });
        }

        // 4) Build sections
        const sortedByScore = (ideas || []).slice().sort((a, b) => {
          const sa = cMap[a.id]?.score || 0;
          const sb = cMap[b.id]?.score || 0;
          if (sb !== sa) return sb - sa;
          return new Date(b.created_at) - new Date(a.created_at);
        });

        const trending = sortedByScore.slice(0, 3);
        const recommended = sortedByScore.slice(3, 6);
        const recent = (ideas || [])
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);

        if (mounted) {
          setCountsMap(cMap);
          setUserVoteMap(voteMap);
          setTrendingIdeas(trending);
          setRecommendedIdeas(recommended);
          setRecentIdeas(recent);
        }
      } catch (err) {
        console.error("Failed to load visitor data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // voteValue: 1 upvote, -1 downvote, 0 remove
  async function handleVote(ideaId, voteValue) {
    try {
      // check auth
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user ?? null; // ✅ correct shape
      if (!user) {
        alert("Please login to vote.");
        navigate("/login");
        return;
      }

      // Remove vote
      if (voteValue === 0) {
        const { error: delErr } = await supabase
          .from("idea_votes")
          .delete()
          .match({ idea_id: ideaId, user_id: user.id });

        if (delErr) {
          console.error("Delete vote error", delErr);
        } else {
          setUserVoteMap((m) => {
            const nm = { ...m };
            delete nm[ideaId];
            return nm;
          });
          await refreshCountsForIdea(ideaId);
        }
        return;
      }

      // Upsert vote
      const { error } = await supabase
        .from("idea_votes")
        .upsert(
          { idea_id: ideaId, user_id: user.id, vote: voteValue },
          { onConflict: ["idea_id", "user_id"] }
        );

      if (error) {
        console.error("Vote upsert error", error);
        if (error.message && error.message.includes("row-level security")) {
          alert("Permission error: please login and try again.");
        }
      } else {
        setUserVoteMap((m) => ({ ...m, [ideaId]: voteValue }));
        await refreshCountsForIdea(ideaId);
      }
    } catch (e) {
      console.error("handleVote error", e);
    }
  }

  async function refreshCountsForIdea(ideaId) {
    try {
      const { data } = await supabase
        .from("idea_vote_counts")
        .select("idea_id, upvotes, downvotes, score")
        .eq("idea_id", ideaId)
        .single();
      if (data) {
        setCountsMap((m) => ({
          ...m,
          [ideaId]: {
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            score: data.score || 0,
          },
        }));
      }
    } catch (e) {
      console.error("refreshCountsForIdea error", e);
    }
  }

  const renderIdeaCard = (idea) => {
    const counts = countsMap[idea.id] || {
      upvotes: 0,
      downvotes: 0,
      score: 0,
    };
    const myVote = userVoteMap[idea.id] || 0;

    return (
      <div key={idea.id} className="idea-card">
        <h3>{idea.title}</h3>
        <p className="industry-tag">{idea.industry}</p>
        <p className="summary">{idea.description?.slice(0, 140) ?? ""}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="view-btn"
              onClick={() => navigate(`/idea/${idea.id}`)}
            >
              View Idea
            </button>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                className={`vote-btn up ${myVote === 1 ? "active" : ""}`}
                onClick={() => handleVote(idea.id, myVote === 1 ? 0 : 1)}
                aria-label="Upvote"
              >
                ▲
              </button>
              <span>{counts.upvotes}</span>

              <button
                className={`vote-btn down ${myVote === -1 ? "active" : ""}`}
                onClick={() => handleVote(idea.id, myVote === -1 ? 0 : -1)}
                aria-label="Downvote"
              >
                ▼
              </button>
              <span>{counts.downvotes}</span>

              <span style={{ marginLeft: 10, fontWeight: 600 }}>
                Score: {counts.score}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="visitor-wrapper">
      <section className="visitor-hero">
        <h1>Discover Startups to Invest</h1>
        <p>Browse trending and exciting ideas to Invest.</p>
        <a href="/signup" className="btn-primary">
          Join Now
        </a>
      </section>

      <section className="section-block">
        <h2 className="section-title">🔥 Trending Ideas</h2>
        <div className="ideas-grid">
          {loading ? (
            <p>Loading...</p>
          ) : trendingIdeas.length ? (
            trendingIdeas.map(renderIdeaCard)
          ) : (
            <p>No trending ideas yet</p>
          )}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title">🌟 You Might Be Interested In</h2>
        <div className="ideas-grid">
          {loading ? (
            <p>Loading...</p>
          ) : recommendedIdeas.length ? (
            recommendedIdeas.map(renderIdeaCard)
          ) : (
            <p>No recommendations yet</p>
          )}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title">🆕 Recently Added</h2>
        <div className="ideas-grid">
          {loading ? (
            <p>Loading...</p>
          ) : recentIdeas.length ? (
            recentIdeas.map(renderIdeaCard)
          ) : (
            <p>No recent ideas</p>
          )}
        </div>
      </section>

      <section className="visitor-cta">
        <h2>Want to Share Your Own Idea?</h2>
        <p>Join the platform and pitch your startup to investors.</p>
        <a href="/signup" className="btn-primary">
          Create Account
        </a>
      </section>
    </div>
  );
}
