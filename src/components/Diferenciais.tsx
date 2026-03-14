import { motion } from "framer-motion";
import { Zap, User, ShieldCheck, Target, Rocket } from "lucide-react";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase mb-4">
          Por que a <span className="neon-text">Liberty</span>?
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`glass-card p-8 flex gap-5 ${i === items.length - 1 ? "md:col-span-2" : ""}`}
          >
            <item.icon className="text-primary shrink-0 mt-1" size={28} />
            <div>
              <h3 className="font-orbitron font-bold text-base mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Diferenciais;
