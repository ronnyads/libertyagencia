import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Download, FileText, Layout, CheckSquare, Terminal } from 'lucide-react';

const filters = ['Todos', 'Templates', 'Checklists', 'Prompts', 'Planilhas', 'PDFs', 'Bônus'];

const categories = [
  { title: 'Início e Organização', items: [
    { name: 'Guia de Onboarding', cat: 'PDF', type: 'pdf' },
    { name: 'Checklist Primeiros Passos', cat: 'Checklist', type: 'checklist' },
    { name: 'Glossário de IA', cat: 'PDF', type: 'pdf' },
  ]},
  { title: 'Escolha da Ideia', items: [
    { name: 'Template de Ideação', cat: 'Template', type: 'template' },
    { name: 'Prompt de Validação de Ideia', cat: 'Prompt', type: 'prompt' },
    { name: 'Planilha de Viabilidade', cat: 'Planilha', type: 'template' },
  ]},
  { title: 'Estrutura do Projeto', items: [
    { name: 'Blueprint Template', cat: 'Template', type: 'template' },
    { name: 'Mapa de Funcionalidades', cat: 'Template', type: 'template' },
    { name: 'Roteiro de Escopo', cat: 'PDF', type: 'pdf' },
  ]},
  { title: 'Construção com IA', items: [
    { name: 'Biblioteca de Prompts', cat: 'Prompt', type: 'prompt' },
    { name: 'Guia de Ferramentas IA', cat: 'PDF', type: 'pdf' },
    { name: 'Fluxo de Desenvolvimento', cat: 'Template', type: 'template' },
  ]},
  { title: 'Validação e Venda', items: [
    { name: 'Roteiro de Entrevista', cat: 'PDF', type: 'pdf' },
    { name: 'Template de Proposta', cat: 'Template', type: 'template' },
    { name: 'Checklist de Lançamento', cat: 'Checklist', type: 'checklist' },
  ]},
];

const typeConfig: Record<string, { icon: typeof FileText; bg: string }> = {
  pdf: { icon: FileText, bg: 'rgba(59,130,246,0.1)' },
  template: { icon: Layout, bg: 'rgba(139,92,246,0.1)' },
  checklist: { icon: CheckSquare, bg: 'rgba(16,185,129,0.1)' },
  prompt: { icon: Terminal, bg: 'rgba(245,158,11,0.1)' },
};

export default function Materials() {
  const [active, setActive] = useState('Todos');
  const [search, setSearch] = useState('');

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Central de Materiais ZPPIA</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Todos os recursos em um só lugar.</p>
      </motion.div>

      {/* Search + Filters */}
      <div className="mt-5 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar material..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card font-inter text-sm text-white border-none focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} className={`px-3.5 py-1.5 rounded-full font-inter font-medium text-[13px] whitespace-nowrap border transition-all ${
              active === f ? 'text-zppia-blue border-zppia-blue/30 bg-zppia-blue/10' : 'border-border'
            }`} style={active !== f ? { color: 'rgba(255,255,255,0.35)' } : {}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.map((cat, ci) => (
        <motion.div key={cat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.06 }} className="mb-8">
          <h3 className="font-sora font-bold text-base text-white mb-3">{cat.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.items.map(item => {
              const tc = typeConfig[item.type] || typeConfig.pdf;
              const Icon = tc.icon;
              return (
                <div key={item.name} className="glass-card p-4 flex items-center gap-3 hover:border-zppia-blue/30 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tc.bg }}>
                    <Icon size={18} className="text-zppia-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sora font-semibold text-sm text-white">{item.name}</p>
                    <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.cat}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zppia-surface hover:gradient-bg transition-all cursor-pointer">
                    <Download size={14} className="text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
