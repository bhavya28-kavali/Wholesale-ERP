import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../../components/marketing/SectionReveal';
import Button from '../../components/ui/Button';

const faqs = [
  {
    q: 'Is Wholesale ERP GST compliant for India?',
    a: 'Yes. Invoices support CGST+SGST for intra-state and IGST for inter-state sales, with place of supply, GSTIN fields, and downloadable PDF tax invoices.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No desktop install. Run the backend on Node.js + MongoDB and open the React app in any modern browser. Docker optional for your own deployment.',
  },
  {
    q: 'How do real-time alerts work?',
    a: 'Socket.io broadcasts low-stock, new order, and invoice events to connected clients. Your team sees toast notifications and a bell dropdown instantly.',
  },
  {
    q: 'What roles are supported?',
    a: 'Admin (full access), Manager (inventory + orders + analytics), Accountant (invoices), and User (read-only dashboard + orders view).',
  },
  {
    q: 'Can I import existing products?',
    a: 'Use the API or seed script as a template. Bulk import UI can be added — the product model supports SKU, barcode, category, and GST fields.',
  },
  {
    q: 'Is there a free plan?',
    a: 'The Starter plan is free during beta with up to 100 products and 2 team members. See Pricing for Growth and Enterprise options.',
  },
];

const FAQItem = ({ q, a, open, onToggle }) => (
  <div className="border-b border-white/10">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 py-5 text-left"
    >
      <span className="font-medium text-white">{q}</span>
      <ChevronDown
        className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
      />
    </button>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-sm leading-relaxed text-slate-400">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">FAQ</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Questions? We&apos;ve got answers.
          </h1>
          <p className="mt-4 text-slate-400">
            Everything you need to know before moving your wholesale ops to Wholesale ERP.
          </p>
        </SectionReveal>

        <SectionReveal className="mt-12 rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-sm">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              {...item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </SectionReveal>

        <SectionReveal className="mt-16 text-center">
          <p className="text-slate-400">Still unsure?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button>Contact us</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="!border-white/20 !bg-white/5 !text-white">
                Start free trial
              </Button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default FAQ;
