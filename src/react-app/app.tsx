

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
import { Dashboard } from "./pages/Dashboard";
import { ClientPortal } from "./pages/ClientPortal";
import { ProfilePage } from "./pages/ProfilePage";
import { ProcessDetailPage } from "./pages/ProcessDetailPage";
import { UnsubscribePage } from "./pages/UnsubscribePage";
import { AuthProtect } from "./components/AuthProtect";
import { ChatWidget } from "./components/ChatWidget";
import { CartProvider } from "./components/Cart";

export const App = () => {
  return (
    <CartProvider>
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
          <ChatWidget />
        </HashRouter>
      </AuthProvider>
    </CartProvider>
  );
};

