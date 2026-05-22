import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, deleteProduct } from '../api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function HomePage({ user, setPage }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
    load();
  }, []);

  function load() {
    setLoading(true);
    getProducts({ search, category_id: categoryId, min_price: minPrice, max_price: maxPrice })
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

  const isOwner = selected && user && user.id === selected.user_id;

  return (
    <div style={page}>

      <div style={hero}>
        <h1 style={heroTitle}>Buy & Sell Anything</h1>
        <p style={heroSub}>Find great deals from people in your area</p>
        {!user && (
          <div style={heroBtns}>
            <button style={heroPrimary} onClick={() => setPage('register')}>
              Get Started
            </button>
            <button style={heroSecondary} onClick={() => setPage('login')}>
              Sign In
            </button>
          </div>
        )}
      </div>

      <div style={content}>

        <div style={filters}>
          <input
            style={inputStyle}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
          <select style={selectStyle} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            style={{ ...inputStyle, maxWidth: 120 }}
            placeholder="Min price"
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            style={{ ...inputStyle, maxWidth: 120 }}
            placeholder="Max price"
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
          <button style={searchBtn} onClick={load}>Search</button>
          {(search || categoryId || minPrice || maxPrice) && (
            <button style={clearBtn} onClick={() => {
              setSearch(''); setCategoryId(''); setMinPrice(''); setMaxPrice('');
              getProducts().then(data => setProducts(Array.isArray(data) ? data : []));
            }}>
              Clear
            </button>
          )}
        </div>

        {notice && <div style={noticeBox}>{notice}</div>}

        {loading ? (
          <div style={center}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={empty}>
            <div style={emptyIcon}>🛍️</div>
            <div>No products found</div>
          </div>
        ) : (
          <div style={grid}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={catName(p.category_id)}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}

      </div>

      <ProductModal
        user={user}
        product={selected}
        categoryName={selected ? catName(selected.category_id) : ''}
        isOwner={isOwner}
        onClose={() => setSelected(null)}
        onEdit={() => {
          setSelected(null);
          setPage('edit-product');
        }}
        onDelete={() => handleDelete(selected.id)}
      />

    </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#f9fafb',
};

const hero = {
  background: 'linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)',
  padding: '56px 20px 44px',
  textAlign: 'center',
  borderBottom: '1px solid #e5e7eb',
};

const heroTitle = {
  fontSize: 36,
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 10px',
};

const heroSub = {
  fontSize: 16,
  color: '#6b7280',
  margin: '0 0 24px',
};

const heroBtns = {
  display: 'flex',
  gap: 10,
  justifyContent: 'center',
};

const heroPrimary = {
  background: '#ec4899',
  color: 'white',
  border: 'none',
  padding: '11px 26px',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
};

const heroSecondary = {
  background: 'white',
  color: '#2563eb',
  border: '1px solid #2563eb',
  padding: '11px 26px',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
};

const content = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '24px 20px 60px',
};

const filters = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginBottom: 24,
};

const inputStyle = {
  flex: 1,
  minWidth: 150,
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '9px 12px',
  fontSize: 14,
  outline: 'none',
  background: 'white',
};

const selectStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '9px 12px',
  fontSize: 14,
  outline: 'none',
  background: 'white',
  cursor: 'pointer',
};

const searchBtn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '9px 20px',
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const clearBtn = {
  background: '#f3f4f6',
  color: '#6b7280',
  border: 'none',
  padding: '9px 16px',
  borderRadius: 7,
  fontSize: 14,
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

const center = {
  textAlign: 'center',
  padding: 60,
  color: '#9ca3af',
};

const empty = {
  textAlign: 'center',
  padding: 60,
  color: '#9ca3af',
};

const emptyIcon = {
  fontSize: 48,
  marginBottom: 12,
};
