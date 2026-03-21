import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Trilha from "@/pages/Trilha";
import ModulePage from "@/pages/ModulePage";
import LessonPage from "@/pages/LessonPage";
import Materials from "@/pages/Materials";
import Bonus from "@/pages/Bonus";
import Community from "@/pages/Community";
import Progress from "@/pages/Progress";
import Certificate from "@/pages/Certificate";
import NextSteps from "@/pages/NextSteps";
import Mentorship from "@/pages/Mentorship";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/trilha" element={<ProtectedRoute><Trilha /></ProtectedRoute>} />
      <Route path="/modulo/:id" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
      <Route path="/modulo/:id/aula/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      <Route path="/materiais" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
      <Route path="/bonus" element={<ProtectedRoute><Bonus /></ProtectedRoute>} />
      <Route path="/comunidade" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/progresso" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/certificado" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
      <Route path="/proximos-passos" element={<ProtectedRoute><NextSteps /></ProtectedRoute>} />
      <Route path="/mentoria" element={<ProtectedRoute><Mentorship /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
