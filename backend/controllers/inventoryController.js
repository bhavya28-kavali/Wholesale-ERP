import InventoryTransaction from "../models/InventoryTransaction.js";

export const getInventoryHistory = async (req, res) => {
  try {
    const history = await InventoryTransaction.find()
      .populate("product")
      .populate("performedBy")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};