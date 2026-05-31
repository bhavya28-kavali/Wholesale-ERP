import axios from 'axios';

export const createPOSInvoice = (data) =>
  axios.post('/api/invoices/pos', data);