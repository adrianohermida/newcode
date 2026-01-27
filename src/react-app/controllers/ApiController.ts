// src/react-app/controllers/ApiController.ts
// Centraliza todas as chamadas à API do frontend

export async function apiFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // Tenta extrair mensagem de erro do backend
      let message = `Erro ao acessar ${url}: ${res.status}`;
      try {
        const data = await res.json();
        if (data?.error) message += ` - ${data.error}`;
        if (data?.message) message += ` - ${data.message}`;
      } catch {}
      throw new Error(message);
    }
    return res.json();
  } catch (err: any) {
    // Fallback para erro de rede ou parsing
    throw new Error(err?.message || `Erro de conexão com ${url}`);
  }
}

// Exemplo de uso:
// const data = await apiFetch('/api/users/me');
