# Wholesale ERP — Setup

## Workflow

**Products → Create Order → Stock Deducted → Generate Invoice → Record Payment → Track on Dashboard**

## Start

```bash
# Terminal 1 — MongoDB must be running
cd backend && cp .env.example .env && npm install && npm run seed && npm run dev

# Terminal 2
cd frontend && cp .env.example .env && npm install && npm run dev
```

- Marketing site: http://localhost:5173  
- ERP login: http://localhost:5173/login  
- API: http://localhost:8080  

## Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@wholesale.com | admin123 |
| Manager | manager@wholesale.com | manager123 |
| Accountant | accountant@wholesale.com | acc123 |
| User | user@wholesale.com | user123 |

## Seed data

- **50** wholesale products (multiple categories, suppliers, barcodes)
- **5** sample customers
- Low stock flagged when quantity **&lt; 10**

## Role access

| Page | Admin | Manager | Accountant | User |
|------|-------|---------|------------|------|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Products | ✓ edit | ✓ edit | — | view |
| Orders | ✓ full | ✓ full | — | create only |
| Invoices | ✓ | — | ✓ | — |
| Payments | ✓ | — | ✓ | — |
| Analytics | ✓ | ✓ | — | — |

## Order statuses

`pending` → `processing` → `shipped` → `delivered` | `cancelled` (restores stock)

## Payment methods

Cash, UPI, Bank Transfer, Credit Card
