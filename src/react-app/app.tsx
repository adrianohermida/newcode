

import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { AuthCallback } from "./pages/AuthCallback";
import { AuthProvider } from "@hey-boss/users-service/react";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CheckoutErrorPage } from "./pages/CheckoutErrorPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import LoginPage from "./pages/LoginPage";
import { FreshworksWidget } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { ClientPortal } from "./pages/ClientPortal";
import { ProfilePage } from "./pages/ProfilePage";
import { ProcessDetailPage } from "./pages/ProcessDetailPage";
import { UnsubscribePage } from "./pages/UnsubscribePage";
import { AuthProtect } from "./components/AuthProtect";
import { ChatWidget } from "./components/ChatWidget";
import { CartProvider } from "./components/Cart";
import React from "react";

// Widget Freshworks para páginas públicas
const FreshworksWidget = () => {
  React.useEffect(() => {
    if (document.getElementById('fw-widget-public')) return;
    const script = document.createElement('script');
    script.id = 'fw-widget-public';
    script.src = '//eu.fw-cdn.com/10713913/375987.js';
    script.setAttribute('chat', 'true');
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
  return null;
};

// Widget Freshworks para ClientPortal
const FreshworksWidgetPortal = () => {
  React.useEffect(() => {
    if (document.getElementById('fw-widget-portal')) return;
    const script = document.createElement('script');
    script.id = 'fw-widget-portal';
    script.src = '//eu.fw-cdn.com/10713913/375987.js';
    script.setAttribute('chat', 'true');
    script.setAttribute('widgetId', '2bb07572-34a4-4ea6-9708-4ec2ed23589d');
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
  return null;
};
export const App = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><HomePage /><FreshworksWidget /></>} />
            <Route path="/sobre" element={<><AboutPage /><FreshworksWidget /></>} />
            <Route path="/contato" element={<><ContactPage /><FreshworksWidget /></>} />
            <Route path="/agendar" element={<><AppointmentsPage /><FreshworksWidget /></>} />
            <Route path="/blog" element={<><BlogPage /><FreshworksWidget /></>} />
            <Route path="/blog/:slug" element={<><BlogPostPage /><FreshworksWidget /></>} />
            <Route path="/unsubscribe" element={<><UnsubscribePage /><FreshworksWidget /></>} />
            <Route path="/login" element={<><LoginPage /><FreshworksWidget /></>} />
            <Route path="/auth/callback" element={<><AuthCallback /><FreshworksWidget /></>} />
            <Route path="/checkout/success" element={<><CheckoutSuccessPage /><FreshworksWidget /></>} />
            <Route path="/checkout/error" element={<><CheckoutErrorPage /><FreshworksWidget /></>} />
            <Route path="/checkout/cancel" element={<><CheckoutCancelPage /><FreshworksWidget /></>} />
            <Route path="/account" element={<AuthProtect><ClientPortal /><FreshworksWidgetPortal /></AuthProtect>} />
            <Route path="/processos/:id" element={<AuthProtect><ProcessDetailPage /><FreshworksWidgetPortal /></AuthProtect>} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <AuthProtect>
                  <Dashboard />
                  <ChatWidget />
                </AuthProtect>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AuthProtect>
                  <Dashboard />
                </AuthProtect>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <AuthProtect>
                  <ProfilePage />
                </AuthProtect>
              } 
            />
          </Routes>
          {/* ChatWidget global removido, agora só no Dashboard e página de teste */}
        // Página de teste pública para ChatWidget
        const ChatWidgetTestPublic = () => (
          <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Teste Público do ChatWidget</h1>
            <div className="w-full max-w-md">
              <ChatWidget />
            </div>
            <p className="text-white/40 mt-6">Ambiente público (não logado)</p>
          </div>
        );

        // Página de teste protegida (cliente)
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

        // Página de teste protegida (dashboard/admin)
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
                    {/* Páginas de teste do ChatWidget */}
                    <Route path="/chatwidget-test-public" element={<ChatWidgetTestPublic />} />
                    <Route path="/chatwidget-test-client" element={<ChatWidgetTestClient />} />
                    <Route path="/chatwidget-test-dashboard" element={<ChatWidgetTestDashboard />} />
        </HashRouter>
      </AuthProvider>
    </CartProvider>
  );
};

