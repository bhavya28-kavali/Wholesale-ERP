export const ROLE_ACCESS = {
  admin: ['dashboard', 'products', 'orders', 'invoices', 'payments', 'analytics'],
  manager: ['dashboard', 'products', 'orders', 'analytics'],
  accountant: ['dashboard', 'invoices', 'payments'],
  user: ['dashboard', 'products', 'orders'],
};

export const canAccess = (role, page) => ROLE_ACCESS[role]?.includes(page) ?? false;

export const canManageProducts = (role) => ['admin', 'manager'].includes(role);
export const canCreateOrders = (role) => ['admin', 'manager', 'user'].includes(role);
export const canEditOrders = (role) => ['admin', 'manager'].includes(role);
export const canManageInvoices = (role) => ['admin', 'accountant'].includes(role);
export const canManagePayments = (role) => ['admin', 'accountant'].includes(role);
export const canViewAnalytics = (role) => ['admin', 'manager'].includes(role);
