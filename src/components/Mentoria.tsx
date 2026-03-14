import { motion } from "framer-motion";
import { Check, MessageCircle, Users, Video, Clock, Headphones } from "lucide-react";

const checklist = [
  "Aprenda a construir SaaS do zero com IA",
  "Domine React, TypeScript e Supabase",
  "Projetos reais no seu portfólio",
  "Acompanhamento semanal personalizado",
  "Acesso a comunidade exclusiva",
  "Certificado de conclusão",
];

const features = [
  { icon: Video, label: "Calls ao vivo semanais" },
  { icon: Users, label: "Comunidade privada" },
  { icon: Clock, label: "3 meses de duração" },
  { icon: Headphones, label: "Suporte via WhatsApp" },
];

const Mentoria = () => (
  <section id="mentoria" className="py-24 relative">
    <div className="container px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase mb-6">
            Mentoria <span className="neon-text">1:1</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Aprenda diretamente com quem já construiu dezenas de projetos com IA. Mentoria individual, intensiva e focada no seu resultado.
          </p>
          <ul className="space-y-3 mb-8">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <Check className="text-primary shrink-0" size={18} />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/5511999999999?text=Olá, quero saber mais sobre a Mentoria 1:1."
            target="_blank"
            rel="noopener noreferrer"
            className="neon-button px-8 py-3.5 text-sm inline-flex items-center gap-2"
          >
            <MessageCircle size={18} /> Quero a Mentoria
          </a>
        </motion.div>

        {/* Right — Ticket card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card-neon p-8 relative"
        >
          <div className="text-center mb-6">
            <span className="font-orbitron text-6xl font-black neon-text">1:1</span>
            <p className="text-muted-foreground text-sm mt-2">Mentoria Individual Intensiva</p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <f.icon className="text-primary shrink-0" size={20} />
                <span className="text-foreground/90">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-accent text-accent-foreground font-bold text-xs px-3 py-1.5 rounded-full inline-block animate-bounce" style={{ background: "#f97316" }}>
            🔥 Apenas 5 vagas abertas por mês
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Mentoria;
