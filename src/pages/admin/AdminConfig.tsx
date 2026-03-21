import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminConfig() {
  const [course, setCourse] = useState({ name: 'Método ZPPIA', subtitle: 'Zero ao Primeiro Projeto com IA', mentor_name: 'Ronny Oliveira', mentor_instagram: '@euronnyads', community_link: '', whatsapp_link: '' });
  const [admin, setAdmin] = useState({ name: '', email: '', password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);

  useEffect(() => {
    supabase.from('community_links').select('key,value').then(({ data }) => {
      if (data) {
        const map = Object.fromEntries(data.map((r: any) => [r.key, r.value]));
        setCourse(p => ({ ...p, community_link: map.group ?? '', whatsapp_link: map.whatsapp ?? '' }));
      }
    });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('profiles').select('name').eq('id', data.user.id).single().then(({ data: p }) => {
          setAdmin(prev => ({ ...prev, email: data.user.email ?? '', name: p?.name ?? '' }));
        });
      }
    });
  }, []);

  const saveCourse = async () => {
    setSaving(true);
    await supabase.from('community_links').update({ value: course.community_link }).eq('key', 'group');
    await supabase.from('community_links').update({ value: course.whatsapp_link }).eq('key', 'whatsapp');
    toast.success('Configurações salvas!');
    setSaving(false);
  };

  const saveAdmin = async () => {
    if (admin.password && admin.password !== admin.confirm) return toast.error('As senhas não coincidem.');
    setSavingAdmin(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from('profiles').update({ name: admin.name }).eq('id', data.user.id);
      if (admin.password) {
        const { error } = await supabase.auth.updateUser({ password: admin.password });
        if (error) { toast.error('Erro ao atualizar senha.'); setSavingAdmin(false); return; }
      }
    }
    toast.success('Conta atualizada!');
    setSavingAdmin(false);
  };

  const dangerReset = async (what: string) => {
    if (!confirm(`Confirmar: ${what}?`)) return;
    if (what === 'Resetar todos os progressos') {
      await supabase.from('student_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast.success('Progressos resetados!');
    }
    if (what === 'Limpar community_links') {
      await supabase.from('community_links').update({ value: '' }).in('key', ['whatsapp', 'email', 'group']);
      toast.success('Links limpos!');
    }
  };

  const fields = [
    { label: 'Nome do Curso', key: 'name' },
    { label: 'Subtítulo', key: 'subtitle' },
    { label: 'Nome do Mentor', key: 'mentor_name' },
    { label: 'Instagram do Mentor', key: 'mentor_instagram' },
    { label: 'Link da Comunidade', key: 'community_link' },
    { label: 'Link do WhatsApp de Suporte', key: 'whatsapp_link' },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[900px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="font-sora font-bold text-2xl text-white">Configurações do Curso</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Ajuste as informações gerais da plataforma.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Course info */}
        <div className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-white mb-4">Informações Gerais</h3>
          <div className="space-y-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.label}</label>
                <input value={(course as any)[f.key]} onChange={e => setCourse(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)' }} />
              </div>
            ))}
          </div>
          <button onClick={saveCourse} disabled={saving} className="btn-gradient text-sm mt-4 w-full">
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        {/* Admin account */}
        <div className="glass-card p-6">
          <h3 className="font-sora font-bold text-base text-white mb-4">Conta do Administrador</h3>
          <div className="space-y-3">
            {[{ label: 'Nome', key: 'name', type: 'text' },
              { label: 'E-mail de acesso', key: 'email', type: 'email' },
              { label: 'Nova senha', key: 'password', type: 'password' },
              { label: 'Confirmar nova senha', key: 'confirm', type: 'password' },
            ].map(f => (
              <div key={f.key}>
                <label className="font-inter text-[12px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.label}</label>
                <input type={f.type} value={(admin as any)[f.key]} onChange={e => setAdmin(p => ({ ...p, [f.key]: e.target.value }))}
                  disabled={f.key === 'email'}
                  className="w-full px-3 py-2 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors disabled:opacity-50"
                  style={{ background: 'rgba(255,255,255,0.03)' }} />
              </div>
            ))}
          </div>
          <button onClick={saveAdmin} disabled={savingAdmin} className="btn-gradient text-sm mt-4 w-full">
            {savingAdmin ? 'Atualizando...' : 'Atualizar Conta'}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass-card p-6" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <h3 className="font-sora font-bold text-base mb-4" style={{ color: '#EF4444' }}>Zona de Perigo</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => dangerReset('Resetar todos os progressos')}
            className="px-4 py-2 rounded-xl font-inter font-medium text-sm transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
            Resetar todos os progressos
          </button>
          <button
            onClick={() => dangerReset('Limpar community_links')}
            className="px-4 py-2 rounded-xl font-inter font-medium text-sm transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
            Limpar links da comunidade
          </button>
        </div>
      </div>
    </div>
  );
}
