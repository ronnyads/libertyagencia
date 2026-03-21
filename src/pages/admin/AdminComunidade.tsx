import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useFaqs, useUpsertFaq, useDeleteFaq, type DBFaq } from '@/hooks/useFaqs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

function CommunityLinks() {
  const [links, setLinks] = useState({ whatsapp: '', email: '', group: '' });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    supabase.from('community_links').select('key,value').then(({ data }) => {
      if (data) {
        const map = Object.fromEntries(data.map(r => [r.key, r.value]));
        setLinks({ whatsapp: map.whatsapp ?? '', email: map.email ?? '', group: map.group ?? '' });
      }
    });
  }, []);

  const save = async () => {
    for (const [key, value] of Object.entries(links)) {
      await supabase.from('community_links').update({ value }).eq('key', key);
    }
    toast.success('Links salvos!');
    setDirty(false);
  };

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="font-sora font-bold text-base text-white mb-4">Links da Comunidade</h3>
      {[
        { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/...' },
        { key: 'email', label: 'E-mail de suporte', placeholder: 'contato@zppia.com' },
        { key: 'group', label: 'Link do grupo', placeholder: 'https://...' },
      ].map(f => (
        <div key={f.key} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <label className="font-inter font-medium text-sm text-white w-36 flex-shrink-0">{f.label}</label>
          <input value={(links as any)[f.key]} placeholder={f.placeholder}
            onChange={e => { setLinks(p => ({ ...p, [f.key]: e.target.value })); setDirty(true); }}
            className="flex-1 px-3 py-2 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>
      ))}
      <button onClick={save} disabled={!dirty} className="btn-gradient text-sm mt-4 disabled:opacity-50">
        Salvar todos
      </button>
    </div>
  );
}

function FaqModal({ faq, onClose }: { faq: Partial<DBFaq>; onClose: () => void }) {
  const [form, setForm] = useState(faq);
  const upsert = useUpsertFaq();

  const save = () => {
    if (!form.question || !form.answer) return toast.error('Preencha pergunta e resposta.');
    upsert.mutate(form, {
      onSuccess: () => { toast.success('FAQ salvo!'); onClose(); },
      onError: () => toast.error('Erro ao salvar.'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,18,0.85)' }} onClick={onClose}>
      <div className="glass-card p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="font-sora font-bold text-lg text-white mb-5">{form.id ? 'Editar Pergunta' : 'Nova Pergunta'}</h3>
        <div className="space-y-4">
          <div>
            <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Pergunta</label>
            <input value={form.question || ''} onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.03)' }} placeholder="Como...?" />
          </div>
          <div>
            <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Resposta</label>
            <textarea value={form.answer || ''} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none resize-y min-h-[80px]"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)' }}
              placeholder="Resposta detalhada..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost-blue flex-1">Cancelar</button>
          <button onClick={save} disabled={upsert.isPending} className="btn-gradient flex-1">Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminComunidade() {
  const { data: faqs } = useFaqs();
  const del = useDeleteFaq();
  const [modal, setModal] = useState<Partial<DBFaq> | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-[900px] mx-auto">
      {modal && <FaqModal faq={modal} onClose={() => setModal(null)} />}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="font-sora font-bold text-2xl text-white">Comunidade e FAQ</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Configure links da comunidade e perguntas frequentes.</p>
      </motion.div>

      <CommunityLinks />

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sora font-bold text-base text-white">FAQ de Suporte</h3>
          <button onClick={() => setModal({ question: '', answer: '', order_index: (faqs?.length ?? 0) + 1 })}
            className="btn-ghost-blue text-[13px] py-1.5 px-3 flex items-center gap-1">
            <Plus size={14} /> Nova Pergunta
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {faqs?.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl border-b hover:bg-zppia-elevated transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="font-inter font-medium text-sm text-white flex-1">{f.question}</span>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setModal(f)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zppia-blue/20 transition-colors">
                  <Pencil size={13} className="text-zppia-blue" />
                </button>
                <button onClick={() => { if (confirm('Excluir pergunta?')) del.mutate(f.id, { onSuccess: () => toast.success('Excluído!') }); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
                  <Trash2 size={13} style={{ color: '#EF4444' }} />
                </button>
              </div>
            </motion.div>
          ))}
          {(!faqs || faqs.length === 0) && (
            <p className="py-6 text-center font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Nenhuma pergunta. Clique em "Nova Pergunta".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
