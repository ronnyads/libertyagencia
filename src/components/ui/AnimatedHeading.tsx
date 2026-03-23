import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

const wordVariants = {
  hidden: { opacity: 0, y: "100%", skewY: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: "0%",
    skewY: 0,
    transition: { duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const AnimatedHeading = ({ text, className = "", delay = 0, once = true }: AnimatedHeadingProps) => {
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      custom={0}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            custom={delay / 0.07 + i}
            variants={wordVariants}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default AnimatedHeading;
