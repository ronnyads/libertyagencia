import { motion } from "framer-motion";
import { MessageCircle, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import HeroCanvas from "./HeroCanvas";
import CyclingText from "./CyclingText";

const lineVariants = {
  hidden: { opacity: 0, y: "60%", rotateX: -25, skewY: 2 },
  visible: (i: number) => ({
    opacity: 1,
    y: "0%",
    rotateX: 0,
    skewY: 0,
    transition: { duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    {/* Neural network canvas */}
    <HeroCanvas />

    {/* Grid background (reduzido) */}
    <div className="absolute inset-0 grid-bg opacity-10" />

    {/* Neon orbs */}
    <div className="neon-orb w-[600px] h-[600px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    <div className="neon-orb w-[300px] h-[300px] bottom-20 right-10 opacity-30" />

    <div className="container relative z-10 text-center px-4">
      {/* Urgency pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Link
          to="/form"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/15 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Projeto piloto gratuito — apenas 3 vagas esta semana
        </Link>
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <span className="inline-block border border-primary/30 bg-primary/10 text-primary text-xs uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse-neon mb-10">
          Agência de IA — Projetos Ativos em 2025
        </span>
      </motion.div>

      {/* Headline — animação linha a linha */}
      <div style={{ perspective: "800px" }}>
        <h1
          className="font-orbitron font-black uppercase leading-[1.05] mb-6 tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)", letterSpacing: "-0.03em" }}
        >
          {[
            { text: "Enquanto você hesita,", className: "" },
            { text: "a IA já entregou.", className: "neon-text" },
          ].map((line, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "block", transformOrigin: "bottom left" }}
              className={line.className}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Subtítulo com cycling text */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-lg md:text-xl text-muted-foreground mb-10 font-inter"
      >
        Criamos <CyclingText /> para negócios que não podem esperar.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a
          href="https://wa.me/5511999999999?text=Olá, quero iniciar um projeto de IA."
          target="_blank"
          rel="noopener noreferrer"
          className="neon-button px-8 py-4 text-base flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> Começar Projeto com IA
        </a>
        <a
          href="https://instagram.com/euronnyads"
          target="_blank"
          rel="noopener noreferrer"
          className="neon-button-outline px-8 py-4 text-base flex items-center justify-center gap-2"
        >
          <Instagram size={20} /> @euronnyads
        </a>
      </motion.div>

      {/* Secondary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="mt-4"
      >
        <Link to="/form" className="text-primary text-sm underline underline-offset-4 hover:text-primary/80 transition-colors">
          Ou garanta um projeto gratuito →
        </Link>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-16 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  </section>
);

export default Hero;
