import React, { useState, useEffect } from 'react';
import { updateProduct, getCategories, uploadImage } from '../api';

export default function EditProductPage({ product, setPage }) {
  const [name, setName] = useState(product ? product.name : '');
  const [description, setDescription] = useState(product ? product.description || '' : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [stock, setStock] = useState(product ? product.stock : '');
  const [categoryId, setCategoryId] = useState(product ? product.category_id : '');
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product ? product.image_url ? 'http://localhost:8000' + product.image_url : '' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  if (!product) {
    return (
      <div style={page}>
        <div style={card}>
          <p>No product selected.</p>
          <button style={cancelBtn} onClick={() => setPage('my-listings')}>Back</button>
        </div>
      </div>
    );
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!name || !price || !stock || !categoryId) {
      setError('All required fields must be filled');
      return;
    }
    setError('');
    setLoading(true);

    let imageURL = product.image_url || '';
    if (imageFile) {
      const uploadRes = await uploadImage(imageFile);
      if (uploadRes.error) {
        setError(uploadRes.error);
        setLoading(false);
        return;
      }
      imageURL = uploadRes.image_url;
    }

    const res = await updateProduct(product.id, {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category_id: parseInt(categoryId),
      image_url: imageURL,
    });
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setPage('my-listings');
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={header}>
          <button style={backBtn} onClick={() => setPage('my-listings')}>← Back</button>
          <h1 style={title}>Edit Listing</h1>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={group}>
          <label style={label}>Photo</label>
          <div style={uploadBox}>
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={previewImg} />
            ) : (
              <div style={uploadPlaceholder}>📷 Click to change photo</div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} style={fileInput} />
          </div>
        </div>

        <div style={group}>
          <label style={label}>Title</label>
          <input style={input} value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={group}>
          <label style={label}>Description</label>
          <textarea style={textarea} value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div style={row}>
          <div style={halfGroup}>
            <label style={label}>Price</label>
            <input style={input} type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div style={halfGroup}>
            <label style={label}>Quantity</label>
            <input style={input} type="number" value={stock} onChange={e => setStock(e.target.value)} />
          </div>
        </div>

        <div style={group}>
          <label style={label}>Category</label>
          <select style={selectStyle} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={actions}>
          <button style={cancelBtn} onClick={() => setPage('my-listings')}>Cancel</button>
          <button style={submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
const page = {
  minHeight: '100vh',
  background: '#f9fafb',
  display: 'flex',
  justifyContent: 'center',
  padding: '32px 20px'
};

const card = {
  background: 'white',
  borderRadius: 12,
  padding: '28px 28px',
  width: '100%',
  maxWidth: 520,
  border: '1px solid #e5e7eb',
  height: 'fit-content'
};

const header = {
  marginBottom: 24
};

const backBtn = {
  background: 'none',
  border: 'none',
  fontSize: 14,
  color: '#6b7280',
  cursor: 'pointer',
  padding: '0 0 12px'
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  color: '#111827',
  margin: 0
};

const errorBox = {
  background: '#fef2f2',
  color: '#ef4444',
  padding: '10px 12px',
  borderRadius: 7,
  fontSize: 14,
  marginBottom: 18
};

const group = {
  marginBottom: 16
};

const halfGroup = {
  flex: 1,
  marginBottom: 16
};

const label = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6
};

const input = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box'
};

const textarea = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  minHeight: 90,
  resize: 'vertical'
};

const selectStyle = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none',
  background: 'white',
  cursor: 'pointer'
};

const row = {
  display: 'flex',
  gap: 12
};

const actions = {
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 8
};

const cancelBtn = {
  background: '#f3f4f6',
  color: '#374151',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer'
};

const submitBtn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '10px 24px',
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer'
};

const uploadBox = {
  position: 'relative',
  border: '2px dashed #e5e7eb',
  borderRadius: 8,
  height: 140,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  cursor: 'pointer'
};

const uploadPlaceholder = {
  color: '#9ca3af',
  fontSize: 14
};

const previewImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const fileInput = {
  position: 'absolute',
  inset: 0,
  opacity: 0,
  cursor: 'pointer',
  width: '100%',
  height: '100%'
};