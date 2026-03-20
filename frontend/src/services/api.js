// src/services/api.js  – centralised fetch helper + type-safe service methods

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('dropcode_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

// ─── Products ──────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (page = 1, category = '', sort = 'created_at') =>
    request(`/api/products?page=${page}&category=${category}&sort=${sort}`),
  get: (id) => request(`/api/products/${id}`),
  search: (q) => request(`/api/products/search?q=${encodeURIComponent(q)}`),
  create: (body) => request('/api/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryApi = {
  list: () => request('/api/categories'),
  create: (body) => request('/api/categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => request('/api/cart'),
  add: (product_id, quantity = 1, size = 'M') =>
    request('/api/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity, size }) }),
  update: (itemId, quantity) =>
    request(`/api/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  remove: (itemId) => request(`/api/cart/${itemId}`, { method: 'DELETE' }),
  clear: () => request('/api/cart', { method: 'DELETE' }),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistApi = {
  get: () => request('/api/wishlist'),
  add: (product_id) =>
    request('/api/wishlist', { method: 'POST', body: JSON.stringify({ product_id }) }),
  remove: (id) => request(`/api/wishlist/${id}`, { method: 'DELETE' }),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderApi = {
  create: (body) => request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  get: (id) => request(`/api/orders/${id}`),
  listAdmin: () => request('/api/orders/admin'),
  updateStatus: (id, status) => request(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  cancel: (id) => request(`/api/orders/${id}/cancel`, { method: 'PATCH' }),
};

// ─── Admin Specific ──────────────────────────────────────────────────────────
export const adminApi = {
  listUsers: () => request('/api/admin/users'),
  getAnalytics: () => request('/api/admin/analytics'),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => request('/api/profile'),
  update: (body) => request('/api/profile', { method: 'PUT', body: JSON.stringify(body) }),
  orders: () => request('/api/profile/orders'),
  addresses: () => request('/api/profile/addresses'),
  addAddress: (body) =>
    request('/api/profile/addresses', { method: 'POST', body: JSON.stringify(body) }),
  updateAddress: (id, body) =>
    request(`/api/profile/addresses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAddress: (id) => request(`/api/profile/addresses/${id}`, { method: 'DELETE' }),
  paymentMethods: () => request('/api/profile/payment-methods'),
};
