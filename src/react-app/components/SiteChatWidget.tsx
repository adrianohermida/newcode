import React from 'react';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { ChatWidget } from './ChatWidget';

/**
 * Centraliza o controle do ChatWidget para todas as páginas.
 * Detecta tipo de usuário (admin, cliente, visitante) e repassa para ChatWidget.
 */
export const SiteChatWidget: React.FC = () => {
  const session = useSupabaseSession();
  const user = session?.user;
  let mode: 'admin' | 'client' | 'visitor' = 'visitor';
  if (user) {
    mode = user.isAdmin ? 'admin' : 'client';
  }
  return <ChatWidget mode={mode} />;
};
