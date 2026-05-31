import { useState } from 'react';
import { scanBarcode } from '../services/barcodeApi';

export default function BarcodeScanner() {
  const [sku, setSku] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    try {
      setError('');
      const res = await scanBarcode(sku);
      setProduct(res.data);
    } catch (err) {
      setProduct(null);
      setError('Product not found');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Barcode Scanner (Simulation)
      </h1>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="Scan or enter SKU"
          className="border p-2 w-full"
        />

        <button
          onClick={handleScan}
          className="bg-blue-600 text-white px-4"
        >
          Scan
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 mt-3">{error}</p>
      )}

      {/* PRODUCT RESULT */}
      {product && (
        <div className="mt-5 border p-4 rounded shadow">

          <h2 className="text-xl font-bold">
            {product.name}
          </h2>

          <p>SKU: {product.sku}</p>
          <p>Price: ₹{product.unitPrice}</p>
          <p>Stock: {product.stock}</p>

        </div>
      )}

    </div>
  );
}