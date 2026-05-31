import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, CreditCard, Boxes } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { canAccess } from '../../utils/roles';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { to: '/products', label: 'Products', icon: Package, page: 'products' },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, page: 'orders' },
  { to: '/invoices', label: 'Invoices', icon: FileText, page: 'invoices' },
  { to: '/payments', label: 'Payments', icon: CreditCard, page: 'payments' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, page: 'analytics' },
];

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { user } = useAuth();
  const filtered = navItems.filter((item) => canAccess(user?.role, item.page));

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onMobileClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <Boxes className="h-7 w-7 text-slate-700 dark:text-slate-200" />
          <div>
            <p className="text-sm font-semibold">Wholesale ERP</p>
            <p className="text-xs text-slate-500">Inventory & Billing</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {filtered.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4 text-sm dark:border-slate-800">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
