            <Route path="/chatwidget-test-public" element={<ChatWidgetTestPublic />} />
            <Route path="/chatwidget-test-client" element={<ChatWidgetTestClient />} />
            <Route path="/chatwidget-test-dashboard" element={<ChatWidgetTestDashboard />} />


import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { AuthCallback } from "./pages/AuthCallback";
// import { AuthProvider } from "@hey-boss/users-service/react";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CheckoutErrorPage } from "./pages/CheckoutErrorPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import LoginPage from "./pages/LoginPage";
// import { FreshworksWidget } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { ClientPortal } from "./pages/ClientPortal";

export const ChatWidgetTestPublic = () => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
    <h1 className="text-2xl font-bold text-white mb-6">Teste Público do ChatWidget</h1>
    <div className="w-full max-w-md">
      <ChatWidget />
    </div>
    <p className="text-white/40 mt-6">Ambiente público (não logado)</p>
  </div>
);

export const ChatWidgetTestClient = () => (
  <AuthProtect>
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Teste Cliente do ChatWidget</h1>
      <div className="w-full max-w-md">
        <ChatWidget />
      </div>
      <p className="text-white/40 mt-6">Ambiente logado (cliente)</p>
    </div>
  </AuthProtect>
);

export const ChatWidgetTestDashboard = () => (
  <AuthProtect>
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Teste Dashboard/Admin do ChatWidget</h1>
      <div className="w-full max-w-md">
        <ChatWidget />
      </div>
      <p className="text-white/40 mt-6">Ambiente logado (admin/dashboard)</p>
    </div>
  </AuthProtect>
);
import { ProfilePage } from "./pages/ProfilePage";
import { ProcessDetailPage } from "./pages/ProcessDetailPage";
import { UnsubscribePage } from "./pages/UnsubscribePage";
import { AuthProtect } from "./components/AuthProtect";
import { ChatWidget } from "./components/ChatWidget";
import { CartProvider } from "./components/Cart";
import React from "react";
import { AuthProvider } from "./hooks/AuthContext";
import AuthTest from "./pages/AuthTest";
import PrivateTest from "./pages/PrivateTest";

// Widget Freshchat para páginas públicas
export const App = () => {
  // Detecta se está em rota de teste
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  if (typeof window !== 'undefined') {
    // Log de depuração para produção
    // eslint-disable-next-line no-console
    console.log('[App] window.location.hash:', window.location.hash);
  }
  const isTestRoute = hash.startsWith('#/auth-test') || hash.startsWith('#/private-test');
  if (isTestRoute) {
    return (
      <HashRouter>
        <Routes>
          <Route path="auth-test" element={<AuthTest />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="private-test" element={<PrivateTest />} />
          <Route path="/private-test" element={<PrivateTest />} />
          {/* Catch-all para rotas de teste */}
          <Route path="*" element={<div style={{textAlign:'center',marginTop:40}}><b>Rota de teste não encontrada</b><br/>Verifique a URL.</div>} />
        </Routes>
      </HashRouter>
    );
  }
  // App normal
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/agendar" element={<AppointmentsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/error" element={<CheckoutErrorPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="/account" element={<AuthProtect><ClientPortal /></AuthProtect>} />
            <Route path="/processos/:id" element={<AuthProtect><ProcessDetailPage /></AuthProtect>} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <AuthProtect>
                  <Dashboard />
                </AuthProtect>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AuthProtect>
                  <Dashboard />
                  <FreshchatWidgetPortal />
                </AuthProtect>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <AuthProtect>
                  <ProfilePage />
                  <FreshchatWidgetPortal />
                </AuthProtect>
              } 
            />
            {/* Páginas de teste do ChatWidget */}
            <Route path="/chatwidget-test-public" element={<ChatWidget />} />
            <Route path="/chatwidget-test-client" element={<AuthProtect><ChatWidget /></AuthProtect>} />
            <Route path="/chatwidget-test-dashboard" element={<AuthProtect><ChatWidget /></AuthProtect>} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

