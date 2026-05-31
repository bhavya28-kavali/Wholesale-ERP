import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

const Header = ({ onMenuClick }) => {
  const { logout, theme, toggleTheme, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:px-6">
      <button type="button" onClick={onMenuClick} className="rounded p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
        <Menu className="h-5 w-5" />
      </button>
      <p className="hidden text-sm text-slate-600 lg:block dark:text-slate-300">
        Signed in as <span className="font-medium capitalize">{user?.role}</span>
      </p>
      <div className="ml-auto flex items-center gap-4">
        <NotificationBell />
        <button type="button" onClick={toggleTheme} className="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
