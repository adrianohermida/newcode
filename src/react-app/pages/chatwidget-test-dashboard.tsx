import { ChatWidget } from '../components/ChatWidget';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function ChatWidgetTestDashboard() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <ChatWidget />
      <Header />
      <main className="max-w-2xl mx-auto py-16">
        <h1 className="text-2xl font-bold mb-4">Teste ChatWidget Dashboard/Admin</h1>
        <p className="mb-6">Este teste valida o widget Freshchat em contexto de dashboard/admin.</p>
      </main>
      <Footer />
    </div>
  );
}
