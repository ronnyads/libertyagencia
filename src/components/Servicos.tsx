import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Bot, Code, GraduationCap, Check, ArrowRight } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";

const services = [
  {
    icon: Bot,
    title: "Projetos de IA Customizados",
    desc: "Soluções sob medida com inteligência artificial para o seu negócio.",
    features: ["Automação de processos", "Chatbots inteligentes", "Análise de dados com IA", "Integração com APIs"],
    servico: "IA Customizada",
    ctaLabel: "Quero minha IA em 30 dias",
    featured: false,
  },
  {
    icon: Code,
    title: "Sites e SaaS de Alto Nível",
    desc: "Desenvolvimento de plataformas web modernas e escaláveis.",
    features: ["React + TypeScript", "Design responsivo premium", "Painel administrativo", "Deploy e manutenção"],
    servico: "Sites e SaaS",
    ctaLabel: "Quero meu SaaS com IA",
    featured: true,
  },
  {
    icon: GraduationCap,
    title: "Mentoria Intensiva",
    desc: "Aprenda a construir projetos com IA do zero ao deploy.",
    features: ["Aulas ao vivo 1:1", "Projetos práticos reais", "Suporte contínuo", "Certificado de conclusão"],
    servico: "Mentoria Intensiva",
    ctaLabel: "Garantir minha vaga",
    featured: false,
  },
];

const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function TiltCard({ children, className, glowColor = "rgba(0,212,255,0.25)" }: {
  children: React.ReactNode; className?: string; glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 300, damping: 30, mass: 0.5 });
  const rotateY = useSpring(rawY, { stiffness: 300, damping: 30, mass: 0.5 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(-y * 12);
    rawY.set(x * 12);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: canHover ? rotateX : 0, rotateY: canHover ? rotateY : 0, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={canHover ? onMove : undefined}
      onMouseLeave={canHover ? onLeave : undefined}
      whileHover={canHover ? { boxShadow: `0 8px 40px ${glowColor}, 0 0 0 1px ${glowColor}` } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Servicos = () => {
  const navigate = useNavigate();
  return (
  <section id="servicos" className="py-24 relative" style={{ background: "hsl(222 50% 5%)" }}>
    <div className="container px-4">
      <div className="text-center mb-5">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase">
          <AnimatedHeading text="Nossos" /> <span className="neon-text"><AnimatedHeading text="Serviços" delay={0.1} /></span>
        </h2>
      </div>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-5 max-w-xs mx-auto"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-xl mx-auto text-center mb-14"
      >
        Soluções completas para quem quer dominar a tecnologia.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className={s.featured ? "md:scale-105 z-10" : ""}
          >
            <TiltCard
              className={`relative p-8 h-full ${s.featured ? "glass-card-neon" : "glass-card"}`}
              glowColor={s.featured ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.15)"}
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
              <button
                onClick={() => navigate(`/form?servico=${encodeURIComponent(s.servico)}`)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  s.featured ? "neon-button" : "border border-foreground/20 text-foreground hover:bg-foreground/5"
                }`}
              >
                {s.ctaLabel} <ArrowRight size={16} />
              </button>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Servicos;
