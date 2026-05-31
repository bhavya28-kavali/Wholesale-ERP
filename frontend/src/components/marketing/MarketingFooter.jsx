import { Link } from 'react-router-dom';
import { Boxes, Mail, Share2, Globe } from 'lucide-react';

const footerLinks = {
  Product: [
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/login', label: 'Sign in' },
  ],
  Company: [
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ],
  Legal: [
    { to: '/contact', label: 'Privacy' },
    { to: '/contact', label: 'Terms' },
  ],
};

const MarketingFooter = () => (
  <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-white">
            <Boxes className="h-8 w-8 text-indigo-400" />
            <span className="text-lg font-bold">Wholesale ERP</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Modern inventory and GST billing for wholesale distributors. Real-time stock,
            invoices, and analytics in one premium workspace.
          </p>
          <div className="mt-6 flex gap-3">
            {[Mail, Share2, Globe].map((Icon, i) => (
              <a
                key={i}
                href={i === 0 ? 'mailto:hello@wholesaleerp.com' : '#'}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm transition hover:text-indigo-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
        <p>© {new Date().getFullYear()} Wholesale ERP. Built for Indian wholesale businesses.</p>
        <p>GST-ready · Real-time inventory · Role-based access</p>
      </div>
    </div>
  </footer>
);

export default MarketingFooter;
