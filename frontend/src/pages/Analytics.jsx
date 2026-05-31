import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { analyticsApi } from '../services/api/index';
import PageHeader from '../components/ui/PageHeader';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

const Analytics = () => {
  const [monthly, setMonthly] = useState([]);
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.revenueMonthly(6),
      analyticsApi.sales(30),
      analyticsApi.products(),
      analyticsApi.categoryDistribution(),
      analyticsApi.lowStockReport(),
    ])
      .then(([m, s, p, c, l]) => {
        setMonthly(m.data);
        setSales(s.data);
        setTopProducts(p.data);
        setCategories(c.data);
        setLowStock(l.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading analytics...</p>;

  const monthlyChart = {
    labels: monthly.map((d) => d.month),
    datasets: [{ label: 'Monthly sales (₹)', data: monthly.map((d) => d.revenue), backgroundColor: '#334155' }],
  };

  const trendChart = {
    labels: sales.map((d) => d.date),
    datasets: [{ label: 'Daily revenue (₹)', data: sales.map((d) => d.revenue), borderColor: '#2563eb', tension: 0.2 }],
  };

  const topChart = {
    labels: topProducts.slice(0, 8).map((p) => p._id?.slice(0, 20) || p.sku),
    datasets: [{ label: 'Units sold', data: topProducts.slice(0, 8).map((p) => p.unitsSold), backgroundColor: '#64748b' }],
  };

  const categoryChart = {
    labels: categories.map((c) => c.category),
    datasets: [{ data: categories.map((c) => c.count), backgroundColor: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#78716c', '#57534e', '#44403c'] }],
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Sales and inventory insights" />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-medium">Monthly sales</h2>
          <div className="h-64"><Bar data={monthlyChart} options={chartOpts} /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-medium">Revenue trend (30 days)</h2>
          <div className="h-64"><Line data={trendChart} options={{ ...chartOpts, scales: { y: { beginAtZero: true } } }} /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-medium">Top selling products</h2>
          <div className="h-64"><Bar data={topChart} options={chartOpts} /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-medium">Category distribution</h2>
          <div className="h-64"><Doughnut data={categoryChart} options={chartOpts} /></div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800">Low stock report (&lt; 10 units)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-800/50">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">No low stock items</td></tr>
              ) : (
                lowStock.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.sku}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2 font-medium text-amber-700">{p.quantity}</td>
                    <td className="px-3 py-2">{p.supplier || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
