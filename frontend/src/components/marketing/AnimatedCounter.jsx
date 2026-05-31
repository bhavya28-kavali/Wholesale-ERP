import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const parseValue = (str) => {
  const match = str.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: str, decimals: 0 };
  const num = parseFloat(match[1]);
  const suffix = match[2];
  const decimals = (match[1].split('.')[1] || '').length;
  return { num, suffix, decimals };
};

const AnimatedCounter = ({ value, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const { num, suffix, decimals } = parseValue(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(num * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, num]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
