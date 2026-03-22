import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, FileText, Layout, CheckSquare, Terminal, Table } from 'lucide-react';
import { useMaterials, useUpsertMaterial, useDeleteMaterial, type DBMaterial } from '@/hooks/useMaterials';
import { useModules } from '@/hooks/useModules';
import { toast } from 'sonner';

const typeConfig = {
  pdf:      { icon: FileText,    bg: 'rgba(59,130,246,0.1)',  color: '#3B82F6' },
  template: { icon: Layout,      bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  checklist:{ icon: CheckSquare, bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  prompt:   { icon: Terminal,    bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
} as const;

const SECTIONS = [
  'Início e Organização',
  'Escolha da Ideia',
  'Estrutura do Projeto',
  'Construção com IA',
  'Validação e Venda',
  'Geral',
];

const EMPTY: Partial<DBMaterial> = { name: '', description: '', type: 'pdf', url: '', category: 'Geral', module_id: null, visible: true };

function MaterialModal({ mat, onClose, modules }: { mat: Partial<DBMaterial>; onClose: () => void; modules: any[] }) {
  const [form, setForm] = useState(mat);
  const upsert = useUpsertMaterial();

  const save = () => {
    if (!form.name) return toast.error('Nome é obrigatório.');
    upsert.mutate(form, {
      onSuccess: () => { toast.success('Material salvo!'); onClose(); },
      onError: () => toast.error('Erro ao salvar.'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,18,0.88)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="glass-card p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="font-sora font-bold text-lg text-white mb-5">{form.id ? 'Editar Material' : 'Novo Material'}</h3>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Nome do Material</label>
            <input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Blueprint do Projeto (Modelo em Branco)"
              className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }} />
            <p className="font-inter text-[11px] mt-1.5 leading-relaxed" style={{ color: 'rgba(245,158,11,0.7)' }}>
              💡 Use o nome exato como aparece na lista do aluno para ativar o download automaticamente.
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Descrição curta</label>
            <input value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Breve descrição do material..."
              className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>

          {/* URL */}
          <div>
            <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>URL do arquivo</label>
            <input value={form.url || ''} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="Link do Google Drive, Notion, PDF..."
              className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>

          {/* Seção + Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Seção</label>
              <select value={form.category || 'Geral'} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(12,18,37,1)' }}>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(12,18,37,1)' }}>
                <option value="pdf">PDF</option>
                <option value="template">Template</option>
                <option value="checklist">Checklist</option>
                <option value="prompt">Prompt</option>
              </select>
            </div>
          </div>

          {/* Visível */}
          <div className="flex items-center gap-3">
            <label className="font-inter text-sm text-white">Visível para alunos</label>
            <button onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              className="w-10 h-5 rounded-full transition-colors flex-shrink-0 relative"
              style={{ background: form.visible ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.1)' }}>
              <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                style={{ left: form.visible ? '20px' : '2px' }} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost-blue flex-1">Cancelar</button>
          <button onClick={save} disabled={upsert.isPending} className="btn-gradient flex-1">
            {upsert.isPending ? 'Salvando...' : 'Salvar Material'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMateriais() {
  const { data: materials, isLoading } = useMaterials();
  const { data: modules } = useModules();
  const del = useDeleteMaterial();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Partial<DBMaterial> | null>(null);

  const filtered = materials?.filter(m => m.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {modal && <MaterialModal mat={modal} onClose={() => setModal(null)} modules={modules ?? []} />}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-2xl text-white">Central de Materiais</h2>
          <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Faça upload, edite e organize todos os materiais.</p>
        </div>
        <button onClick={() => setModal(EMPTY)} className="btn-gradient text-sm flex items-center gap-1.5">
          <Plus size={16} /> Novo Material
        </button>
      </motion.div>

      {/* Hint */}
      <div className="glass-card p-4 mb-4 flex gap-3 items-start" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.05)' }}>
        <span className="text-base">💡</span>
        <p className="font-inter text-[13px]" style={{ color: 'rgba(245,158,11,0.85)' }}>
          Para ativar o download na tela do aluno, o <strong>nome do material aqui deve ser idêntico</strong> ao nome que aparece na Central de Materiais do aluno. Após salvar com a URL preenchida, o botão de download fica ativo automaticamente.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar material..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Nome', cls: 'flex-[2]' },
            { label: 'Seção', cls: 'flex-1' },
            { label: 'Tipo', cls: 'w-24' },
            { label: 'URL', cls: 'flex-1' },
            { label: 'Visível', cls: 'w-20' },
            { label: 'Ações', cls: 'w-20' },
          ].map(h => (
            <span key={h.label} className={`font-inter font-medium text-[11px] uppercase tracking-wider ${h.cls}`}
              style={{ color: 'rgba(255,255,255,0.35)' }}>{h.label}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-inter text-sm mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Nenhum material cadastrado ainda.</p>
            <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Clique em "Novo Material" e use os nomes exatos da lista do aluno para ativar os downloads.
            </p>
          </div>
        ) : filtered.map(mat => {
          const tc = (typeConfig as any)[mat.type] ?? typeConfig.pdf;
          const Icon = tc.icon;
          return (
            <div key={mat.id} className="flex items-center gap-3 px-5 py-3.5 border-b hover:bg-zppia-elevated transition-colors last:border-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2.5 flex-[2] min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tc.bg }}>
                  <Icon size={15} style={{ color: tc.color }} />
                </div>
                <span className="font-sora font-medium text-sm text-white truncate">{mat.name}</span>
              </div>
              <span className="flex-1 font-inter text-[12px] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {mat.category || 'Geral'}
              </span>
              <span className="w-24 font-inter text-[12px] capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {mat.type}
              </span>
              <span className="flex-1 font-inter text-[12px] truncate" style={{ color: mat.url ? 'rgba(16,185,129,0.8)' : 'rgba(255,255,255,0.25)' }}>
                {mat.url ? '✓ URL cadastrada' : '— sem URL'}
              </span>
              <span className={`w-20 font-inter text-[12px] font-medium ${mat.visible ? 'text-zppia-green' : ''}`}
                style={!mat.visible ? { color: 'rgba(255,255,255,0.35)' } : {}}>
                {mat.visible ? 'Sim' : 'Oculto'}
              </span>
              <div className="w-20 flex items-center gap-1">
                <button onClick={() => setModal(mat)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zppia-blue/20 transition-colors">
                  <Pencil size={14} className="text-zppia-blue" />
                </button>
                <button onClick={() => { if (confirm('Excluir material?')) del.mutate(mat.id, { onSuccess: () => toast.success('Excluído!') }); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
                  <Trash2 size={14} style={{ color: '#EF4444' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
