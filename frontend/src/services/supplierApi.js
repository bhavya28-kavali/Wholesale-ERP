import axios from 'axios';

const API = '/api/suppliers';

export const getSuppliers = () => axios.get(API);
export const createSupplier = (data) => axios.post(API, data);
export const updateSupplier = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteSupplier = (id) => axios.delete(`${API}/${id}`);