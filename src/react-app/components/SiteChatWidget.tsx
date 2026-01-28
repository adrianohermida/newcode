import React from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { ChatWidget } from './ChatWidget';

/**
 * Centraliza o controle do ChatWidget para todas as páginas.
 * Detecta tipo de usuário (admin, cliente, visitante) e repassa para ChatWidget.
 */
export const SiteChatWidget: React.FC = () => {
  const { user } = useAuthContext();
  let mode: 'admin' | 'client' | 'visitor' = 'visitor';
  if (user) {
    mode = user.isAdmin ? 'admin' : 'client';
  }
  return <ChatWidget mode={mode} />;
};
