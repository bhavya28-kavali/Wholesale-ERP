import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Scan,
  Bell,
  Shield,
  Layers,
  Download,
  History,
} from 'lucide-react';
import SectionReveal from '../../components/marketing/SectionReveal';
import Button from '../../components/ui/Button';

const featureGroups = [
  {
    category: 'Inventory',
    features: [
      {
        icon: Package,
        title: 'Smart product catalog',
        desc: 'Categories, SKU, barcode, cost & sell price, GST %, and low-stock thresholds.',
      },
      {
        icon: Scan,
        title: 'Barcode scanner',
        desc: 'Find and highlight products instantly from the warehouse floor.',
      },
      {
        icon: History,
        title: 'Stock history',
        desc: 'Every quantity change logged — manual, orders, and adjustments.',
      },
      {
        icon: Bell,
        title: 'Live low-stock alerts',
        desc: 'Socket notifications and dashboard widgets before you run out.',
      },
    ],
  },
  {
    category: 'Sales & billing',
    features: [
      {
        icon: ShoppingCart,
        title: 'Orders with auto-deduct',
        desc: 'Create orders that reserve stock atomically with GST line totals.',
      },
      {
        icon: FileText,
        title: 'GST tax invoices',
        desc: 'CGST/SGST or IGST, place of supply, professional PDF export.',
      },
      {
        icon: Download,
        title: 'Print & PDF',
        desc: 'Print-friendly invoice preview and one-click PDF download.',
      },
    ],
  },
  {
    category: 'Insights & control',
    features: [
      {
        icon: BarChart3,
        title: 'Advanced analytics',
        desc: 'Revenue trends, profit charts, best sellers, and stock predictions.',
      },
      {
        icon: Shield,
        title: 'Role-based access',
        desc: 'Admin, manager, accountant, and read-only user — UI adapts per role.',
      },
      {
        icon: Layers,
        title: 'Premium UX',
        desc: 'Dark mode, skeleton loaders, toasts, modals, and collapsible sidebar.',
      },
    ],
  },
];

const Features = () => (
  <div className="pt-28 pb-20 sm:pt-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionReveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">Features</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
          Every tool your wholesale team needs
        </h1>
        <p className="mt-6 text-lg text-slate-400">
          From receiving goods to collecting payment — one cohesive platform with enterprise-grade
          polish.
        </p>
      </SectionReveal>

      <div className="mt-20 space-y-24">
        {featureGroups.map((group, gi) => (
          <section key={group.category}>
            <SectionReveal>
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
                <span className="h-8 w-1 rounded-full bg-indigo-500" />
                {group.category}
              </h2>
            </SectionReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {group.features.map((f, i) => (
                <SectionReveal key={f.title} delay={i * 0.06}>
                  <div className="group flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/40 hover:bg-indigo-500/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 transition group-hover:scale-110">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      <SectionReveal className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 p-10 text-center">
        <h2 className="text-2xl font-bold text-white">See it live in your browser</h2>
        <p className="mt-3 text-slate-400">Spin up the demo with seeded data in under 2 minutes.</p>
        <Link to="/login" className="mt-8 inline-block">
          <Button size="lg">Open demo workspace</Button>
        </Link>
      </SectionReveal>
    </div>
  </div>
);

export default Features;
