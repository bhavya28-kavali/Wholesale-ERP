import api from './api.js';

export const getLowStockProducts = () =>
  api.get('/alerts/low-stock');