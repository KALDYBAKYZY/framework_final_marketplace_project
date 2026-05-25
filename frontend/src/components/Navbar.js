import React from 'react';

export default function Navbar({ user, page, setPage, onLogout }) {
  return (
    <nav style={nav}>
      <div style={inner}>
        <span style={logo} onClick={() => setPage('home')}>
          Marketplace
        </span>

        <div style={links}>
          <button style={page === 'home' ? activeBtn : btn} onClick={() => setPage('home')}>
            Home
          </button>
          {user && (
            <>
              <button style={page === 'categories' ? activeBtn : btn} onClick={() => setPage('categories')}>
                Categories
              </button>
              <button style={page === 'my-listings' ? activeBtn : btn} onClick={() => setPage('my-listings')}>
                My Listings
              </button>
              <button style={page === 'orders' ? activeBtn : btn} onClick={() => setPage('orders')}>
                My Orders
              </button>
              <button style={page === 'profile' ? activeBtn : btn} onClick={() => setPage('profile')}>
                Profile
              </button>
              {user.role === 'admin' && (
                <button style={page === 'admin-categories' ? activeBtn : adminBtn} onClick={() => setPage('admin-categories')}>
                  Admin
                </button>
              )}
            </>
          )}
        </div>

        <div style={actions}>
          {user ? (
            <>
              <button style={postBtn} onClick={() => setPage('create-product')}>
                + Post Item
              </button>
              <span style={userName}>{user.name}</span>
              {user.role === 'admin' && <span style={roleBadge}>admin</span>}
              <button style={logoutBtn} onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button style={loginBtn} onClick={() => setPage('login')}>
                Sign In
              </button>
              <button style={registerBtn} onClick={() => setPage('register')}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const nav = {
  background: 'white',
  borderBottom: '1px solid #e5e7eb',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const inner = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '0 20px',
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
};

const logo = {
  fontSize: 20,
  fontWeight: 700,
  color: '#2563eb',
  cursor: 'pointer',
  letterSpacing: 0.5,
};

const links = {
  display: 'flex',
  gap: 4,
};

const btn = {
  background: 'none',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 14,
  color: '#6b7280',
  cursor: 'pointer',
};

const activeBtn = {
  ...btn,
  color: '#2563eb',
  background: '#eff6ff',
};

const actions = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const postBtn = {
  background: '#ec4899',
  color: 'white',
  border: 'none',
  padding: '7px 16px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const loginBtn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '7px 16px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const registerBtn = {
  background: 'white',
  color: '#2563eb',
  border: '1px solid #2563eb',
  padding: '7px 16px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const logoutBtn = {
  background: 'none',
  border: '1px solid #e5e7eb',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 13,
  color: '#6b7280',
  cursor: 'pointer',
};

const userName = {
  fontSize: 13,
  color: '#374151',
  fontWeight: 500,
};

const roleBadge = {
  background: '#fef3c7',
  color: '#92400e',
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 10,
};
