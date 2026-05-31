import { useEffect, useState } from "react";
import API from "../services/analyticsApi";

export default function InventoryHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await API.get("/inventory");
    setHistory(data);
  };

  return (
    <div>
      <h2>Inventory History</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Old Qty</th>
            <th>New Qty</th>
            <th>Action</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item) => (
            <tr key={item._id}>
              <td>{item.product?.name}</td>
              <td>{item.previousQty}</td>
              <td>{item.newQty}</td>
              <td>{item.action}</td>
              <td>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}