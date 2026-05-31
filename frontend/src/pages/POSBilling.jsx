import { useState } from 'react';
import { scanBarcode } from '../services/barcodeApi';

export default function POSBilling() {
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!barcode.trim()) return;

    try {
      setError('');

      const res = await scanBarcode(barcode);
      const product = res.data;

      const existing = cart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        setCart(
          cart.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          )
        );
      } else {
        setCart([
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ]);
      }

      setBarcode('');
    } catch (err) {
      setError('Product not found');
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        POS Billing
      </h1>

      {/* Barcode Input */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan barcode..."
          className="w-full border rounded-lg px-4 py-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleScan();
            }
          }}
        />
      </div>

      {error && (
        <p className="text-red-500 mt-2">
          {error}
        </p>
      )}

      {/* Cart Table */}
      <div className="bg-white rounded-lg shadow mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 text-left">
                Product
              </th>
              <th className="p-3 text-center">
                Qty
              </th>
              <th className="p-3 text-center">
                Price
              </th>
              <th className="p-3 text-center">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-500"
                >
                  No products scanned
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr
                  key={item._id}
                  className="border-t"
                >
                  <td className="p-3">
                    {item.name}
                  </td>

                  <td className="text-center">
                    {item.quantity}
                  </td>

                  <td className="text-center">
                    ₹{item.unitPrice}
                  </td>

                  <td className="text-center">
                    ₹
                    {(
                      item.quantity *
                      item.unitPrice
                    ).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Billing Summary */}
      <div className="mt-6 ml-auto max-w-sm bg-white rounded-lg shadow p-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>GST (18%)</span>
          <span>
            ₹{gst.toFixed(2)}
          </span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}