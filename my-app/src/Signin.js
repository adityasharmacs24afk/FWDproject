import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signin.css';

export default function Signin() {
  const [role, setRole] = useState('investor');

  return (
    <div className="ps-page">
      <div className="ps-hero">
        <div className="brand">
          <h1 className="brand-title">PITCH
            <span className="arrows">&gt;&gt;</span>
            <br />SPHERE</h1>
          <p className="brand-sub">CREATE. EMPOWER. SUSTAINABLY.</p>
        </div>
        <div className="bg-sphere" />
      </div>

      <aside className="ps-panel">
        <div className="panel-inner">
          <div className="panel-top">
            <div className="panel-logo">&gt;&gt;</div>
            <h3 className="panel-title">SIGN IN TO CONTINUE</h3>
          </div>

          {/* Role selector - Investor / Founder */}
          <div className="form-row role-row">
            <label
              className={`role-option ${role === 'investor' ? 'selected' : ''}`}
              onClick={() => setRole('investor')}
            >
              <input type="radio" name="role" value="investor" checked={role === 'investor'} readOnly />
              INVESTOR
            </label>

            <label
              className={`role-option ${role === 'founder' ? 'selected' : ''}`}
              onClick={() => setRole('founder')}
            >
              <input type="radio" name="role" value="founder" checked={role === 'founder'} readOnly />
              FOUNDER
            </label>
          </div>

          <div className="form-row">
            <input className="pill" placeholder="ENTER EMAIL OR USERNAME" />
          </div>
          <div className="form-row small-row">
            <input className="pill" placeholder="ENTER PASSWORD" type="password" />
            <button
              className="btn-proceed"
              onClick={() => console.log('Proceeding sign-in as:', role)}
            >
              PROCEED
            </button>
          </div>

          <div className="or-get">OR GET STARTED TODAY !</div>

          <div className="signup-choices">
            <Link to="/signup/founder" className="btn-cta">JOIN AS FOUNDER</Link>
            <Link to="/signup/investor" className="btn-cta secondary">JOIN AS INVESTOR</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
