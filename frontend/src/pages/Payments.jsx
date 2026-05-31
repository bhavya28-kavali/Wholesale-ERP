import { useEffect, useState } from 'react';
import { paymentApi, orderApi } from '../services/api/index';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

const METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
];

const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: '', amount: '', method: 'cash', status: 'pending' });

  const load = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const [p, s, o] = await Promise.all([
        paymentApi.list(params),
        paymentApi.summary(),
        orderApi.list(),
      ]);
      setPayments(p.data);
      setSummary(s.data);
      setOrders(o.data.filter((x) => x.status !== 'cancelled'));
      setError('');
    } catch {
      setError('Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await paymentApi.create({
        orderId: form.orderId,
        amount: form.amount ? Number(form.amount) : undefined,
        method: form.method,
        status: form.status,
      });
      setMessage('Payment recorded.');
      setShowForm(false);
      setForm({ orderId: '', amount: '', method: 'cash', status: 'pending' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not record payment.');
    }
  };

  const markPaid = async (id) => {
    try {
      await paymentApi.update(id, { status: 'paid' });
      setMessage('Payment marked as paid.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800';

  return (
    <div className="space-y-4">
      <PageHeader title="Payments" subtitle="Record and track order payments" actions={<Button onClick={() => setShowForm(true)}>Record payment</Button>} />

      {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Paid revenue</p>
            <p className="text-xl font-semibold text-emerald-700">{formatCurrency(summary.paidTotal)}</p>
            <p className="text-xs text-slate-500">{summary.paidCount} payments</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-xl font-semibold text-amber-700">{formatCurrency(summary.pendingTotal)}</p>
            <p className="text-xs text-slate-500">{summary.pendingCount} pending</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">By method (paid)</p>
            <ul className="mt-1 text-xs text-slate-600">
              {(summary.byMethod || []).map((m) => (
                <li key={m.method}>{m.method}: {formatCurrency(m.total)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 font-medium">Record payment</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Order</label>
              <select value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className={inputClass} required>
                <option value="">Select order</option>
                {orders.map((o) => (
                  <option key={o._id} value={o._id}>{o.orderNumber} — {o.customerName} ({formatCurrency(o.total)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Amount (optional, defaults to order total)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Method</label>
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputClass}>
                {METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="flex gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} max-w-xs`}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-3 py-2 text-left">Payment ID</th>
              <th className="px-3 py-2 text-left">Order</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Method</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-500">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-500">No payments</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 font-medium">{p.paymentNumber}</td>
                  <td className="px-3 py-2">{p.order?.orderNumber || '—'}</td>
                  <td className="px-3 py-2">{p.customerName}</td>
                  <td className="px-3 py-2">{formatCurrency(p.amount)}</td>
                  <td className="px-3 py-2 capitalize">{p.method.replace('_', ' ')}</td>
                  <td className="px-3 py-2 capitalize">{p.status}</td>
                  <td className="px-3 py-2">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-3 py-2">
                    {p.status === 'pending' && (
                      <button type="button" onClick={() => markPaid(p._id)} className="text-emerald-700 hover:underline">Mark paid</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
