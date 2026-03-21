import { motion } from 'framer-motion';
import { MessageCircle, Rocket, Target, ClipboardList, Smartphone, Mail } from 'lucide-react';
import { useState } from 'react';

const actions = [
  { icon: MessageCircle, bg: 'rgba(59,130,246,0.1)', title: 'Postar Dúvida', desc: 'Tire suas dúvidas com a comunidade e com a equipe.' },
  { icon: Rocket, bg: 'rgba(139,92,246,0.1)', title: 'Compartilhar Projeto', desc: 'Mostre o que você está construindo e receba feedback.' },
  { icon: Target, bg: 'rgba(16,185,129,0.1)', title: 'Pedir Feedback', desc: 'Peça revisão do seu projeto ou ideia para a comunidade.' },
  { icon: ClipboardList, bg: 'rgba(245,158,11,0.1)', title: 'Ver Projetos dos Alunos', desc: 'Inspire-se com o que outros alunos estão criando.' },
];

const faqs = [
  { q: 'Como entro em contato com o suporte?', a: 'Você pode enviar uma mensagem pelo WhatsApp ou e-mail diretamente pela página de suporte.' },
  { q: 'Onde tiro dúvidas sobre o conteúdo?', a: 'Na comunidade exclusiva do Método ZPPIA, onde alunos e equipe estão disponíveis.' },
  { q: 'Posso pedir revisão do meu projeto?', a: 'Sim! Compartilhe na comunidade ou solicite na mentoria de aceleração.' },
  { q: 'Onde fico sabendo das novidades?', a: 'No painel do curso e por e-mail. Ative as notificações no seu perfil.' },
  { q: 'Como acesso a mentoria de aceleração?', a: 'Acesse a página de Mentoria Premium no menu lateral para saber mais.' },
];

export default function Community() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Comunidade e Suporte</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Você não está sozinho nessa jornada.</p>
      </motion.div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="glass-card p-7 mt-5 mb-6" style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)' }}>
        <h3 className="font-sora font-[800] text-2xl text-white">Comunidade ZPPIA</h3>
        <p className="font-inter text-base mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Conecte-se com outros alunos, tire dúvidas e compartilhe seu projeto.</p>
        <div className="flex gap-3 mt-4">
          <button className="btn-gradient text-sm" data-placeholder>Entrar na Comunidade</button>
          <button className="btn-ghost-blue text-sm">Como funciona?</button>
        </div>
      </motion.div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {actions.map((a, i) => (
          <motion.div key={a.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}
            className="glass-card p-6 hover:border-zppia-blue/30 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3" style={{ background: a.bg }}>
              <a.icon size={20} className="text-zppia-blue" />
            </div>
            <h4 className="font-sora font-bold text-[17px] text-white">{a.title}</h4>
            <p className="font-inter text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{a.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-[680px]">
        <h3 className="font-sora font-bold text-lg text-white mb-4">Dúvidas de Suporte</h3>
        <div className="flex flex-col gap-2">
          {faqs.map((f, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between">
                <span className="font-inter font-medium text-sm text-white">{f.q}</span>
                <span className="text-zppia-blue">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        {[
          { icon: Smartphone, title: 'WhatsApp', desc: 'Suporte direto' },
          { icon: Mail, title: 'E-mail', desc: 'contato@zppia.com' },
          { icon: MessageCircle, title: 'Comunidade', desc: 'Grupo oficial' },
        ].map(c => (
          <div key={c.title} className="glass-card p-4 flex items-center gap-3 flex-1 cursor-pointer hover:border-zppia-blue/30 transition-colors" data-placeholder>
            <c.icon size={20} className="text-zppia-blue" />
            <div>
              <p className="font-inter font-medium text-sm text-white">{c.title}</p>
              <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
