import { motion } from 'framer-motion';
import { useBonuses } from '@/hooks/useBonuses';

export default function Bonus() {
  const { data: bonusItems = [], isLoading } = useBonuses();
  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-sora font-bold text-2xl text-white">Área de Bônus</h2>
        <p className="font-inter text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Conteúdo extra para ir além do método.</p>
      </motion.div>

      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="glass-card p-7 mt-5 mb-6" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(139,92,246,0.08))', borderColor: 'rgba(245,158,11,0.2)' }}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">⭐</span>
          <h3 className="font-sora font-[800] text-2xl text-white">Conteúdos Exclusivos</h3>
        </div>
        <p className="font-inter text-base mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Recursos criados para acelerar sua jornada no Método ZPPIA.</p>
        <span className="inline-block mt-3 px-3 py-1 rounded-full font-inter font-semibold text-xs bg-zppia-gold/20 text-zppia-gold border border-zppia-gold/30">{isLoading ? '...' : bonusItems.length} bônus disponíveis</span>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {bonusItems.filter(b => b.visible).map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}
            className="glass-card p-6 hover:border-zppia-blue/30 hover:-translate-y-0.5 transition-all cursor-pointer"
            onClick={() => b.url && window.open(b.url, '_blank')}>
            {b.badge && (
              <span className={`inline-block px-2 py-0.5 rounded-md font-inter font-semibold text-[10px] mb-3 ${
                b.badge === 'NOVO' ? 'bg-zppia-blue/20 text-zppia-blue' : 'bg-zppia-gold/20 text-zppia-gold'
              }`}>{b.badge}</span>
            )}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="font-inter font-medium text-[11px] tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{b.type}</p>
            <h4 className="font-sora font-bold text-[17px] text-white mt-1">{b.title}</h4>
            <p className="font-inter text-sm mt-1.5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.65)' }}>{b.description}</p>
            <button className="font-inter font-medium text-[13px] text-zppia-blue mt-3 hover:underline">{b.cta_label || 'Acessar'} →</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
