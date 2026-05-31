import { motion } from 'framer-motion';
import Card from './Card';

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-600 dark:text-indigo-400',
  emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-600 dark:text-emerald-400',
  amber: 'from-amber-500/20 to-amber-600/5 text-amber-600 dark:text-amber-400',
  rose: 'from-rose-500/20 to-rose-600/5 text-rose-600 dark:text-rose-400',
};

const KpiCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.08, duration: 0.35 }}
  >
    <Card className="relative overflow-hidden">
      <div
        className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${colorMap[color]}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl bg-gradient-to-br p-2.5 ${colorMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  </motion.div>
);

export default KpiCard;
