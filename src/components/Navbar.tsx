import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const navLinks = [
  { label: "Serviços", href: "#servicos", id: "servicos" },
  { label: "Mentoria", href: "#mentoria", id: "mentoria" },
  { label: "Resultados", href: "#resultados", id: "resultados" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(navLinks.map((l) => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-background/80" : "bg-transparent"
      }`}
      style={scrolled ? { boxShadow: "0 0 0 1px rgba(255,255,255,0.05)" } : {}}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="#" className="font-orbitron font-bold text-xl tracking-tighter text-foreground">
          LIBERTY<span className="text-primary">.</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className="relative text-sm transition-colors"
                style={{ color: isActive ? "hsl(190 100% 50%)" : undefined }}
              >
                <span className={isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
                  {l.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
          <Link
            to="/form"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Projeto Grátis
          </Link>
          <Link
            to="/form"
            className="neon-button px-5 py-2 text-sm flex items-center gap-2"
          >
            <MessageCircle size={16} /> Falar Agora
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden backdrop-blur-md bg-background/95 border-t border-foreground/5 px-6 pb-6 pt-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`block py-3 transition-colors ${
                activeId === l.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/form"
            className="neon-button px-5 py-2.5 text-sm flex items-center justify-center gap-2 mt-3 w-full"
            onClick={() => setMobileOpen(false)}
          >
            <MessageCircle size={16} /> Falar Agora
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
