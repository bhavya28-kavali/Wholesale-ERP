import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import SectionReveal from '../../components/marketing/SectionReveal';
import Button from '../../components/ui/Button';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'during beta',
    desc: 'For small shops getting off spreadsheets.',
    features: [
      'Up to 100 products',
      'Orders & GST invoices',
      '2 team members',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start free',
    to: '/register',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₹2,499',
    period: '/ month',
    desc: 'For growing distributors with multiple staff.',
    features: [
      'Unlimited products',
      'Real-time stock alerts',
      'All roles & permissions',
      'Advanced analytics',
      'Barcode + stock history',
      'Priority support',
    ],
    cta: 'Start trial',
    to: '/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Multi-branch, custom integrations, SLA.',
    features: [
      'Dedicated onboarding',
      'Custom GST templates',
      'API access',
      'SSO & audit logs',
      'Account manager',
    ],
    cta: 'Contact sales',
    to: '/contact',
    highlighted: false,
  },
];

const Pricing = () => (
  <div className="pt-28 pb-20 sm:pt-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionReveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">Pricing</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
          Simple plans. Serious software.
        </h1>
        <p className="mt-6 text-lg text-slate-400">
          Start free while we&apos;re in beta. Upgrade when your SKU count and team outgrow the basics.
        </p>
      </SectionReveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <SectionReveal key={plan.name} delay={i * 0.1}>
            <div
              className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-600/20 to-slate-900/80 shadow-xl shadow-indigo-500/20'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-400">{plan.period}</span>}
              </div>
              <p className="mt-3 text-sm text-slate-400">{plan.desc}</p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={plan.to} className="mt-8 block">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-white !text-slate-900 hover:!bg-slate-100'
                      : ''
                  }`}
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </SectionReveal>
        ))}
      </div>

      <SectionReveal className="mt-16 text-center text-sm text-slate-500">
        All plans include GST invoicing, dark mode, and secure JWT authentication. Prices in INR.
      </SectionReveal>
    </div>
  </div>
);

export default Pricing;
