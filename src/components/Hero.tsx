import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Instagram } from "lucide-react";

const phrases = [
  "Criamos SaaS com IA.",
  "Automatizamos seu negócio.",
  "Ensinamos você a fazer o mesmo.",
  "Entregamos o futuro. Agora.",
];

const Hero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 50);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(charIndex - 1), 30);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((phraseIndex + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />

      {/* Neon orbs */}
      <div className="neon-orb w-[600px] h-[600px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="neon-orb w-[300px] h-[300px] bottom-20 right-10 opacity-50" />

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <span className="inline-block border border-primary/30 bg-primary/10 text-primary text-xs uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse-neon mb-8">
            Agência de IA — Projetos Ativos em 2025
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-orbitron font-black uppercase leading-tight mb-6 tracking-tight">
            Enquanto você hesita,
            <br />
            <span className="neon-text">a IA já entregou.</span>
          </h1>

          {/* Typewriter */}
          <p className="text-lg md:text-2xl text-muted-foreground mb-10 h-8 font-inter">
            <span>{phrases[phraseIndex].substring(0, charIndex)}</span>
            <span className="border-r-2 border-primary animate-typewriter-blink ml-0.5">&nbsp;</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999?text=Olá, quero iniciar um projeto de IA."
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button px-8 py-3.5 text-base flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Começar Projeto com IA
            </a>
            <a
              href="https://instagram.com/euronnyads"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button-outline px-8 py-3.5 text-base flex items-center justify-center gap-2"
            >
              <Instagram size={20} /> @euronnyads
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
