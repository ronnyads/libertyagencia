import { Instagram, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-12 border-t border-foreground/5">
    <div className="container px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="font-orbitron font-bold text-lg tracking-tighter">
          LIBERTY<span className="text-primary">.</span>
        </a>

        <div className="flex items-center gap-6">
          <a href="https://instagram.com/euronnyads" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram size={20} />
          </a>
          <Link to="/form" className="text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle size={20} />
          </Link>
          <a href="mailto:contato@liberty.agency" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <div className="text-muted-foreground text-xs text-center md:text-right">
          <p>CNPJ: 60.355.549/0001-20</p>
          <p>© {new Date().getFullYear()} Liberty Agency. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
