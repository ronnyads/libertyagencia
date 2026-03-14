import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const stats = [
  { value: 47, suffix: "+", label: "Projetos Entregues" },
  { value: 120, suffix: "+", label: "Alunos Formados" },
  { value: 35, suffix: "+", label: "Clientes Ativos" },
  { value: 98, suffix: "%", label: "Satisfação" },
];

const testimonials = [
  { name: "Rafael M.", role: "CEO, TechStart", text: "A Liberty transformou nossa operação. Em 3 semanas tínhamos um SaaS rodando com IA integrada." },
  { name: "Ana C.", role: "Empreendedora", text: "A mentoria me deu confiança para lançar meu primeiro produto digital. Suporte incrível!" },
  { name: "Carlos T.", role: "CTO, DataFlow", text: "Profissionalismo e velocidade que nunca vi em outra agência. Recomendo de olhos fechados." },
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase mb-4">
          Resultados que <span className="neon-text">falam</span>
        </h2>
      </motion.div>

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

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="text-primary fill-primary" size={16} />
              ))}
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-bold text-sm">{t.name}</p>
              <p className="text-muted-foreground text-xs">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Resultados;
