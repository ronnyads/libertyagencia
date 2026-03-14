import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Quanto custa um projeto de IA?", a: "Cada projeto é personalizado. Após entender suas necessidades em uma call gratuita, enviamos uma proposta detalhada com escopo, prazo e investimento." },
  { q: "Qual o prazo de entrega?", a: "Projetos simples de 2 a 4 semanas. Projetos mais complexos (SaaS completo) de 4 a 8 semanas. Sempre com entregas parciais para validação." },
  { q: "Preciso ter conhecimento técnico?", a: "Não! Cuidamos de toda a parte técnica. Você só precisa ter clareza sobre o problema que quer resolver. Na mentoria, ensinamos do zero." },
  { q: "Qual tipo de suporte vocês oferecem?", a: "Suporte via WhatsApp durante o projeto, 30 dias de acompanhamento pós-entrega e manutenção opcional com planos mensais." },
  { q: "Vocês trabalham com empresas de qualquer tamanho?", a: "Sim! De empreendedores solo a empresas com equipes. Adaptamos a solução ao seu momento e orçamento." },
];

const Faq = () => (
  <section id="faq" className="py-24 relative" style={{ background: "hsl(222 50% 5%)" }}>
    <div className="container px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase mb-4">
          Perguntas <span className="neon-text">Frequentes</span>
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <AccordionItem value={`item-${i}`} className="border-b border-foreground/10">
              <AccordionTrigger className="text-left font-inter font-medium text-sm py-5 hover:no-underline hover:text-primary transition-colors">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  </section>
);

export default Faq;
