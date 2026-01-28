import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
  }

  // Aqui você pode buscar mais dados do usuário se quiser
  return new Response(JSON.stringify({ user }), { headers: { 'Content-Type': 'application/json' } })
})