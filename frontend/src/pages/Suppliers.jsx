import { useEffect, useState } from 'react';
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier
} from '../services/supplierApi';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // =========================
  // MODAL HANDLERS
  // =========================

  const openAddModal = () => {
    setEditId(null);
    setForm({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditId(supplier._id);
    setForm({
      name: supplier.name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  // =========================
  // DATA LOADING
  // =========================

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data || []);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // =========================
  // SUBMIT (CREATE / UPDATE)
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateSupplier(editId, form);
      } else {
        await createSupplier(form);
      }

      setForm({ name: '', phone: '', email: '', address: '' });
      setIsModalOpen(false);
      setEditId(null);
      loadSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Supplier
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan="4">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.phone}</td>
                  <td className="p-2">{s.email}</td>

                  <td className="p-2 flex gap-3">
                    <button
                      onClick={() => openEditModal(s)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white width:420px p-6 rounded shadow-lg">

            <h2 className="text-xl font-bold mb-4">
              {editId ? 'Edit Supplier' : 'Add Supplier'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                className="w-full border p-2 rounded"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 mt-4">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  {editId ? 'Update' : 'Save'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}