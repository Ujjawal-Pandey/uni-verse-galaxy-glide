import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UniverseProvider } from "@/contexts/UniverseContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import StudySphere from "./pages/StudySphere";
import SpendStar from "./pages/SpendStar";
import KnowledgeNebula from "./pages/KnowledgeNebula";
import StarConnect from "./pages/StarConnect";
import MindMoons from "./pages/MindMoons";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./contexts/AuthContext";
import ChatbaseScript from '@/components/ChatbaseScript';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen w-screen items-center justify-center bg-universe-darker">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Index />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/study-sphere" element={
            <ProtectedRoute>
              <Layout>
                <StudySphere />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/spend-star" element={
            <ProtectedRoute>
              <Layout>
                <SpendStar />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/knowledge-nebula" element={
            <ProtectedRoute>
              <Layout>
                <KnowledgeNebula />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/star-connect" element={
            <ProtectedRoute>
              <Layout>
                <StarConnect />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/mind-moons" element={
            <ProtectedRoute>
              <Layout>
                <MindMoons />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute>
              <Layout>
                <Friends />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UniverseProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <ChatbaseScript />
          <AppRoutes />
        </AuthProvider>
      </UniverseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
