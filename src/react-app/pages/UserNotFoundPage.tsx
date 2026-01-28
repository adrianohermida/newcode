import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserNotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto mt-32 p-8 bg-brand-dark rounded-xl text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Usuário não localizado</h1>
      <p className="mb-6 text-white/80">
        Não encontramos uma conta de usuário para este e-mail.<br />
        Para acessar a área restrita, é necessário ser cliente cadastrado.<br />
        Caso seja cliente, entre em contato pelo formulário abaixo ou pelo chat no horário comercial.
      </p>
      <button
        className="bg-brand-primary text-white py-2 px-6 rounded-xl font-bold"
        onClick={() => navigate('/contact')}
      >
        Falar com a equipe
      </button>
    </div>
  );
}