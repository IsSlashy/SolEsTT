'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

interface StatItemProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}

function StatItem({ label, value, prefix = '', suffix = '', decimals = 0, delay = 0 }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShouldAnimate(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="modern-card p-6 relative overflow-hidden group"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />

      <div className="relative z-10">
        <p className="text-neutral-500 text-xs mb-2">{label}</p>
        <p className="text-3xl font-bold">
          {shouldAnimate ? (
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              duration={1.5}
            />
          ) : (
            `${prefix}0${suffix}`
          )}
        </p>
      </div>

      {/* Progress bar animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-white"
        initial={{ width: '0%' }}
        animate={isInView ? { width: '100%' } : {}}
        transition={{ duration: 1, delay: delay + 0.5 }}
      />
    </motion.div>
  );
}

interface AnimatedStatsProps {
  stats: StatItemProps[];
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatItem key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}
