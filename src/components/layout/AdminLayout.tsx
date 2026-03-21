import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Target, BookOpen, Star, MessageCircle,
  Bell, Users, Award, Settings, ChevronLeft, LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/admin/dashboard' },
  { icon: Target, label: 'Módulos e Aulas', path: '/admin/modulos' },
  { icon: BookOpen, label: 'Materiais', path: '/admin/materiais' },
  { icon: Star, label: 'Bônus', path: '/admin/bonus' },
  { icon: MessageCircle, label: 'Comunidade / FAQ', path: '/admin/comunidade' },
  { icon: Bell, label: 'Avisos', path: '/admin/avisos' },
  { icon: Users, label: 'Alunos', path: '/admin/alunos' },
  { icon: Award, label: 'Certificados', path: '/admin/certificados' },
  { icon: Settings, label: 'Configurações', path: '/admin/config' },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentName, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-[260px] z-30 border-r"
      style={{ background: 'hsl(222,47%,3%)', borderColor: 'rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded gradient-bg flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="4" cy="6" r="2" fill="white"/>
              <circle cx="8" cy="6" r="2" fill="white" fillOpacity="0.7"/>
            </svg>
          </div>
          <span className="font-sora font-[800] text-[18px] gradient-text">ZPPIA</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
            Admin
          </span>
        </div>
        <p className="font-inter text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Painel de Gerenciamento
        </p>
      </div>

      {/* Mini Profile */}
      <div className="mx-3 mb-4 px-3 py-2.5 rounded-[12px] flex items-center gap-2.5"
        style={{ background: 'hsl(222,40%,9%)' }}>
        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
          <span className="font-sora font-bold text-sm text-white">R</span>
        </div>
        <div className="min-w-0">
          <p className="font-inter font-semibold text-[14px] text-white truncate">{studentName}</p>
          <p className="font-inter text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Administrador</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-150 text-left w-full border-l-2"
              style={active
                ? { background: 'rgba(245,158,11,0.1)', color: 'white', borderColor: '#F59E0B' }
                : { color: 'rgba(255,255,255,0.35)', borderColor: 'transparent' }
              }>
              <item.icon size={18} />
              <span className="font-inter font-medium text-[14px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-[10px] hover:bg-zppia-surface transition-colors"
          style={{ color: '#3B82F6' }}>
          <ChevronLeft size={16} />
          <span className="font-inter font-medium text-[12px]">Ver como aluno</span>
        </button>
        <button onClick={async () => { await logout(); navigate('/login', { replace: true }); }}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-[10px] hover:bg-red-500/10 transition-colors group mt-0.5"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          <LogOut size={15} className="group-hover:text-red-400 transition-colors" />
          <span className="font-inter text-[12px] group-hover:text-red-400 transition-colors">Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'hsl(222,60%,5%)' }}>
      <AdminSidebar />
      <main className="flex-1 lg:ml-[260px] overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
