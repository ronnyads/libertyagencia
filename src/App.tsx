import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import AdminLayout from "@/components/layout/AdminLayout";
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
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminModulos from "@/pages/admin/AdminModulos";
import AdminMateriais from "@/pages/admin/AdminMateriais";
import AdminBonus from "@/pages/admin/AdminBonus";
import AdminComunidade from "@/pages/admin/AdminComunidade";
import AdminAvisos from "@/pages/admin/AdminAvisos";
import AdminAlunos from "@/pages/admin/AdminAlunos";
import AdminCertificados from "@/pages/admin/AdminCertificados";
import AdminConfig from "@/pages/admin/AdminConfig";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#060B18' }}>
    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
  </div>
);

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, authLoading } = useAuth();
  if (authLoading) return <Spinner />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, authLoading, role } = useAuth();
  if (authLoading) return <Spinner />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function AppRoutes() {
  const { isLoggedIn, authLoading, role } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={authLoading ? <Spinner /> : isLoggedIn ? <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Student routes */}
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

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/modulos" element={<AdminRoute><AdminModulos /></AdminRoute>} />
      <Route path="/admin/materiais" element={<AdminRoute><AdminMateriais /></AdminRoute>} />
      <Route path="/admin/bonus" element={<AdminRoute><AdminBonus /></AdminRoute>} />
      <Route path="/admin/comunidade" element={<AdminRoute><AdminComunidade /></AdminRoute>} />
      <Route path="/admin/avisos" element={<AdminRoute><AdminAvisos /></AdminRoute>} />
      <Route path="/admin/alunos" element={<AdminRoute><AdminAlunos /></AdminRoute>} />
      <Route path="/admin/certificados" element={<AdminRoute><AdminCertificados /></AdminRoute>} />
      <Route path="/admin/config" element={<AdminRoute><AdminConfig /></AdminRoute>} />

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
