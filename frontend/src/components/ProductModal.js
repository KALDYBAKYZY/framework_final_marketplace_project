import React, { useState, useEffect } from 'react';
import { getProductReviews, createReview, createOrder } from '../api';

export default function ProductModal({ product, categoryName, isOwner, onClose, onEdit, onDelete, user }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [qty, setQty] = useState(1);
  const [orderMsg, setOrderMsg] = useState('');

  useEffect(() => {
    if (product) {
      getProductReviews(product.id).then(data => {
        if (data.reviews) setReviews(data.reviews);
        if (data.average_rating) setAvgRating(data.average_rating);
      });
    }
  }, [product]);

  if (!product) return null;

  async function submitReview() {
    const res = await createReview(product.id, rating, comment);
    if (res.error) { setReviewMsg(res.error); return; }
    setReviewMsg('Review submitted!');
    setComment('');
    getProductReviews(product.id).then(data => {
      if (data.reviews) setReviews(data.reviews);
      if (data.average_rating) setAvgRating(data.average_rating);
    });
  }

  async function submitOrder() {
    const res = await createOrder([{ product_id: product.id, quantity: qty }]);
    if (res.error) { setOrderMsg(res.error); return; }
    setOrderMsg('Order placed successfully!');
    setOrdering(false);
  }

  function stars(n) {
    return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  }

  const imgSrc = product.image_url ? 'http://localhost:8000' + product.image_url : null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>✕</button>

        <div style={topSection}>
          <div style={imgBox}>
            {imgSrc
              ? <img src={imgSrc} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}} />
              : <span style={{fontSize:32}}>{categoryName ? categoryName[0] : '🛍'}</span>
            }
          </div>
          <div style={info}>
            {categoryName && <span style={catTag}>{categoryName}</span>}
            <h2 style={productTitle}>{product.name}</h2>
            <div style={price}>₸{product.price.toLocaleString()}</div>
            <div style={stock}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
            {product.description && <p style={desc}>{product.description}</p>}

            {avgRating > 0 && (
              <div style={ratingRow}>
                <span style={stars_style}>{stars(avgRating)}</span>
                <span style={ratingNum}>{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {isOwner && (
          <div style={ownerActions}>
            <button style={editBtn} onClick={onEdit}>Edit</button>
            <button style={deleteBtn} onClick={onDelete}>Delete</button>
          </div>
        )}

        {!isOwner && user && product.stock > 0 && (
          <div style={orderSection}>
            {!ordering ? (
              <button style={orderBtn} onClick={() => setOrdering(true)}>Buy Now</button>
            ) : (
              <div style={orderForm}>
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={e => setQty(parseInt(e.target.value))}
                  style={qtyInput}
                />
                <button style={confirmBtn} onClick={submitOrder}>Confirm Order</button>
                <button style={cancelBtn} onClick={() => setOrdering(false)}>Cancel</button>
              </div>
            )}
            {orderMsg && <div style={msgBox}>{orderMsg}</div>}
          </div>
        )}

        <div style={reviewSection}>
          <h3 style={reviewTitle}>Reviews</h3>

          {user && !isOwner && (
            <div style={reviewForm}>
              <div style={ratingSelect}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={n <= rating ? starOn : starOff} onClick={() => setRating(n)}>★</button>
                ))}
              </div>
              <input
                style={commentInput}
                placeholder="Write a review..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button style={submitReviewBtn} onClick={submitReview}>Submit</button>
              {reviewMsg && <div style={msgBox}>{reviewMsg}</div>}
            </div>
          )}

          {reviews.length === 0 ? (
            <div style={noReviews}>No reviews yet</div>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={reviewCard}>
                <div style={reviewHead}>
                  <span style={reviewStars}>{stars(r.rating)}</span>
                  <span style={reviewDate}>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.comment && <p style={reviewComment}>{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 200, padding: 20,
};

const modal = {
  background: 'white', borderRadius: 12,
  width: '100%', maxWidth: 540,
  maxHeight: '90vh', overflowY: 'auto',
  padding: 24, position: 'relative',
};

const closeBtn = {
  position: 'absolute', top: 14, right: 16,
  background: 'none', border: 'none',
  fontSize: 18, cursor: 'pointer', color: '#9ca3af',
};

const topSection = {
  display: 'flex', gap: 16, marginBottom: 16,
};

const imgBox = {
  width: 80, height: 80, minWidth: 80,
  background: '#f3f4f6', borderRadius: 8,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 32,
};

const info = { flex: 1 };

const catTag = {
  background: '#eff6ff', color: '#2563eb',
  fontSize: 11, fontWeight: 600,
  padding: '2px 8px', borderRadius: 6,
  display: 'inline-block', marginBottom: 6,
};

const productTitle = { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 };
const price = { fontSize: 22, fontWeight: 700, color: '#2563eb', marginBottom: 4 };
const stock = { fontSize: 13, color: '#9ca3af', marginBottom: 6 };
const desc = { fontSize: 14, color: '#6b7280', lineHeight: 1.5 };

const ratingRow = { display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 };
const stars_style = { color: '#f59e0b', fontSize: 16 };
const ratingNum = { fontSize: 13, color: '#6b7280' };

const ownerActions = { display: 'flex', gap: 8, marginBottom: 16 };

const editBtn = {
  background: '#eff6ff', color: '#2563eb',
  border: 'none', padding: '7px 16px', borderRadius: 7,
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const deleteBtn = {
  background: '#fef2f2', color: '#ef4444',
  border: 'none', padding: '7px 16px', borderRadius: 7,
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const orderSection = { marginBottom: 16 };

const orderBtn = {
  background: '#ec4899', color: 'white',
  border: 'none', padding: '9px 24px', borderRadius: 8,
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

const orderForm = { display: 'flex', gap: 8, alignItems: 'center' };

const qtyInput = {
  width: 70, border: '1px solid #e5e7eb', borderRadius: 7,
  padding: '8px 10px', fontSize: 14, outline: 'none',
};

const confirmBtn = {
  background: '#2563eb', color: 'white',
  border: 'none', padding: '8px 16px', borderRadius: 7,
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const cancelBtn = {
  background: '#f3f4f6', color: '#6b7280',
  border: 'none', padding: '8px 14px', borderRadius: 7,
  fontSize: 13, cursor: 'pointer',
};

const msgBox = {
  marginTop: 8, padding: '8px 12px', borderRadius: 7,
  background: '#ecfdf5', color: '#065f46', fontSize: 13,
};

const reviewSection = { borderTop: '1px solid #e5e7eb', paddingTop: 16 };
const reviewTitle = { fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 12 };

const reviewForm = { marginBottom: 16 };
const ratingSelect = { display: 'flex', gap: 4, marginBottom: 8 };

const starOn = {
  background: 'none', border: 'none', fontSize: 22,
  color: '#f59e0b', cursor: 'pointer',
};

const starOff = {
  background: 'none', border: 'none', fontSize: 22,
  color: '#d1d5db', cursor: 'pointer',
};

const commentInput = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: 7,
  padding: '8px 12px', fontSize: 14, outline: 'none',
  marginBottom: 8, boxSizing: 'border-box',
};

const submitReviewBtn = {
  background: '#2563eb', color: 'white',
  border: 'none', padding: '8px 18px', borderRadius: 7,
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const noReviews = { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '16px 0' };

const reviewCard = {
  borderBottom: '1px solid #f3f4f6', paddingBottom: 10, marginBottom: 10,
};

const reviewHead = { display: 'flex', justifyContent: 'space-between', marginBottom: 4 };
const reviewStars = { color: '#f59e0b' };
const reviewDate = { fontSize: 12, color: '#9ca3af' };
const reviewComment = { fontSize: 14, color: '#6b7280' };
