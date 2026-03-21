import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const container = {
  hidden: {},
  show: (delay: number) => ({
    transition: { staggerChildren: 0.05, delayChildren: delay },
  }),
};

const word = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: TextRevealProps) {
  const words = text.split(' ');
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      custom={delay}
      className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}
      style={{ fontFamily: 'inherit', display: 'flex' }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} style={{ display: 'inline-block' }}>
          {w}
        </motion.span>
      ))}
    </motion.div>
  );
}
