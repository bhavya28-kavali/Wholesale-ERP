import axios from 'axios';

const API = '/api/purchase-orders';

export const getPurchaseOrders = () => axios.get(API);
export const createPurchaseOrder = (data) => axios.post(API, data);
export const updatePOStatus = (id, status) =>
  axios.put(`${API}/${id}/status`, { status });