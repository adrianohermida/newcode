

/**
 * @description Componente de cabeçalho global para o site Hermida Maia Advocacia.
 *             Gerencia a navegação principal e o estado de autenticação do usuário.

 *             Implementa um menu dropdown no avatar do usuário com rotas dinâmicas.
 *             Utiliza useAuth do @hey-boss/users-service/react para controle de sessão.
 *             Ajustado para exibir "Monte Seu Plano" apenas no desktop.
 *             (Atenção: Todas as referências a /portal removidas, não existe mais essa rota)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Briefcase, ChevronDown, LayoutDashboard, Menu, X, Shield, Settings } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useApi } from '../hooks/useApi';


export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useApi();
  // Verifica se o usuário é admin (membro da equipe) - Insensível a maiúsculas
  const adminEmails = ["contato@hermidamaia.adv.br", "adrianohermida@gmail.com", "admin@example.com"];
  const userEmail = (user?.email || "").toLowerCase();
  const isAdmin = user && adminEmails.some(email => email.toLowerCase() === userEmail);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-brand-primary rounded-xl overflow-hidden w-12 h-12 flex items-center justify-center">
              <img src="https://heyboss.heeyo.ai/user-assets/logo_lzI6JHzO.png" alt="Logo Hermida Maia Advocacia" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-lg leading-tight">Dr. Adriano Hermida Maia</span>
              <span className="text-brand-primary text-xs font-semibold uppercase tracking-wider">Defesa do Superendividado</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-brand-primary transition-colors text-sm font-medium">Início</Link>
            <Link to="/sobre" className="text-white/80 hover:text-brand-primary transition-colors text-sm font-medium">Sobre</Link>
            <a href="/#serviços" className="text-white/80 hover:text-brand-primary transition-colors text-sm font-medium">Serviços</a>
            <Link to="/blog" className="text-white/80 hover:text-brand-primary transition-colors text-sm font-medium">Blog</Link>
            <Link to="/contato" className="text-white/80 hover:text-brand-primary transition-colors text-sm font-medium">Contato</Link>
            
            {user ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-2 pr-4 py-1.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                    {user.name?.[0] || user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-white/80 text-sm font-medium hidden xl:inline">{user.name || user.email.split('@')[0]}</span>
                  <ChevronDown size={16} className={`text-white/40 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-brand-elevated border border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-white font-bold text-sm truncate">{user.name || 'Usuário'}</p>
                      <p className="text-white/40 text-xs truncate">{user.email}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-brand-primary font-bold hover:bg-brand-primary/10 transition-all border-b border-white/5"
                      >
                        <Shield size={18} />
                        Painel Administrativo
                      </Link>
                    )}
                    
                    <Link 
                      to="/perfil" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-brand-primary hover:bg-white/5 transition-all"
                    >
                      <User size={16} />
                      Meu Perfil
                    </Link>

                    <Link 
                      to="/account" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-brand-primary hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard size={18} />
                      Meu Painel (Cliente)
                    </Link>

                    <div className="h-px bg-white/5 my-2" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2"
              >
                <User size={16} />
                Login
              </button>
            )}
          </nav>

          {/* Desktop CTA - "Monte Seu Plano" */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="https://wa.me/5551996032004" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-brand-primary/20"
            >
              <span>Monte Seu Plano</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            {user ? (
              <Link to={isAdmin ? "/dashboard" : "/account"} className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                {user.name?.[0] || user.email?.[0].toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs">
                <User size={20} />
              </Link>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-brand-dark/95 backdrop-blur-xl z-40 animate-in slide-in-from-top duration-300 border-t border-white/5">
          <nav className="flex flex-col p-6 gap-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-white font-bold border-b border-white/5 pb-4">Início</Link>
            <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-white font-bold border-b border-white/5 pb-4">Sobre</Link>
            <a href="/#serviços" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-white font-bold border-b border-white/5 pb-4">Serviços</a>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-white font-bold border-b border-white/5 pb-4">Blog</Link>
            <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-white font-bold border-b border-white/5 pb-4">Contato</Link>
            
            {!user && (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-primary text-white text-center py-4 rounded-xl font-bold text-lg mt-4">
                Fazer Login
              </Link>
            )}
              {!user && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-primary text-white text-center py-4 rounded-xl font-bold text-lg mt-4">
                  Fazer Login
                </Link>
              )}
            
            {user && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                    {user.name?.[0] || user.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{user.name || user.email.split('@')[0]}</p>
                    <p className="text-white/40 text-xs">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {isAdmin && (
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-brand-primary/20 text-brand-primary font-bold"
                    >
                      <LayoutDashboard size={20} />
                      Meu Escritório (Admin)
                    </Link>
                  )}
                  <Link 
                    to="/account" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white/70"
                  >
                    <LayoutDashboard size={20} />
                    Meu Painel (Cliente)
                  </Link>
                  <Link 
                    to="/perfil" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white/70"
                  >
                    <User size={20} />
                    Meu Perfil
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}


