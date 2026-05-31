import axios from 'axios';

const API = '/api/barcode';

export const scanBarcode = (sku) => axios.get(`${API}/${sku}`);