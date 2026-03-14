import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Mentoria", href: "#mentoria" },
  { label: "Resultados", href: "#resultados" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5511999999999?text=Olá, vim pelo site e quero saber mais sobre a Liberty."
            target="_blank"
            rel="noopener noreferrer"
            className="neon-button px-5 py-2 text-sm flex items-center gap-2"
          >
            <MessageCircle size={16} /> Falar Agora
          </a>
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
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5511999999999?text=Olá, vim pelo site e quero saber mais sobre a Liberty."
            target="_blank"
            rel="noopener noreferrer"
            className="neon-button px-5 py-2.5 text-sm flex items-center justify-center gap-2 mt-3 w-full"
          >
            <MessageCircle size={16} /> Falar Agora
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
