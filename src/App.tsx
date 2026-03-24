import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const LeadForm = lazy(() => import("./pages/LeadForm"));
const MentoriaForm = lazy(() => import("./pages/MentoriaForm"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Obrigado = lazy(() => import("./pages/Obrigado"));

const queryClient = new QueryClient();

// cursor global, scroll progress só na homepage
function SiteOnlyEffects() {
  const { pathname } = useLocation();
  return (
    <>
      <CustomCursor />
      {pathname === "/" && <ScrollProgress />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteOnlyEffects />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/form" element={<Suspense fallback={null}><LeadForm /></Suspense>} />
          <Route path="/mentoria-form" element={<Suspense fallback={null}><MentoriaForm /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={null}><AdminPanel /></Suspense>} />
          <Route path="/obrigado" element={<Suspense fallback={null}><Obrigado /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
