import { useEffect, useState } from 'react';
import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePOStatus
} from '../services/purchaseOrderApi';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);

  const loadPO = async () => {
    const res = await getPurchaseOrders();
    setOrders(res.data);
  };

  useEffect(() => {
    loadPO();
  }, []);

  const markReceived = async (id) => {
    await updatePOStatus(id, 'Received');
    loadPO();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>

      <div className="space-y-4">
        {orders.map((po) => (
          <div key={po._id} className="border p-4 rounded">

            <div className="flex justify-between">
              <div>
                <p className="font-bold">
                  Supplier: {po.supplier?.name}
                </p>

                <p>Status: {po.status}</p>
              </div>

              {po.status !== 'Received' && (
                <button
                  onClick={() => markReceived(po._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Mark Received
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}