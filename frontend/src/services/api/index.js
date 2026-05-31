import api from '../api.js';

export const authApi = {
  me: () => api.get('/auth/me'),
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const productApi = {
  list: (params) => api.get('/products', { params }),
  categories: () => api.get('/products/categories'),
  lowStock: () => api.get('/products/low-stock'),
  history: (productId) => api.get(`/products/history/${productId}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  bulkDelete: (ids) => api.post('/products/bulk-delete', { ids }),
};

export const customerApi = {
  list: (params) => api.get('/customers', { params }),
  create: (data) => api.post('/customers', data),
};

export const orderApi = {
  list: (params) => api.get('/orders', { params }),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  remove: (id) => api.delete(`/orders/${id}`),
};

export const invoiceApi = {
  list: (params) => api.get('/invoices', { params }),
  fromOrder: (orderId, data) => api.post(`/invoices/from-order/${orderId}`, data),
  updatePayment: (id, status) => api.patch(`/invoices/${id}/payment`, { paymentStatus: status }),
};

export const paymentApi = {
  list: (params) => api.get('/payments', { params }),
  summary: () => api.get('/payments/summary'),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  remove: (id) => api.delete(`/payments/${id}`),
};

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  activity: () => api.get('/analytics/activity'),
  sales: (days = 30) => api.get('/analytics/sales', { params: { days } }),
  products: () => api.get('/analytics/products'),
  revenueMonthly: (months = 6) => api.get('/analytics/revenue-monthly', { params: { months } }),
  categoryDistribution: () => api.get('/analytics/category-distribution'),
  lowStockReport: () => api.get('/analytics/low-stock-report'),
};

export default api;
