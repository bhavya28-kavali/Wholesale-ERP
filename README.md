# Wholesale Inventory & Billing Bot

A lightweight ERP for small wholesalers — inventory, orders, GST invoices, barcode lookup, and sales analytics.

## Tech stack

- **Frontend:** React (Vite), TailwindCSS, Framer Motion, React Router, Socket.io client, Chart.js, react-hot-toast
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt
- **PDF invoices:** PDFKit

## Roles

| Role       | Access                                      |
|-----------|----------------------------------------------|
| admin     | Full access                                  |
| manager   | Products, orders, analytics                  |
| accountant| Invoices (+ order list for invoice generation)|
| user      | View products & orders (limited)             |

## Public website

| Route       | Page                                      |
|------------|-------------------------------------------|
| `/`        | Home — hero, bento features, CTA          |
| `/about`   | Mission, values, timeline                 |
| `/features`| Full feature breakdown                    |
| `/pricing` | Starter / Growth / Enterprise plans       |
| `/contact` | Contact form & company info               |
| `/faq`     | Accordion FAQ                             |
| `/login`   | Sign in to ERP                            |
| `/dashboard` | ERP app (authenticated)                 |

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Backend

```bash
cd backend
cp .env.example .env   # edit if needed
npm install
npm run seed           # demo users & products
npm run dev            # http://localhost:8080
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

### Demo logins (after seed)

| Email                   | Password    | Role       |
|-------------------------|-------------|------------|
| admin@wholesale.com     | admin123    | admin      |
| manager@wholesale.com   | manager123  | manager    |
| accountant@wholesale.com| acc123      | accountant |
| user@wholesale.com      | user123     | user       |

### Barcode simulation

On the Products page, scan or type barcodes from seed data, e.g. `8901001001001`.

## API overview

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/auth/login`                 | Login                    |
| POST   | `/api/auth/register`              | Register (first = admin) |
| GET    | `/api/products`                   | List products            |
| GET    | `/api/products/barcode/:code`     | Barcode lookup           |
| GET    | `/api/products/low-stock`         | Low stock alerts         |
| POST   | `/api/orders`                     | Create order (deducts stock) |
| POST   | `/api/invoices/from-order/:id`    | GST invoice from order   |
| GET    | `/api/invoices/:id/pdf`           | Download PDF             |
| GET    | `/api/analytics/dashboard`        | Dashboard stats          |
| GET    | `/api/analytics/sales`            | Sales chart data         |
| GET    | `/api/analytics/activity`         | Recent orders & invoices |
| GET    | `/api/products/history/:id`       | Stock change history     |
| POST   | `/api/products/bulk-delete`       | Bulk deactivate (admin)  |

## Real-time (Socket.io)

Events: `lowStockAlert`, `orderCreated`, `invoiceCreated`, `stockUpdated` — shown as toasts and in the notification bell.

## Project structure

```
wholesale-erp/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/seed.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/          # Design system
        │   └── layout/      # Sidebar, Header
        ├── context/
        ├── hooks/
        ├── pages/
        ├── services/api/
        ├── socket/
        └── utils/
```

## License

MIT
