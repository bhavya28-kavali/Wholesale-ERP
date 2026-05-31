import { Outlet } from 'react-router-dom';
import MarketingNav from './MarketingNav';
import MarketingFooter from './MarketingFooter';
import FloatingOrbs from './FloatingOrbs';

const MarketingLayout = () => (
  <div className="marketing-site relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
    <FloatingOrbs />
    <div className="marketing-mesh pointer-events-none fixed inset-0" aria-hidden />
    <div className="marketing-grid pointer-events-none fixed inset-0 opacity-[0.15]" aria-hidden />
    <div className="noise-overlay pointer-events-none fixed inset-0 opacity-[0.03]" aria-hidden />
    <MarketingNav />
    <main className="relative">
      <Outlet />
    </main>
    <MarketingFooter />
  </div>
);

export default MarketingLayout;
