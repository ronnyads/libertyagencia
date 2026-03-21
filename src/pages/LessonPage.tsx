import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModules } from '@/hooks/useModules';
import { useLessons } from '@/hooks/useLessons';
import { Play, Download, Check } from 'lucide-react';
import { useState } from 'react';

function VideoPlayer({ url, title, duration }: { url: string; title: string; duration?: string }) {
  const [playing, setPlaying] = useState(false);

  const ytMatch = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  const vimeoMatch = url?.match(/vimeo\.com\/(\d+)/);

  // Thumbnail do YouTube
  const ytThumb = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` : null;

  // Placeholder (sem URL ou não reconhecido)
  if (!url) {
    return (
      <div className="aspect-video flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0C1225, #0A0F1E)' }}>
        <div className="w-[72px] h-[72px] rounded-full gradient-bg flex items-center justify-center" style={{ boxShadow: '0 0 0 16px rgba(59,130,246,0.1), 0 0 0 32px rgba(59,130,246,0.04)' }}>
          <Play size={28} className="text-white ml-1" />
        </div>
        <p className="font-inter text-sm mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{title}</p>
        <p className="font-inter text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Vídeo não configurado</p>
      </div>
    );
  }

  // Thumbnail overlay (lazy loading)
  if (!playing) {
    return (
      <div className="aspect-video relative overflow-hidden cursor-pointer group" onClick={() => setPlaying(true)}
        style={{ background: '#0A0F1E' }}>
        {/* Thumbnail */}
        {ytThumb && (
          <img src={ytThumb} alt={title} className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
        {/* Overlay escuro */}
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: ytThumb ? 'rgba(6,11,24,0.55)' : 'linear-gradient(145deg, #0C1225, #0A0F1E)' }} />
        {/* Glow radial atrás do botão */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' }} />
        </div>
        {/* Botão de play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[72px] h-[72px] rounded-full gradient-bg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ boxShadow: '0 0 0 12px rgba(59,130,246,0.15), 0 0 0 24px rgba(59,130,246,0.06)' }}>
            <Play size={28} className="text-white ml-1.5" />
          </div>
        </div>
        {/* Título no rodapé */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
          style={{ background: 'linear-gradient(to top, rgba(6,11,24,0.9) 0%, transparent 100%)' }}>
          <p className="font-inter text-sm text-white line-clamp-1">{title}</p>
          {duration && <p className="font-inter text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{duration}</p>}
        </div>
      </div>
    );
  }

  // YouTube embed (nocookie + sem download)
  if (ytMatch) {
    return (
      <div className="aspect-video">
        <iframe className="w-full h-full" title={title}
          src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1&fs=0&iv_load_policy=3`}
          allow="autoplay; encrypted-media" />
      </div>
    );
  }

  // Vimeo
  if (vimeoMatch) {
    return (
      <div className="aspect-video">
        <iframe className="w-full h-full" title={title}
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`}
          allow="autoplay; encrypted-media" />
      </div>
    );
  }

  // Panda Video / outros
  return (
    <div className="aspect-video">
      <iframe className="w-full h-full" src={url} title={title} allow="autoplay; encrypted-media" />
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
