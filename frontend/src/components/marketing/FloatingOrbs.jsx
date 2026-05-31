import { motion } from 'framer-motion';

const orbs = [
  { size: 320, x: '10%', y: '20%', color: 'rgba(99,102,241,0.4)', delay: 0 },
  { size: 280, x: '70%', y: '10%', color: 'rgba(139,92,246,0.35)', delay: 2 },
  { size: 200, x: '80%', y: '60%', color: 'rgba(59,130,246,0.25)', delay: 4 },
  { size: 240, x: '20%', y: '70%', color: 'rgba(236,72,153,0.2)', delay: 1 },
];

const FloatingOrbs = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {orbs.map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: orb.size,
          height: orb.size,
          left: orb.x,
          top: orb.y,
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12 + i * 2,
          repeat: Infinity,
          delay: orb.delay,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export default FloatingOrbs;
