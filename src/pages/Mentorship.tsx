import { motion } from 'framer-motion';
import { Diamond, Check } from 'lucide-react';

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

export default function Mentorship() {
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
                <span className="font-sora font-medium text-[15px] text-white" data-placeholder>{item}</span>
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
        <button className="btn-gradient w-full mt-5 py-4 text-base font-bold" style={{ boxShadow: '0 0 30px rgba(139,92,246,0.35)' }} data-placeholder>
          ✦ Quero a Mentoria de Aceleração
        </button>
        <p className="font-inter text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Vagas limitadas · Acesso exclusivo para alunos</p>
      </motion.div>
    </div>
  );
}
