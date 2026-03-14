import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const CtaFinal = () => (
  <section className="py-32 relative overflow-hidden">
    {/* Radial glow */}
    <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(0,212,255,0.12) 0%, transparent 70%)" }} />

    <div className="container relative z-10 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block border border-primary/30 bg-primary/10 text-primary text-xs uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse-neon mb-8">
          Não espere mais
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-black uppercase leading-tight mb-6 max-w-3xl mx-auto">
          O futuro não espera.
          <br />
          <span className="neon-text">Sua empresa também não.</span>
        </h2>

        <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
          Domine a tecnologia ou seja substituído por ela. Fale com a gente agora e comece a transformar seu negócio.
        </p>

        <a
          href="https://wa.me/5511999999999?text=Olá, vim pelo site e quero saber mais sobre a Liberty."
          target="_blank"
          rel="noopener noreferrer"
          className="neon-button px-10 py-4 text-lg inline-flex items-center gap-3"
        >
          <MessageCircle size={22} /> Falar com a Liberty
        </a>
      </motion.div>
    </div>
  </section>
);

export default CtaFinal;
