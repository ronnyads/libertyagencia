import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, BookOpen, Star, MessageCircle, BarChart3, Map, Award, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Target, label: 'Trilha Principal', path: '/trilha' },
  { icon: BookOpen, label: 'Central de Materiais', path: '/materiais' },
  { icon: Star, label: 'Bônus', path: '/bonus' },
  { icon: MessageCircle, label: 'Comunidade e Suporte', path: '/comunidade' },
  { icon: BarChart3, label: 'Meu Progresso', path: '/progresso' },
  { icon: Map, label: 'Próximos Passos', path: '/proximos-passos' },
  { icon: Award, label: 'Certificado', path: '/certificado' },
  { icon: Sparkles, label: 'Mentoria Premium', path: '/mentoria' },
  { icon: User, label: 'Meu Perfil', path: '/perfil' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, logout } = useAuth();

  const initials = studentName
    ? studentName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 z-30 border-r border-border" style={{ background: 'hsl(222, 47%, 3%)' }}>
      {/* Brand */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded gradient-bg flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="4" cy="6" r="2" fill="white"/><circle cx="8" cy="6" r="2" fill="white" fillOpacity="0.7"/><line x1="6" y1="6" x2="6" y2="6" stroke="white" strokeWidth="1"/></svg>
          </div>
          <span className="font-sora font-[800] text-lg gradient-text">ZPPIA</span>
        </div>
        <p className="font-inter text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Método Zero ao Primeiro Projeto com IA</p>
      </div>

      {/* Student mini profile */}
      <div className="mx-3 mt-3 mb-4 px-3 py-3 rounded-xl" style={{ background: 'hsl(222, 40%, 9%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
            <span className="font-sora font-bold text-sm text-white">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-inter font-semibold text-sm text-white truncate">{studentName}</p>
            <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Aluno ativo</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-0.5">
        {navItems.map(item => {
          const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-150 text-left w-full ${
                active ? 'border-l-2 border-zppia-blue' : 'border-l-2 border-transparent hover:bg-zppia-surface'
              }`}
              style={active ? { background: 'rgba(59,130,246,0.12)', color: 'white' } : { color: 'rgba(255,255,255,0.35)' }}
            >
              <item.icon size={18} />
              <span className="font-inter font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 mt-auto">
        <div className="border-t border-border mb-3" />
        <div className="glass-card px-3 py-2.5 rounded-[10px] flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
            <span className="font-sora font-bold text-[10px] text-white">R</span>
          </div>
          <div>
            <p className="font-inter font-semibold text-xs text-white">Ronny Oliveira</p>
            <p className="font-inter text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Seu mentor</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-150 hover:bg-red-500/10 group"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
          <span className="font-inter text-sm group-hover:text-red-400 transition-colors">Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}