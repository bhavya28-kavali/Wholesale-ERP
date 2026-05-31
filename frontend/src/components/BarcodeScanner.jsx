import { useState } from 'react';
import { ScanBarcode, Search } from 'lucide-react';
import api from '../services/api';

const BarcodeScanner = ({ onProductFound }) => {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!barcode.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(
        `/products/barcode/${encodeURIComponent(barcode.trim())}`
      );

      onProductFound?.(data.data);
      setBarcode('');
    } catch (err) {
      console.error(err);
      setError('No product found for this barcode');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScan();
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
        <ScanBarcode className="h-5 w-5" />
        Barcode Scan Simulation
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scan or type barcode..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          autoFocus
        />

        <button
          type="button"
          onClick={handleScan}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {loading ? 'Searching...' : 'Lookup'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        Try: 8901001001001, 8901001001002 (from seed data)
      </p>
    </div>
  );
};

export default BarcodeScanner;