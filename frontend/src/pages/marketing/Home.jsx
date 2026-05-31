import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import HeroVisual from '../../components/marketing/HeroVisual';
import FeatureMarquee from '../../components/marketing/FeatureMarquee';
import SectionReveal from '../../components/marketing/SectionReveal';
import AnimatedCounter from '../../components/marketing/AnimatedCounter';
import LogoCloud from '../../components/marketing/LogoCloud';
import InteractiveShowcase from '../../components/marketing/InteractiveShowcase';
import Testimonials from '../../components/marketing/Testimonials';
import Button from '../../components/ui/Button';

const stats = [
  { value: '40%', label: 'Less stockouts' },
  { value: '2×', label: 'Faster invoicing' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500+', label: 'SKUs supported' },
];

const bento = [
  {
    title: 'Live inventory',
    desc: 'Socket-powered low stock alerts the moment quantity drops.',
    className: 'md:col-span-2 md:row-span-2',
    gradient: 'from-indigo-600/30 to-violet-600/10',
    icon: '📦',
  },
  {
    title: 'GST invoices',
    desc: 'CGST/SGST/IGST split, PDF export, print-ready layout.',
    className: 'md:col-span-1',
    gradient: 'from-emerald-600/20 to-teal-600/5',
    icon: '🧾',
  },
  {
    title: 'Barcode ready',
    desc: 'Scan to find products instantly on the warehouse floor.',
    className: 'md:col-span-1',
    gradient: 'from-amber-600/20 to-orange-600/5',
    icon: '📱',
  },
  {
    title: 'Analytics',
    desc: 'Revenue, profit, and demand forecasting in one view.',
    className: 'md:col-span-2',
    gradient: 'from-rose-600/20 to-pink-600/5',
    icon: '📈',
  },
];

const Home = () => (
  <>
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-60" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex h-2 w-2 rounded-full bg-emerald-400"
              />
              <Sparkles className="h-4 w-4" />
              Built for Indian wholesale & distribution
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            >
              The wholesale ERP that feels like{' '}
              <span className="gradient-text-animated">magic</span>
              {' '}— not legacy software
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
            >
              Inventory, orders, GST billing, and real-time analytics in one premium workspace.
              Ship faster. Invoice correctly. Never miss a reorder.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-indigo-500 to-violet-600 px-8 shadow-xl shadow-indigo-500/30 hover:from-indigo-400 hover:to-violet-500"
                >
                  Start free trial
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!border-white/20 !bg-white/5 !text-white hover:!bg-white/10"
                >
                  <Play className="h-4 w-4" />
                  See features
                </Button>
              </Link>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400"
            >
              {['No credit card', 'GST compliant', 'Setup in 5 minutes'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>

          <HeroVisual />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-white/20 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-2 w-1 rounded-full bg-white/60"
          />
        </div>
      </motion.div>
    </section>

    <FeatureMarquee />
    <LogoCloud />

    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Numbers that matter to distributors
          </h2>
        </SectionReveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition hover:border-indigo-500/40">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/10 opacity-0 transition group-hover:opacity-100" />
                <p className="relative text-3xl font-bold text-white sm:text-4xl">
                  <AnimatedCounter value={s.value} />
                </p>
                <p className="relative mt-2 text-sm text-slate-400">{s.label}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    <InteractiveShowcase />

    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-12 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-400">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-widest">Platform</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            One platform. Every workflow.
          </h2>
        </SectionReveal>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {bento.map((item, i) => (
            <SectionReveal key={item.title} delay={i * 0.06} className={item.className}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex h-full min-h-[160px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br ${item.gradient} p-6 backdrop-blur-sm`}
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    <Testimonials />

    <section className="py-20 sm:py-28">
      <SectionReveal>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 p-[1px]">
            <div className="cta-shine absolute inset-0" aria-hidden />
            <div className="relative rounded-[23px] bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950 px-8 py-16 text-center sm:px-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to modernize your wholesale ops?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-300">
                Join distributors who ship faster, invoice correctly, and never miss a reorder.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white !text-slate-900 hover:!bg-slate-100">
                    Create your workspace
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="secondary" size="lg" className="!border-white/30 !bg-transparent !text-white">
                    Read FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  </>
);

export default Home;
