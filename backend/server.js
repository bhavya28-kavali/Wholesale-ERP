import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initSocket } from './socket/socket.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import inventoryRoutes from "./routes/inventoryRoutes.js";
import supplierRoutes from './routes/supplierRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import barcodeRoutes from './routes/barcodeRoutes.js';
import alertRoutes from './routes/alertRoutes.js';


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
// SOCKET INIT (backend only)
const io = initSocket(server);
app.set('io', io);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

app.use(
  "/api/payments/razorpay/webhook",
  express.raw({ type: "application/json" })
);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date() })
);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/barcodes', barcodeRoutes);
app.use('/api/alerts', alertRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;


server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);