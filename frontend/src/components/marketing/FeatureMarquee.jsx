import { Package, BarChart3, FileText, Scan, Zap, Shield, Users, Bell } from 'lucide-react';

const items = [
  { icon: Package, text: 'Real-time inventory' },
  { icon: FileText, text: 'GST invoices' },
  { icon: BarChart3, text: 'Profit analytics' },
  { icon: Scan, text: 'Barcode scanning' },
  { icon: Zap, text: 'Instant alerts' },
  { icon: Shield, text: 'Role-based access' },
  { icon: Users, text: 'Multi-user teams' },
  { icon: Bell, text: 'Low stock warnings' },
];

const FeatureMarquee = () => (
  <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
    <div className="marquee-track flex gap-8">
      {[...items, ...items].map(({ icon: Icon, text }, i) => (
        <div
          key={i}
          className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-300"
        >
          <Icon className="h-4 w-4 text-indigo-400" />
          {text}
        </div>
      ))}
    </div>
  </div>
);

export default FeatureMarquee;
