import api from './api.js';

export const createPOSInvoice = (data) =>
  api.post('/invoices/pos', data);