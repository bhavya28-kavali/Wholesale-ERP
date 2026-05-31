import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Boxes,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccess } from '../utils/roles';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { to: '/products', label: 'Products', icon: Package, page: 'products' },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, page: 'orders' },
  { to: '/invoices', label: 'Invoices', icon: FileText, page: 'invoices' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, page: 'analytics' },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const filtered = navItems.filter((item) => canAccess(user?.role, item.page));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
          <Boxes className="h-8 w-8 text-indigo-600" />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Wholesale ERP</p>
            <p className="text-xs text-slate-500">Inventory & Billing</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {filtered.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
