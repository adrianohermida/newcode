
/**
 * @description This file defines the HomePage component for Hermida Maia Advocacia.
 *             It serves as the main landing page, orchestrating multiple sections
 *             including Hero, Stats, Calculator, Testimonials, and Services.
 *             It uses Tailwind CSS for styling and Lucide React for iconography.
 */

import React, { useEffect, useState } from 'react';
import { ChatWidget } from '../components/ChatWidget';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Zap, 
  Smile, 
  Calendar, 
  Scale, 
  Handshake, 
  CheckCircle2, 
  Star, 
  Play, 
  ChevronRight,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  AlertCircle
} from 'lucide-react';
import { Header } from '../components/Header';
import { useAuthContext } from '../hooks/AuthContext';
import { CustomForm } from '../components/CustomForm';
import { newsletterTheme } from '../components/CustomForm/theme';
import allConfigs from '../../shared/form-configs.json';


// --- Components ---

const Hero = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#0d9c6e15_0%,transparent_50%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
            <span className="text-brand-accent text-xs font-bold uppercase tracking-widest">Lei 14.181/2021 - Superendividamento</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] sm:!text-[53px] text-[#ffffffff]">
            Advogado Especialista em Superendividamento: Parcele suas <span className="text-[#0d9c6eff]">dívidas</span> em até 5 anos
          </h1>
          
          <p className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Advocacia especializada em superendividamento e defesa do consumidor. Mais de R$ 35 milhões em redução de dívidas renegociados em todo o Brasil. Recupere sua paz financeira hoje.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-brand-primary/20 group"
            >
              Calcular Gratuitamente
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/agendar" className="hidden sm:flex w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all items-center justify-center">
              Agendar Consulta
            </Link>
          </div>

          <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
            <div className="flex -space-x-3">
              {['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png'].map((file, idx) => (
                <img
                  key={file}
                  src={require(`../assets/img/${file}`)}
                  className="w-10 h-10 rounded-full border-2 border-brand-dark"
                  alt={`Avatar ${idx + 1}`}
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex text-brand-accent">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-white/60 font-medium">+2.500 clientes satisfeitos</p>
            </div>
          </div>
        </div>

 <div className="relative animate-fade-in delay-200 flex items-center justify-center">

  {/* Floating Badges – camada decorativa (ATRÁS da imagem) */}
          <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 bg-brand-elevated p-4 rounded-2xl border border-white/10 shadow-xl animate-bounce-slow z-30 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/20 p-2 rounded-lg">
              <ShieldCheck className="text-brand-primary" size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">OAB/RS 107048</p>
              <p className="text-white/50 text-xs">Pós-graduado</p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-brand-elevated p-4 rounded-2xl border border-white/10 shadow-xl animate-bounce-slow delay-300 z-30 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="bg-brand-accent/20 p-2 rounded-lg">
              <TrendingDown className="text-brand-accent" size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">12 anos</p>
              <p className="text-white/50 text-xs">de Atuação</p>
            </div>
          </div>
        </div>

        {/* Container da imagem – FRENTE */}
        <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/3b78c0579__TLM961311.jpg"
            alt="Dr. Adriano Hermida Maia, advogado especialista em superendividamento e Lei 14.181/2021."
            className="w-full h-auto object-cover relative z-30"
          />
        </div>

      </div>
    </div>
  </div>
</section>
);

const Stats = () => (
  <section className="py-20 bg-brand-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Resultados Reais na Redução e Renegociação de Dívidas</h2>
        <p className="text-white/60 max-w-2xl mx-auto">Nossa advocacia especializada em dívidas foca em resultados reais para quem busca o fim das cobranças abusivas e a solução rápida para dívidas.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: ShieldCheck, title: "Proteção Legal", desc: "Blindagem contra cobranças abusivas e ameaças de credores com acordo judicial." },
          { icon: TrendingDown, title: "Redução de Dívidas", desc: "Cortes significativos no valor total através da Lei 14.181/2021." },
          { icon: Zap, title: "Solução Rápida", desc: "Processos otimizados para eliminar dívidas de forma definitiva e ágil." },
          { icon: Smile, title: "Tranquilidade", desc: "Recupere sua dignidade financeira com nossa consultoria jurídica especializada." }
        ].map((stat, idx) => (
          <div key={idx} className="bg-brand-elevated p-8 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all group">
            <div className="bg-brand-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <stat.icon className="text-brand-primary" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{stat.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Calculator = () => {
  const [formData, setFormData] = React.useState({
    totalDebt: '',
    monthlyInstallment: '',
    monthlyIncome: ''
  });
  const [result, setResult] = React.useState<{
    percentage: number;
    isSuperendividado: boolean;
  } | null>(null);

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    const amount = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return amount;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const [isSaving, setIsSaving] = React.useState(false);

  const calculate = async () => {
    const installment = parseCurrency(formData.monthlyInstallment);
    const income = parseCurrency(formData.monthlyIncome);

    if (income > 0) {
      const percentage = (installment / income) * 100;
      const calculationResult = {
        percentage,
        isSuperendividado: percentage > 30
      };
      
      setResult(calculationResult);

      // Salvar no banco de dados
      setIsSaving(true);
      try {
        await apiFetch('/api/simulations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            simulationData: {
              ...formData,
              ...calculationResult,
              timestamp: new Date().toISOString()
            }
          })
        });
      } catch (error) {
        console.error('Erro ao salvar simulação:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };
      // Exemplo: buscar dados públicos de uma tabela "posts"
function SupabaseDemo() {
  const [posts, setPosts] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title')
      .then((response) => {
        setPosts(response.data || []);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Carregando posts do Supabase...</div>;
  return (
    <div>
      <h2>Posts do Supabase</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

  return (
    <section id="calculadora" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
            <SupabaseDemo />
        <div className="bg-brand-elevated rounded-[2.5rem] p-8 sm:p-12 border border-white/10 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Calculadora de Superendividamento: Veja como Eliminar Dívidas</h2>
            <p className="text-white/60">Descubra em minutos se você tem direito à Lei 14.181/2021 para renegociar dívidas até 70% e sair do sufoco financeiro.</p>
          </div>

          {!result ? (
            <div className="space-y-8">
              <div className="flex justify-center gap-8 mb-12">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step < 3 ? 'bg-brand-primary text-white' : 'border-2 border-brand-primary text-brand-primary'}`}>
                      {step < 3 ? <CheckCircle2 size={24} /> : step}
                    </div>
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Passo {step}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-1">Valor total das dívidas <span className="text-white/30 font-normal">(Ex: R$ 15.000)</span></label>
                  <input 
                    type="text" 
                    value={formData.totalDebt}
                    onChange={(e) => handleInputChange(e, 'totalDebt')}
                    placeholder="R$ 0,00" 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-1">Parcelas mensais <span className="text-white/30 font-normal">(Ex: R$ 2.500)</span></label>
                  <input 
                    type="text" 
                    value={formData.monthlyInstallment}
                    onChange={(e) => handleInputChange(e, 'monthlyInstallment')}
                    placeholder="R$ 0,00" 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all" 
                  />
                  <p className="text-[10px] text-white/40 ml-1">Soma de cartões, empréstimos e parcelamentos (exceto garantia de bens, impostos, pensão)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70 ml-1">Renda líquida familiar <span className="text-white/30 font-normal">(Ex: R$ 5.000)</span></label>
                  <input 
                    type="text" 
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange(e, 'monthlyIncome')}
                    placeholder="R$ 0,00" 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all" 
                  />
                  <p className="text-[10px] text-white/40 ml-1">Salário bruto menos impostos</p>
                </div>
              </div>

              <button 
                onClick={calculate}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Calcular Minha Situação
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className={`p-3 rounded-full ${result.isSuperendividado ? 'bg-red-500/20 text-red-500' : 'bg-brand-primary/20 text-brand-primary'}`}>
                  {result.isSuperendividado ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {result.isSuperendividado ? 'Identificamos Superendividamento' : 'Situação sob Controle'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    Suas dívidas comprometem <span className={`font-bold ${result.isSuperendividado ? 'text-red-500' : 'text-brand-primary'}`}>{result.percentage.toFixed(1)}%</span> da sua renda (limite saudável: 30%)
                  </p>
                </div>
              </div>

              <div className="bg-brand-dark/50 p-6 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Total de Dívidas:</span>
                  <span className="text-white font-bold">{formData.totalDebt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Parcelas Mensais:</span>
                  <span className="text-white font-bold">{formData.monthlyInstallment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Renda Líquida:</span>
                  <span className="text-white font-bold">{formData.monthlyIncome}</span>
                </div>
              </div>

              <div className="p-6 bg-brand-primary/10 rounded-2xl border border-brand-primary/30">
                <div className="flex gap-3">
                  <div className="bg-brand-primary text-white p-1 rounded-md h-fit mt-1">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {result.isSuperendividado 
                      ? <><span className="font-bold">Ótima notícia:</span> Você tem direito à Lei do Superendividamento! Podemos reduzir até 70% das suas dívidas e restaurar sua paz financeira.</>
                      : <><span className="font-bold">Atenção:</span> Embora não esteja tecnicamente superendividado, você pode considerar agendar uma consulta para avaliar a existência de juros ou cláusulas abusivas em seus contratos.</>
                    }
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <a 
                  href="https://wa.me/5551996032004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <MessageCircle size={18} />
                  Falar com Advogado
                </a>
                <button 
                  onClick={() => {
                    setResult(null);
                    setFormData({ totalDebt: '', monthlyInstallment: '', monthlyIncome: '' });
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Zap size={18} />
                  Nova Análise
                </button>
                <button 
                  onClick={() => document.getElementById('serviços')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <TrendingDown size={18} />
                  Monte seu Plano
                </button>
              </div>
            </div>
          )}
          
          <p className="text-center text-[10px] text-white/20 mt-8">
            * Seus dados estão protegidos pela LGPD e serão usados apenas para esta análise.
          </p>
        </div>
      </div>
    </section>
  );

const HowItWorks = () => (
  <section className="py-24 bg-brand-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Como Funciona a Renegociação de Dívidas pela Lei 14.181/2021</h2>
        <p className="text-white/60">Um processo transparente e seguro para eliminar dívidas e recuperar sua liberdade financeira com consultoria jurídica especializada.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-12 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        
        {[
          { icon: Calendar, title: "Agende uma Consulta", desc: "Conversamos sobre seu caso detalhadamente." },
          { icon: Scale, title: "Estratégia Jurídica", desc: "Analisamos todos os seus contratos e dívidas." },
          { icon: Handshake, title: "Negociação Especializada", desc: "Entramos em contato com os credores." },
          { icon: CheckCircle2, title: "Solução Definitiva", desc: "Plano de pagamento aprovado judicialmente." }
        ].map((step, idx) => (
          <div key={idx} className="relative z-10 text-center space-y-6 group">
            <div className="w-20 h-20 bg-brand-elevated rounded-3xl border border-white/10 flex items-center justify-center mx-auto group-hover:bg-brand-primary transition-all duration-500 shadow-xl">
              <step.icon className="text-brand-primary group-hover:text-white transition-colors" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed px-4">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 bg-brand-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Depoimentos de Clientes sobre Defesa do Consumidor e Dívidas</h2>
        <p className="text-white/60">Histórias reais de quem recuperou a paz com nossa advocacia especializada em dívidas e superendividamento.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Maria Silva", text: "Eu não conseguia mais dormir. O Dr. Adriano conseguiu reduzir minha dívida em 70% e agora consigo pagar com dignidade.", rating: 5 },
          { name: "João Santos", text: "Excelente atendimento. Profissionais extremamente competentes que realmente entendem da Lei do Superendividamento.", rating: 5 },
          { name: "Ana Costa", text: "Minha vida mudou. Estava presa em juros abusivos de cartões e hoje tenho um plano de pagamento que cabe no meu bolso.", rating: 5 }
        ].map((t, idx) => (
          <div key={idx} className="bg-brand-elevated p-8 rounded-3xl border border-white/5 relative">
            <div className="flex text-brand-accent mb-6">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-white/80 italic mb-8 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <img src={`https://ui-avatars.com/api/?name=${t.name.replace(' ', '+')}&background=0d9c6e&color=fff`} className="w-12 h-12 rounded-full" alt={`Depoimento de ${t.name} sobre sucesso na redução de dívidas`} />
              <div>
                <p className="text-white font-bold">{t.name}</p>
                <p className="text-white/40 text-xs">Cliente Verificado</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Services = () => (
  <section id="serviços" className="py-24 bg-brand-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Advocacia Especializada em Dívidas e Defesa do Consumidor</h2>
        <p className="text-white/60">Soluções jurídicas completas para defesa do consumidor, acordo judicial e fim das cobranças abusivas.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          "Defesa Contra Juros Abusivos e Cobranças Ilegais",
          "Superendividamento Lei 14.181/2021 - Renegociação de Dívidas",
          "Recuperação Judicial e Extrajudicial de Empresas",
          "Acordos Extrajudiciais com Credores e Instituições Financeiras",
          "Representação Junto ao BACEN e Órgãos de Defesa do Consumidor",
          "Defesa Contra Fraudes Bancárias e Golpes Pix"
        ].map((service, idx) => (
          <div key={idx} className="group bg-brand-elevated p-8 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-brand-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                <CheckCircle2 className="text-brand-primary group-hover:text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{service}</h3>
            </div>
            <button className="mt-8 text-brand-primary font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              Saiba mais <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const VideoJourney = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  const videos = [
    { id: "Q0PSv2Lc8Qk", title: "Como Funciona a Lei do Superendividamento" },
    { id: "d7dW08nWAcY", title: "Quem Tem Direito a Utilizar a Lei do Superendividamento" },
    { id: "xUbtNefpFs8", title: "Como Renegociar Dívidas pela Lei do Supernedividamento" },
    { id: "GEtGj05jxTw", title: "Como Funciona o Plano de Pagamento na Lei do Superendividamento?" }
  ];

  const handleNext = () => {
    if (currentStep < videos.length - 1) {
      setCurrentStep(currentStep + 1);
      const section = document.getElementById('video-section');
      if (section) {
        window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
      }
    } else {
      setCompleted(true);
    }
  };

  return (
    <section id="video-section" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-4">
            <Play size={16} className="text-brand-primary" />
            <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Passo a Passo Jurídico</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Saiba Como Eliminar Dívidas e Cobranças Abusivas com a Lei 14.181/2021</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Assista aos vídeos abaixo para entender como funciona o acordo judicial e a renegociação de dívidas até 70% com um especialista certificado.</p>
        </div>

        {!completed ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div className="flex gap-2">
                {videos.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 w-12 sm:w-20 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-brand-primary' : 'bg-white/10'}`}
                  />
                ))}
              </div>
              <span className="text-white/40 text-sm font-bold">Vídeo {currentStep + 1} de 4</span>
            </div>

            <div className="bg-brand-elevated rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videos[currentStep].id}?autoplay=0&rel=0`}
                  title={videos[currentStep].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-white font-bold text-xl mb-1">{videos[currentStep].title}</h3>
                  <p className="text-white/50 text-sm">Assista para liberar o próximo passo</p>
                </div>
                <button 
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-brand-primary/20"
                >
                  {currentStep === 3 ? 'Concluir e Ver Opções' : 'Próximo Vídeo'}
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="bg-brand-elevated p-8 sm:p-16 rounded-[2.5rem] border border-brand-primary/30 shadow-2xl shadow-brand-primary/10">
              <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-brand-primary" size={40} />
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-6">Jornada Concluída!</h3>
              <p className="text-white/70 text-lg mb-10">Agora que você conhece seus direitos, escolha como deseja recuperar sua paz financeira:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/agendar"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-5 rounded-2xl font-extrabold text-lg transition-all hover:scale-105 shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Agendar uma avaliação online
                </Link>
                <button 
                  onClick={() => document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-5 rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <TrendingDown size={20} />
                  Monte seu plano de pagamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

type BlogPost = {
  id: number;
  title: string;
  date: string;
  image: string;
  url?: string;
  slug?: string;
};


const Blog = () => {
  const { blog, blogLoading, blogError, fetchBlog } = useApi();
  // Teste de conexão manual
  const [testStatus, setTestStatus] = React.useState<string | null>(null);

  const handleTestConnection = async () => {
    setTestStatus('Testando...');
    try {
      await fetchBlog();
      setTestStatus('Conexão bem-sucedida!');
    } catch (e) {
      setTestStatus('Erro ao testar conexão.');
    }
    setTimeout(() => setTestStatus(null), 3000);
  };

  return (
    <section id="blog" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Blog de Defesa do Consumidor: Dicas para Renegociar Dívidas</h2>
          <p className="text-white/60">Mantenha-se informado sobre a Lei 14.181/2021 e como eliminar dívidas legalmente com nossa consultoria jurídica.</p>
        </div>

        <div className="flex justify-center py-4">
          <button
            onClick={handleTestConnection}
            className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all"
          >
            Testar conexão Blog
          </button>
          {testStatus && (
            <span className="ml-4 text-white/80 text-sm">{testStatus}</span>
          )}
        </div>
        {blogLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : blogError ? (
          <div className="text-red-400 text-center py-8">Erro ao carregar blog: {blogError}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blog.map((post: BlogPost) => (
              <article 
                key={post.id} 
                className="bg-brand-elevated rounded-3xl overflow-hidden border border-white/5 group hover:border-brand-primary/30 transition-all cursor-pointer"
              >
                <Link to={post.url || `/blog/${post.slug || ''}`} className="block">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={`Artigo: ${post.title} - Advocacia especializada em dívidas`} 
                    />
                  </div>
                  <div className="p-8">
                    <p className="text-brand-primary text-xs font-bold uppercase mb-3">{post.date}</p>
                    <h3 className="text-xl font-bold text-white mb-6 leading-tight group-hover:text-brand-primary transition-colors line-clamp-3">
                      {post.title}
                    </h3>
                    <div className="text-white/60 font-bold text-sm flex items-center gap-2 group-hover:text-white transition-colors">
                      Ler mais <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <Link 
            to="/blog"
            className="inline-block bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold transition-all"
          >
            Ver Todos os Artigos
          </Link>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="py-24 bg-brand-primary relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#ffffff20_0%,transparent_50%)]" />

    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-8">
        Fale com um Advogado Especialista em Superendividamento Agora
      </h2>

      <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto">
        Não deixe as dívidas controlarem sua vida. Nossa advocacia especializada
        em superendividamento e redução de dívidas está pronta para lutar por você.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">

        {/* BOTÃO ESQUERDO – WHATSAPP */}
        <a
          href="https://wa.me/5551996032004"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-dark text-white px-10 py-5 rounded-2xl font-extrabold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-center"
        >
          Falar no WhatsApp
        </a>

        {/* BOTÃO DIREITO – AGENDA */}
        <Link
          to="/agendar"
          className="bg-white text-brand-primary px-10 py-5 rounded-2xl font-extrabold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-center"
        >
          Agendar avaliação
        </Link>

      </div>
    </div>
  </section>
);

const Footer = () => {
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleNewsletterSubmit = async (formData: any) => {
    try {
      const response = await apiFetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formId: 'newsletter_form', 
          ...formData,
          source: 'footer_newsletter'
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Erro ao assinar newsletter:', error);
    }
  };

  return (
  <footer className="bg-brand-dark pt-20 pb-10 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary rounded-xl overflow-hidden w-10 h-10 flex items-center justify-center">
              <img src="https://heyboss.heeyo.ai/user-assets/logo_lzI6JHzO.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-extrabold text-lg">Dr. Adriano Hermida Maia</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Advocacia especializada em defesa do consumidor e superendividamento. Atuação nacional com foco em resultados e dignidade humana.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
              <a onClick={() => { window.open("https://youtube.com/@hermidamaia", "_blank"); }}  target="_blank"  key={i} href="https://facebook.com/hermidamaia" className="w-10 h-10 bg-brand-elevated rounded-lg flex items-center justify-center text-white/40 hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Serviços</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><a href="#" className="hover:text-brand-primary transition-colors">Defesa do Superendividado</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Revisão de Contratos Bancários</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Renegociação de Dívidas</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Fraudes e Golpes Bancários</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Links Úteis</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><Link to="/sobre" className="hover:text-brand-primary transition-colors">Sobre o Escritório</Link></li>
            <li><a href="#calculadora" className="hover:text-brand-primary transition-colors">Calculadora Gratuita</a></li>
            <li><Link to="/blog" className="hover:text-brand-primary transition-colors">Blog e Notícias</Link></li>
            <li><Link to="/contato" className="hover:text-brand-primary transition-colors">Agendar Consulta</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6">Contato</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm text-white/50">
              <Phone size={18} className="text-brand-primary shrink-0" />
              <span>(51) 99603-2004</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-white/50">
              <Mail size={18} className="text-brand-primary shrink-0" />
              <span>contato@hermidamaia.adv.br</span>
            </div>
          </div>
          
          <div className="pt-2">
            {isSubscribed ? (
              <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-xl animate-fade-in">
                <div className="flex items-center gap-2 text-brand-primary mb-1">
                  <CheckCircle2 size={18} />
                  <span className="font-bold text-sm">Inscrição Confirmada!</span>
                </div>
                <p className="text-white/50 text-xs">Obrigado por se juntar a nós. Você receberá nossas novidades em breve.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/40 text-xs font-medium ml-1">Assine nossa newsletter jurídica:</p>
                <CustomForm 
                  id="newsletter_form"
                  schema={{ ...(allConfigs.newsletter_form.jsonSchema as any), type: "object" }}
                  onSubmit={handleNewsletterSubmit}
                  theme={newsletterTheme}
                  labels={{ submit: "Assinar" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-white/30 font-medium">
          <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-white transition-colors">LGPD</a>
        </div>
        <p className="text-xs text-white/20">
          © 2024 Hermida Maia Advocacia. Todos os direitos reservados. Made with Heyboss.ai
        </p>
      </div>
    </div>
  </footer>
  );
};

// --- Main Page ---

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-primary selection:text-white">
      <ChatWidget />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Calculator />
        <HowItWorks />
        <VideoJourney />
        <Testimonials />
        <Services />
        <Blog />
        <FinalCTA />
        {/* Links para teste do ChatWidget */}
        <div className="max-w-2xl mx-auto mt-16 p-6 bg-brand-elevated rounded-2xl border border-white/10 text-center">
          <h2 className="text-lg font-bold text-white mb-2">Testes do ChatWidget</h2>
          <div className="flex flex-col gap-2 items-center">
            <a href="/chatwidget-test-public" className="text-brand-primary hover:underline">Teste Público</a>
            <a href="/chatwidget-test-client" className="text-brand-primary hover:underline">Teste Cliente (logado)</a>
            <a href="/chatwidget-test-dashboard" className="text-brand-primary hover:underline">Teste Dashboard/Admin</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );


export function HomePage() {
  // ...existing code...
  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-primary selection:text-white">
      <FreshchatWidget />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Calculator />
        <HowItWorks />
        <VideoJourney />
        <Testimonials />
        <Services />
        <Blog />
        <FinalCTA />
        {/* Links para teste do ChatWidget */}
        <div className="max-w-2xl mx-auto mt-16 p-6 bg-brand-elevated rounded-2xl border border-white/10 text-center">
          <h2 className="text-lg font-bold text-white mb-2">Testes do ChatWidget</h2>
          <div className="flex flex-col gap-2 items-center">
            <a href="/chatwidget-test-public" className="text-brand-primary hover:underline">Teste Público</a>
            <a href="/chatwidget-test-client" className="text-brand-primary hover:underline">Teste Cliente (logado)</a>
            <a href="/chatwidget-test-dashboard" className="text-brand-primary hover:underline">Teste Dashboard/Admin</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
