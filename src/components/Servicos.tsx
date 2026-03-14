import { motion } from "framer-motion";
import { Bot, Code, GraduationCap, Check, MessageCircle } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Projetos de IA Customizados",
    desc: "Soluções sob medida com inteligência artificial para o seu negócio.",
    features: ["Automação de processos", "Chatbots inteligentes", "Análise de dados com IA", "Integração com APIs"],
    cta: "https://wa.me/5511999999999?text=Olá, quero desenvolver um projeto de IA com a Liberty.",
    featured: false,
  },
  {
    icon: Code,
    title: "Sites e SaaS de Alto Nível",
    desc: "Desenvolvimento de plataformas web modernas e escaláveis.",
    features: ["React + TypeScript", "Design responsivo premium", "Painel administrativo", "Deploy e manutenção"],
    cta: "https://wa.me/5511999999999?text=Olá, quero desenvolver um SaaS com a Liberty.",
    featured: true,
  },
  {
    icon: GraduationCap,
    title: "Mentoria Intensiva",
    desc: "Aprenda a construir projetos com IA do zero ao deploy.",
    features: ["Aulas ao vivo 1:1", "Projetos práticos reais", "Suporte contínuo", "Certificado de conclusão"],
    cta: "https://wa.me/5511999999999?text=Olá, quero saber mais sobre a Mentoria 1:1.",
    featured: false,
  },
];

const Servicos = () => (
  <section id="servicos" className="py-24 relative" style={{ background: "hsl(222 50% 5%)" }}>
    <div className="container px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase mb-4">
          Nossos <span className="neon-text">Serviços</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Soluções completas para quem quer dominar a tecnologia.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative p-8 ${
              s.featured ? "glass-card-neon md:scale-105 z-10" : "glass-card"
            }`}
          >
            {s.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Mais Popular
              </span>
            )}
            <s.icon className="text-primary mb-4" size={32} />
            <h3 className="font-orbitron font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm mb-6">{s.desc}</p>
            <ul className="space-y-2 mb-8">
              {s.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="text-primary shrink-0" size={16} /> {f}
                </li>
              ))}
            </ul>
            <a
              href={s.cta}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                s.featured
                  ? "neon-button"
                  : "border border-foreground/20 text-foreground hover:bg-foreground/5"
              }`}
            >
              <MessageCircle size={16} /> Falar sobre {s.title.split(" ")[0]}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Servicos;
