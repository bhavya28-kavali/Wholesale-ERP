import { useEffect, useState, useMemo } from 'react';
import { orderApi, productApi, customerApi } from '../services/api/index';
import useAuth from '../hooks/useAuth';
import { canCreateOrders, canEditOrders } from '../utils/roles';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import BarcodeScanner from '../components/BarcodeScanner';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const statusClass = (status) => {
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-slate-200 text-slate-600',
  };
  return map[status] || 'bg-slate-100';
};

const emptyLine = { productId: '', quantity: 1 };

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    items: [{ ...emptyLine }],
  });

  const canCreate = canCreateOrders(user.role);
  const canEdit = canEditOrders(user.role);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [o, p, c] = await Promise.all([
        orderApi.list(params),
        productApi.list(),
        customerApi.list(),
      ]);
      setOrders(o.data);
      setProducts(p.data.filter((x) => x.status === 'active' || !x.status));
      setCustomers(c.data);
      setError('');
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search, statusFilter]);

  const resetForm = () => {
    setForm({
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      notes: '',
      items: [{ ...emptyLine }],
    });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
    setSelectedOrder(null);
  };

  const openEdit = (order) => {
    setEditing(order);
    setForm({
      customerId: order.customer?._id || '',
      customerName: order.customerName,
      customerEmail: order.customerEmail || '',
      customerPhone: order.customerPhone || '',
      notes: order.notes || '',
      items: order.items.map((i) => ({
        productId: i.product?._id || i.product,
        quantity: i.quantity,
      })),
    });
    setShowForm(true);
    setSelectedOrder(null);
  };

  const onCustomerSelect = (id) => {
    const c = customers.find((x) => x._id === id);
    setForm({
      ...form,
      customerId: id,
      customerName: c?.name || '',
      customerEmail: c?.email || '',
      customerPhone: c?.phone || '',
    });
  };

  const updateLine = (idx, field, value) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: value };
    setForm({ ...form, items });
  };

  const handleBarcodeScanned = (product) => {
    setError('');
    setMessage('');
    const existingIndex = form.items.findIndex((item) => item.productId === product._id);

    if (existingIndex > -1) {
      const updatedItems = [...form.items];
      const currentQty = Number(updatedItems[existingIndex].quantity);
      if (currentQty + 1 > product.quantity) {
        setError(`Insufficient stock for ${product.name}. Available: ${product.quantity}`);
        return;
      }
      updatedItems[existingIndex].quantity = currentQty + 1;
      setForm({ ...form, items: updatedItems });
      setMessage(`Incremented ${product.name} quantity to ${currentQty + 1}`);
    } else {
      if (product.quantity < 1) {
        setError(`Cannot add ${product.name}. Product is out of stock.`);
        return;
      }
      const items = [...form.items];
      const isEmptyFirstLine = items.length === 1 && items[0].productId === '';
      if (isEmptyFirstLine) {
        items[0] = { productId: product._id, quantity: 1 };
      } else {
        items.push({ productId: product._id, quantity: 1 });
      }
      setForm({ ...form, items });
      setMessage(`Added ${product.name} to order lines.`);
    }
  };

  const estimatedTotal = useMemo(() => {
    return form.items.reduce((sum, line) => {
      const p = products.find((x) => x._id === line.productId);
      if (!p || !line.quantity) return sum;
      const taxable = line.quantity * p.unitPrice;
      return sum + taxable + (taxable * p.gstPercent) / 100;
    }, 0);
  }, [form.items, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const finalItems = form.items.filter((i) => i.productId).map((i) => ({
      productId: i.productId,
      quantity: Number(i.quantity),
    }));

    if (!finalItems.length) {
      setError('Please add at least one product line.');
      return;
    }

    // Client-side stock validation
    for (const line of finalItems) {
      const p = products.find((x) => x._id === line.productId);
      if (p && line.quantity > p.quantity) {
        setError(`Insufficient stock for ${p.name}. Available: ${p.quantity}, requested: ${line.quantity}`);
        return;
      }
    }

    const payload = {
      customerId: form.customerId || undefined,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      notes: form.notes,
      items: finalItems,
    };
    try {
      if (editing) await orderApi.update(editing._id, payload);
      else await orderApi.create(payload);
      setMessage(editing ? 'Order updated.' : 'Order created. Stock deducted.');
      setShowForm(false);
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Order save failed.');
    }
  };

  const changeStatus = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      setMessage(status === 'cancelled' ? 'Order cancelled. Stock restored.' : `Status updated to ${status}.`);
      load();
      if (selectedOrder?._id === orderId) {
        const { data } = await orderApi.get(orderId);
        setSelectedOrder(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order? Stock will be restored if active.')) return;
    try {
      await orderApi.remove(id);
      setMessage('Order deleted.');
      setSelectedOrder(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders"
        subtitle="Create and track wholesale orders"
        actions={canCreate && <Button onClick={openCreate}>New order</Button>}
      />

      {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search order or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} sm:max-w-xs`}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {showForm && canCreate && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 font-medium">{editing ? `Edit ${editing.orderNumber}` : 'New order'}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Customer</label>
              <select value={form.customerId} onChange={(e) => onCustomerSelect(e.target.value)} className={inputClass} required={!form.customerName}>
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Or customer name</label>
              <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={inputClass} required />
            </div>
            <input placeholder="Email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className={inputClass} />
          </div>

          <div className="mt-4 max-w-md border-t pt-4">
            <BarcodeScanner onProductFound={handleBarcodeScanned} />
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Line items</p>
            {form.items.map((line, idx) => (
              <div key={idx} className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={line.productId}
                  onChange={(e) => updateLine(idx, 'productId', e.target.value)}
                  className={`${inputClass} flex-1`}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — stock {p.quantity} — ₹{p.unitPrice}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
                  className={`${inputClass} w-full sm:w-24`}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { ...emptyLine }] })} className="text-sm text-slate-600 hover:underline">
              + Add line
            </button>
          </div>

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={`${inputClass} mt-3`}
            rows={2}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Estimated total (incl. GST): <strong>{formatCurrency(estimatedTotal)}</strong></p>
            <div className="flex gap-2">
              <Button type="submit">{editing ? 'Update order' : 'Place order'}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left dark:bg-slate-800/50">
              <tr>
                <th className="px-3 py-2">Order #</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">No orders</td></tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o._id}
                    onClick={() => setSelectedOrder(o)}
                    className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${
                      selectedOrder?._id === o._id ? 'bg-slate-50 dark:bg-slate-800/50' : ''
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">{o.orderNumber}</td>
                    <td className="px-3 py-2">{o.customerName}</td>
                    <td className="px-3 py-2">{formatCurrency(o.total)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded px-2 py-0.5 text-xs capitalize ${statusClass(o.status)}`}>{o.status}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-medium">Order details</h3>
          {!selectedOrder ? (
            <p className="mt-4 text-sm text-slate-500">Select an order to view details.</p>
          ) : (
            <div className="mt-3 space-y-3 text-sm">
              <p><span className="text-slate-500">Order:</span> {selectedOrder.orderNumber}</p>
              <p><span className="text-slate-500">Customer:</span> {selectedOrder.customerName}</p>
              <p><span className="text-slate-500">Subtotal:</span> {formatCurrency(selectedOrder.subtotal)}</p>
              <p><span className="text-slate-500">GST:</span> {formatCurrency(selectedOrder.gstAmount)}</p>
              <p><span className="text-slate-500">Total:</span> <strong>{formatCurrency(selectedOrder.total)}</strong></p>
              <ul className="border-t pt-2">
                {selectedOrder.items?.map((i) => (
                  <li key={i._id || i.sku} className="py-1 text-slate-600">{i.name} × {i.quantity}</li>
                ))}
              </ul>
              {canEdit && selectedOrder.status !== 'cancelled' && (
                <div>
                  <label className="mb-1 block text-xs font-medium">Update status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => changeStatus(selectedOrder._id, e.target.value)}
                    className={inputClass}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
              {canEdit && !['shipped', 'delivered', 'cancelled'].includes(selectedOrder.status) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(selectedOrder)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(selectedOrder._id)}>Delete</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
