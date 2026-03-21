import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useBonuses, useUpsertBonus, useDeleteBonus, type DBBonus } from '@/hooks/useBonuses';
import { toast } from 'sonner';

const EMPTY: Partial<DBBonus> = { title: '', description: '', type: 'Template', url: '', cta_label: 'Acessar', badge: '', visible: true };

function BonusModal({ bonus, onClose }: { bonus: Partial<DBBonus>; onClose: () => void }) {
  const [form, setForm] = useState(bonus);
  const upsert = useUpsertBonus();

  const save = () => {
    if (!form.title) return toast.error('Título é obrigatório.');
    upsert.mutate(form, {
      onSuccess: () => { toast.success('Bônus salvo!'); onClose(); },
      onError: () => toast.error('Erro ao salvar.'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,18,0.85)' }} onClick={onClose}>
      <div className="glass-card p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="font-sora font-bold text-lg text-white mb-5">{form.id ? 'Editar Bônus' : 'Novo Bônus'}</h3>
        <div className="space-y-4">
          {[
            { label: 'Título', key: 'title', placeholder: 'Nome do bônus' },
            { label: 'Descrição', key: 'description', placeholder: 'Descrição breve...' },
            { label: 'URL do conteúdo', key: 'url', placeholder: 'Link do bônus' },
          ].map(f => (
            <div key={f.key}>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.label}</label>
              <input value={(form as any)[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Aula Extra', 'Template', 'Biblioteca', 'Ferramenta'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Botão</label>
              <select value={form.cta_label} onChange={e => setForm(p => ({ ...p, cta_label: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Acessar', 'Baixar', 'Ver'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Badge</label>
              <select value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <option value="">Nenhum</option>
                <option value="NOVO">NOVO</option>
                <option value="EXCLUSIVO">EXCLUSIVO</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-inter text-sm text-white">Visível para alunos</label>
            <button onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
              style={{ background: form.visible ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'rgba(255,255,255,0.1)' }}>
              <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                style={{ left: form.visible ? '20px' : '2px' }} />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost-blue flex-1">Cancelar</button>
          <button onClick={save} disabled={upsert.isPending} className="btn-gradient flex-1">
            {upsert.isPending ? 'Salvando...' : 'Salvar Bônus'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBonus() {
  const { data: bonuses, isLoading } = useBonuses();
  const del = useDeleteBonus();
  const [modal, setModal] = useState<Partial<DBBonus> | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {modal && <BonusModal bonus={modal} onClose={() => setModal(null)} />}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-2xl text-white">Área de Bônus</h2>
          <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Adicione, edite ou remova conteúdos bônus.</p>
        </div>
        <button onClick={() => setModal(EMPTY)} className="btn-gradient text-sm flex items-center gap-1.5">
          <Plus size={16} /> Novo Bônus
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {bonuses?.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 relative">
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={() => setModal(b)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-zppia-blue/20 transition-colors">
                <Pencil size={13} className="text-zppia-blue" />
              </button>
              <button onClick={() => { if (confirm('Excluir este bônus?')) del.mutate(b.id, { onSuccess: () => toast.success('Excluído!') }); }}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
                <Trash2 size={13} style={{ color: '#EF4444' }} />
              </button>
            </div>
            {b.badge && (
              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-inter font-semibold mb-3 ${
                b.badge === 'NOVO' ? 'bg-zppia-blue/20 text-zppia-blue' : 'bg-zppia-gold/20 text-zppia-gold'
              }`}>{b.badge}</span>
            )}
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-3">
              <span className="text-xl">⭐</span>
            </div>
            <p className="font-inter text-[11px] tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{b.type}</p>
            <h4 className="font-sora font-bold text-[16px] text-white">{b.title}</h4>
            <p className="font-inter text-sm mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.65)' }}>{b.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-inter text-[13px] text-zppia-blue">{b.cta_label} →</span>
              <span className={`font-inter text-[11px] font-medium ${b.visible ? 'text-zppia-green' : ''}`}
                style={!b.visible ? { color: 'rgba(255,255,255,0.35)' } : {}}>
                {b.visible ? 'Visível' : 'Oculto'}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Add card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setModal(EMPTY)}
          className="glass-card p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zppia-blue/30 transition-colors min-h-[160px] border-dashed">
          <Plus size={24} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <span className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Novo Bônus</span>
        </motion.div>
      </div>
    </div>
  );
}
