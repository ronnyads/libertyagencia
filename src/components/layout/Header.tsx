import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Início',
  '/trilha': 'Trilha Principal',
  '/materiais': 'Central de Materiais',
  '/bonus': 'Bônus',
  '/comunidade': 'Comunidade e Suporte',
  '/progresso': 'Meu Progresso',
  '/proximos-passos': 'Próximos Passos',
  '/certificado': 'Certificado',
  '/mentoria': 'Mentoria Premium',
  '/perfil': 'Meu Perfil',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Método ZPPIA';

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6">
      <h1 className="font-sora font-bold text-lg text-white">{title}</h1>
      <div className="hidden md:flex items-center">
        <span className="font-inter text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Método ZPPIA</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg transition-colors hover:bg-zppia-surface" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Search size={20} />
        </button>
        <button className="p-2 rounded-lg transition-colors hover:bg-zppia-surface relative" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-zppia-blue animate-pulse-dot" />
        </button>
        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center cursor-pointer">
          <span className="font-sora font-bold text-xs text-white">SN</span>
        </div>
      </div>
    </header>
  );
}
