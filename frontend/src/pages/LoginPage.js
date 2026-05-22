import React, { useState } from 'react';
import { loginUser } from '../api';

export default function LoginPage({ onLogin, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    localStorage.setItem('token', res.token);
    onLogin(res.user);
  }

  return (
    <div style={page}>
      <div style={card}>

        <h1 style={title}>Sign In</h1>
        <p style={sub}>Welcome back to Marketplace</p>

        {error && <div style={errorBox}>{error}</div>}

        <div style={group}>
          <label style={label}>Email</label>
          <input
            style={input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div style={group}>
          <label style={label}>Password</label>
          <input
            style={input}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button style={submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={footer}>
          No account?{' '}
          <span style={link} onClick={() => setPage('register')}>
            Register here
          </span>
        </p>

      </div>
    </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#f9fafb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const card = {
  background: 'white',
  borderRadius: 12,
  padding: '36px 30px',
  width: '100%',
  maxWidth: 400,
  border: '1px solid #e5e7eb',
};

const title = {
  fontSize: 26,
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 6px',
};

const sub = {
  fontSize: 14,
  color: '#9ca3af',
  margin: '0 0 28px',
};

const errorBox = {
  background: '#fef2f2',
  color: '#ef4444',
  padding: '10px 12px',
  borderRadius: 7,
  fontSize: 14,
  marginBottom: 18,
};

const group = {
  marginBottom: 16,
};

const label = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
};

const input = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const submitBtn = {
  width: '100%',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: 12,
  borderRadius: 7,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 6,
};

const footer = {
  fontSize: 14,
  color: '#6b7280',
  textAlign: 'center',
  marginTop: 18,
};

const link = {
  color: '#2563eb',
  cursor: 'pointer',
  fontWeight: 600,
};
