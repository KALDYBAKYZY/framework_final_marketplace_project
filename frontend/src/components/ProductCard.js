import React from 'react';

export default function ProductCard({ product, categoryName, onClick }) {
  const imgSrc = product.image_url ? 'http://localhost:8000' + product.image_url : null;

  return (
    <div style={card} onClick={onClick}>
      <div style={imgBox}>
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} style={img} />
        ) : (
          <span style={emoji}>🛍️</span>
        )}
      </div>
      <div style={body}>
        {categoryName && <span style={catTag}>{categoryName}</span>}
        <div style={name}>{product.name}</div>
        <div style={desc}>
          {product.description
            ? product.description.length > 70
              ? product.description.slice(0, 70) + '...'
              : product.description
            : 'No description'}
        </div>
        {product.seller_name && <div style={seller}>👤 {product.seller_name}</div>}
        <div style={footer}>
          <span style={price}>{Number(product.price).toLocaleString()} ₸</span>
          <span style={product.stock < 3 ? lowStock : stock}>
            {product.stock > 0 ? product.stock + ' left' : 'Sold out'}
          </span>
        </div>
      </div>
    </div>
  );
}

const card = {
    background: 'white',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    cursor: 'pointer'
};

const imgBox = {
    background: '#f0f9ff',
    height: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
};

const img = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const emoji = {
    fontSize: 44
};

const body = {
    padding: '12px 14px 14px'
};

const catTag = {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#2563eb',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 5,
    marginBottom: 7,
    textTransform: 'uppercase'
};

const name = {
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 5
};

const desc = {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
    lineHeight: 1.5
};

const seller = {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8
};

const footer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const price = {
    fontSize: 16,
    fontWeight: 700,
    color: '#2563eb'
};

const stock = {
    fontSize: 12,
    color: '#9ca3af'
};

const lowStock = {
    ...stock,
    color: '#ef4444'
};