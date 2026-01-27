import { apiFetch } from '../controllers/ApiController';

export async function getUserMe() {
  return apiFetch('/api/users/me');
}
export async function getBlogPosts(category?: number) {
  return apiFetch(`/api/blog${category ? `?categoria=${category}` : ''}`);
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
