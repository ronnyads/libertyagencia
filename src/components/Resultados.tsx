import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedHeading from "./ui/AnimatedHeading";
import TestimonialMarquee from "./ui/TestimonialMarquee";

const stats = [
  { value: 47, suffix: "+", label: "Projetos Entregues" },
  { value: 120, suffix: "+", label: "Alunos Formados" },
  { value: 35, suffix: "+", label: "Clientes Ativos" },
  { value: 98, suffix: "%", label: "Satisfação" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums font-orbitron text-4xl md:text-5xl font-bold neon-text">
      {count}{suffix}
    </span>
  );
}

const Resultados = () => (
  <section id="resultados" className="py-24 relative" style={{ background: "hsl(222 50% 5%)" }}>
    <div className="container px-4">
      <div className="text-center mb-5">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase">
          <AnimatedHeading text="Resultados que" /> <span className="neon-text"><AnimatedHeading text="falam" delay={0.1} /></span>
        </h2>
      </div>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-14 max-w-xs mx-auto"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <Counter target={s.value} suffix={s.suffix} />
            <p className="text-muted-foreground text-sm mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <TestimonialMarquee />
    </div>
  </section>
);

export default Resultados;
