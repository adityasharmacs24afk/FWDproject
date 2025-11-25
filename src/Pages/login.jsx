import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [role, setRole] = useState("Investor");

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Login to continue your journey</p>

        {/* Role Selector */}
        <div className="role-select">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-dropdown"
          >
            <option>Investor</option>
            <option>Founder</option>
            <option>Visitor</option>
          </select>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="input-box"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter your password"
          className="input-box"
        />

        {/* Login Button */}
        <button className="login-btn">Login</button>

        <p className="bottom-text">
          Don't have an account? <a href="#" className="signup-link">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
