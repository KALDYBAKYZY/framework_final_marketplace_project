import React, { useState } from 'react';
import { registerUser } from '../api';

export default function RegisterPage({ setPage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name || !email || !password) {
      setError('Name, email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    const res = await registerUser(name, email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div style={page}>
        <div style={card}>
          <div style={successCircle}>✓</div>
          <h2 style={title}>Account Created!</h2>
          <p style={sub}>You can now sign in</p>
          <button style={submitBtn} onClick={() => setPage('login')}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={card}>

        <h1 style={title}>Create Account</h1>
        <p style={sub}>Join the marketplace today</p>

        {error && <div style={errorBox}>{error}</div>}

        <div style={group}>
          <label style={label}>Full Name</label>
          <input
            style={input}
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div style={group}>
          <label style={label}>Email</label>
          <input
            style={input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={group}>
          <label style={label}>Password</label>
          <input
            style={input}
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button style={submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <p style={footer}>
          Already have an account?{' '}
          <span style={link} onClick={() => setPage('login')}>
            Sign in
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

const successCircle = {
  width: 52,
  height: 52,
  background: '#dcfce7',
  color: '#16a34a',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  fontWeight: 700,
  margin: '0 auto 18px',
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
  background: '#ec4899',
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
  color: '#ec4899',
  cursor: 'pointer',
  fontWeight: 600,
};
