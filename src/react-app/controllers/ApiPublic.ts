import { apiFetch } from '../controllers/ApiController';

export async function getUserMe() {
  return apiFetch('/api/users/me');
}
export async function getBlogPosts(category?: number) {
  try {
    return await apiFetch(`/api/blog${category ? `?categoria=${category}` : ''}`);
  } catch (err: any) {
    if (typeof window !== 'undefined') {
      window.__BLOG_ERROR__ = err?.message || 'Erro ao carregar blog.';
    }
    throw err;
  }
}
export async function getBlogCategories() {
  return apiFetch('/api/admin/blog-categories');
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
