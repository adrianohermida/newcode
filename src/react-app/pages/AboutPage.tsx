
/**
 * @description Página "Sobre" para Hermida Maia Advocacia.
 *             Apresenta a trajetória do Dr. Adriano Hermida Maia, a missão do escritório
 *             e os valores que guiam a defesa dos superendividados.
 *             Utiliza componentes visuais consistentes com o tema dark/brand-primary.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  Globe, 
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  History,
  Mic,
  BookOpen,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { Header } from '../components/Header';

const AboutHero = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-dark">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#0d9c6e10_0%,transparent_70%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-6">
        <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Conheça nossa história</span>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
        Compromisso com a sua <span className="text-brand-primary">Dignidade Financeira</span>
      </h1>
      <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
        Liderado pelo Dr. Adriano Hermida Maia, nosso escritório é referência nacional na aplicação da Lei do Superendividamento, devolvendo a paz a milhares de famílias brasileiras.
      </p>
    </div>
  </section>
);

const ProfileSection = () => (
  <section className="py-24 bg-brand-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border-2 border-brand-primary/20 rounded-3xl -z-10" />
          <img 
            src="https://heyboss.heeyo.ai/user-assets/541c30f0c__TLM9795_hxylPUVt.jpg" 
            alt="Dr. Adriano Hermida Maia" 
            className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-brand-dark/90 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <p className="text-white font-bold text-xl">Dr. Adriano Hermida Maia</p>
            <p className="text-brand-primary font-medium text-sm">OAB/SP 476.963 | Especialista em Dívidas</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Trajetória e Expertise</h2>
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>
              O Dr. Adriano Hermida Maia é advogado com sólida formação acadêmica e vasta experiência prática no Direito Bancário e do Consumidor. Sua atuação é pautada pela defesa intransigente do "mínimo existencial", princípio fundamental da Lei 14.181/2021.
            </p>
            <p>
              Com passagens por importantes instituições e uma carreira dedicada a equilibrar a relação entre grandes bancos e o cidadão comum, ele se tornou uma das vozes mais influentes na aplicação da nova Lei do Superendividamento no Brasil.
            </p>
            <p>
              Nosso escritório não apenas resolve processos; nós restauramos a dignidade de quem foi sufocado por juros abusivos e práticas comerciais agressivas. Acreditamos que ninguém deve ser escravo de uma dívida impagável.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {[
              "Especialista em Direito Bancário",
              "Referência em Lei 14.181/2021",
              "Atuação em todo o território nacional",
              "Foco em resultados humanizados"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80 font-medium">
                <CheckCircle2 className="text-brand-primary" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MissionVisionValues = () => (
  <section className="py-24 bg-brand-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Target,
            title: "Missão",
            desc: "Proporcionar soluções jurídicas inovadoras e eficazes para libertar consumidores do superendividamento, garantindo sua dignidade e paz financeira."
          },
          {
            icon: Eye,
            title: "Visão",
            desc: "Ser o escritório de advocacia líder e mais confiável do Brasil na defesa do consumidor endividado, reconhecido pela excelência técnica e ética."
          },
          {
            icon: Heart,
            title: "Valores",
            desc: "Ética inabalável, transparência total, empatia com a dor do cliente e compromisso absoluto com a justiça social e o mínimo existencial."
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-brand-elevated p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/30 transition-all group">
            <div className="bg-brand-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <item.icon className="text-brand-primary" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-white/50 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-24 bg-brand-primary relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#ffffff10_0%,transparent_50%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {[
          { label: "Clientes Atendidos", value: "+2.500" },
          { label: "Dívidas Renegociadas", value: "R$ 35M+" },
          { label: "Anos de Experiência", value: "12+" },
          { label: "Estados Atendidos", value: "26 + DF" }
        ].map((stat, i) => (
          <div key={i} className="space-y-2">
            <p className="text-4xl sm:text-5xl font-black text-white">{stat.value}</p>
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Timeline = () => (
  <section className="py-24 bg-brand-dark relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-4">
          <History size={16} className="text-brand-primary" />
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Nossa Jornada</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Linha do Tempo</h2>
        <p className="text-white/60 max-w-2xl mx-auto">Uma trajetória dedicada à justiça e à proteção do consumidor brasileiro.</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/10 hidden md:block" />
        
        <div className="space-y-12">
          {[
            { year: "2012", title: "Início da Trajetória", desc: "Graduação e primeiros passos na advocacia focada em direitos fundamentais." },
            { year: "2015", title: "Especialização Bancária", desc: "Foco total em Direito Bancário e combate a práticas abusivas de instituições financeiras." },
            { year: "2018", title: "Fundação do Escritório", desc: "Inauguração da Hermida Maia Advocacia com foco em atendimento humanizado e digital." },
            { year: "2021", title: "Lei do Superendividamento", desc: "Liderança nacional na aplicação da Lei 14.181/2021, restaurando a dignidade de milhares." },
            { year: "2024", title: "Referência Nacional", desc: "Mais de R$ 35 milhões renegociados e presença consolidada em todo o Brasil." }
          ].map((item, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full md:w-auto">
                <div className={`bg-brand-elevated p-8 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-all ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-brand-primary font-black text-2xl mb-2 block">{item.year}</span>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-4 h-4 bg-brand-primary rounded-full border-4 border-brand-dark shadow-[0_0_15px_rgba(13,156,110,0.5)]" />
              </div>
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PodcastSection = () => (
  <section className="py-24 bg-brand-secondary overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-elevated rounded-[3rem] p-8 md:p-16 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,#0d9c6e15_0%,transparent_70%)]" />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 px-4 py-2 rounded-full">
              <Mic size={16} className="text-brand-accent" />
              <span className="text-brand-accent text-xs font-bold uppercase tracking-widest">Conteúdo Educativo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Hermida Maia <span className="text-brand-primary">Podcast</span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Acompanhe discussões profundas sobre direitos do consumidor, estratégias contra juros abusivos e educação financeira diretamente com o Dr. Adriano e convidados.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => window.open('https://youtube.com/@hermidamaia', '_blank')} className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105">
                <Youtube size={20} />
                Assistir no YouTube
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all">
                <Mic size={20} />
                Ouvir no Spotify
              </button>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-square max-w-md mx-auto bg-brand-dark rounded-3xl border border-white/10 p-4 shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/3b78c0579__TLM961311.jpg" 
                alt="Podcast Hermida Maia" 
                className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Mic size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WorksSection = () => (
  <section className="py-24 bg-brand-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-4">
          <BookOpen size={16} className="text-brand-primary" />
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Autoridade Acadêmica</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Obras e Publicações</h2>
        <p className="text-white/60 max-w-2xl mx-auto">Conhecimento técnico compartilhado para fortalecer a defesa do consumidor.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            title: "A Lei do Superendividamento Comentada", 
            type: "Ebook", 
            desc: "Um guia completo sobre a Lei 14.181/2021, com análises práticas e jurisprudência atualizada.",
            image: "https://heyboss.heeyo.ai/gemini-image-c5df3e56df0a49fdb468a4708ef7c8a8.png"
          },
          { 
            title: "O Mínimo Existencial na Prática", 
            type: "Artigo Técnico", 
            desc: "Análise profunda sobre o princípio da dignidade humana aplicado às dívidas bancárias.",
            image: "https://heyboss.heeyo.ai/gemini-image-805a2be1c3c8401c828287f865b36b4c.png"
          },
          { 
            title: "Manual de Superendividado", 
            type: "Ebook", 
            desc: "Estratégias essenciais para consumidores lidarem com cobranças abusivas e juros altos.",
            image: "https://heyboss.heeyo.ai/user-assets/5d67058a6_manual-superendividado_0FQQG9Ox.jpg"
          }
        ].map((work, idx) => (
          <div key={idx} className="group bg-brand-elevated rounded-3xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img src={work.image} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-brand-primary text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-2 inline-block">
                  {work.type}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">{work.title}</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-white/50 text-sm leading-relaxed mb-6">{work.desc}</p>
              <button className="text-brand-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Saiba mais <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-brand-dark py-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-white/20 text-xs">
        © 2024 Hermida Maia Advocacia. Todos os direitos reservados. Made with Heyboss.ai
      </p>
    </div>
  </footer>
);

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sobre o Escritório | Hermida Maia Advocacia";
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white">
      <Header />
      <main>
        <AboutHero />
        <ProfileSection />
        <Timeline />
        <MissionVisionValues />
        <StatsSection />
        <PodcastSection />
        <WorksSection />
        
        <section className="py-24 bg-brand-secondary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white">Pronto para recomeçar sua história?</h2>
            <p className="text-white/60 text-lg mb-12">
              Não deixe que as dívidas definam quem você é. Nossa equipe está pronta para aplicar a lei a seu favor e devolver sua liberdade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5551996032004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-10 py-5 rounded-2xl font-extrabold text-xl shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} />
                Falar com Especialista
              </a>
              <Link 
                to="/contato"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-extrabold text-xl transition-all flex items-center justify-center gap-3"
              >
                Agendar Consulta
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
