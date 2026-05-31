import SectionReveal from './SectionReveal';

const logos = [
  'AgroMart',
  'FreshBulk',
  'MetroSupply',
  'GrainLink',
  'PackRight',
  'TradeFlow',
  'StockHub',
  'NorthDist',
];

const LogoCloud = () => (
  <section className="border-y border-white/5 py-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionReveal>
        <p className="mb-8 text-center text-sm text-slate-500">
          Trusted by distributors and wholesale teams nationwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-slate-600 transition hover:text-slate-400"
            >
              {name}
            </span>
          ))}
        </div>
      </SectionReveal>
    </div>
  </section>
);

export default LogoCloud;
