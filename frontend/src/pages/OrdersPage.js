import React, { useState, useEffect } from 'react';
import { getMyOrders, updateOrderStatus, deleteOrder } from '../api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyOrders()
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
  }, []);

  async function handlePay(orderId) {
    const res = await updateOrderStatus(orderId, 'paid');
    if (res.error) { alert(res.error); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'paid' } : o));
  }

  async function handleDelete(orderId) {
    if (!window.confirm('Cancel this order?')) return;
    const res = await deleteOrder(orderId);
    if (res.error) { alert(res.error); return; }
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }

  function statusColor(status) {
    if (status === 'paid')      return { background: '#d1fae5', color: '#065f46' };
    if (status === 'shipped')   return { background: '#dbeafe', color: '#1e40af' };
    if (status === 'cancelled') return { background: '#fee2e2', color: '#991b1b' };
    return { background: '#fef3c7', color: '#92400e' };
  }

  return (
      <div style={page}>
        <div style={inner}>
          <h1 style={title}>My Orders</h1>

          {loading && <div style={center}>Loading...</div>}

          {!loading && orders.length === 0 && (
              <div style={empty}>
                <div style={emptyIcon}></div>
                <div>No orders yet</div>
              </div>
          )}

          {orders.map(order => (
              <div key={order.id} style={card}>
                <div style={cardHead}>
                  <div>
                    <span style={orderNum}>Order #{order.id}</span>
                    <span style={date}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <span style={{ ...badge, ...statusColor(order.status) }}>
                {order.status === 'pending' ? 'Pending' :
                    order.status === 'paid' ? 'Paid' :
                        order.status === 'shipped' ? 'Shipped' : order.status}
              </span>
                </div>

                {order.items && order.items.map(item => (
                    <div key={item.id} style={itemCard}>
                      <div style={itemImg}>
                        {item.image_url
                            ? <img src={'http://localhost:8000' + item.image_url} alt={item.product_name} style={imgStyle} />
                            : <span style={{fontSize:28}}></span>
                        }
                      </div>
                      <div style={itemInfo}>
                        <div style={itemName}>{item.product_name || 'Product #' + item.product_id}</div>
                        <div style={itemMeta}>Qty: {item.quantity} × ₸{item.price.toLocaleString()}</div>
                      </div>
                    </div>
                ))}

                <div style={cardFoot}>
                  <div style={totalRow}>
                    <span style={totalLabel}>Total</span>
                    <span style={totalPrice}>₸{order.total_price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {order.status === 'pending' && (
                        <button style={payBtn} onClick={() => handlePay(order.id)}>
                          ✓ Confirm Payment
                        </button>
                    )}
                    {order.status === 'pending' && (
                        <button style={deleteBtn} onClick={() => handleDelete(order.id)}>
                          Cancel
                        </button>
                    )}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#f9fafb',
  padding: '32px 20px'
};
const inner = {
  maxWidth: 700,
  margin: '0 auto'
};
const title = {
  fontSize: 26,
  fontWeight: 700,
  color: '#111827',
  marginBottom: 24
};
const center = {
  textAlign: 'center',
  padding: 40,
  color: '#9ca3af'
};
const empty = {
  textAlign: 'center',
  padding: 60,
  color: '#9ca3af'
};
const emptyIcon = {
  fontSize: 48,
  marginBottom: 12
};
const card = {
  background: 'white',
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  padding: 20,
  marginBottom: 16
};
const cardHead = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16
};
const orderNum = {
  fontSize: 16,
  fontWeight: 600,
  color: '#111827',
  marginRight: 10
};
const date = {
  fontSize: 13,
  color: '#9ca3af'
};
const badge = {
  padding: '4px 12px',
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600
};
const itemCard = {
  display: 'flex',
  gap: 12,
  padding: '10px 0',
  borderTop: '1px solid #f3f4f6'
};
const itemImg = {
  width: 60,
  height: 60,
  minWidth: 60,
  background: '#f3f4f6',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};
const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};
const itemInfo = {
  flex: 1 };
const itemName = {
  fontSize: 14,
  fontWeight: 600,
  color: '#111827',
  marginBottom: 4
};
const itemMeta = {
  fontSize: 13,
  color: '#9ca3af'
};
const cardFoot = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #e5e7eb',
  paddingTop: 12,
  marginTop: 8
};
const totalRow = {
  display: 'flex',
  gap: 8,
  alignItems: 'center' };
const totalLabel = {
  fontSize: 14,
  fontWeight: 600,
  color: '#374151'
};
const totalPrice = {
  fontSize: 18,
  fontWeight: 700,
  color: '#2563eb'
};
const payBtn = {
  background: '#ec4899',
  color: 'white',
  border: 'none',
  padding: '8px 18px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer'
};
const deleteBtn = {
  background: '#fef2f2',
  color: '#ef4444',
  border: 'none',
  padding: '8px 18px',
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer'
};