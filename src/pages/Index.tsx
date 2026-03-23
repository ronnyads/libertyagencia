import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const Problema = lazy(() => import("@/components/Problema"));
const Servicos = lazy(() => import("@/components/Servicos"));
const Diferenciais = lazy(() => import("@/components/Diferenciais"));
const Resultados = lazy(() => import("@/components/Resultados"));
const Mentoria = lazy(() => import("@/components/Mentoria"));
const Faq = lazy(() => import("@/components/Faq"));
const CtaFinal = lazy(() => import("@/components/CtaFinal"));
const Footer = lazy(() => import("@/components/Footer"));

const Fallback = () => <div className="h-32 bg-background" />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Suspense fallback={<Fallback />}>
        <Problema />
        <Servicos />
        <Diferenciais />
        <Resultados />
        <Mentoria />
        <Faq />
        <CtaFinal />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
