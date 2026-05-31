import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../services/api/index';
import { getLowStockProducts } from '../services/alertApi';
import PageHeader from '../components/ui/PageHeader';
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const statusClass = (status) => {
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-slate-200 text-slate-700',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    analyticsApi
      .dashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await getLowStockProducts();
      setLowStock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("low-stock", (data) => {
      toast.warning(
        `⚠️ Low Stock Alert\n\n${data.name}\nCurrent Stock: ${data.quantity}`,
        { position: "top-right" }
      );
    });

    return () => {
      socket.off("low-stock");
    };
  }, [socket]);


  if (loading) return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const kpis = [
    { label: 'Total Products', value: data.totalProducts },
    { label: 'Total Orders', value: data.totalOrders },
    { label: 'Revenue', value: formatCurrency(data.totalRevenue) },
    { label: 'Pending Payments', value: formatCurrency(data.pendingPayments) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Business overview" />

      <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
        <h2 className="text-red-600 font-bold text-lg">
          ⚠ Low Stock Alerts
        </h2>

        {lowStock.length === 0 ? (
          <p className="text-green-600 mt-2">
            All stock levels are healthy
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {lowStock.map((p) => (
              <li key={p._id} className="text-sm">
                <span className="font-semibold">{p.name}</span>
                {' '}— Stock: {p.stock} (Min: {p.minStockLevel})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="font-medium">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-slate-600 hover:underline dark:text-slate-400">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentOrders || []).length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No orders yet</td></tr>
                ) : (
                  data.recentOrders.map((o) => (
                    <tr key={o._id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-2 font-medium">{o.orderNumber}</td>
                      <td className="px-4 py-2">{o.customerName}</td>
                      <td className="px-4 py-2">{formatCurrency(o.total)}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded px-2 py-0.5 text-xs capitalize ${statusClass(o.status)}`}>{o.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="font-medium">Low Stock (&lt; 10 units)</h2>
            <Link to="/products?lowStock=true" className="text-sm text-slate-600 hover:underline dark:text-slate-400">View products</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {(data.lowStockItems || []).length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">Stock levels OK</td></tr>
                ) : (
                  data.lowStockItems.map((p) => (
                    <tr key={p._id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2 text-slate-500">{p.sku}</td>
                      <td className="px-4 py-2 font-medium text-amber-700">{p.quantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 font-medium">Payment Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-slate-500">Paid</p>
            <p className="text-lg font-semibold text-emerald-700">{formatCurrency(data.paidPayments)}</p>
          </div>
          <div>
            <p className="text-slate-500">Pending</p>
            <p className="text-lg font-semibold text-amber-700">{formatCurrency(data.pendingPayments)}</p>
          </div>
          <div>
            <p className="text-slate-500">Pending count</p>
            <p className="text-lg font-semibold">{data.pendingPaymentCount || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
