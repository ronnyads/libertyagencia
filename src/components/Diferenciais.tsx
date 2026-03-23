import { motion } from "framer-motion";
import { Zap, User, ShieldCheck, Target, Rocket } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";

const items = [
  { icon: Zap, title: "Entrega rápida sem abrir mão da qualidade", desc: "Processos otimizados para entregar no prazo com excelência." },
  { icon: User, title: "Fundador técnico, não só vendedor", desc: "Quem lidera o projeto entende de código, IA e negócios." },
  { icon: ShieldCheck, title: "Garantia de satisfação", desc: "Seu projeto ajustado até você ficar 100% satisfeito." },
  { icon: Target, title: "Foco em resultado, não em horas", desc: "Trabalhamos por entrega, não por hora parada." },
  { icon: Rocket, title: "Sempre na vanguarda tecnológica", desc: "GPT-4, Claude, Supabase, React — usamos o que há de melhor." },
];

const Diferenciais = () => (
  <section className="py-24 relative">
    <div className="container px-4">
      <div className="text-center mb-5">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase">
          <AnimatedHeading text="Por que a" /> <span className="neon-text"><AnimatedHeading text="Liberty?" delay={0.1} /></span>
        </h2>
      </div>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-14 max-w-xs mx-auto"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
      />

      <div className="flex flex-col gap-5 max-w-3xl mx-auto">
        {items.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card p-6 flex gap-5 items-start ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                style={{ boxShadow: "0 0 16px rgba(0,212,255,0.15)" }}>
                <item.icon className="text-primary" size={24} />
              </div>
              <div className={isLeft ? "text-left" : "md:text-right text-left"}>
                <h3 className="font-orbitron font-bold text-base mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Diferenciais;
