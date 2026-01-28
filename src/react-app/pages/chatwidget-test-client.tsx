import { ChatWidget } from '../components/ChatWidget';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '@hey-boss/users-service/react';

export default function ChatWidgetTestClient() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <ChatWidget />
      <Header />
      <main className="max-w-2xl mx-auto py-16">
        <h1 className="text-2xl font-bold mb-4">Teste ChatWidget Cliente (logado)</h1>
        {user ? (
          <p className="mb-6">Usuário autenticado: <span className="font-mono">{user.email}</span></p>
        ) : (
          <p className="mb-6 text-red-400">Usuário não autenticado. Faça login para testar o widget privado.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
