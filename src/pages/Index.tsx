import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problema from "@/components/Problema";
import Servicos from "@/components/Servicos";
import Diferenciais from "@/components/Diferenciais";
import Resultados from "@/components/Resultados";
import Mentoria from "@/components/Mentoria";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Problema />
      <Servicos />
      <Diferenciais />
      <Resultados />
      <Mentoria />
      <Faq />
      <CtaFinal />
      <Footer />
    </div>
  );
};

export default Index;
