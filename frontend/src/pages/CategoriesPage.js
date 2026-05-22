import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';

export default function CategoriesPage({ user }) {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => { load(); }, []);

  function load() {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
  }

  async function handleCreate() {
    if (!newName.trim()) { setError('Category name is required'); return; }
    setError('');
    setLoading(true);
    const res = await createCategory(newName.trim());
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    setNewName('');
    load();
  }

  async function handleUpdate(id) {
    if (!editName.trim()) return;
    const res = await updateCategory(id, editName.trim());
    if (res.error) { setError(res.error); return; }
    setEditId(null);
    setEditName('');
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return;
    const res = await deleteCategory(id);
    if (res.error) { setError(res.error); return; }
    load();
  }

  return (
      <div style={page}>
        <div style={content}>
          <h1 style={title}>Categories</h1>

          {isAdmin && (
              <div style={addRow}>
                <input
                    style={input}
                    placeholder="New category name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
                <button style={addBtn} onClick={handleCreate} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </div>
          )}

          {error && <div style={errorBox}>{error}</div>}

          {categories.length === 0 ? (
              <div style={empty}>No categories yet</div>
          ) : (
              <div style={list}>
                {categories.map(c => (
                    <div key={c.id} style={item}>
                      {editId === c.id ? (
                          <>
                            <input
                                style={inputInline}
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleUpdate(c.id)}
                                autoFocus
                            />
                            <div style={btnGroup}>
                              <button style={saveBtn} onClick={() => handleUpdate(c.id)}>Save</button>
                              <button style={cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
                            </div>
                          </>
                      ) : (
                          <>
                            <span style={catName}>{c.name}</span>
                            {isAdmin && (
                                <div style={btnGroup}>
                                  <button style={editBtn} onClick={() => { setEditId(c.id); setEditName(c.name); }}>Edit</button>
                                  <button style={delBtn} onClick={() => handleDelete(c.id)}>Delete</button>
                                </div>
                            )}
                          </>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#f9fafb'
};

const content = {
  maxWidth: 600,
  margin: '0 auto',
  padding: '32px 20px 60px'
};

const title = {
  fontSize: 24,
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 24px'
};

const addRow = {
  display: 'flex',
  gap: 10,
  marginBottom: 16
};

const input = {
  flex: 1,
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  padding: '10px 12px',
  fontSize: 14,
  outline: 'none'
};

const inputInline = {
  flex: 1,
  border: '1px solid #93c5fd',
  borderRadius: 7,
  padding: '7px 10px',
  fontSize: 14,
  outline: 'none'
};

const addBtn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 7,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer'
};

const errorBox = {
  background: '#fef2f2',
  color: '#ef4444',
  padding: '10px 12px',
  borderRadius: 7,
  fontSize: 14,
  marginBottom: 16
};

const list = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8
};

const item = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const catName = {
  fontSize: 15,
  fontWeight: 500,
  color: '#111827'
};

const btnGroup = {
  display: 'flex',
  gap: 6
};

const editBtn = {
  background: '#eff6ff',
  color: '#2563eb',
  border: 'none',
  padding: '5px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer'
};

const saveBtn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '5px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer'
};

const cancelBtn = {
  background: '#f3f4f6',
  color: '#6b7280',
  border: 'none',
  padding: '5px 12px',
  borderRadius: 6,
  fontSize: 12,
  cursor: 'pointer'
};

const delBtn = {
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: '5px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer'
};

const empty = {
  textAlign: 'center',
  padding: 40,
  color: '#9ca3af',
  fontSize: 15
};