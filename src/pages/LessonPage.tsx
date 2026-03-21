import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModules } from '@/hooks/useModules';
import { useLessons } from '@/hooks/useLessons';
import { Play, Download, Check } from 'lucide-react';
import { useState } from 'react';

function VideoPlayer({ url, title }: { url: string; title: string }) {
  if (!url) {
    return (
      <div className="aspect-video flex flex-col items-center justify-center" style={{ background: 'linear-gradient(145deg, #0C1225, #0A0F1E)' }}>
        <div className="w-[72px] h-[72px] rounded-full gradient-bg flex items-center justify-center" style={{ boxShadow: '0 0 0 12px rgba(59,130,246,0.12), 0 0 0 24px rgba(59,130,246,0.05)' }}>
          <Play size={26} className="text-white ml-1" />
        </div>
        <p className="font-inter text-sm mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{title}</p>
        <p className="font-inter text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Vídeo não configurado</p>
      </div>
    );
  }

  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return (
      <div className="aspect-video">
        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen title={title} />
      </div>
    );
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <div className="aspect-video">
        <iframe className="w-full h-full" src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={title} />
      </div>
    );
  }

  // Panda Video ou qualquer outro iframe-friendly
  return (
    <div className="aspect-video">
      <iframe className="w-full h-full" src={url} allow="autoplay; fullscreen" allowFullScreen title={title} />
    </div>
  );
}

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const { data: allModules = [] } = useModules();
  const { data: lessons = [] } = useLessons(id);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);

  const m = allModules.find(mod => mod.id === id);
  const lesson = lessons.find(l => l.id === lessonId);
  const lessonIdx = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = lessonIdx > 0 ? lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < lessons.length - 1 ? lessons[lessonIdx + 1] : null;

  if (!m || !lesson) {
    return <div className="p-6 text-white font-inter">Carregando...</div>;
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="font-inter text-[13px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/trilha')}>Trilha</span>
          {' → '}
          <span className="cursor-pointer hover:text-white" onClick={() => navigate(`/modulo/${m.id}`)}>Módulo {m.number}</span>
          {' → '}Aula {lesson.number}
        </p>
        <h1 className="font-sora font-bold text-2xl text-white">{lesson.title}</h1>
        <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Módulo {m.number} · Aula {lesson.number} de {lessons.length}</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Video + controls */}
        <div className="flex-1 lg:w-[65%]">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
            <VideoPlayer url={lesson.video_url} title={`Aula ${lesson.number} — ${lesson.title}`} />
          </motion.div>
          <div className="mt-2 progress-bar-track"><div className="progress-bar-fill" style={{ width: completed ? '100%' : '35%' }} /></div>
          <div className="flex items-center justify-between mt-2 px-1">
            {prevLesson ? <button onClick={() => navigate(`/modulo/${m.id}/aula/${prevLesson.id}`)} className="font-inter font-medium text-[13px] text-zppia-blue hover:underline">← Aula anterior</button> : <span />}
            <span className="font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Aula {lesson.number} de {lessons.length}</span>
            {nextLesson ? <button onClick={() => navigate(`/modulo/${m.id}/aula/${nextLesson.id}`)} className="font-inter font-medium text-[13px] text-zppia-blue hover:underline">Próxima aula →</button> : <span />}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-[35%] flex flex-col gap-3">
          {lesson.objectives?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-sora font-semibold text-[15px] text-zppia-blue mb-2.5">🎯 O que você vai aprender</h3>
              <ul className="flex flex-col gap-1.5">
                {lesson.objectives.map((o, i) => <li key={i} className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>• {o}</li>)}
              </ul>
            </div>
          )}

          {lesson.summary && (
            <div className="glass-card p-5">
              <h3 className="font-sora font-semibold text-[15px] text-white mb-2.5">📋 Resumo da Aula</h3>
              <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{lesson.summary}</p>
            </div>
          )}

          {lesson.task && (
            <div className="glass-card p-5" style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.3)' }}>
              <h3 className="font-sora font-bold text-[15px] text-zppia-blue mb-2">⚡ Tarefa Prática</h3>
              <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{lesson.task}</p>
              <button className="btn-ghost-blue text-[13px] mt-3 py-1.5 px-3">✅ Marcar como feita</button>
            </div>
          )}

          <div className="glass-card p-5">
            <h3 className="font-sora font-semibold text-[15px] text-white mb-2.5">📝 Minhas Anotações</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Registre aqui seus insights desta aula..."
              className="w-full min-h-[100px] p-3.5 rounded-[10px] font-inter text-sm resize-y border border-border focus:border-zppia-blue focus:outline-none text-white"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)' }} />
            <div className="flex justify-end mt-2">
              <button className="btn-ghost-blue text-[13px] py-1.5 px-3">Salvar nota</button>
            </div>
          </div>

          {!completed ? (
            <button onClick={() => setCompleted(true)} className="btn-gradient w-full py-3.5 text-[15px] font-bold rounded-xl">✓ Marcar Aula como Concluída</button>
          ) : (
            <div className="w-full py-3.5 text-center rounded-xl border font-sora font-bold text-[15px] text-zppia-green" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }}>
              ✓ Aula Concluída
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
