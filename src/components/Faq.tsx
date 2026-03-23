import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";

const faqs = [
  { q: "Quanto custa um projeto de IA?", a: "Cada projeto é personalizado. Após entender suas necessidades em uma call gratuita, enviamos uma proposta detalhada com escopo, prazo e investimento." },
  { q: "Qual o prazo de entrega?", a: "Projetos simples de 2 a 4 semanas. Projetos mais complexos (SaaS completo) de 4 a 8 semanas. Sempre com entregas parciais para validação." },
  { q: "Preciso ter conhecimento técnico?", a: "Não! Cuidamos de toda a parte técnica. Você só precisa ter clareza sobre o problema que quer resolver. Na mentoria, ensinamos do zero." },
  { q: "Qual tipo de suporte vocês oferecem?", a: "Suporte via WhatsApp durante o projeto, 30 dias de acompanhamento pós-entrega e manutenção opcional com planos mensais." },
  { q: "Vocês trabalham com empresas de qualquer tamanho?", a: "Sim! De empreendedores solo a empresas com equipes. Adaptamos a solução ao seu momento e orçamento." },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative" style={{ background: "hsl(222 50% 5%)" }}>
      <div className="container px-4 max-w-3xl">
        <div className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase">
            <AnimatedHeading text="Perguntas" /> <span className="neon-text"><AnimatedHeading text="Frequentes" delay={0.1} /></span>
          </h2>
        </div>
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-14 max-w-xs mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
        />

        <div className="space-y-2">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-foreground/10"
            >
              <button
                className="w-full flex items-center justify-between text-left font-inter font-medium text-sm py-5 hover:text-primary transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{f.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="shrink-0 ml-4 text-primary"
                >
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed pb-5">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
