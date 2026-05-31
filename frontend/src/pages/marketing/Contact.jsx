import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import SectionReveal from '../../components/marketing/SectionReveal';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';

const Contact = () => {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message received! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', company: '', message: '' });
      setSending(false);
    }, 800);
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">Contact</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Let&apos;s talk wholesale</h1>
          <p className="mt-6 text-lg text-slate-400">
            Questions about pricing, onboarding, or a custom deployment? We&apos;d love to hear from you.
          </p>
        </SectionReveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          <SectionReveal className="lg:col-span-2 space-y-8">
            {[
              { icon: Mail, label: 'Email', value: 'hello@wholesaleerp.com' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Office', value: 'Mumbai, Maharashtra, India' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="font-medium text-white">{value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-white/10 bg-indigo-500/10 p-6">
              <p className="text-sm font-medium text-indigo-300">Enterprise & demos</p>
              <p className="mt-2 text-sm text-slate-400">
                Book a 30-minute walkthrough of inventory, GST billing, and real-time alerts.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal className="lg:col-span-3" delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">Company</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Wholesale business name"
                />
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Tell us about your inventory size, team, and goals..."
                />
              </div>
              <Button type="submit" disabled={sending} className="mt-8 w-full sm:w-auto" size="lg">
                <Send className="h-4 w-4" />
                {sending ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
