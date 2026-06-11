import api from './api.js';

export const getPurchaseOrders = () => api.get('/purchase-orders');
export const createPurchaseOrder = (data) => api.post('/purchase-orders', data);
export const updatePOStatus = (id, status) =>
  api.put(`/purchase-orders/${id}/status`, { status });