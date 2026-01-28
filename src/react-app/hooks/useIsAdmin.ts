import { useSupabaseSession } from './useSupabaseSession';

// Lista de e-mails ou domínios considerados admin
const ADMIN_EMAILS = [
  'contato@hermidamaia.adv.br',
  'adrianohermida@gmail.com',
  'admin@example.com',
];
const ADMIN_DOMAINS = [
  '@hermidamaia.com.br',
  '@hermidamaia.adv.br',
];

export function useIsAdmin(): boolean {
  const session = useSupabaseSession();
  const email = session?.user?.email?.toLowerCase() || '';
  if (!email) return false;
  if (ADMIN_EMAILS.includes(email)) return true;
  if (ADMIN_DOMAINS.some(domain => email.endsWith(domain))) return true;
  // (Opcional) Checar claims customizados no JWT
  // const isAdminClaim = session?.user?.user_metadata?.role === 'admin';
  // if (isAdminClaim) return true;
  return false;
}
