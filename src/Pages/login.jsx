import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

/**
 * Login component — keeps original look & classes but adds:
 * - email/password state + validation
 * - role selection (Investor / Founder / Visitor)
 * - redirect to /investor-dashboard when Investor logs in
 * - a small illustration using the uploaded file path
 */
export default function Login() {
  const [role, setRole] = useState("Investor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roleLabels = {
    Investor: "Investor",
    Founder: "Founder",
    Visitor: "Visitor",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    if (!email.includes("@") || email.length < 5) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulated authentication (replace with real API call)
    // If role is Investor, navigate to investor dashboard
    if (role === "Investor") {
      // pass role via state if you want: navigate('/investor-dashboard', { state: { role } })
      navigate("/investor-dashboard");
    } else {
      // temporary behavior for Founder / Visitor
      alert(`Welcome, ${roleLabels[role]}! This feature is coming soon.`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Login to continue your journey</p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Role Selector */}
            <label className="label" htmlFor="role">
              Sign in as
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-dropdown"
              aria-label="Select role"
            >
              <option>Investor</option>
              <option>Founder</option>
              <option>Visitor</option>
            </select>

            {/* Email */}
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input-box"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            {/* Password */}
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input-box"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && <div className="error-message" role="alert">{error}</div>}

            {/* Login Button */}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="bottom-text">
            Don't have an account? <a href="#signup" className="signup-link">Sign Up</a>
          </p>

          <button className="btn-back" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>

        {/* Illustration column (keeps your design aesthetic) */}
        <div className="login-right" aria-hidden>
          <img
            src="/mnt/data/b0d490eb-6059-410f-ac94-7883322f9e38.png"
            alt="illustration"
            className="login-illustration"
          />
          <div className="illustration-blurb">
            <h3>Secure & Fast</h3>
            <p>Sign in to access tailored dashboards, analytics, and network with the right investors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
