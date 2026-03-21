import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Check, X, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const forWhom = [
  'Quem quer encurtar o caminho com direção personalizada',
  'Quem quer evitar os erros mais comuns de quem está começando',
  'Quem busca validação mais rápida do projeto',
  'Quem quer acompanhamento real, não só conteúdo gravado',
  'Quem tem urgência de executar com clareza',
];

const includes = [
  'Sessões individuais com Ronny Oliveira',
  'Revisão do seu projeto e plano de ação',
  'Acesso prioritário e suporte direto',
  'Acompanhamento de validação e primeiros passos',
  'Material exclusivo da mentoria',
];

const howItWorks = [
  { n: '1', title: 'Inscrição', desc: 'Escolha seu plano e garanta sua vaga na mentoria.' },
  { n: '2', title: 'Onboarding', desc: 'Presente seu projeto e alinhe seus objetivos com Ronny.' },
  { n: '3', title: 'Aceleração', desc: 'Sessões, revisões e acompanhamento direto para ir mais longe.' },
];

const steps = [
  {
    question: 'Qual é o seu momento atual?',
    options: [
      { id: 'A', label: 'Tenho uma ideia e quero validar' },
      { id: 'B', label: 'Já comecei mas estou travado' },
      { id: 'C', label: 'Estou começando do zero' },
    ],
  },
  {
    question: 'O que você busca com a mentoria?',
    options: [
      { id: 'A', label: 'Lançar meu projeto nos próximos 3 meses' },
      { id: 'B', label: 'Acelerar o que já comecei' },
      { id: 'C', label: 'Entender se vale a pena investir em IA agora' },
    ],
  },
  {
    question: 'Qual é o seu plano de investimento?',
    options: [
      { id: 'A', label: 'Estou pronto para investir agora' },
      { id: 'B', label: 'Preciso avaliar melhor as opções' },
      { id: 'C', label: 'Ainda não tenho budget definido' },
    ],
  },
];

function isQualified(answers: Record<number, string>) {
  const step2 = answers[2];
  const step3 = answers[3];
  return (step2 === 'A' || step2 === 'B') && step3 === 'A';
}

export default function Mentorship() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<'qualified' | 'notqualified' | null>(null);

  const openModal = () => {
    setOpen(true);
    setStep(1);
    setAnswers({});
    setResult(null);
  };

  const closeModal = () => setOpen(false);

  const handleSelect = (optId: string) => {
    setAnswers(prev => ({ ...prev, [step]: optId }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      setResult(isQualified(answers) ? 'qualified' : 'notqualified');
    }
  };

  const handleBack = () => setStep(s => s - 1);

  const currentStep = steps[step - 1];
  const selected = answers[step];

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {/* Premium Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))', border: '2px solid rgba(139,92,246,0.3)', borderRadius: 24, boxShadow: '0 0 80px rgba(139,92,246,0.1)' }}>
        <div className="absolute right-0 top-0 w-[250px] h-[250px] rounded-full pointer-events-none" style={{ background: 'rgba(139,92,246,0.12)', filter: 'blur(80px)' }} />
        <div className="relative z-10">
          <p className="font-inter font-semibold text-[11px] text-zppia-violet tracking-[0.15em]">OFERTA PREMIUM</p>
          <h1 className="font-sora font-[800] text-3xl lg:text-[40px] text-white mt-4 leading-tight">Mentoria de</h1>
          <h1 className="font-sora font-[800] text-3xl lg:text-[40px] gradient-text leading-tight">Aceleração</h1>
          <p className="font-inter text-lg mt-3 max-w-[600px]" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            Para alunos do Método ZPPIA que querem acompanhamento direto com Ronny Oliveira, validação mais rápida e direção personalizada para o projeto.
          </p>
          <span className="inline-block mt-4 px-3 py-1 rounded-full font-inter font-semibold text-xs bg-zppia-gold/20 text-zppia-gold border border-zppia-gold/30">Vagas Limitadas</span>
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-zppia-violet mb-4">Para quem é</h3>
          <div className="flex flex-col gap-2.5">
            {forWhom.map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <Diamond size={14} className="text-zppia-violet mt-0.5 flex-shrink-0" />
                <span className="font-inter text-[15px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-zppia-blue mb-4">O que inclui</h3>
          <div className="flex flex-col gap-2.5">
            {includes.map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-white" />
                </div>
                <span className="font-sora font-medium text-[15px] text-white">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <h3 className="font-sora font-bold text-xl text-white mb-5 text-center">Como Funciona</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {howItWorks.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
            className="glass-card p-6 text-center">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mx-auto">
              <span className="font-sora font-[800] text-base text-white">{s.n}</span>
            </div>
            <h4 className="font-sora font-semibold text-[17px] text-white mt-3">{s.title}</h4>
            <p className="font-inter text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-9 text-center max-w-[600px] mx-auto" style={{ borderColor: 'rgba(139,92,246,0.35)' }}>
        <h3 className="font-sora font-[800] text-[28px] text-white">Pronto para acelerar?</h3>
        <p className="font-inter text-base mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Garanta sua vaga na Mentoria de Aceleração e vá além com Ronny Oliveira ao seu lado.</p>
        <button onClick={openModal} className="btn-gradient w-full mt-5 py-4 text-base font-bold" style={{ boxShadow: '0 0 30px rgba(139,92,246,0.35)' }}>
          ✦ Quero a Mentoria de Aceleração
        </button>
        <p className="font-inter text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Vagas limitadas · Acesso exclusivo para alunos</p>
      </motion.div>

      {/* Qualification Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg overflow-hidden"
              style={{ border: '1px solid rgba(139,92,246,0.3)' }}>

              {/* Progress bar */}
              {!result && (
                <div className="h-1 w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full gradient-bg"
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.4 }} />
                </div>
              )}

              <div className="p-8">
                {/* Close btn */}
                <div className="flex justify-end mb-4">
                  <button onClick={closeModal} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <X size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                      <p className="font-inter text-xs font-semibold mb-3" style={{ color: 'rgba(139,92,246,0.8)', letterSpacing: '0.12em' }}>
                        PERGUNTA {step} DE 3
                      </p>
                      <h3 className="font-sora font-bold text-xl text-white mb-6">{currentStep.question}</h3>

                      <div className="flex flex-col gap-3 mb-8">
                        {currentStep.options.map(opt => (
                          <button key={opt.id} onClick={() => handleSelect(opt.id)}
                            className="text-left px-5 py-4 rounded-xl font-inter text-sm transition-all"
                            style={{
                              background: selected === opt.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${selected === opt.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                              color: selected === opt.id ? '#fff' : 'rgba(255,255,255,0.65)',
                            }}>
                            <span className="font-semibold mr-2" style={{ color: selected === opt.id ? 'rgba(139,92,246,1)' : 'rgba(255,255,255,0.3)' }}>{opt.id})</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        {step > 1 && (
                          <button onClick={handleBack} className="flex items-center gap-2 px-4 py-3 rounded-xl font-inter font-medium text-sm"
                            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
                            <ArrowLeft size={15} /> Voltar
                          </button>
                        )}
                        <button onClick={handleNext} disabled={!selected}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-inter font-semibold text-sm text-white btn-gradient disabled:opacity-40 disabled:cursor-not-allowed">
                          {step === 3 ? 'Ver resultado' : 'Avançar'} <ArrowRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ) : result === 'qualified' ? (
                    <motion.div key="qualified" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <Check size={28} style={{ color: '#10B981' }} />
                      </div>
                      <h3 className="font-sora font-[800] text-2xl text-white mb-2">Você tem perfil para a mentoria!</h3>
                      <p className="font-inter text-base mb-8" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        Suas respostas mostram que você está pronto para acelerar com acompanhamento direto. Fale com Ronny para garantir sua vaga.
                      </p>
                      <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Ronny%2C%20quero%20saber%20mais%20sobre%20a%20Mentoria%20de%20Acelera%C3%A7%C3%A3o!"
                        target="_blank" rel="noopener noreferrer"
                        className="btn-gradient w-full flex items-center justify-center gap-2 py-4 text-base font-bold rounded-xl text-white"
                        style={{ boxShadow: '0 0 24px rgba(16,185,129,0.25)' }}>
                        <MessageCircle size={18} /> Falar com Ronny no WhatsApp
                      </a>
                      <button onClick={closeModal} className="mt-3 font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Fechar</button>
                    </motion.div>
                  ) : (
                    <motion.div key="notqualified" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h3 className="font-sora font-[800] text-2xl text-white mb-2">Continue evoluindo!</h3>
                      <p className="font-inter text-base mb-8" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        Agora é hora de avançar no Método ZPPIA. Quando você estiver com o projeto em andamento e pronto para investir, volte aqui — a mentoria vai fazer muito mais sentido.
                      </p>
                      <button onClick={closeModal} className="btn-gradient w-full py-4 text-base font-bold rounded-xl text-white">
                        Continuar no Método
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
