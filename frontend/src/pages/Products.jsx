import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../services/api/index';
import useAuth from '../hooks/useAuth';
import { canManageProducts } from '../utils/roles';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import BarcodeScanner from '../components/BarcodeScanner';

const emptyForm = {
  name: '',
  sku: '',
  barcode: '',
  category: 'General',
  unitPrice: '',
  costPrice: '',
  quantity: '',
  lowStockThreshold: 10,
  supplier: '',
  status: 'active',
  gstPercent: 18,
};

const Products = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const canEdit = canManageProducts(user.role);

  const load = async () => {
    setLoading(true);
    try {
      const params = { search: search || undefined, category: category !== 'all' ? category : undefined };
      if (searchParams.get('lowStock') === 'true') params.lowStock = 'true';
      const { data } = await productApi.list(params);
      setProducts(data);
      setError('');
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    productApi.categories().then((r) => setCategories(r.data)).catch(() => {});
  }, [search, category, searchParams]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage('');
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode || '',
      category: p.category,
      unitPrice: p.unitPrice,
      costPrice: p.costPrice || 0,
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold || 10,
      supplier: p.supplier || '',
      status: p.status || 'active',
      gstPercent: p.gstPercent,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      unitPrice: Number(form.unitPrice),
      costPrice: Number(form.costPrice),
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      gstPercent: Number(form.gstPercent),
    };
    try {
      if (editing) await productApi.update(editing._id, payload);
      else await productApi.create(payload);
      setMessage(editing ? 'Product updated.' : 'Product added.');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await productApi.remove(id);
      setMessage('Product deactivated.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Products"
        subtitle="Manage wholesale inventory"
        actions={canEdit && <Button onClick={openAdd}>Add product</Button>}
      />

      {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex flex-col gap-3 sm:flex-row flex-1">
          <input
            type="search"
            placeholder="Search name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} sm:max-w-xs`}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} sm:max-w-xs`}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:max-w-xs">
          <BarcodeScanner
            onProductFound={(product) => {
              setSearch(product.sku);
              setMessage(`Barcode lookup successful: ${product.name} (SKU: ${product.sku})`);
            }}
          />
        </div>
      </div>

      {showForm && canEdit && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <h3 className="mb-3 font-medium">{editing ? 'Edit product' : 'Add product'}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['name', 'text', true],
              ['sku', 'text', true],
              ['barcode', 'text', false],
              ['category', 'text', false],
              ['supplier', 'text', false],
              ['unitPrice', 'number', true],
              ['costPrice', 'number', false],
              ['quantity', 'number', true],
              ['lowStockThreshold', 'number', false],
              ['gstPercent', 'number', false],
            ].map(([key, type, req]) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input type={type} required={req} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputClass} />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Status</th>
              {canEdit && <th className="px-3 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-500">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-500">No products found</td></tr>
            ) : (
              products.map((p) => {
                const isLow = p.quantity <= (p.lowStockThreshold || 10);
                return (
                  <tr key={p._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-3 py-2 font-medium">
                      {p.name}
                      {isLow && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          Low stock
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">{p.sku}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2">₹{p.unitPrice}</td>
                    <td className={`px-3 py-2 font-semibold ${isLow ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                      {p.quantity} <span className="text-xs font-normal text-slate-400">/ thresh: {p.lowStockThreshold || 10}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-500">{p.supplier || '—'}</td>
                    <td className="px-3 py-2 capitalize">{p.status || 'active'}</td>
                    {canEdit && (
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => openEdit(p)} className="mr-2 text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                        {user.role === 'admin' && (
                          <button type="button" onClick={() => handleDelete(p._id)} className="text-rose-600 hover:underline">Delete</button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
