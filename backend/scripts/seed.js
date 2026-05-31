import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import StockHistory from '../models/StockHistory.js';
import connectDB from '../config/db.js';

dotenv.config();
await connectDB();

await Promise.all([
  User.deleteMany({}),
  Product.deleteMany({}),
  Customer.deleteMany({}),
  Order.deleteMany({}),
  Invoice.deleteMany({}),
  Payment.deleteMany({}),
  StockHistory.deleteMany({}),
]);

const admin = await User.create({
  name: 'Admin User',
  email: 'admin@wholesale.com',
  password: 'admin123',
  role: 'admin',
});

await User.create([
  { name: 'Store Manager', email: 'manager@wholesale.com', password: 'manager123', role: 'manager' },
  { name: 'Accountant', email: 'accountant@wholesale.com', password: 'acc123', role: 'accountant' },
  { name: 'Sales User', email: 'user@wholesale.com', password: 'user123', role: 'user' },
]);

const customers = await Customer.insertMany([
  { name: 'Sharma Traders', email: 'orders@sharmatraders.in', phone: '9876543210', address: 'Pune, MH', gstin: '27AABCS1234F1Z5' },
  { name: 'Metro Retail Hub', email: 'purchase@metrohub.com', phone: '9123456780', address: 'Mumbai, MH' },
  { name: 'Green Valley Stores', email: 'buy@greenvalley.in', phone: '9988776655', address: 'Nashik, MH' },
  { name: 'City Wholesale Mart', email: 'procurement@citymart.in', phone: '9012345678', address: 'Nagpur, MH' },
  { name: 'Sunrise Distributors', email: 'sales@sunrise.co.in', phone: '8899776655', address: 'Ahmedabad, GJ' },
]);

const catalog = [
  ['Premium Basmati Rice 25kg', 'RICE-25', 'Grains', 1200, 950, 55, 'Agro Foods Ltd'],
  ['Sona Masoori Rice 25kg', 'RICE-SM25', 'Grains', 980, 780, 42, 'Agro Foods Ltd'],
  ['Wheat Flour 10kg', 'FLR-10', 'Grains', 380, 290, 100, 'GrainWorks'],
  ['Wheat Flour 5kg', 'FLR-5', 'Grains', 210, 160, 85, 'GrainWorks'],
  ['Toor Dal 1kg', 'DAL-TOOR1', 'Grains', 145, 118, 60, 'Pulse India'],
  ['Moong Dal 1kg', 'DAL-MOONG1', 'Grains', 132, 105, 48, 'Pulse India'],
  ['Sunflower Oil 5L', 'OIL-SF5', 'Oil', 650, 520, 8, 'Golden Oil Co'],
  ['Sunflower Oil 1L', 'OIL-SF1', 'Oil', 145, 115, 35, 'Golden Oil Co'],
  ['Mustard Oil 1L', 'OIL-MU1', 'Oil', 165, 130, 28, 'Golden Oil Co'],
  ['Refined Palm Oil 15L', 'OIL-PALM15', 'Oil', 1680, 1420, 12, 'Golden Oil Co'],
  ['Sugar 1kg', 'SUG-1', 'Essentials', 48, 38, 5, 'SweetCorp'],
  ['Sugar 5kg', 'SUG-5', 'Essentials', 225, 185, 40, 'SweetCorp'],
  ['Salt Iodized 1kg', 'SALT-1', 'Essentials', 22, 15, 90, 'SaltWorks'],
  ['Tea Premium 500g', 'TEA-500', 'Beverages', 320, 250, 40, 'Hill Tea Estates'],
  ['Tea Economy 250g', 'TEA-250', 'Beverages', 145, 110, 55, 'Hill Tea Estates'],
  ['Instant Coffee 200g', 'COF-200', 'Beverages', 420, 340, 22, 'Brew Masters'],
  ['Soft Drink Crate 24x300ml', 'BEV-SDC24', 'Beverages', 720, 580, 18, 'Refresh Beverages'],
  ['Mineral Water 1L x12', 'BEV-WAT12', 'Beverages', 180, 140, 65, 'Pure Aqua'],
  ['Detergent Powder 1kg', 'HOU-DET1', 'Household', 95, 72, 50, 'CleanHome'],
  ['Dishwash Liquid 750ml', 'HOU-DSH750', 'Household', 85, 62, 38, 'CleanHome'],
  ['Floor Cleaner 1L', 'HOU-FLR1', 'Household', 110, 85, 30, 'CleanHome'],
  ['Toilet Cleaner 500ml', 'HOU-TCL500', 'Household', 75, 55, 44, 'CleanHome'],
  ['Broom Stick Premium', 'HOU-BRM1', 'Household', 65, 42, 25, 'HomeTools'],
  ['Mop Set Industrial', 'HOU-MOP1', 'Household', 280, 210, 15, 'HomeTools'],
  ['Biscuit Assorted 1kg', 'SNK-BIS1', 'Snacks', 180, 140, 70, 'SnackNation'],
  ['Namkeen Mix 500g', 'SNK-NMK500', 'Snacks', 95, 72, 45, 'SnackNation'],
  ['Potato Chips 12 Pack', 'SNK-CHP12', 'Snacks', 240, 185, 32, 'Crunchy Foods'],
  ['Chocolate Bar Box 24', 'SNK-CHO24', 'Snacks', 480, 390, 20, 'Sweet Treats'],
  ['Turmeric Powder 500g', 'SPC-TUR500', 'Spices', 85, 62, 55, 'Spice Route'],
  ['Red Chilli Powder 500g', 'SPC-CHI500', 'Spices', 92, 68, 48, 'Spice Route'],
  ['Coriander Powder 500g', 'SPC-COR500', 'Spices', 78, 58, 52, 'Spice Route'],
  ['Garam Masala 100g', 'SPC-GAR100', 'Spices', 55, 40, 60, 'Spice Route'],
  ['Cumin Seeds 500g', 'SPC-CUM500', 'Spices', 165, 130, 35, 'Spice Route'],
  ['Hand Wash 250ml', 'PC-HW250', 'Personal Care', 65, 48, 42, 'CarePlus'],
  ['Bath Soap 125g x6', 'PC-SOP6', 'Personal Care', 210, 165, 55, 'CarePlus'],
  ['Shampoo 340ml', 'PC-SHP340', 'Personal Care', 185, 145, 28, 'CarePlus'],
  ['Toothpaste 200g', 'PC-TPT200', 'Personal Care', 95, 72, 50, 'OralFresh'],
  ['Tissue Roll 6 Pack', 'PC-TIS6', 'Personal Care', 120, 90, 40, 'SoftPaper'],
  ['UHT Milk 1L x12', 'DAI-MLK12', 'Dairy', 780, 640, 25, 'DairyFresh'],
  ['Paneer 1kg Block', 'DAI-PNR1', 'Dairy', 320, 260, 8, 'DairyFresh'],
  ['Butter 500g', 'DAI-BTR500', 'Dairy', 285, 230, 18, 'DairyFresh'],
  ['Frozen Peas 1kg', 'FRZ-PEA1', 'Frozen', 95, 72, 30, 'ColdStore'],
  ['Frozen Corn 1kg', 'FRZ-CRN1', 'Frozen', 88, 65, 28, 'ColdStore'],
  ['Frozen Paratha 20pc', 'FRZ-PAR20', 'Frozen', 220, 175, 22, 'ColdStore'],
  ['Plastic Bucket 20L', 'GEN-BKT20', 'General', 145, 105, 35, 'Plastix'],
  ['Steel Scrubber Pack 12', 'GEN-SCR12', 'General', 85, 58, 48, 'HomeTools'],
  ['Matchbox Carton 100', 'GEN-MAT100', 'General', 420, 340, 15, 'FireLite'],
  ['Notebook A4 200pg x10', 'GEN-NOT10', 'General', 350, 280, 20, 'PaperCo'],
  ['LED Bulb 9W x10', 'GEN-LED10', 'General', 680, 540, 12, 'BrightLite'],
  ['Packaging Tape 6 Roll', 'GEN-TAPE6', 'General', 240, 185, 38, 'PackRight'],
];

const products = catalog.map(([name, sku, category, unitPrice, costPrice, quantity, supplier], i) => ({
  name,
  sku,
  barcode: `8902001${String(i + 1).padStart(5, '0')}`,
  category,
  unitPrice,
  costPrice,
  quantity,
  supplier,
  status: quantity < 10 ? 'active' : 'active',
  isActive: true,
  lowStockThreshold: 10,
  gstPercent: category === 'Grains' || category === 'Essentials' ? 5 : 18,
  createdBy: admin._id,
}));

await Product.insertMany(products);

console.log('Seed complete!');
console.log('Users: admin@wholesale.com / admin123 (+ manager, accountant, user)');
console.log(`Products: ${products.length} | Customers: ${customers.length}`);
process.exit(0);
