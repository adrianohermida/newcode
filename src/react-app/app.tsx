import React, { Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { BlogPostPage } from "./pages/BlogPostPage";
import AuthCallback from "./pages/AuthCallback";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CheckoutErrorPage } from "./pages/CheckoutErrorPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import LoginPage from "./pages/LoginPage";
import { Dashboard } from "./components/Dashboard/Dashboard";
import ClientPortal from "./pages/ClientPortal";
import ProfilePage from "./pages/ProfilePage";
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
import AuthProtect from "./components/AuthProtect";
import { AuthProvider } from "./hooks/AuthContext";
const PasswordResetPage = React.lazy(() => import("./pages/PasswordResetPage"));
const PasswordChangePage = React.lazy(() => import("./pages/PasswordChangePage"));
const UserNotFoundPage = React.lazy(() => import("./pages/UserNotFoundPage"));

const App = () => {
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
  if (routeState === 'unknown') return null;
  if (routeState === 'test') {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.startsWith('#/private-test')) return <PrivateTest />;
    if (hash.startsWith('#/auth-test')) return <AuthTest />;
    return <DevFallbackPanel />;
  }
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;







