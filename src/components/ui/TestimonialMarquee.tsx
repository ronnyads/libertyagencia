import { Star } from "lucide-react";

const allTestimonials = [
  { name: "Rafael M.", role: "CEO, TechStart", text: "A Liberty transformou nossa operação. Em 3 semanas tínhamos um SaaS rodando com IA integrada." },
  { name: "Ana C.", role: "Empreendedora", text: "A mentoria me deu confiança para lançar meu primeiro produto digital. Suporte incrível!" },
  { name: "Carlos T.", role: "CTO, DataFlow", text: "Profissionalismo e velocidade que nunca vi em outra agência. Recomendo de olhos fechados." },
  { name: "Fernanda L.", role: "Fundadora, NovaTech", text: "Em menos de um mês, automatizamos 70% dos processos manuais da empresa. Resultado surreal." },
  { name: "Marcos R.", role: "COO, ExpandIA", text: "O chatbot entregue superou nossas expectativas. Clientes adoraram a experiência." },
  { name: "Julia S.", role: "Product Manager", text: "A consultoria me ajudou a definir o escopo certo. Sem desperdício de dinheiro." },
  { name: "Diego P.", role: "Startup Founder", text: "Aprendi do zero e hoje já tenho dois SaaS no ar. A mentoria muda tudo." },
  { name: "Camila V.", role: "Head of Growth", text: "ROI de 4x em 60 dias com as automações implementadas. Valeu cada centavo." },
];

function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="glass-card p-6 w-[320px] shrink-0 mx-3">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-primary fill-primary" size={14} />
        ))}
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{text}"</p>
      <div>
        <p className="font-bold text-sm text-foreground">{name}</p>
        <p className="text-muted-foreground text-xs">{role}</p>
      </div>
    </div>
  );
}

const row1 = allTestimonials.slice(0, 4);
const row2 = allTestimonials.slice(4, 8);

const TestimonialMarquee = () => (
  <div className="marquee-wrapper overflow-hidden space-y-4">
    {/* Row 1 — slides left */}
    <div className="flex">
      <div className="flex animate-marquee-left">
        {[...row1, ...row1].map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </div>

    {/* Row 2 — slides right */}
    <div className="flex">
      <div className="flex animate-marquee-right">
        {[...row2, ...row2].map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </div>
  </div>
);

export default TestimonialMarquee;
