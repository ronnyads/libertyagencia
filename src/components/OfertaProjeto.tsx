import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";

const beneficios = [
  "Sem compromisso financeiro",
  "Resultado em até 7 dias",
  "Apenas 3 vagas por semana",
];

const OfertaProjeto = () => (
  <section className="py-16 relative overflow-hidden">
    {/* Gradient background */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.04) 50%, transparent 100%)",
      }}
    />
    <div className="absolute inset-0 border-y border-primary/10" />

    <div className="container relative z-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto"
      >
        {/* Left */}
        <div className="text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Oferta de Tempo Limitado
          </motion.span>

          <h2 className="text-2xl md:text-3xl font-orbitron font-black uppercase mb-3 leading-tight">
            <AnimatedHeading text="Criamos 1 projeto piloto de IA" />
            <br />
            <span className="neon-text">
              <AnimatedHeading text="sem custo para você" delay={0.1} />
            </span>
          </h2>

          <p className="text-muted-foreground text-sm max-w-md mb-5">
            Analisamos seu negócio, construímos uma automação ou agente de IA real.
            Você vê o resultado antes de investir qualquer coisa.
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            {beneficios.map((b, i) => (
              <li key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="text-primary shrink-0" size={14} />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="shrink-0"
        >
          <Link
            to="/form"
            className="neon-button px-8 py-4 text-base font-bold inline-flex items-center gap-2 whitespace-nowrap"
          >
            Garantir Meu Projeto Gratuito
            <ArrowRight size={18} />
          </Link>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Resposta em até 24h — sem cartão de crédito
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default OfertaProjeto;
