import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

export default function Signup({ initialRole }) {
  const [role, setRole] = useState(initialRole || 'founder');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', proofProvided: false, proofDesc: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please complete all required fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    // Replace this with real submit logic
    const payload = { role, ...form };
    console.log('Sign up payload:', payload);
    alert(`Submitted sign up as ${role.toUpperCase()} — check console for payload`);
  }

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
            <h3 className="panel-title">CREATE AN ACCOUNT</h3>
          </div>

          <div className="form-row role-row">
            <label
              className={`role-option ${role === 'founder' ? 'selected' : ''}`}
              onClick={() => setRole('founder')}
            >
              <input type="radio" name="role" value="founder" checked={role === 'founder'} readOnly />
              FOUNDER
            </label>

            <label
              className={`role-option ${role === 'investor' ? 'selected' : ''}`}
              onClick={() => setRole('investor')}
            >
              <input type="radio" name="role" value="investor" checked={role === 'investor'} readOnly />
              INVESTOR
            </label>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                className="pill"
                name="name"
                placeholder={role === 'founder' ? 'FOUNDER NAME' : 'INVESTOR NAME'}
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <input
                className="pill"
                name="email"
                placeholder="EMAIL"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row small-row">
              <input
                className="pill"
                name="password"
                placeholder="PASSWORD"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-row small-row">
              <input
                className="pill"
                name="confirm"
                placeholder="CONFIRM PASSWORD"
                type="password"
                value={form.confirm}
                onChange={handleChange}
              />
            </div>

            {role === 'investor' && (
              <div className="proof-block">
                <label className="proof-checkbox">
                  <input name="proofProvided" type="checkbox" checked={form.proofProvided} onChange={handleChange} />
                  I can show proof of at least one past investment (optional)
                </label>

                {form.proofProvided && (
                  <div className="proof-fields">
                    <input
                      className="pill"
                      name="proofDesc"
                      placeholder="Brief description or link to proof"
                      value={form.proofDesc}
                      onChange={handleChange}
                    />
                    <small className="muted">(You may provide a link, file, or short description. This is optional.)</small>
                  </div>
                )}
              </div>
            )}

            {error && <div className="form-error">{error}</div>}

            <div className="form-row">
              <button className="btn-proceed" type="submit">CREATE ACCOUNT</button>
            </div>
          </form>

          <div className="back-row">
            <Link to="/" className="link-back">Already have an account? Sign in</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
