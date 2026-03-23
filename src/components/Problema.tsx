import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Clock, DollarSign, HelpCircle } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";

const items = [
  { icon: Clock, title: "Perdendo tempo em tarefas manuais", desc: "Enquanto seus concorrentes automatizam, você ainda faz tudo na mão." },
  { icon: DollarSign, title: "Pagando caro por tecnologia ultrapassada", desc: "Ferramentas genéricas que não resolvem o seu problema real." },
  { icon: HelpCircle, title: "Sem saber por onde começar com IA", desc: "A tecnologia avança rápido demais e você fica para trás." },
];

const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
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
    rawX.set(-y * 8);
    rawY.set(x * 8);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: canHover ? rotateX : 0, rotateY: canHover ? rotateY : 0, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={canHover ? onMove : undefined}
      onMouseLeave={canHover ? onLeave : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Problema = () => (
  <section className="py-24 relative">
    <div className="container px-4">
      <div className="text-center mb-5">
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold uppercase">
          <AnimatedHeading text="Isso te parece" /> <span className="text-destructive"><AnimatedHeading text="familiar?" delay={0.2} /></span>
        </h2>
      </div>
      <motion.div
        className="h-px bg-gradient-to-r from-destructive/60 via-destructive/30 to-transparent mb-8 max-w-xs mx-auto"
        initial={{ scaleX: 0, originX: 0.5 }}
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
        Se você se identifica com algum desses problemas, está no lugar certo.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <TiltCard className="glass-card-red p-8 h-full">
              <item.icon className="text-destructive mb-4" size={32} />
              <h3 className="font-orbitron font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Problema;
