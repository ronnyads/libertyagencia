import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedHeading from "./ui/AnimatedHeading";
import RippleButton from "./ui/RippleButton";

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
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="inline-block border border-primary/30 bg-primary/10 text-primary text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
        >
          Não espere mais
        </motion.span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-black uppercase leading-tight mb-6 max-w-3xl mx-auto">
          <AnimatedHeading text="O futuro não espera." />
          <br />
          <span className="neon-text">
            <AnimatedHeading text="Sua empresa também não." delay={0.15} />
          </span>
        </h2>

        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-8 max-w-xs mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-10 max-w-lg mx-auto"
        >
          Empresas que adotam IA agora têm 3x mais eficiência em 90 dias. As que esperam, perdem espaço todo mês.
        </motion.p>

        <Link
          to="/form"
          className="neon-button px-10 py-4 text-lg inline-flex items-center justify-center gap-3"
        >
          <ArrowRight size={22} /> Garantir Projeto Gratuito
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CtaFinal;
