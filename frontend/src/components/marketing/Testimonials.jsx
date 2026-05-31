import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionReveal from './SectionReveal';

const testimonials = [
  {
    quote:
      'We replaced three spreadsheets and a Tally export loop. Low-stock alerts alone saved us from two major stockouts last quarter.',
    name: 'Rajesh Mehta',
    role: 'MD, Mehta Agro Distributors',
    location: 'Pune',
  },
  {
    quote:
      'GST invoices in one click — our accountant stopped chasing us for PDFs. The dashboard feels like software we pay lakhs for.',
    name: 'Priya Nair',
    role: 'Operations Head, Coastal Wholesale',
    location: 'Kochi',
  },
  {
    quote:
      'Barcode scan on the floor, invoice at the desk. My team adopted it in a week because it actually looks and feels modern.',
    name: 'Amit Sharma',
    role: 'Owner, Sharma FMCG Hub',
    location: 'Delhi NCR',
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Loved by wholesale teams across India
          </h2>
        </SectionReveal>

        <SectionReveal>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 blur-xl" />
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-8 sm:p-12 backdrop-blur-xl">
              <Quote className="mb-6 h-10 w-10 text-indigo-500/50" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed text-slate-200 sm:text-xl">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-slate-400">
                        {t.role} · {t.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === index ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'
                      }`}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                    className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
                    className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default Testimonials;
