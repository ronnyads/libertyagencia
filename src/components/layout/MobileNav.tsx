import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, BookOpen, BarChart3, User } from 'lucide-react';

const items = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Target, label: 'Trilha', path: '/trilha' },
  { icon: BookOpen, label: 'Materiais', path: '/materiais' },
  { icon: BarChart3, label: 'Progresso', path: '/progresso' },
  { icon: User, label: 'Perfil', path: '/perfil' },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border flex justify-around py-2" style={{ background: 'hsl(222, 47%, 3%)' }}>
      {items.map(item => {
        const active = location.pathname === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-0.5 px-2 py-1">
            <item.icon size={20} className={active ? 'text-zppia-blue' : ''} style={active ? {} : { color: 'rgba(255,255,255,0.35)' }} />
            <span className={`font-inter text-[10px] ${active ? 'text-zppia-blue' : ''}`} style={active ? {} : { color: 'rgba(255,255,255,0.35)' }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
