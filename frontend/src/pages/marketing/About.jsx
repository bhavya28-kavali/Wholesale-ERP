import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Heart, Rocket, Users, Award, Globe2 } from 'lucide-react';
import SectionReveal from '../../components/marketing/SectionReveal';
import AnimatedCounter from '../../components/marketing/AnimatedCounter';
import Button from '../../components/ui/Button';

const values = [
  {
    icon: Target,
    title: 'Clarity over clutter',
    desc: 'We design for distributors who need answers in seconds — not another bloated ERP.',
  },
  {
    icon: Heart,
    title: 'India-first',
    desc: 'GST splits, rupee formatting, and wholesale workflows baked in from day one.',
  },
  {
    icon: Rocket,
    title: 'Ship fast',
    desc: 'Real-time sockets, instant PDFs, and modals instead of page hops.',
  },
  {
    icon: Users,
    title: 'Teams that scale',
    desc: 'Admin, manager, accountant, and floor staff — each role sees what they need.',
  },
];

const team = [
  { name: 'Product & Design', role: 'Crafting the premium ERP experience', initial: 'P' },
  { name: 'Engineering', role: 'MERN stack, sockets, GST logic', initial: 'E' },
  { name: 'Customer success', role: 'Onboarding wholesale teams daily', initial: 'C' },
];

const milestones = [
  { year: '2024', title: 'The problem', desc: 'Spreadsheets couldn’t keep up with multi-SKU wholesale.' },
  { year: '2025', title: 'First prototype', desc: 'Inventory + orders + GST in one MERN stack.' },
  { year: '2026', title: 'Premium ERP', desc: 'Real-time alerts, analytics, SaaS-grade marketing site.' },
];

const impactStats = [
  { value: '50+', label: 'Beta teams' },
  { value: '1M+', label: 'Line items tracked' },
  { value: '24/7', label: 'Cloud ready' },
];

const About = () => (
  <div className="pt-28 pb-20 sm:pt-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionReveal className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600"
        >
          <Globe2 className="h-8 w-8 text-white" />
        </motion.div>
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">About us</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          We&apos;re building the{' '}
          <span className="gradient-text-animated">operating system</span>
          {' '}for modern wholesale
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-400">
          Wholesale ERP started as a practical tool for inventory-heavy businesses tired of
          disconnected tools. Today it&apos;s a full platform — from barcode floor checks to
          accountant-ready GST invoices.
        </p>
      </SectionReveal>

      <SectionReveal className="mt-20">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 sm:grid-cols-3 sm:p-10">
          {impactStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">
                <AnimatedCounter value={s.value} />
              </p>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      <section className="mt-24">
        <SectionReveal>
          <h2 className="mb-12 text-center text-2xl font-bold text-white">What we believe</h2>
        </SectionReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <SectionReveal key={v.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="h-full rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{v.desc}</p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <SectionReveal className="mb-12 flex items-center justify-center gap-2">
          <Award className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">The team behind the product</h2>
        </SectionReveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((member, i) => (
            <SectionReveal key={member.name} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white">
                  {member.initial}
                </div>
                <h3 className="mt-4 font-semibold text-white">{member.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{member.role}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <SectionReveal className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white">Our journey</h2>
        </SectionReveal>
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-transparent sm:left-1/2" />
          {milestones.map((item, i) => (
            <SectionReveal key={item.year} delay={i * 0.1}>
              <div className={`relative mb-12 flex gap-8 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                <div className="hidden flex-1 sm:block" />
                <div className="absolute left-4 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-indigo-500 bg-slate-950 text-xs font-bold text-indigo-400 sm:left-1/2">
                  {item.year.slice(2)}
                </div>
                <div className="ml-14 flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 sm:ml-0">
                  <p className="text-sm font-medium text-indigo-400">{item.year}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <SectionReveal className="mt-24 text-center">
        <Link to="/register">
          <Button size="lg">Join us — get started today</Button>
        </Link>
      </SectionReveal>
    </div>
  </div>
);

export default About;
