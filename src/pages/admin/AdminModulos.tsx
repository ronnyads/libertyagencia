import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, Trash2, Plus, Save, GripVertical } from 'lucide-react';
import { useModules, useUpdateModule } from '@/hooks/useModules';
import { useLessons, useUpdateLesson, useAddLesson, useDeleteLesson } from '@/hooks/useLessons';
import { toast } from 'sonner';

function LessonRow({ lesson, moduleId }: { lesson: any; moduleId: string }) {
  const [title, setTitle] = useState(lesson.title);
  const [duration, setDuration] = useState(lesson.duration);
  const [videoUrl, setVideoUrl] = useState(lesson.video_url || '');
  const [coverUrl, setCoverUrl] = useState(lesson.cover_url || '');
  const [status, setStatus] = useState(lesson.status);
  const update = useUpdateLesson();
  const del = useDeleteLesson();
  const [dirty, setDirty] = useState(false);

  const save = () => {
    update.mutate({ id: lesson.id, title, duration, video_url: videoUrl, cover_url: coverUrl, status }, {
      onSuccess: () => { toast.success('Aula salva!'); setDirty(false); },
      onError: () => toast.error('Erro ao salvar.'),
    });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b last:border-0 hover:bg-zppia-elevated transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <GripVertical size={16} style={{ color: 'rgba(255,255,255,0.2)' }} className="flex-shrink-0" />
      <span className="font-inter text-[12px] flex-shrink-0 w-6" style={{ color: 'rgba(255,255,255,0.35)' }}>{lesson.number}</span>
      <input value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }}
        className="flex-1 min-w-0 bg-transparent font-inter text-sm text-white border border-transparent hover:border-border focus:border-zppia-blue rounded-lg px-2 py-1 focus:outline-none transition-colors" />
      <input value={duration} onChange={e => { setDuration(e.target.value); setDirty(true); }}
        className="w-16 bg-transparent font-inter text-[12px] text-white border border-transparent hover:border-border focus:border-zppia-blue rounded-lg px-2 py-1 focus:outline-none transition-colors text-center"
        placeholder="18min" />
      <input value={videoUrl} onChange={e => { setVideoUrl(e.target.value); setDirty(true); }}
        className="w-48 bg-transparent font-inter text-[12px] text-white border border-transparent hover:border-border focus:border-zppia-blue rounded-lg px-2 py-1 focus:outline-none transition-colors"
        placeholder="URL do vídeo (Panda/YouTube/Vimeo)" />
      <input value={coverUrl} onChange={e => { setCoverUrl(e.target.value); setDirty(true); }}
        className="w-44 bg-transparent font-inter text-[12px] text-white border border-transparent hover:border-border focus:border-zppia-blue rounded-lg px-2 py-1 focus:outline-none transition-colors"
        placeholder="Capa (imagem)" />
      <select value={status} onChange={e => { setStatus(e.target.value); setDirty(true); }}
        className="bg-zppia-surface font-inter text-[12px] text-white border border-border rounded-lg px-2 py-1 focus:outline-none">
        <option value="locked">Bloqueado</option>
        <option value="current">Atual</option>
        <option value="completed">Concluído</option>
      </select>
      {dirty && (
        <button onClick={save} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zppia-blue/20 hover:bg-zppia-blue/40 transition-colors">
          <Save size={14} className="text-zppia-blue" />
        </button>
      )}
      <button onClick={() => { if (confirm('Excluir esta aula?')) del.mutate(lesson.id, { onSuccess: () => toast.success('Aula excluída.') }); }}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
        <Trash2 size={14} style={{ color: '#EF4444' }} />
      </button>
    </div>
  );
}

function ModulePanel({ mod }: { mod: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(mod.title);
  const [result, setResult] = useState(mod.result);
  const [status, setStatus] = useState(mod.status);
  const [dirty, setDirty] = useState(false);
  const { data: lessons } = useLessons(mod.id);
  const updateMod = useUpdateModule();
  const addLesson = useAddLesson();

  const save = () => {
    updateMod.mutate({ id: mod.id, title, result, status }, {
      onSuccess: () => { toast.success('Módulo salvo!'); setDirty(false); },
    });
  };

  const handleAddLesson = () => {
    const maxNum = lessons ? Math.max(0, ...lessons.map(l => l.number)) : 0;
    addLesson.mutate({
      id: `${mod.id}-l${maxNum + 1}-${Date.now()}`,
      module_id: mod.id,
      number: maxNum + 1,
      title: 'Nova Aula',
      duration: '0min',
      video_url: '',
      cover_url: '',
      objectives: [],
      summary: '',
      task: '',
      status: 'locked',
    }, { onSuccess: () => toast.success('Aula adicionada!') });
  };

  const statusColor = mod.status === 'completed' ? '#10B981' : mod.status === 'in-progress' ? '#3B82F6' : 'rgba(255,255,255,0.35)';

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-zppia-elevated transition-colors"
        onClick={() => setOpen(!open)}>
        <GripVertical size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
        <span className="gradient-bg text-white font-sora font-bold text-[11px] px-2 py-1 rounded-md flex-shrink-0">
          Módulo {mod.number}
        </span>
        <span className="flex-1 font-sora font-semibold text-[15px] text-white">{mod.title}</span>
        <span className="font-inter text-[12px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {lessons?.length ?? mod.lesson_count ?? 0} aulas
        </span>
        <span className="px-2 py-0.5 rounded-md font-inter text-[11px] border flex-shrink-0"
          style={{ color: statusColor, borderColor: statusColor + '40', background: statusColor + '15' }}>
          {mod.status === 'completed' ? 'Concluído' : mod.status === 'in-progress' ? 'Em andamento' : 'Bloqueado'}
        </span>
        {open ? <ChevronUp size={18} style={{ color: 'rgba(255,255,255,0.35)' }} /> : <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.35)' }} />}
      </div>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Module edit */}
          <div className="flex flex-wrap gap-3 py-4">
            <div className="flex-1 min-w-[200px]">
              <label className="font-inter text-[11px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Nome do Módulo</label>
              <input value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }}
                className="w-full px-3 py-2 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="font-inter text-[11px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Resultado esperado</label>
              <input value={result} onChange={e => { setResult(e.target.value); setDirty(true); }}
                className="w-full px-3 py-2 rounded-lg font-inter text-sm text-white border border-border focus:border-zppia-blue focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
            <div>
              <label className="font-inter text-[11px] mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</label>
              <select value={status} onChange={e => { setStatus(e.target.value); setDirty(true); }}
                className="px-3 py-2 rounded-lg font-inter text-sm text-white border border-border focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <option value="locked">Bloqueado</option>
                <option value="in-progress">Em andamento</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
            {dirty && (
              <div className="flex items-end">
                <button onClick={save} className="btn-gradient px-4 py-2 text-sm">Salvar</button>
              </div>
            )}
          </div>

          {/* Lessons table */}
          <div className="glass-card overflow-hidden mt-2">
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="font-sora font-semibold text-sm text-white">Aulas</span>
              <button onClick={handleAddLesson} className="btn-ghost-blue text-[13px] py-1.5 px-3 flex items-center gap-1">
                <Plus size={14} /> Nova Aula
              </button>
            </div>
            {lessons?.map(l => <LessonRow key={l.id} lesson={l} moduleId={mod.id} />)}
            {(!lessons || lessons.length === 0) && (
              <p className="px-4 py-6 text-center font-inter text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Nenhuma aula. Clique em "Nova Aula" para adicionar.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminModulos() {
  const { data: modules, isLoading } = useModules();

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sora font-bold text-2xl text-white">Módulos e Aulas</h2>
          <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Gerencie toda a estrutura do curso.
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="glass-card h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {modules?.map((mod, i) => (
            <motion.div key={mod.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ModulePanel mod={mod} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
