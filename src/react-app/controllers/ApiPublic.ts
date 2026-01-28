import { apiFetch } from '../controllers/ApiController';
import { supabase } from '../utils/supabaseClient';

  // Chama Edge Function via Supabase SDK
  const { data, error } = await supabase.functions.invoke('users-me');
  if (error) throw new Error(error.message || 'Erro ao buscar usuário.');
  return data;
}
}
export async function getBlogPosts(category?: number) {
  // Chama Edge Function via Supabase SDK
  const { data, error } = await supabase.functions.invoke('blog', {
    body: category ? { categoria: category } : {},
  });
  if (error) {
    if (typeof window !== 'undefined') {
      window.__BLOG_ERROR__ = error.message || 'Erro ao carregar blog.';
    }
    throw new Error(error.message || 'Erro ao carregar blog.');
  }
  return data;
}
export async function getBlogCategories() {
  // Chama Edge Function via Supabase SDK
  const { data, error } = await supabase.functions.invoke('blog-categories');
  if (error) throw new Error(error.message || 'Erro ao carregar categorias do blog.');
  return data;
}
export async function getBlogPost(slug: string) {
  return apiFetch(`/api/blog/${slug}`);
}
export async function getProfissionais() {
  return apiFetch('/api/appointments/profissionais');
}
export async function getSlots(date: string, profId: number, type: string) {
  return apiFetch(`/api/appointments/slots?date=${date}&profId=${profId}&type=${type}`);
}
export async function submitForm(data: any) {
  return apiFetch('/api/forms/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
