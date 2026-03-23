import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const phrases = [
  "Projetos de IA",
  "SaaS com IA",
  "Automações de IA",
  "Mentoria 1:1",
];

const CyclingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center overflow-hidden h-[1.2em] align-middle">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="text-primary font-semibold"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block" }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default CyclingText;
