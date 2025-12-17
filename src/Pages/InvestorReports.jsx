import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./InvestorReports.css";

export default function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    totalInvested: 0,
    totalIdeas: 0,
    totalReturns: 0,
    investments: []
  });

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data: investments, error } = await supabase
          .from("investments")
          .select(`
            id,
            amount,
            created_at,
            ideas(title)
          `)
          .eq("investor_id", user.id);

        if (error) throw error;

        const totalInvested = investments.reduce(
          (sum, inv) => sum + Number(inv.amount || 0),
          0
        );

        const totalReturns = Math.round(totalInvested * 0.12); // placeholder logic
        const totalIdeas = new Set(
          investments.map((i) => i.ideas?.title)
        ).size;

        setReportData({
          totalInvested,
          totalIdeas,
          totalReturns,
          investments
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <h1>Investment Reports</h1>
          <p>Analyze your investments and performance</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </header>

      {loading && <p className="loading">Loading reports…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <section className="report-summary">
            <div className="summary-card">
              <h3>Total Invested</h3>
              <p>₹{reportData.totalInvested.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>Active Ideas</h3>
              <p>{reportData.totalIdeas}</p>
            </div>
            <div className="summary-card highlight">
              <h3>Estimated Returns</h3>
              <p>₹{reportData.totalReturns.toLocaleString()}</p>
            </div>
          </section>

          {/* Investment Table */}
          <section className="report-table-section">
            <h2>Investment Breakdown</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.investments.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.ideas?.title || "Startup"}</td>
                    <td>₹{Number(inv.amount).toLocaleString()}</td>
                    <td>
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
