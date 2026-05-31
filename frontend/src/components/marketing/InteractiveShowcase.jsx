import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, FileText, BarChart3, Bell } from 'lucide-react';
import SectionReveal from './SectionReveal';

const tabs = [
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    title: 'Know your stock before it runs out',
    points: [
      'Category & barcode filters',
      'Inline quantity edits',
      'Stock history audit trail',
      'Real-time low-stock socket alerts',
    ],
    preview: (
      <div className="space-y-2 p-4">
        {['Organic Rice 25kg', 'Sunflower Oil 5L', 'Masala Mix 500g'].map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <span className="text-slate-200">{name}</span>
            <span className={i === 0 ? 'text-amber-400' : 'text-emerald-400'}>
              {i === 0 ? '8 left' : `${120 - i * 40} units`}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'billing',
    label: 'GST Billing',
    icon: FileText,
    title: 'Invoices your accountant will actually love',
    points: [
      'CGST / SGST / IGST auto-split',
      'PDF & print-ready layout',
      'Generate from orders in one click',
      'Payment status tracking',
    ],
    preview: (
      <div className="p-4 font-mono text-xs text-slate-400">
        <p className="text-center text-sm font-bold text-white">TAX INVOICE</p>
        <p className="mt-2">INV-2026-0042</p>
        <div className="mt-3 space-y-1 border-t border-white/10 pt-2">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>₹45,200</span>
          </div>
          <div className="flex justify-between">
            <span>CGST 9%</span>
            <span>₹4,068</span>
          </div>
          <div className="flex justify-between font-bold text-emerald-400">
            <span>Grand Total</span>
            <span>₹53,336</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    title: 'Decisions backed by profit, not guesswork',
    points: [
      '14-day profit vs revenue chart',
      'Best-selling SKU ranking',
      'Low-stock prediction engine',
      'Monthly revenue bars',
    ],
    preview: (
      <div className="flex h-32 items-end gap-1 p-4">
        {[35, 55, 40, 70, 50, 85, 65, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-violet-400"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'alerts',
    label: 'Live alerts',
    icon: Bell,
    title: 'Your team hears it the moment something happens',
    points: [
      'Order placed notifications',
      'Invoice generated toasts',
      'Notification bell history',
      'Role-based socket rooms',
    ],
    preview: (
      <div className="space-y-2 p-4">
        {[
          { t: 'Low stock: Rice 25kg', c: 'amber' },
          { t: 'Order ORD-1089 placed', c: 'emerald' },
          { t: 'Invoice INV-0042 ready', c: 'indigo' },
        ].map(({ t, c }) => (
          <div
            key={t}
            className={`rounded-lg border px-3 py-2 text-xs ${
              c === 'amber'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                : c === 'emerald'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                  : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'
            }`}
          >
            {t}
          </div>
        ))}
      </div>
    ),
  },
];

const InteractiveShowcase = () => {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            Product tour
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Explore the platform — tab by tab
          </h2>
        </SectionReveal>

        <SectionReveal>
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  active === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white">{current.title}</h3>
                <ul className="mt-6 space-y-3">
                  {current.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-indigo-500/20 blur-2xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-white/10 px-4 py-2 text-xs text-slate-500">
                    Live preview · {current.label}
                  </div>
                  {current.preview}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
