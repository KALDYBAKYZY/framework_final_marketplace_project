import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, deleteProduct } from '../api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function MyListingsPage({ user, setPage, goEdit }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (user) {
      getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
      load();
    }
  }, [user]);

  function load() {
    if (!user) return;
    setLoading(true);
    getProducts({ user_id: user.id })
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  function catName(id) {
    const c = categories.find(x => x.id === id);
    return c ? c.name : '';
  }

  function showNotice(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    const res = await deleteProduct(id);
    if (res.error) {
      showNotice(res.error);
    } else {
      setSelected(null);
      showNotice('Product deleted');
      load();
    }
  }

  if (!user) {
    return (
      <div style={page}>
        <div style={center}>
          <p>Please sign in to see your listings.</p>
          <button style={loginBtn} onClick={() => setPage('login')}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={content}>

        <div style={topRow}>
          <h1 style={title}>My Listings</h1>
          <button style={postBtn} onClick={() => setPage('create-product')}>
            + Post New Item
          </button>
        </div>

        {notice && <div style={noticeBox}>{notice}</div>}

        {loading ? (
          <div style={center}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={empty}>
            <h3 style={emptyTitle}>No listings yet</h3>
            <p style={emptySub}>Post your first item to get started</p>
            <button style={postBtn} onClick={() => setPage('create-product')}>
              Post Your First Item
            </button>
          </div>
        ) : (
          <div style={grid}>
            {products.map(p => (
              <div key={p.id} style={cardWrap}>
                <ProductCard
                  product={p}
                  categoryName={catName(p.category_id)}
                  onClick={() => setSelected(p)}
                />
                <div style={cardActions}>
                  <button style={editBtn} onClick={() => goEdit(p)}>Edit</button>
                  <button style={deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <ProductModal
        product={selected}
        categoryName={selected ? catName(selected.category_id) : ''}
        isOwner={true}
        onClose={() => setSelected(null)}
        onEdit={() => { setSelected(null); goEdit(selected); }}
        onDelete={() => handleDelete(selected.id)}
      />

    </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#f9fafb',
};

const content = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '32px 20px 60px',
};

const topRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
};

const title = {
  fontSize: 24,
  fontWeight: 700,
  color: '#111827',
  margin: 0,
};

const postBtn = {
  background: '#ec4899',
  color: 'white',
  border: 'none',
  padding: '9px 18px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const noticeBox = {
  background: '#eff6ff',
  color: '#2563eb',
  padding: '10px 14px',
  borderRadius: 7,
  fontSize: 14,
  marginBottom: 16,
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
  gap: 18,
};

const cardWrap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const cardActions = {
  display: 'flex',
  gap: 8,
};

const editBtn = {
  flex: 1,
  background: '#eff6ff',
  color: '#2563eb',
  border: '1px solid #bfdbfe',
  padding: '7px 0',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const deleteBtn = {
  flex: 1,
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: '7px 0',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const center = {
  textAlign: 'center',
  padding: 60,
  color: '#9ca3af',
};

const loginBtn = {
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

const empty = {
  textAlign: 'center',
  padding: '60px 20px',
};

const emptyIcon = {
  fontSize: 52,
  marginBottom: 14,
};

const emptyTitle = {
  fontSize: 20,
  fontWeight: 600,
  color: '#111827',
  margin: '0 0 8px',
};

const emptySub = {
  fontSize: 14,
  color: '#9ca3af',
  margin: '0 0 20px',
};
