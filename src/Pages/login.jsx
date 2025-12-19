// src/Pages/login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./login.css";

export default function Login() {
  const [role, setRole] = useState("Investor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roleLabels = {
    Investor: "Investor",
    Founder: "Founder",
    Visitor: "Visitor",
  };

  // helper: wait for a session for up to timeoutMs
  async function waitForSession(timeoutMs = 8000, intervalMs = 300) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        // v2 shape: sessionData?.session
        const session = sessionData?.session ?? sessionData;
        if (session?.access_token || (sessionData && Object.keys(sessionData).length)) {
          return session;
        }
      } catch (e) {
        console.warn("waitForSession getSession error:", e);
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    if (!email.includes("@") || email.length < 5) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Sign in with Supabase v2
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        // common cases: wrong password, no user, email not confirmed
        setError(signInError.message || "Login failed. Check your credentials.");
        setLoading(false);
        return;
      }

      // Wait briefly for client to establish session so RLS will see auth.uid()
      const session = await waitForSession(8000, 300);
      if (!session) {
        // Could be email confirmation required (common) → guide the user
        setError(
          "Signed in but session not ready. If your account requires email confirmation, please confirm your email and then log in."
        );
        setLoading(false);
        return;
      }

      // Now get the user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Login succeeded but user info not available. Try again.");
        setLoading(false);
        return;
      }
      const userId = user.id;

      // Ensure a 'profiles' row exists for this user. Insert only if missing.
      const { data: existingProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("id, role, name")
        .eq("id", userId)
        .maybeSingle();

      if (profileErr) {
        console.warn("profiles query error:", profileErr);
        // Not fatal — attempt insert next if missing
      }

      if (!existingProfile) {
        // create profile with selected role
        const profileInsert = {
          id: userId,
          role: role.toLowerCase(),
          name: email.split("@")[0] || user.email?.split("@")[0] || "User",
        };

        const { error: insertErr } = await supabase
          .from("profiles")
          .insert(profileInsert, { returning: "representation" });

        if (insertErr) {
          // This is often the RLS error if session/auth not established; log the error and show message
          console.error("Profile insert error:", insertErr);
          setError(
            "Signed in but failed to create profile. If you recently signed up, confirm your email and log in to complete setup. Otherwise contact support."
          );
          setLoading(false);
          return;
        }
      } else {
        // profile exists — check role mismatch
        const normalizedExistingRole = (existingProfile.role || "").toLowerCase();
        const normalizedSelected = role.toLowerCase();
        if (normalizedExistingRole && normalizedExistingRole !== normalizedSelected) {
          setError(
            `Your account role is "${existingProfile.role}". To sign in as "${role}" choose the correct role or update your profile.`
          );
          setLoading(false);
          return;
        }
      }

      // Navigate to appropriate dashboard
      if (role === "Investor") {
        navigate("/investor-dashboard");
      } else if (role === "Founder") {
        navigate("/founder-dashboard");
      } else {
        navigate("/visitor");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
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
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="bottom-text">
            Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
          </p>

          <button className="btn-back" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>

        {/* Illustration column (keeps your design aesthetic) */}
        <div className="login-right" aria-hidden>

          <div className="illustration-blurb">
            <h3>Pitch Sphere</h3>
            <p>Sign in to access bottomless scope of ideas, analytics, and network with the right investors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
