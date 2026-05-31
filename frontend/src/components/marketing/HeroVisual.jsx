import { motion } from 'framer-motion';
import { Package, TrendingUp, FileText, Bell } from 'lucide-react';

const float = (delay) => ({
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity, delay, ease: 'easeInOut' },
});

const HeroVisual = () => (
  <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/30 to-violet-500/30 blur-3xl" />
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl"
      style={{ perspective: 1200 }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs text-slate-500">app.wholesale-erp.com/dashboard</span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Good morning</p>
            <p className="text-lg font-semibold text-white">Revenue overview</p>
          </div>
          <motion.div animate={float(0)} className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </motion.div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {[
            { label: 'Revenue', value: '₹12.4L', icon: TrendingUp, color: 'from-rose-500/20 to-rose-600/5' },
            { label: 'Products', value: '248', icon: Package, color: 'from-indigo-500/20 to-indigo-600/5' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              animate={float(i * 0.5)}
              className={`rounded-xl border border-white/5 bg-gradient-to-br ${card.color} p-3`}
            >
              <card.icon className="mb-2 h-4 w-4 text-indigo-400" />
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="text-lg font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-800/50 p-3">
          <div className="mb-3 flex items-end gap-1 h-16">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-indigo-400"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">Profit trend · Last 14 days</p>
        </div>

        <motion.div
          animate={float(1)}
          className="mt-3 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2"
        >
          <FileText className="h-4 w-4 text-amber-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-amber-200">Low stock: Organic Rice 25kg</p>
            <p className="text-[10px] text-amber-400/80">8 units left · Reorder suggested</p>
          </div>
        </motion.div>
      </div>
    </motion.div>

    <motion.div
      animate={float(0.3)}
      className="absolute -left-4 top-1/4 hidden rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl lg:block"
    >
      <p className="text-xs text-slate-500">Orders today</p>
      <p className="text-2xl font-bold text-emerald-400">+24</p>
    </motion.div>

    <motion.div
      animate={float(0.8)}
      className="absolute -right-2 bottom-1/4 hidden rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl lg:block"
    >
      <p className="text-xs text-slate-500">GST invoices</p>
      <p className="text-2xl font-bold text-indigo-400">98%</p>
      <p className="text-[10px] text-slate-500">on-time</p>
    </motion.div>
  </div>
);

export default HeroVisual;
