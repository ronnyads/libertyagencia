import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const steps = [
  { title: 'Melhore a Versão 1 do seu projeto', desc: 'Colete feedback real de usuários, ajuste o escopo e faça uma segunda versão mais refinada.', cta: 'Ver guia de iteração →' },
  { title: 'Valide com pessoas reais', desc: 'Apresente seu projeto para 5 a 10 pessoas do seu público e anote os feedbacks de forma estruturada.', cta: 'Baixar roteiro de validação →' },
  { title: 'Conquiste os primeiros clientes ou usuários', desc: 'Use os primeiros passos de venda do Módulo 5 para ativar sua estratégia de aquisição.', cta: 'Ver template de oferta →' },
  { title: 'Evolua o projeto para uma versão comercial', desc: 'Com feedback e validação, melhore as funcionalidades e prepare uma versão para vender.', cta: 'Ver roadmap de evolução →' },
  { title: 'Aplique o Método em um novo projeto', desc: 'Agora que você domina o caminho, aplique novamente em uma nova ideia. O método é replicável.', cta: 'Revisitar a trilha →' },
  { title: 'Acelere com acompanhamento direto', desc: 'Quer encurtar o caminho e ter apoio personalizado de Ronny Oliveira? A Mentoria de Aceleração foi feita para esse momento.', cta: 'Conhecer a Mentoria →', link: '/mentoria' },
];

export default function NextSteps() {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Próximos Passos</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Você concluiu o Método. Agora vem o que importa de verdade.</p>
      </motion.div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="glass-card p-7 mt-5 mb-6" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <h3 className="font-sora font-[800] text-2xl text-white">🎉 Parabéns por chegar até aqui!</h3>
        <p className="font-inter text-base mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Você tem um projeto. Agora é hora de evoluir, validar melhor e dar os próximos passos estratégicos.</p>
      </motion.div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06 }}
            className="glass-card p-6 flex gap-5">
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderImage: 'linear-gradient(135deg, #3B82F6, #8B5CF6) 1', borderImageSlice: 1 }}>
              <span className="font-sora font-[800] text-lg gradient-text">{i + 1}</span>
            </div>
            <div>
              <h4 className="font-sora font-bold text-lg text-white">{s.title}</h4>
              <p className="font-inter text-[15px] mt-1.5" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{s.desc}</p>
              <button onClick={() => s.link ? navigate(s.link) : null} className="font-inter font-medium text-[13px] text-zppia-blue mt-2.5 hover:underline">{s.cta}</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
