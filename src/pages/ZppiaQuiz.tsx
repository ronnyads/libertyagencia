import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Cpu, Zap, Shield, Trophy, Loader2, Sparkles, Brain, Target, ArrowRight, DollarSign, Image as ImageIcon, MousePointer2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Step = {
  id: string;
  type: "intro" | "question" | "reveal" | "loading" | "result" | "offer" | "notice";
  title: string;
  subtitle?: string;
  options?: { label: string; value: string; icon?: any }[];
  image?: string;
  content?: React.ReactNode;
};

const ZPPIA_STEPS: Step[] = [
  {
    id: "intro",
    type: "intro",
    title: "ZPPIA PROMPTs",
    subtitle: "Iniciando Protocolo de Acesso à Nova Era da Inteligência Artificial...",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-gray-400 text-base md:text-lg leading-relaxed px-2">
          Prepare-se para dominar a criação de influencers e imagens 
          com realismo absoluto. O futuro da publicidade começou.
        </p>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <Brain className="w-20 h-20 md:w-24 md:h-24 text-primary relative z-10 mx-auto" />
        </motion.div>
      </div>
    )
  },
  {
    id: "gender",
    type: "question",
    title: "Identificação",
    subtitle: "Como você se identifica para personalizarmos sua experiência?",
    options: [
      { label: "Sou Homem", value: "male" },
      { label: "Sou Mulher", value: "female" }
    ]
  },
  {
    id: "experience",
    type: "question",
    title: "Sua Experiência",
    subtitle: "Você já tentou criar um influencer ou imagem realista com IA?",
    options: [
      { label: "Nunca tentei", value: "never" },
      { label: "Tentei, mas ficou artificial", value: "bad_results" },
      { label: "Já crio, mas quero o próximo nível", value: "advanced" }
    ]
  },
  {
    id: "perception-test",
    type: "question",
    title: "Teste Neural",
    subtitle: "Analise as texturas. Qual destas modelos você acredita ser 100% HUMANA?",
    options: [
      { label: "Modelo A", value: "a" },
      { label: "Modelo B", value: "b" },
      { label: "Modelo C", value: "c" }
    ],
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
        <div className="relative group overflow-hidden rounded-xl border border-white/10 aspect-[3/4] glass-card-neon">
           <img src="/zppia_test1.png" alt="Test A" className="object-cover w-full h-full transition-all duration-700" />
           <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold tracking-tighter">OPÇÃO A</div>
        </div>
        <div className="relative group overflow-hidden rounded-xl border border-white/10 aspect-[3/4] glass-card-neon">
           <img src="/zppia_test2.png" alt="Test B" className="object-cover w-full h-full transition-all duration-700" />
           <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold tracking-tighter">OPÇÃO B</div>
        </div>
        <div className="relative group overflow-hidden rounded-xl border border-white/10 aspect-[3/4] glass-card-neon">
           <img src="/zppia_test3.png" alt="Test C" className="object-cover w-full h-full transition-all duration-700" />
           <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold tracking-tighter">OPÇÃO C</div>
        </div>
      </div>
    )
  },
  {
    id: "reveal-truth",
    type: "reveal",
    title: "ERRO DETECTADO",
    subtitle: "Seu cérebro foi enganado pelo algoritmo.",
    content: (
      <div className="space-y-6">
        <div className="p-5 md:p-6 glass-card-red text-center">
          <p className="text-red-400 font-bold text-lg md:text-xl uppercase tracking-tighter italic">
            100% das imagens anteriores foram geradas por IA.
          </p>
        </div>
        <p className="text-gray-400 text-center text-sm md:text-base leading-relaxed px-4">
          Nenhuma delas é humana. Elas foram criadas com o motor de realismo que você está prestes a acessar.
        </p>
      </div>
    )
  },
  {
    id: "tools-question",
    type: "question",
    title: "Custo de Produção",
    subtitle: "Quanto você acredita que um estúdio comum gasta em assinaturas para produzir este nível de realismo?",
    options: [
      { label: "Assinaturas (R$ 500+/mês)", value: "paid" },
      { label: "ZPPIA PROMPTs (R$ 0,00/mês)", value: "free" }
    ]
  },
  {
    id: "reveal-free",
    type: "reveal",
    title: "ECONOMIZE R$ 6.000/ANO",
    subtitle: "O segredo está no Prompt, não na mensalidade.",
    content: (
      <div className="space-y-6">
        <p className="text-gray-400 text-center text-sm md:text-base leading-relaxed px-4">
          Enquanto outros ficam presos em assinaturas caras, 
          o <span className="text-primary font-bold">ZPPIA PROMPTs</span> te ensina a usar motores de realismo com <span className="text-primary font-bold">custo de produção ZERO</span>. 
          Você investe uma única vez e nunca mais paga por imagem gerada.
        </p>
        <div className="flex justify-center">
           <div className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
             Custo operacional: R$ 0,00
           </div>
        </div>
      </div>
    )
  },
  {
    id: "nsfw-notice",
    type: "notice",
    title: "Atenção Importante",
    subtitle: "Sobre o conteúdo do ZPPIA PROMPTs",
    content: (
      <div className="space-y-6">
        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
           <div className="flex items-center gap-3 mb-4">
             <AlertCircle className="text-amber-500 w-6 h-6" />
             <h4 className="font-bold text-amber-500 uppercase italic text-sm">Política de Conteúdo (NSFW)</h4>
           </div>
           <p className="text-gray-300 text-sm leading-relaxed">
             Não trabalhamos com conteúdo explícito (18+). Os Prompts focam em realismo para publicidade, 
             moda, influencers de biquíni e lifestyle de alto nível. Se você busca pornografia, este lugar não é para você.
           </p>
        </div>
        <p className="text-gray-400 text-center text-xs">
          Nosso foco é <span className="text-white font-bold">MONETIZAÇÃO PROFISSIONAL</span> e autoridade digital.
        </p>
      </div>
    )
  },
  {
    id: "earnings-reveal",
    type: "reveal",
    title: "RESULTADOS",
    subtitle: "Isso é o que acontece quando você domina a IA certa.",
    content: (
      <div className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-neon-glow-strong">
           <img src="/zppia_dash.png" alt="Dashboard" className="w-full h-auto" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
           <div className="absolute bottom-3 left-3 right-3 text-center">
              <p className="text-primary font-black text-xs md:text-sm uppercase tracking-widest">Dashboard de Aluno: R$ 89.452,00</p>
           </div>
        </div>
        <p className="text-gray-500 text-center text-[10px] md:text-xs italic px-6">
          *Resultados através da venda de packs de imagens e influencers sintéticas.
        </p>
      </div>
    )
  },
  {
    id: "loading",
    type: "loading",
    title: "AVALIANDO...",
    subtitle: "Verificando parâmetros do ZPPIA PROMPTs para seu perfil"
  },
  {
    id: "offer",
    type: "offer",
    title: "AUTORIZADO",
    subtitle: "O segredo do realismo absoluto está liberado.",
    content: (
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: Shield, title: "Vault de Prompts", desc: "Biblioteca de realismo do Ronny" },
            { icon: Trophy, title: "Fábrica de Influencers", desc: "Identidade consistente e lucrativa" },
            { icon: Zap, title: "Engine Grátis", desc: "O fim das assinaturas caras" },
            { icon: DollarSign, title: "Guia Monetização", desc: "Transforme pixels em lucro real" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 md:p-4 glass-card">
              <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-tight italic text-xs md:text-sm">{item.title}</h4>
                <p className="text-[10px] md:text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center p-6 md:p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl relative overflow-hidden shadow-neon-glow">
          <div className="absolute top-0 right-0 p-2">
            <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase italic">LIMITADO</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">OFERTA DE LANÇAMENTO</p>
          <div className="flex flex-col items-center justify-center gap-1 mb-6">
            <span className="text-gray-600 line-through text-base md:text-lg">R$ 197</span>
            <span className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">R$ 19,90</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Pagamento Único</span>
          </div>
          <Button className="w-full h-14 md:h-16 text-lg md:text-xl font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,212,255,0.4)] uppercase italic group">
            LIBERAR ACESSO AGORA
            <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="mt-4 flex flex-col gap-1 items-center justify-center opacity-50">
             <p className="text-[9px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-widest">
               <Shield className="w-3 h-3 text-primary" /> Garantia de 7 Dias | Vitalício
             </p>
          </div>
        </div>
      </div>
    )
  }
];

export default function ZppiaQuiz() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);

  const currentStep = ZPPIA_STEPS[currentStepIndex];

  useEffect(() => {
    const p = ((currentStepIndex) / (ZPPIA_STEPS.length - 1)) * 100;
    setProgress(p);
    
    if (currentStep.type === "loading") {
      const timer = setTimeout(() => {
        handleNext();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  // Backredirect / Exit Intent Logic
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (currentStep.id === "offer" && !showDownsell) {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
        setShowDownsell(true);
      }
    };

    if (currentStep.id === "offer") {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep.id, showDownsell]);

  const handleNext = () => {
    if (currentStepIndex < ZPPIA_STEPS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setIsTransitioning(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter selection:bg-primary/30 overflow-x-hidden pb-12">
      {/* HUD Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[60%] md:w-[40%] h-[40%] bg-primary/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] md:w-[30%] h-[50%] bg-blue-500/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute inset-0 grid-bg opacity-[0.05]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">
        {/* Header HUD */}
        <div className="flex flex-col items-center mb-10 md:mb-16">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-8 md:mb-10"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shadow-neon-glow rotate-3">
              <span className="font-black text-black text-xl md:text-2xl italic">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter leading-none italic uppercase">ZPPIA PROMPTs</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Neural Engine v2.0</span>
            </div>
          </motion.div>
          
          <div className="w-full space-y-2 md:space-y-3 px-2">
            <div className="flex justify-between text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-primary/80 font-black italic">
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
                {currentStep.type === "offer" ? "TERMINADO" : "PROCESSANDO"}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary shadow-neon-glow" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Quiz Canvas */}
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentStep.id}
              initial={{ x: 20, opacity: 0, filter: "blur(10px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: -20, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 md:space-y-10"
            >
              <div className="text-center space-y-3 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.95] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase px-2">
                  {currentStep.title}
                </h1>
                {currentStep.subtitle && (
                  <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto px-4">
                    {currentStep.subtitle}
                  </p>
                )}
              </div>

              {currentStep.content && (
                <div className="relative">
                  {currentStep.content}
                </div>
              )}

              {currentStep.type === "loading" && (
                <div className="flex flex-col items-center justify-center py-12 md:py-16 space-y-6 md:space-y-8">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-primary animate-spin" />
                    <Cpu className="w-6 h-6 md:w-8 md:h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2 md:space-y-3 text-center">
                    <p className="text-primary animate-pulse font-mono text-[10px] md:text-sm tracking-[0.2em] font-bold italic uppercase">Acessando_Dados...</p>
                    <p className="text-gray-600 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black px-4">Decrypting realistic pattern recognition</p>
                  </div>
                </div>
              )}

              {currentStep.options && (
                <div className="grid grid-cols-1 gap-3 md:gap-4 mt-8 md:mt-10">
                  {currentStep.options.map((opt, i) => (
                    <button
                      key={opt.value}
                      onClick={handleNext}
                      className="group relative flex items-center justify-between p-5 md:p-7 bg-white text-black rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-left overflow-hidden shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                    >
                      <div className="relative z-10 flex items-center gap-4 md:gap-6">
                         <span className="text-[10px] md:text-xs font-black opacity-30 italic">0{i+1}</span>
                         <span className="text-lg md:text-xl font-bold uppercase tracking-tighter italic">{opt.label}</span>
                      </div>
                      <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-primary-foreground transition-all">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {(currentStep.type === "intro" || currentStep.type === "reveal" || currentStep.type === "notice") && (
                <div className="mt-10 md:mt-14">
                  <Button 
                    onClick={handleNext}
                    className="w-full h-16 md:h-20 text-xl md:text-2xl font-black italic bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-tighter group"
                  >
                    CONTINUAR
                    <ArrowRight className="ml-3 w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* DOWNSELL MODAL (Backredirect Aggressive) */}
        <AnimatePresence>
          {showDownsell && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-md w-full bg-card border-2 border-primary rounded-[2.5rem] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(0,212,255,0.3)]"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                   <AlertCircle className="w-10 h-10 text-red-500 animate-bounce" />
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter italic leading-none">ESPERE! NÃO VÁ AINDA...</h2>
                <p className="text-gray-400 font-medium">
                  Percebemos que você está prestes a deixar passar a chance de dominar a IA por causa do preço. 
                  <br /><br />
                  Vamos fazer algo que <span className="text-white font-bold">NUNCA</span> fizemos antes.
                </p>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <p className="text-xs uppercase tracking-widest font-bold mb-1">Downsell Exclusivo</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-gray-500 line-through text-lg">R$ 19,90</span>
                    <span className="text-5xl font-black text-primary italic">R$ 9,90</span>
                  </div>
                </div>
                <Button className="w-full h-16 bg-primary text-black font-black text-lg uppercase italic shadow-neon-glow hover:bg-white transition-all">
                  QUERO O DESCONTO DE 50%
                </Button>
                <button 
                  onClick={() => setShowDownsell(false)}
                  className="text-gray-500 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors"
                >
                  Não, prefiro perder essa oportunidade
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer System Status */}
      <footer className="py-12 md:py-16 border-t border-white/5 mt-16 md:mt-20 opacity-20 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-4">
           <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase italic">Liberty Agency © 2026</span>
           <Link to="/privacidade" className="text-[8px] md:text-[10px] font-black tracking-widest uppercase italic hover:text-primary transition-colors">Política de Privacidade</Link>
           <Link to="/seguranca" className="text-[8px] md:text-[10px] font-black tracking-widest uppercase italic hover:text-primary transition-colors">Segurança</Link>
           <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase italic">Neural Sync Active</span>
        </div>
        <p className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-primary px-4">AUTHORIZED PERSONNEL ONLY - ZPPIA PROMPTs</p>
      </footer>
    </div>
  );
}
