import React, { useState, useEffect } from 'react';
import { createProduct, getCategories, uploadImage } from '../api';

export default function CreateProductPage({ setPage }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!name || !price || !stock || !categoryId) {
      setError('All fields except description and image are required');
      return;
    }
    setError('');
    setLoading(true);

    let imageURL = '';
    if (imageFile) {
      const uploadRes = await uploadImage(imageFile);
      if (uploadRes.error) {
        setError(uploadRes.error);
        setLoading(false);
        return;
      }
      imageURL = uploadRes.image_url;
    }

    const res = await createProduct({
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
          <button style={backBtn} onClick={() => setPage('home')}>← Back</button>
          <h1 style={title}>Post a Listing</h1>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={group}>
          <label style={label}>Photo</label>
          <div style={uploadBox}>
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={previewImg} />
            ) : (
              <div style={uploadPlaceholder}>📷 Click to upload photo</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={fileInput}
            />
          </div>
        </div>

        <div style={group}>
          <label style={label}>Title</label>
          <input style={input} placeholder="What are you selling?" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={group}>
          <label style={label}>Description</label>
          <textarea style={textarea} placeholder="Describe your item..." value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div style={row}>
          <div style={halfGroup}>
            <label style={label}>Price</label>
            <input style={input} type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div style={halfGroup}>
            <label style={label}>Quantity</label>
            <input style={input} type="number" placeholder="1" value={stock} onChange={e => setStock(e.target.value)} />
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
          <button style={cancelBtn} onClick={() => setPage('home')}>Cancel</button>
          <button style={submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Posting...' : 'Post Listing'}
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
  background: '#ec4899',
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