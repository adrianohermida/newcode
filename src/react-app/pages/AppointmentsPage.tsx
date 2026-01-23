
/**
 * @description Página de agendamento aprimorada para Hermida Maia Advocacia.
 *             Implementa um calendário interativo integrado ao banco de dados interno.
 *             Suporta Avaliação Inicial e Consultas Técnicas com regras de antecedência.
 *             Exige login obrigatório para realizar agendamentos.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { CustomForm } from '../components/CustomForm';
import { contactFormTheme } from '../components/CustomForm/themes';
import allConfigs from '../../shared/form-configs.json';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  User as UserIcon, 
  Loader2,
  ChevronLeft,
  Filter,
  Scale,
  MessageSquare,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../utils';
import { useAuth } from '@hey-boss/users-service/react';

export const AppointmentsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // Step 0: Tipo, Step 1: Horário, Step 2: Dados
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State para seleção
  const [appointmentType, setAppointmentType] = useState<'avaliacao' | 'tecnica'>('avaliacao');
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [selectedProf, setSelectedProf] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Carregar profissionais ao iniciar
  useEffect(() => {
    fetch('/api/appointments/profissionais')
      .then(res => res.json())
      .then(data => {
        setProfissionais(data);
        if (data.length > 0) setSelectedProf(data[0]);
      });
  }, []);

  // Carregar slots quando data, profissional ou tipo mudar
  useEffect(() => {
    if (selectedDate && selectedProf) {
      setLoading(true);
      fetch(`/api/appointments/slots?date=${selectedDate}&profId=${selectedProf.id}&type=${appointmentType}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data);
          setLoading(false);
        });
    }
  }, [selectedDate, selectedProf, appointmentType]);

  const handleSubmit = async (formData: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: 'appointment_form',
          ...formData,
          appointment_type: appointmentType,
          appointment_date: selectedDate,
          appointment_time: selectedSlot.hora_inicio,
          profissional_id: selectedProf.id
        })
      });

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const error = await response.json();
        alert(error.error || "Ocorreu um erro ao processar seu agendamento.");
      }
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
    }
  };

  // Lógica do Calendário
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Regra de antecedência mínima (48h ou 72h)
    const minAdvanceHours = appointmentType === 'tecnica' ? 72 : 48;
    const minDate = new Date(today.getTime() + minAdvanceHours * 60 * 60 * 1000);
    
    return date < minDate || date.getDay() === 0 || date.getDay() === 6; // Excluir fins de semana
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-dark text-white">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-brand-primary" size={48} />
            </div>
            <h1 className="text-4xl font-extrabold">Solicitação Recebida!</h1>
            <p className="text-white/60 text-lg">
              Obrigado por confiar na Hermida Maia Advocacia. Sua solicitação para o dia <strong>{new Date(selectedDate).toLocaleDateString('pt-BR')}</strong> às <strong>{selectedSlot?.hora_inicio}</strong> foi enviada. 
              <br /><br />
              O status atual é <strong>Aguardando Aceite</strong>. Você receberá uma confirmação por e-mail assim que o profissional validar o horário.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/account" className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all">
                Ver Meus Agendamentos
              </Link>
              <Link to="/" className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                Voltar para o Início
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full">
              <CalendarIcon size={16} className="text-brand-primary" />
              <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Agendamento Online</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Reserve sua Consulta com um <span className="text-brand-primary">Especialista</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Dê o primeiro passo para recuperar sua tranquilidade financeira. Escolha o melhor horário para conversarmos sobre seu caso.
            </p>

            <div className="space-y-6 pt-4">
              {[
                { icon: Clock, title: "Rápido e Prático", desc: "Agende em menos de 2 minutos sem precisar ligar." },
                { icon: ShieldCheck, title: "Sigilo Absoluto", desc: "Seus dados estão protegidos pela LGPD e pelo sigilo profissional." },
                { icon: CheckCircle2, title: "Atendimento Nacional", desc: "Consultas realizadas via videoconferência para todo o Brasil." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-brand-elevated p-3 rounded-xl h-fit">
                    <item.icon className="text-brand-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-elevated p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
            {!user && !authLoading && (
              <div className="absolute inset-0 z-50 bg-brand-dark/60 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-brand-primary/20 p-4 rounded-full mb-6">
                  <Lock className="text-brand-primary" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
                <p className="text-white/60 mb-8 max-w-xs">
                  Para garantir a segurança e o sigilo do seu atendimento, é necessário criar uma conta gratuita antes de agendar.
                </p>
                <Link to="/login" className="bg-brand-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-brand-primary/20">
                  Entrar ou Criar Conta
                </Link>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= 0 ? "bg-brand-primary text-white" : "bg-white/5 text-white/40")}>1</div>
              <div className={cn("h-px flex-1 transition-all", step >= 1 ? "bg-brand-primary" : "bg-white/10")} />
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= 1 ? "bg-brand-primary text-white" : "bg-white/5 text-white/40")}>2</div>
              <div className={cn("h-px flex-1 transition-all", step >= 2 ? "bg-brand-primary" : "bg-white/10")} />
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= 2 ? "bg-brand-primary text-white" : "bg-white/5 text-white/40")}>3</div>
            </div>

            {step === 0 ? (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-2xl font-bold">O que você precisa?</h2>
                <div className="grid gap-4">
                  <button
                    onClick={() => { setAppointmentType('avaliacao'); setStep(1); }}
                    className="flex items-start gap-4 p-6 rounded-2xl border border-white/5 bg-brand-dark hover:border-brand-primary/50 transition-all text-left group"
                  >
                    <div className="bg-brand-primary/10 p-3 rounded-xl group-hover:bg-brand-primary/20 transition-colors">
                      <MessageSquare className="text-brand-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Avaliação de Caso Inicial</h3>
                      <p className="text-white/50 text-sm mt-1">Para novos clientes que buscam orientação sobre superendividamento ou dívidas bancárias.</p>
                      <p className="text-brand-primary text-xs font-bold mt-2 uppercase tracking-wider">Gratuito • Antecedência 48h</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setAppointmentType('tecnica'); setStep(1); }}
                    className="flex items-start gap-4 p-6 rounded-2xl border border-white/5 bg-brand-dark hover:border-brand-primary/50 transition-all text-left group"
                  >
                    <div className="bg-brand-primary/10 p-3 rounded-xl group-hover:bg-brand-primary/20 transition-colors">
                      <Scale className="text-brand-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Consulta Técnica / Processual</h3>
                      <p className="text-white/50 text-sm mt-1">Análise de autos, dúvidas sobre processos em andamento ou pareceres técnicos.</p>
                      <p className="text-brand-primary text-xs font-bold mt-2 uppercase tracking-wider">Sujeito a Honorários • Antecedência 72h</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : step === 1 ? (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Escolha o Horário</h2>
                  <button onClick={() => setStep(0)} className="text-brand-primary text-sm font-bold hover:underline flex items-center gap-1">
                    <ArrowLeft size={16} /> Alterar Tipo
                  </button>
                </div>
                
                {/* Seleção de Profissional */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Filter size={16} className="text-brand-primary" />
                    Selecione o Especialista
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {profissionais.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProf(p)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border transition-all text-left group",
                          selectedProf?.id === p.id ? "bg-brand-primary/10 border-brand-primary" : "bg-brand-dark border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-primary/50 transition-all">
                          {p.avatar_url ? <img src={p.avatar_url} alt={p.nome} className="w-full h-full object-cover" /> : <UserIcon className="text-brand-primary" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{p.nome}</p>
                          <p className="text-xs text-white/50">{p.especialidade}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendário Interativo */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-white/70">Data da Consulta</label>
                    <div className="flex items-center gap-4">
                      <button onClick={prevMonth} className="p-1 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                      <span className="text-sm font-bold capitalize">
                        {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={nextMonth} className="p-1 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                      <div key={d} className="text-[10px] font-bold text-white/30 uppercase">{d}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((date, idx) => {
                      if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;
                      
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      const past = isPast(date);
                      
                      return (
                        <button
                          key={dateStr}
                          disabled={past}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            "aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all relative",
                            isSelected ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : 
                            past ? "text-white/10 cursor-not-allowed" : "bg-brand-dark border border-white/5 hover:border-brand-primary/50 text-white/70",
                            isToday(date) && !isSelected && !past && "border-brand-primary/50 text-brand-primary"
                          )}
                        >
                          {date.getDate()}
                          {isToday(date) && <div className="absolute bottom-1 w-1 h-1 bg-brand-primary rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seleção de Slot */}
                {selectedDate && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="text-sm font-semibold text-white/70">Horários Disponíveis</label>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-brand-primary" />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "py-3 rounded-lg border text-sm font-bold transition-all",
                              selectedSlot?.id === slot.id ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" : "bg-brand-dark border-white/10 hover:border-brand-primary/50 text-white/60"
                            )}
                          >
                            {slot.hora_inicio}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-center">
                        <p className="text-sm text-red-400">
                          Nenhum horário disponível para esta data. Tente outro dia ou profissional.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep(2)}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  Próximo Passo
                  <ChevronRight size={24} />
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Seus Dados</h2>
                  <button onClick={() => setStep(1)} className="text-brand-primary text-sm font-bold hover:underline flex items-center gap-1">
                    <ArrowLeft size={16} /> Alterar Horário
                  </button>
                </div>

                <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 mb-6 flex items-center gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-xl">
                    <CalendarIcon className="text-brand-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1">Resumo do Agendamento</p>
                    <p className="text-sm font-bold text-white">
                      {selectedProf?.nome} • {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedSlot?.hora_inicio}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">{appointmentType === 'tecnica' ? 'Consulta Técnica' : 'Avaliação Inicial'}</p>
                  </div>
                </div>

                <CustomForm 
                  id="appointment_form"
                  schema={allConfigs.appointment_form.jsonSchema}
                  formData={user ? { name: user.name, email: user.email } : {}}
                  onSubmit={handleSubmit}
                  theme={contactFormTheme}
                  labels={{
                    submit: "Confirmar Solicitação",
                    submitting: "Processando..."
                  }}
                />
              </div>
            )}

            <p className="text-center text-[10px] text-white/20 mt-8">
              * Ao clicar em solicitar, você concorda com nossos termos de uso e política de privacidade. Seus dados estão protegidos pela LGPD.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
