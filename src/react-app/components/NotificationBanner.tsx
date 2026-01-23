

/**
 * @description Componente de banner para notificações e anúncios do sistema.
 *             Permite exibir mensagens importantes sobre mudanças de rotas ou atualizações.
 *             Utiliza o localStorage para permitir que o usuário dispense a mensagem.
 */

import React, { useState, useEffect } from 'react';
import { Info, X, Bell } from 'lucide-react';
import { cn } from '../utils';

interface NotificationBannerProps {
  id: string;
  message: string;
  type?: 'info' | 'warning' | 'success';
  className?: string;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  id, 
  message, 
  type = 'info',
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(`notif_dismissed_${id}`);
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, [id]);

  const handleDismiss = () => {
    localStorage.setItem(`notif_dismissed_${id}`, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const bgColors = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    warning: 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent',
    success: 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary',
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border mb-6 animate-in fade-in slide-in-from-top-4 duration-500",
      bgColors[type],
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          type === 'info' ? 'bg-blue-500/20' : type === 'warning' ? 'bg-brand-accent/20' : 'bg-brand-primary/20'
        )}>
          <Bell size={18} />
        </div>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={handleDismiss}
        className="p-1 hover:bg-white/5 rounded-lg transition-colors shrink-0"
        title="Dispensar"
      >
        <X size={18} />
      </button>
    </div>
  );
};
  
