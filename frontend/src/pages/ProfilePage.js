import React, { useState } from 'react';
import { updateUser, deleteUser } from '../api';
export default function ProfilePage({ user, setUser, setPage }) {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  if (!user) {
    return (
        <div style={page}>
          <div style={center}>
            <p>Please sign in to view profile.</p>
            <button style={btn} onClick={() => setPage('login')}>Sign In</button>
          </div>
        </div>
    );
  }

  async function handleSave() {
    setError('');
    setSuccess('');
    setLoading(true);

    const data = {};
    if (name && name !== user.name) data.name = name;
    if (email && email !== user.email) data.email = email;

    if (Object.keys(data).length === 0) {
      setError('Nothing to update');
      setLoading(false);
      return;
    }

    const res = await updateUser(user.id, data);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setUser(res);
    setSuccess('Profile updated successfully');
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    setDeleting(true);
    const res = await deleteUser(user.id);
    setDeleting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    localStorage.removeItem('token');
    setUser(null);
    setPage('home');
  }

  return (
      <div style={page}>
        <div style={card}>

          <h1 style={title}>My Profile</h1>

          <div style={avatar}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          {error && <div style={errorBox}>{error}</div>}
          {success && <div style={successBox}>{success}</div>}

          <div style={group}>
            <label style={label}>Full Name</label>
            <input
                style={input}
                value={name}
                onChange={e => setName(e.target.value)}
            />
          </div>

          <div style={group}>
            <label style={label}>Email</label>
            <input
                style={input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div style={actions}>
            <button style={saveBtn} onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button style={myListingsBtn} onClick={() => setPage('my-listings')}>
              My Listings
            </button>
          </div>

          <button style={deleteAccountBtn} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>

        </div>
      </div>
  );
}
const page = {
  minHeight: '100vh',
  background: '#f9fafb',
  display: 'flex',
  justifyContent: 'center',
  padding: '32px 20px',
};

const card = {
  background: 'white',
  borderRadius: 12,
  padding: '32px 28px',
  width: '100%',
  maxWidth: 460,
  border: '1px solid #e5e7eb',
  height: 'fit-content',
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 20px',
};

const avatar = {
  width: 64,
  height: 64,
  background: '#2563eb',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 26,
  fontWeight: 700,
  margin: '0 auto 24px',
};

const errorBox = {
  background: '#fef2f2',
  color: '#ef4444',
  padding: '10px 12px',
  borderRadius: 7,
  fontSize: 14,
  marginBottom: 16,
};

const successBox = {
  background: '#f0fdf4',
  color: '#16a34a',
  padding: '10px 12px',
  borderRadius: 7,
  fontSize: 14,
  marginBottom: 16,
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

const actions = {
  display: 'flex',
  gap: 10,
};

const saveBtn = {
  flex: 1,
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: 11,
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const myListingsBtn = {
  flex: 1,
  background: '#f3f4f6',
  color: '#374151',
  border: 'none',
  padding: 11,
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const btn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 12,
};

const center = {
  textAlign: 'center',
  padding: 60,
  color: '#9ca3af',
};

const deleteAccountBtn = {
  width: '100%',
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: 11,
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 10,
};
