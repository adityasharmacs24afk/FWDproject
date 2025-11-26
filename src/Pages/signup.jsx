import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Investor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLabels = {
    Investor: "investor",
    Founder: "founder",
    Visitor: "visitor",
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill email and password.");
      return;
    }

    setLoading(true);

    try {
      // 1) sign up
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpErr) {
        console.error("signUpErr:", signUpErr);
        setError(signUpErr.message || "Signup failed.");
        setLoading(false);
        return;
      }

      // 2) try immediate sign-in to obtain session (works if email confirmation not required)
      let user = signUpData?.user ?? null;

      try {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInErr) {
          // Most projects require email confirmation by default — if sign-in fails,
          // instruct the user to confirm email and stop.
          console.warn("Immediate sign-in failed:", signInErr);
          setError(
            "Signup created. Please confirm your email (check your inbox) and then log in to complete your profile."
          );
          setLoading(false);
          return;
        }

        user = signInData?.user ?? user;
      } catch (signinEx) {
        console.warn("signInWithPassword exception:", signinEx);
      }

      // 3) verify session & user are available
      const { data: sessionData } = await supabase.auth.getSession();
      const { data: userData } = await supabase.auth.getUser();

      const sessionUser = userData?.user ?? user;
      if (!sessionUser) {
        console.warn("No authenticated user/session after sign-up/sign-in attempts:", { sessionData, userData });
        setError("Signup succeeded but unable to obtain authenticated session. Please log in after confirming your email.");
        setLoading(false);
        return;
      }
      user = sessionUser;

      // 4) insert profiles row (RLS requires auth.uid() = id; we now have a session)
      const profilePayload = {
        id: user.id,
        role: roleLabels[role],
        name: email.split("@")[0],
        bio: null,
      };

      const { error: profileErr } = await supabase.from("profiles").insert(profilePayload);
      if (profileErr) {
        console.error("profileErr:", profileErr);
        setError("Failed to create profile: " + profileErr.message);
        setLoading(false);
        return;
      }

      // success
      alert("Signup successful! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(err?.message ?? "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join the platform — choose a role to get started</p>

        <form className="signup-form" onSubmit={handleSignup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label>Register As</label>
          <div className="role-options">
            <label className={`role-chip ${role === "Investor" ? "active" : ""}`}>
              <input
                type="radio"
                name="role"
                value="Investor"
                checked={role === "Investor"}
                onChange={() => setRole("Investor")}
              />
              Investor
            </label>

            <label className={`role-chip ${role === "Founder" ? "active" : ""}`}>
              <input
                type="radio"
                name="role"
                value="Founder"
                checked={role === "Founder"}
                onChange={() => setRole("Founder")}
              />
              Founder
            </label>

            <label className={`role-chip ${role === "Visitor" ? "active" : ""}`}>
              <input
                type="radio"
                name="role"
                value="Visitor"
                checked={role === "Visitor"}
                onChange={() => setRole("Visitor")}
              />
              Visitor
            </label>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}
