import { useEffect, useState } from 'react';
import { invoiceApi, orderApi } from '../services/api/index';
import useAuth from '../hooks/useAuth';
import { canManageInvoices } from '../utils/roles';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2
  })}`;

const company = {
  name: import.meta.env.VITE_COMPANY_NAME,
  gstin: import.meta.env.VITE_COMPANY_GSTIN,
  address: import.meta.env.VITE_COMPANY_ADDRESS,
  logo: import.meta.env.VITE_COMPANY_LOGO,
};

export default function Invoices() {
  const { user } = useAuth();
  const canEdit = canManageInvoices(user?.role);

  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // =========================
  // LOAD DATA
  // =========================
  const load = async () => {
    setLoading(true);
    try {
      const inv = await invoiceApi.list();
      setInvoices(inv.data || []);

      if (canEdit) {
        const ord = await orderApi.list();
        setOrders(
          (ord.data || []).filter((o) => o.status !== 'cancelled')
        );
      }

      setError('');
    } catch (err) {
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // GENERATE INVOICE
  // =========================
  const generateInvoice = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await invoiceApi.fromOrder(selectedOrder, {
        placeOfSupply: 'Maharashtra',
        isInterState: false
      });

      setMessage('GST invoice generated successfully.');
      setSelectedOrder('');
      load();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not generate invoice.'
      );
    }
  };

const handlePayment = async (invoice) => {
  try {
    // 1. Create order
    const { data } = await api.post("/payments/razorpay/order", {
      amount: invoice.grandTotal,
      invoiceId: invoice._id,
    });

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      name: "ERP System",
      order_id: data.order.id,

      handler: async function (response) {
        try {
          await api.post("/payments/razorpay/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            invoiceId: invoice._id,
            amount: invoice.grandTotal,
          });

          alert("Payment Successful!");
        } catch (err) {
          alert("Payment verified but failed to record in system");
        }
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error(err);
    alert("Failed to initiate payment");
  }
};

  // =========================
  // PAYMENT UPDATE
  // =========================
  const updatePayment = async (id, status) => {
    try {
      await invoiceApi.updatePayment(id, status);
      setMessage('Payment status updated.');
      load();
    } catch {
      setError('Failed to update payment.');
    }
  };

  // =========================
  // PDF DOWNLOAD
  // =========================
  const downloadPdf = async (id, invoiceNumber) => {
    try {
      const token = localStorage.getItem('token');
      const base = import.meta.env.VITE_API_URL;

      const res = await fetch(`${base}/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch {
      setError('PDF download failed.');
    }
  };

  const inputClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800';

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-4">
      <PageHeader title="Invoices" subtitle="GST tax invoices" />

      {/* MESSAGES */}
      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* GENERATE INVOICE */}
      {canEdit && (
        <form
          onSubmit={generateInvoice}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-end dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium">
              Generate from order
            </label>

            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              required
              className={`${inputClass} w-full`}
            >
              <option value="">Select order</option>
              {orders.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.orderNumber} — {o.customerName} (
                  {formatCurrency(o.total)})
                </option>
              ))}
            </select>
          </div>

          <Button type="submit">Generate invoice</Button>
        </form>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-3 py-2 text-left">Invoice #</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Payment</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="px-3 py-2 font-medium">
                    {inv.invoiceNumber}
                  </td>

                  <td className="px-3 py-2">{inv.customerName}</td>

                  <td className="px-3 py-2">
                    {formatCurrency(inv.grandTotal)}
                  </td>

                  <td className="px-3 py-2">
                    {canEdit ? (
                      <select
                        value={inv.paymentStatus}
                        onChange={(e) =>
                          updatePayment(inv._id, e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                    ) : (
                      inv.paymentStatus
                    )}
                  </td>

                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        downloadPdf(inv._id, inv.invoiceNumber)
                      }
                      className="hover:underline"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* INVOICE PREVIEW */}
      {viewInvoice && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-900">
          
          <div className="mb-4 flex justify-between border-b pb-4">
            <div>
              {company.logo && (
                <img src={company.logo} className="h-10 mb-2" />
              )}
              <p className="text-lg font-semibold">{company.name}</p>
              <p className="text-slate-500">GSTIN: {company.gstin}</p>
              <p className="text-slate-500">{company.address}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">TAX INVOICE</p>
              <p>{viewInvoice.invoiceNumber}</p>
              <p>
                {new Date(
                  viewInvoice.invoiceDate ||
                    viewInvoice.createdAt
                ).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          <p className="mb-4">
            <strong>Bill To:</strong> {viewInvoice.customerName}
          </p>

          <table className="mb-4 w-full">
            <thead>
              <tr className="text-left text-xs uppercase">
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {viewInvoice.items?.map((item, i) => (
                <tr key={i}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{item.gstPercent}%</td>
                  <td className="text-right">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto max-w-xs text-right space-y-1">
            <p>
              Subtotal: {formatCurrency(viewInvoice.subtotal)}
            </p>
            <p>
              GST: {formatCurrency(viewInvoice.gstTotal)}
            </p>
            <p className="font-bold text-base">
              Total: {formatCurrency(viewInvoice.grandTotal)}
            </p>
          </div>

          <div className="mt-4 flex gap-2 print:hidden">
            <Button onClick={() => window.print()}>
              Print
            </Button>

            <Button
              onClick={() =>
                downloadPdf(
                  viewInvoice._id,
                  viewInvoice.invoiceNumber
                )
              }
            >
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}