import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BlogPostPage } from "./pages/BlogPostPage";
import AuthCallback from "./pages/AuthCallback";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CheckoutErrorPage } from "./pages/CheckoutErrorPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import LoginPage from "./pages/LoginPage";
import { Dashboard } from "./components/Dashboard/Dashboard";
import ClientPortal from "./pages/ClientPortal";
import { ProfilePage } from "./pages/ProfilePage";
import { ProcessDetailPage } from "./pages/ProcessDetailPage";
import { UnsubscribePage } from "./pages/UnsubscribePage";
import { ChatWidget } from "./components/ChatWidget";

import AuthTest from "./pages/AuthTest";
import PrivateTest from "./pages/PrivateTest";
import { DevFallbackPanel } from "./components/DevFallbackPanel";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import BlogPage from "./pages/BlogPage";
import React, { Suspense } from "react";
const PasswordResetPage = React.lazy(() => import("./pages/PasswordResetPage"));
const PasswordChangePage = React.lazy(() => import("./pages/PasswordChangePage"));
const UserNotFoundPage = React.lazy(() => import("./pages/UserNotFoundPage"));
// AboutPage, ContactPage, AppointmentsPage, BlogPage, CartProvider, AuthProtect are not imported due to missing or incorrect exports.


// Rotas de teste do ChatWidget (mantidas para compatibilidade, mas não usadas no fluxo principal)
const ChatWidgetTestPublic = () => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
    <h1 className="text-2xl font-bold text-white mb-6">Teste Público do ChatWidget</h1>
    <div className="w-full max-w-md">
      <ChatWidget />
    </div>
    <p className="text-white/40 mt-6">Ambiente público (não logado)</p>
  </div>
);
const ChatWidgetTestClient = () => (
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
const ChatWidgetTestDashboard = () => (
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
// ...existing code...

// Widget Freshchat para páginas públicas
export const App = () => {
  // Detecta se está em rota de teste
  const [routeState, setRouteState] = React.useState<'unknown'|'test'|'normal'>(() => {
    if (typeof window === 'undefined') return 'unknown';
    const hash = window.location.hash;
    return (hash.startsWith('#/auth-test') || hash.startsWith('#/private-test')) ? 'test' : 'normal';
  });
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => {
      const hash = window.location.hash;
      setRouteState((hash.startsWith('#/auth-test') || hash.startsWith('#/private-test')) ? 'test' : 'normal');
    };
    window.addEventListener('hashchange', check);
    if ((import.meta as any).hot) {
      (import.meta as any).hot.on('vite:afterUpdate', () => {
        check();
      });
    }
    return () => window.removeEventListener('hashchange', check);
  }, []);
  if (routeState === 'unknown') {
    return null; // Não renderiza nada até saber a rota
  }
  if (routeState === 'test') {
    // Isolamento máximo: renderiza apenas o componente puro
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.startsWith('#/private-test')) {
      return <PrivateTest />;
    }
    if (hash.startsWith('#/auth-test')) {
      return <AuthTest />;
    }
    // Fallback técnico
    return <DevFallbackPanel />;
  }
  // App normal
  return (
    <AuthProvider>
         {/* CartProvider removido */}
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
            <Route path="/password-reset" element={<Suspense fallback={<div>Carregando…</div>}><PasswordResetPage /></Suspense>} />
            <Route path="/password-change" element={<Suspense fallback={<div>Carregando…</div>}><PasswordChangePage /></Suspense>} />
            <Route path="/user-not-found" element={<Suspense fallback={<div>Carregando…</div>}><UserNotFoundPage /></Suspense>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/error" element={<CheckoutErrorPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/processos/:id" element={<AuthProtect><ProcessDetailPage /></AuthProtect>} />
            <Route path="/perfil" element={<AuthProtect><ProfilePage /></AuthProtect>} />
                        {/* Fallback 404 */}
                        <Route path="*" element={<DevFallbackPanel />} />
            {/* Páginas de teste do ChatWidget */}
            <Route path="/chatwidget-test-public" element={<ChatWidget />} />
            <Route path="/chatwidget-test-client" element={<AuthProtect><ChatWidget /></AuthProtect>} />
            <Route path="/chatwidget-test-dashboard" element={<AuthProtect><ChatWidget /></AuthProtect>} />
          </Routes>
        </HashRouter>
         {/* CartProvider removido */}
      {/* ...existing code... */}
    </AuthProvider>

