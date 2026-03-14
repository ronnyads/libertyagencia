import { motion } from "framer-motion";
import { Clock, DollarSign, HelpCircle } from "lucide-react";

const items = [
  { icon: Clock, title: "Perdendo tempo em tarefas manuais", desc: "Enquanto seus concorrentes automatizam, você ainda faz tudo na mão." },
  { icon: DollarSign, title: "Pagando caro por tecnologia ultrapassada", desc: "Ferramentas genéricas que não resolvem o seu problema real." },
  { icon: HelpCircle, title: "Sem saber por onde começar com IA", desc: "A tecnologia avança rápido demais e você fica para trás." },
];

const Problema = () => (
  <section className="py-24 relative">
    <div className="container px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase mb-4">
          Isso te parece <span className="text-destructive">familiar</span>?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Se você se identifica com algum desses problemas, está no lugar certo.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card-red p-8"
          >
            <item.icon className="text-destructive mb-4" size={32} />
            <h3 className="font-orbitron font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Problema;
