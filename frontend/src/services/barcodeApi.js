import api from './api.js';

export const scanBarcode = (sku) => api.get(`/barcodes/${sku}`);