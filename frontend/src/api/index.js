const BASE = 'http://localhost:8000';

function token() {
  return localStorage.getItem('token');
}

async function req(path, options) {
  const headers = { 'Content-Type': 'application/json' };
  if (token()) {
    headers['Authorization'] = 'Bearer ' + token();
  }
  const res = await fetch(BASE + path, { headers, ...options });
  return res.json();
}

export function loginUser(email, password) {
  return req('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function registerUser(name, email, password, phone) {
  return req('/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) });
}

export function getMe() {
  return req('/me');
}

export function getUsers() {
  return req('/users');
}

export function updateUser(id, data) {
  return req('/users/' + id, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteUser(id) {
  return req('/users/' + id, { method: 'DELETE' });
}

export function getProducts(filters) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.search)      params.append('search', filters.search);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.user_id)     params.append('user_id', filters.user_id);
    if (filters.min_price)   params.append('min_price', filters.min_price);
    if (filters.max_price)   params.append('max_price', filters.max_price);
  }
  const qs = params.toString() ? '?' + params.toString() : '';
  return req('/products' + qs);
}

export function getProduct(id) {
  return req('/products/' + id);
}

export function createProduct(data) {
  return req('/products', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProduct(id, data) {
  return req('/products/' + id, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProduct(id) {
  return req('/products/' + id, { method: 'DELETE' });
}

export function getCategories() {
  return req('/categories');
}

export function createCategory(name) {
  return req('/categories', { method: 'POST', body: JSON.stringify({ name }) });
}

export function updateCategory(id, name) {
  return req('/categories/' + id, { method: 'PUT', body: JSON.stringify({ name }) });
}

export function deleteCategory(id) {
  return req('/categories/' + id, { method: 'DELETE' });
}

export function createOrder(items) {
  return req('/orders', { method: 'POST', body: JSON.stringify({ items }) });
}

export function getMyOrders() {
  return req('/orders/my');
}

export function getOrderByID(id) {
  return req('/orders/' + id);
}

export function updateOrderStatus(id, status) {
  return req('/orders/' + id + '/status', {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function getProductReviews(productId) {
  return req('/products/' + productId + '/reviews');
}

export function createReview(productId, rating, comment) {
  return req('/reviews', { method: 'POST', body: JSON.stringify({ product_id: productId, rating, comment }) });
}

export function updateReview(id, rating, comment) {
  return req('/reviews/' + id, { method: 'PUT', body: JSON.stringify({ rating, comment }) });
}

export function deleteReview(id) {
  return req('/reviews/' + id, { method: 'DELETE' });
}

export function getMyReviews() {
  return req('/reviews/my');
}

export function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  return fetch('http://localhost:8000/upload', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    body: formData,
  }).then(r => r.json());
}
