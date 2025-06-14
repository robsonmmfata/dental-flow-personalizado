
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth/AuthProvider";
import { AuthView } from "./components/Auth/AuthView";
import { ErrorBoundary } from "./components/Global/ErrorBoundary";
import { LoadingSpinner } from "./components/Global/LoadingSpinner";
import { NotificationContainer } from "./stores/globalStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index onLogout={signOut} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AppContent />
            <NotificationContainer />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
