'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const dirMap = {
  up: { y: 60, x: 0 },
  down: { y: -60, x: 0 },
  left: { y: 0, x: 60 },
  right: { y: 0, x: -60 },
};

export default function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
