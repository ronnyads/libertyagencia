import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Download, FileText, Layout, CheckSquare, Terminal, Table } from 'lucide-react';
import { useMaterials } from '@/hooks/useMaterials';
import { toast } from 'sonner';

const filters = ['Todos', 'Templates', 'Checklists', 'Prompts', 'Planilhas', 'PDFs'];

type Badge = 'Obrigatório' | 'Essencial' | 'Apoio' | 'Avançado' | 'Bônus';
type ItemType = 'pdf' | 'template' | 'checklist' | 'prompt' | 'planilha';

interface MaterialItem {
  name: string;
  cat: string;
  type: ItemType;
  desc: string;
  badge: Badge;
}

interface Category {
  title: string;
  items: MaterialItem[];
}

const categories: Category[] = [
  { title: 'Início e Organização', items: [
    { name: 'Guia de Onboarding', cat: 'PDF', type: 'pdf', desc: 'Entenda o método, a estrutura e como aproveitar ao máximo cada módulo.', badge: 'Obrigatório' },
    { name: 'Checklist Primeiros Passos', cat: 'Checklist', type: 'checklist', desc: 'Lista de ações para você sair do zero sem se perder.', badge: 'Obrigatório' },
    { name: 'Glossário de IA', cat: 'PDF', type: 'pdf', desc: 'Termos essenciais de IA explicados de forma simples e prática.', badge: 'Apoio' },
  ]},
  { title: 'Escolha da Ideia', items: [
    { name: 'Template de Ideação (Exemplo Preenchido)', cat: 'Template', type: 'template', desc: 'Veja como outro aluno usou o template para encontrar a ideia certa.', badge: 'Essencial' },
    { name: 'Template de Ideação (Modelo em Branco)', cat: 'Template', type: 'template', desc: 'Preencha com sua própria ideia seguindo o passo a passo do Módulo 2.', badge: 'Essencial' },
    { name: 'Prompt de Validação de Ideia', cat: 'Prompt', type: 'prompt', desc: 'Copie e cole no ChatGPT ou Claude para validar sua ideia em minutos.', badge: 'Essencial' },
    { name: 'Planilha de Viabilidade', cat: 'Planilha', type: 'planilha', desc: 'Avalie critérios de viabilidade antes de escolher sua ideia final.', badge: 'Apoio' },
  ]},
  { title: 'Estrutura do Projeto', items: [
    { name: 'Blueprint do Projeto (Exemplo Preenchido)', cat: 'Template', type: 'template', desc: 'Blueprint real de um projeto do método — use como referência.', badge: 'Obrigatório' },
    { name: 'Blueprint do Projeto (Modelo em Branco)', cat: 'Template', type: 'template', desc: 'Monte a estrutura completa do seu projeto com este modelo.', badge: 'Obrigatório' },
    { name: 'Mapa de Funcionalidades do Projeto', cat: 'Template', type: 'template', desc: 'Organize as funcionalidades do seu projeto antes de construir.', badge: 'Essencial' },
    { name: 'Roteiro de Escopo', cat: 'PDF', type: 'pdf', desc: 'Defina o que entra e o que fica fora da primeira versão.', badge: 'Apoio' },
  ]},
  { title: 'Construção com IA', items: [
    { name: 'Prompts Prontos ZPPIA', cat: 'Prompt', type: 'prompt', desc: 'Coleção de prompts testados para cada etapa da construção com IA.', badge: 'Obrigatório' },
    { name: 'Guia de Ferramentas IA', cat: 'PDF', type: 'pdf', desc: 'As melhores ferramentas de IA do mercado organizadas por função.', badge: 'Essencial' },
    { name: 'Fluxo de Desenvolvimento com IA', cat: 'Template', type: 'template', desc: 'Siga esse fluxo para construir a primeira versão do seu projeto.', badge: 'Essencial' },
  ]},
  { title: 'Validação e Venda', items: [
    { name: 'Roteiro de Entrevista', cat: 'PDF', type: 'pdf', desc: 'Perguntas prontas para conversar com potenciais clientes e validar.', badge: 'Obrigatório' },
    { name: 'Proposta Comercial Pronta (Exemplo Preenchido)', cat: 'Template', type: 'template', desc: 'Veja como uma proposta real foi estruturada por um aluno do método.', badge: 'Essencial' },
    { name: 'Proposta Comercial Pronta (Modelo em Branco)', cat: 'Template', type: 'template', desc: 'Adapte este modelo para apresentar seu projeto a clientes.', badge: 'Essencial' },
    { name: 'Checklist de Lançamento', cat: 'Checklist', type: 'checklist', desc: 'Tudo que você precisa verificar antes de lançar seu projeto.', badge: 'Obrigatório' },
  ]},
];

const typeConfig: Record<string, { icon: typeof FileText; bg: string; color: string }> = {
  pdf:      { icon: FileText,    bg: 'rgba(59,130,246,0.1)',  color: '#3B82F6' },
  template: { icon: Layout,      bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  checklist:{ icon: CheckSquare, bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  prompt:   { icon: Terminal,    bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  planilha: { icon: Table,       bg: 'rgba(34,211,238,0.1)', color: '#22D3EE' },
};

const badgeConfig: Record<Badge, { bg: string; border: string; color: string }> = {
  'Obrigatório': { bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.3)',    color: '#EF4444' },
  'Essencial':   { bg: 'rgba(59,130,246,0.12)',   border: 'rgba(59,130,246,0.25)', color: '#3B82F6' },
  'Apoio':       { bg: 'rgba(255,255,255,0.07)',  border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)' },
  'Avançado':    { bg: 'rgba(139,92,246,0.12)',   border: 'rgba(139,92,246,0.3)',  color: '#8B5CF6' },
  'Bônus':       { bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.25)', color: '#F59E0B' },
};

function matchesFilter(item: MaterialItem, active: string) {
  if (active === 'Todos') return true;
  if (active === 'Templates') return item.type === 'template';
  if (active === 'Checklists') return item.type === 'checklist';
  if (active === 'Prompts') return item.type === 'prompt';
  if (active === 'Planilhas') return item.type === 'planilha';
  if (active === 'PDFs') return item.type === 'pdf';
  return true;
}

export default function Materials() {
  const [active, setActive] = useState('Todos');
  const [search, setSearch] = useState('');
  const { data: dbMaterials } = useMaterials();

  const handleDownload = (itemName: string) => {
    const found = dbMaterials?.find(m => m.name === itemName && m.visible && m.url);
    if (found?.url) {
      window.open(found.url, '_blank');
    } else {
      toast.info('Em breve — o conteúdo está sendo preparado.');
    }
  };

  const filteredCats = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      matchesFilter(item, active) &&
      (search === '' || item.name.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Central de Materiais ZPPIA</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Todos os recursos estratégicos do método em um só lugar.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div className="mt-5 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar material..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-3.5 py-1.5 rounded-full font-inter font-medium text-[13px] whitespace-nowrap border transition-all ${
                active === f ? 'text-zppia-blue border-zppia-blue/30 bg-zppia-blue/10' : 'border-border'
              }`} style={active !== f ? { color: 'rgba(255,255,255,0.35)' } : {}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {filteredCats.length === 0 ? (
        <div className="text-center py-16 font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Nenhum material encontrado para "{search}".
        </div>
      ) : filteredCats.map((cat, ci) => (
        <motion.div key={cat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 }} className="mb-8">
          <h3 className="font-sora font-bold text-base text-white mb-3">{cat.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.items.map(item => {
              const tc = typeConfig[item.type] || typeConfig.pdf;
              const Icon = tc.icon;
              const bc = badgeConfig[item.badge];
              const hasUrl = dbMaterials?.some(m => m.name === item.name && m.visible && m.url);
              return (
                <div key={item.name}
                  className="glass-card p-4 flex gap-3 hover:border-zppia-blue/25 transition-all group"
                  style={{ alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: tc.bg }}>
                    <Icon size={18} style={{ color: tc.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-inter text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: bc.bg, border: `1px solid ${bc.border}`, color: bc.color }}>
                        {item.badge}
                      </span>
                      <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {item.cat}
                      </span>
                    </div>
                    <p className="font-sora font-semibold text-sm text-white leading-snug">{item.name}</p>
                    <p className="font-inter text-[12px] mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Download */}
                  <button onClick={() => handleDownload(item.name)}
                    title={hasUrl ? 'Baixar material' : 'Em breve'}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all group-hover:scale-105"
                    style={{
                      background: hasUrl ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.06)',
                      boxShadow: hasUrl ? '0 0 12px rgba(59,130,246,0.3)' : 'none',
                    }}>
                    <Download size={13} style={{ color: hasUrl ? '#fff' : 'rgba(255,255,255,0.3)' }} />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
