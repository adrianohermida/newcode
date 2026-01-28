// == BLOG PUBLIC ENDPOINTS ==
app.get("/api/blog", async (c) => {
  const categoria = c.req.query("categoria");
  let query = "SELECT * FROM blog_posts ORDER BY data_publicacao DESC";
  let params: any[] = [];
  if (categoria) {
    query = "SELECT * FROM blog_posts WHERE categoria_id = ? ORDER BY data_publicacao DESC";
    params = [categoria];
  }
  try {
    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    // Always return an array, even if empty
    return c.json(Array.isArray(results) ? results : []);
  } catch (e: any) {
    // Always return a valid JSON array on error, and set error header for debugging
    c.header('X-Blog-Error', e.message || 'Unknown error');
    return c.json([]);
  }
});

app.get("/api/admin/blog-categories", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM blog_categories ORDER BY nome ASC").all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  SESSION_TOKEN_COOKIE_NAME,
  sendOTP,
  verifyOTP,
  getCurrentUser,
} from "@hey-boss/users-service/backend";
import { CustomerService } from "../shared/customers-service";

const app = new Hono<{
  Bindings: {
    DB: D1Database;
    API_KEY: string;
    USER_ID: string;
    PROJECT_ID: string;
    USER_EMAIL: string;
    AUTH_KEY: string;
    ADMIN_EMAILS: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_CONNECT_ACCOUNT_ID?: string;
  };
}>();

// =================================================================
// == MIDDLEWARES & HELPERS                                       ==
// =================================================================

async function logAudit(db: D1Database, resource: string, action: string, actor: string, details?: any) {
  try {
    await db.prepare(
      "INSERT INTO audit_logs (resource, action, actor_id, payload_hash, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(
      resource, 
      action, 
      actor, 
      details ? JSON.stringify(details).substring(0, 100) : null, 
      new Date().toISOString()
    ).run();
  } catch (e) {
    console.error("Audit Log Error:", e);
  }
}

const adminPermissionMiddleware = async (c: any, next: any) => {
  const user = c.get("user");
  if (!user || !user.email) return c.json({ error: "Unauthorized" }, 401);

  const userEmail = user.email.toLowerCase();
  const adminEmails = (c.env.ADMIN_EMAILS || "").split(",").map((e: string) => e.trim().toLowerCase());
  const ownerEmail = (c.env.USER_EMAIL || "").toLowerCase();

  const isExplicitAdmin = adminEmails.includes(userEmail) || 
                         (ownerEmail !== "" && ownerEmail !== "user_email" && userEmail === ownerEmail) ||
                         userEmail === "adrianohermida@gmail.com" ||
                         userEmail === "contato@hermidamaia.adv.br";

  if (isExplicitAdmin) {
    await next();
    return;
  }

  const profile = await c.env.DB.prepare("SELECT id FROM user_profiles WHERE LOWER(user_email) = ?").bind(userEmail).first();
  if (profile) {
    await next();
    return;
  }

  return c.json({ error: "Forbidden - Admin access required" }, 403);
};

// =================================================================
// == AUTHENTICATION ROUTES                                       ==
// =================================================================

app.get("/api/oauth/google/redirect_url", async (c) => {
  const origin = c.req.query("originUrl") || "";
  const redirectUrl = await getOAuthRedirectUrl("google", {
    originUrl: origin,
  });
  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();
  if (!body.code) return c.json({ error: "No authorization code provided" }, 400);

  const sessionToken = await exchangeCodeForSessionToken(body.code, c.env.PROJECT_ID);

  try {
    const user = await getCurrentUser(sessionToken);
    if (user && user.email) {
      await CustomerService.save(c.env.DB, {
        formData: { email: user.email, email_verified: true, email_consent: true, name: user.name },
        source: "google-oauth",
      });
    }
  } catch (error) {
    console.error("Failed to save customer after Google login:", error);
  }

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  // Recupera o usuário autenticado do contexto
  //@ts-ignore
  const user = c.get("user");
  if (!user || !user.email) return c.json({ error: "Usuário não autenticado" }, 401);

  const userEmail = user.email.toLowerCase();
  const adminEmails = (c.env.ADMIN_EMAILS || "").split(",").map((e: string) => e.trim().toLowerCase());
  const ownerEmail = (c.env.USER_EMAIL || "").toLowerCase();

  // Critérios para admin explícito
  const isExplicitAdmin = adminEmails.includes(userEmail) ||
    (ownerEmail !== "" && ownerEmail !== "user_email" && userEmail === ownerEmail) ||
    userEmail === "adrianohermida@gmail.com" ||
    userEmail === "contato@hermidamaia.adv.br";

  let isAdmin = isExplicitAdmin;
  if (!isAdmin) {
    try {
      const profile = await c.env.DB.prepare("SELECT id FROM user_profiles WHERE LOWER(user_email) = ?").bind(userEmail).first();
      if (profile) isAdmin = true;
    } catch (e) {}
  }

  // Log de auditoria
  await logAudit(c.env.DB, "user_profile", "view_me", userEmail);

  // Retorna dados mínimos esperados pelo frontend
  return c.json({
    email: user.email,
    name: user.name || null,
    isAdmin,
    id: user.id || null,
    avatar_url: user.avatar_url || null,
    // Adicione outros campos necessários para o frontend aqui
  });
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, SESSION_TOKEN_COOKIE_NAME);
  if (typeof sessionToken === "string") await deleteSession(sessionToken);
  setCookie(c, SESSION_TOKEN_COOKIE_NAME, "", { httpOnly: true, path: "/", sameSite: "none", secure: true, maxAge: 0 });
  return c.json({ success: true }, 200);
});

app.post("/api/send-otp", async (c) => {
  const { email } = await c.req.json();
  if (!email) return c.json({ error: "No email provided" }, 400);

  const data = await sendOTP(email, c.env.PROJECT_ID);
  return data.error ? c.json({ error: data.error }, 400) : c.json({ success: true }, 200);
});

app.post("/api/verify-otp", async (c) => {
  const { email, otp } = await c.req.json();
  if (!email || !otp) return c.json({ error: "Missing fields" }, 400);
  const data = await verifyOTP(email, otp);
  if (data.error) return c.json({ error: data.error }, 400);

  await CustomerService.save(c.env.DB, {
    formData: { email, email_verified: true, email_consent: true },
    source: "otp",
  });

  setCookie(c, SESSION_TOKEN_COOKIE_NAME, data.sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 1 * 24 * 60 * 60,
  });
  return c.json({ success: true, data }, 200);
});

// =================================================================
// == APPOINTMENTS LOGIC (INTERNAL DB)                            ==
// =================================================================

app.get("/api/appointments/profissionais", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM profissionais WHERE ativo = 1").all();
  return c.json(results);
});

app.get("/api/appointments/slots", async (c) => {
  const profId = c.req.query("profId");
  const date = c.req.query("date");
  const type = c.req.query("type") || "avaliacao";

  if (!date || !profId) return c.json({ error: "Missing parameters" }, 400);

  try {
    // 1. Buscar regras de disponibilidade do profissional
    const rules = await c.env.DB.prepare("SELECT * FROM availability_rules WHERE profissional_id = ?").bind(profId).first() as any;
    if (!rules) return c.json([]);

    const diasSemana = JSON.parse(rules.dias_semana || "[1,2,3,4,5]");
    const selectedDate = new Date(`${date}T00:00:00-03:00`);
    
    // Validar dia da semana
    if (!diasSemana.includes(selectedDate.getDay())) return c.json([]);

    // 2. Validar antecedência mínima
    const now = new Date();
    const diffHours = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const minAdvance = type === 'tecnica' ? rules.antecedencia_tecnica : rules.antecedencia_avaliacao;
    if (diffHours < minAdvance) return c.json([]);

    // 3. Buscar agendamentos existentes (confirmados ou aguardando)
    const { results: existing } = await c.env.DB.prepare(
      "SELECT form_data FROM appointments WHERE profissional_id = ? AND status IN ('confirmado', 'aguardando_aceite') AND uniqueness_check LIKE ?"
    ).bind(profId, `%:${date}:%`).all();

    const busyTimes = existing.map((a: any) => {
      const data = JSON.parse(a.form_data);
      return data.appointment_time;
    });

    // 4. Gerar slots
    const slots = [];
    const [startH, startM] = rules.hora_inicio.split(':').map(Number);
    const [endH, endM] = rules.hora_fim.split(':').map(Number);
    const [breakStartH, breakStartM] = rules.intervalo_bloqueado_inicio.split(':').map(Number);
    const [breakEndH, breakEndM] = rules.intervalo_bloqueado_fim.split(':').map(Number);

    let current = new Date(selectedDate);
    current.setHours(startH, startM, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endH, endM, 0, 0);

    while (current < end) {
      const timeStr = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
      
      // Verificar se está no intervalo bloqueado
      const isBreak = (current.getHours() > breakStartH || (current.getHours() === breakStartH && current.getMinutes() >= breakStartM)) &&
                      (current.getHours() < breakEndH || (current.getHours() === breakEndH && current.getMinutes() < breakEndM));

      if (!isBreak && !busyTimes.includes(timeStr)) {
        slots.push({
          id: `${date}-${timeStr}`,
          hora_inicio: timeStr,
          status: 'disponivel'
        });
      }

      current.setMinutes(current.getMinutes() + rules.duracao_minima + rules.espaco_minimo);
    }

    return c.json(slots);
  } catch (error) {
    console.error("Error calculating slots:", error);
    return c.json({ error: "Failed to calculate availability" }, 500);
  }
});

app.post("/api/forms/submit", authMiddleware, async (c) => {
  const { formId, ...formData } = await c.req.json();
  const user = c.get("user") as any;
  const now = new Date().toISOString();
  
  if (formId === 'appointment_form') {
    const uniqueness = `${user.email}:${formData.appointment_date}:${formData.appointment_time}`;
    
    // Verificar duplicidade
    const existing = await c.env.DB.prepare("SELECT id FROM appointments WHERE uniqueness_check = ?").bind(uniqueness).first();
    if (existing) return c.json({ error: "ALREADY SUBMITTED" }, 400);

    try {
      await c.env.DB.prepare(
        `INSERT INTO appointments (uniqueness_check, user_id, form_data, profissional_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        uniqueness, 
        user.id || user.email,
        JSON.stringify(formData), 
        formData.profissional_id || 1,
        'aguardando_aceite',
        now, 
        now
      ).run();

      await logAudit(c.env.DB, "appointment", "create", user.email, { uniqueness });
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  }

  // Outros formulários (contato, newsletter, etc)
  const table = formId === 'contact_form' ? 'contact_submissions' :
                formId === 'newsletter_form' ? 'newsletter_subscribers' :
                formId === 'ticket_form' ? 'tickets' : 'contact_submissions';

  try {
    const uniqueness = formData.email || `anon_${crypto.randomUUID()}`;
    await c.env.DB.prepare(
      `INSERT INTO ${table} (uniqueness_check, form_data, created_at, updated_at) VALUES (?, ?, ?, ?)`
    ).bind(uniqueness, JSON.stringify(formData), now, now).run();
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get("/api/my-appointments", authMiddleware, async (c) => {
  const user = c.get("user") as any;
  const { results } = await c.env.DB.prepare(
    "SELECT a.*, p.nome as profissional_nome FROM appointments a LEFT JOIN profissionais p ON a.profissional_id = p.id WHERE a.user_id = ? OR a.uniqueness_check LIKE ? ORDER BY a.created_at DESC"
  ).bind(user.id || user.email, `${user.email}:%`).all();
  
  return c.json(results.map((r: any) => ({
    ...r,
    form_data: JSON.parse(r.form_data)
  })));
});

app.post("/api/appointments/:id/cancel", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const user = c.get("user") as any;
  const now = new Date();

  const appointment = await c.env.DB.prepare("SELECT * FROM appointments WHERE id = ?").bind(id).first() as any;
  if (!appointment) return c.json({ error: "Not found" }, 404);

  const data = JSON.parse(appointment.form_data);
  const appDate = new Date(`${data.appointment_date}T${data.appointment_time}:00-03:00`);
  const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 24) return c.json({ error: "Cancelamento permitido apenas com 24h de antecedência." }, 400);

  await c.env.DB.prepare("UPDATE appointments SET status = 'cancelado', updated_at = ? WHERE id = ?")
    .bind(now.toISOString(), id).run();

  await logAudit(c.env.DB, `appointment:${id}`, "cancel", user.email);
  return c.json({ success: true });
});

// =================================================================
// == ADMIN APPOINTMENT MANAGEMENT                                ==
// =================================================================

app.get("/api/admin/appointments", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT a.*, p.nome as profissional_nome FROM appointments a LEFT JOIN profissionais p ON a.profissional_id = p.id ORDER BY a.created_at DESC"
  ).all();
  return c.json(results.map((r: any) => ({
    ...r,
    form_data: JSON.parse(r.form_data)
  })));
});

app.post("/api/admin/appointments/:id/status", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const { status, notes } = await c.req.json();
  const user = c.get("user") as any;

  await c.env.DB.prepare("UPDATE appointments SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?")
    .bind(status, notes || null, new Date().toISOString(), id).run();

  await logAudit(c.env.DB, `appointment:${id}`, `status_update_${status}`, user.email);
  return c.json({ success: true });
});

// =================================================================
// == OTHER ROUTES (LEADS, PROCESSOS, ETC)                        ==
// =================================================================

app.get("/api/admin/leads", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
  return c.json(results);
});

app.get("/api/admin/processos", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM processos ORDER BY updated_at DESC").all();
  return c.json(results);
});

app.get("/api/processos/:id/details", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const user = c.get("user") as any;
  
  const processo = await c.env.DB.prepare("SELECT * FROM processos WHERE id = ?").bind(id).first();
  if (!processo) return c.json({ error: "Not found" }, 404);

  const isAdmin = (await c.env.DB.prepare("SELECT id FROM user_profiles WHERE LOWER(user_email) = ?").bind(user.email.toLowerCase()).first()) || user.email.toLowerCase() === c.env.USER_EMAIL.toLowerCase();
  if (!isAdmin && (processo as any).cliente_email.toLowerCase() !== user.email.toLowerCase()) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const movements = (await c.env.DB.prepare("SELECT * FROM process_movements WHERE processo_id = ? ORDER BY data_movimento DESC").bind(id).all()).results;
  const hearings = (await c.env.DB.prepare("SELECT * FROM hearings WHERE processo_id = ? ORDER BY data_audiencia ASC").bind(id).all()).results;
  const tasks = (await c.env.DB.prepare("SELECT * FROM tasks WHERE processo_id = ? ORDER BY data_limite ASC").bind(id).all()).results;
  const documents = (await c.env.DB.prepare("SELECT * FROM process_documents WHERE processo_id = ? ORDER BY created_at DESC").bind(id).all()).results;
  
  const publicacoes = (await c.env.DB.prepare("SELECT * FROM publicacoes WHERE processo_cnj = ? ORDER BY data_publicacao DESC").bind((processo as any).numero_cnj).all()).results;
  const faturas = (await c.env.DB.prepare("SELECT * FROM faturas WHERE processo_id = ? OR negocio = ?").bind(id, (processo as any).numero_cnj).all()).results;
  const tickets = (await c.env.DB.prepare("SELECT * FROM tickets WHERE processo_id = ? OR (client_email = ? AND subject LIKE ?)").bind(id, (processo as any).cliente_email, `%${(processo as any).numero_cnj}%`).all()).results;

  return c.json({ processo, movements, hearings, tasks, documents, publicacoes, faturas, tickets });
});

app.get("/api/admin/faturas", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM faturas ORDER BY data_vencimento ASC").all();
  return c.json(results);
});

app.get("/api/admin/publicacoes", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM publicacoes ORDER BY data_publicacao DESC LIMIT 100").all();
  return c.json(results);
});

app.get("/api/admin/ai-interactions", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM ai_interactions ORDER BY updated_at DESC LIMIT 50").all();
  return c.json(results);
});

// Channels CRUD
app.get("/api/admin/channels", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM channels ORDER BY created_at DESC").all();
  return c.json(results);
});

app.post("/api/admin/channels", authMiddleware, adminPermissionMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get("user") as any;
  const now = new Date().toISOString();
  
  try {
    await c.env.DB.prepare(
      "INSERT INTO channels (type, name, credentials, webhook_url, default_queue_id, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      body.type,
      body.name,
      body.credentials || null,
      body.webhook_url || null,
      body.default_queue_id || null,
      body.active ? 1 : 0,
      now,
      now
    ).run();
    
    await logAudit(c.env.DB, "channels", "create", user.email, body);
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.put("/api/admin/channels/:id", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const user = c.get("user") as any;
  const now = new Date().toISOString();
  
  if (!body.type || !body.name) {
    return c.json({ error: "Tipo e nome do canal são obrigatórios." }, 400);
  }
  
  try {
    const result = await c.env.DB.prepare(
      "UPDATE channels SET type = ?, name = ?, credentials = ?, webhook_url = ?, default_queue_id = ?, active = ?, updated_at = ? WHERE id = ?"
    ).bind(
      body.type,
      body.name,
      body.credentials || null,
      body.webhook_url || null,
      body.default_queue_id || null,
      body.active ? 1 : 0,
      now,
      id
    ).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: "Canal não encontrado." }, 404);
    }
    
    await logAudit(c.env.DB, `channels:${id}`, "update", user.email, { name: body.name, queue_id: body.default_queue_id });
    return c.json({ success: true });
  } catch (e: any) {
    console.error("Error updating channel:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.delete("/api/admin/channels/:id", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const user = c.get("user") as any;
  
  try {
    await c.env.DB.prepare("DELETE FROM channels WHERE id = ?").bind(id).run();
    await logAudit(c.env.DB, `channels:${id}`, "delete", user.email);
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.patch("/api/admin/channels/:id/toggle", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const { active } = await c.req.json();
  const user = c.get("user") as any;
  const now = new Date().toISOString();
  
  try {
    await c.env.DB.prepare(
      "UPDATE channels SET active = ?, updated_at = ? WHERE id = ?"
    ).bind(active ? 1 : 0, now, id).run();
    
    await logAudit(c.env.DB, `channels:${id}`, `toggle_${active ? 'on' : 'off'}`, user.email);
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get("/api/admin/balcao/stats", authMiddleware, adminPermissionMiddleware, async (c) => {
  const user = c.get("user") as any;
  const now = new Date().toISOString();

  try {
    // 1. Atendimentos Ativos (status = 'ativo')
    const ativos = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM conversations WHERE status = 'ativo'"
    ).first("count");

    // 2. Aguardando Fila (sem responsável atribuído)
    const fila = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM conversations WHERE assigned_agent_email IS NULL OR assigned_agent_email = ''"
    ).first("count");

    // 3. Risco de SLA (conversas abertas acima do tempo máximo configurado)
    const slaRisk = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM conversations WHERE status != 'resolvido' AND sla_deadline < ?"
    ).bind(now).first("count");

    // 4. Canais Online (canais ativos)
    const channels = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM channels WHERE active = 1"
    ).first("count");

    await logAudit(c.env.DB, "balcao_virtual", "view_stats", user.email);

    return c.json({
      active: ativos || 0,
      pending: fila || 0,
      sla_risk: slaRisk || 0,
      online_channels: channels || 0
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get("/api/admin/conversations", authMiddleware, adminPermissionMiddleware, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        conv.*, 
        cust.first_name, 
        cust.last_name, 
        cust.email as lead_email,
        ch.name as channel_name,
        ch.type as channel_type,
        q.name as queue_name
      FROM conversations conv
      JOIN customers cust ON conv.lead_id = cust.id
      JOIN channels ch ON conv.channel_id = ch.id
      LEFT JOIN queues q ON conv.queue_id = q.id
      ORDER BY conv.last_message_at DESC
    `).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Queues CRUD
app.get("/api/admin/queues", authMiddleware, adminPermissionMiddleware, async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM queues ORDER BY name ASC").all();
    const user = c.get("user") as any;
    await logAudit(c.env.DB, "queues", "list", user.email);
    return c.json(results || []);
  } catch (e: any) {
    console.error("Error fetching queues:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.post("/api/admin/queues", authMiddleware, adminPermissionMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get("user") as any;
  const now = new Date().toISOString();
  
  if (!body.name || !body.routing_rule) {
    return c.json({ error: "Nome e regra de roteamento são obrigatórios." }, 400);
  }
  
  try {
    const result = await c.env.DB.prepare(
      "INSERT INTO queues (name, routing_rule, active, created_at) VALUES (?, ?, ?, ?)"
    ).bind(
      body.name,
      body.routing_rule || "ia_first",
      body.active ? 1 : 0,
      now
    ).run();
    
    await logAudit(c.env.DB, "queues", "create", user.email, { name: body.name, routing_rule: body.routing_rule });
    return c.json({ success: true, queueId: result.meta.last_row_id });
  } catch (e: any) {
    console.error("Error creating queue:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.put("/api/admin/queues/:id", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const user = c.get("user") as any;
  
  if (!body.name || !body.routing_rule) {
    return c.json({ error: "Nome e regra de roteamento são obrigatórios." }, 400);
  }
  
  try {
    const result = await c.env.DB.prepare(
      "UPDATE queues SET name = ?, routing_rule = ?, active = ? WHERE id = ?"
    ).bind(
      body.name,
      body.routing_rule,
      body.active ? 1 : 0,
      id
    ).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: "Fila não encontrada." }, 404);
    }
    
    await logAudit(c.env.DB, `queues:${id}`, "update", user.email, { name: body.name, routing_rule: body.routing_rule });
    return c.json({ success: true });
  } catch (e: any) {
    console.error("Error updating queue:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.delete("/api/admin/queues/:id", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const user = c.get("user") as any;
  
  try {
    // Check if any channel uses this queue
    const inUse = await c.env.DB.prepare("SELECT id FROM channels WHERE default_queue_id = ?").bind(id).first();
    if (inUse) {
      return c.json({ error: "Esta fila está sendo usada por um ou mais canais e não pode ser excluída." }, 400);
    }

    const result = await c.env.DB.prepare("DELETE FROM queues WHERE id = ?").bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: "Fila não encontrada." }, 404);
    }
    
    await logAudit(c.env.DB, `queues:${id}`, "delete", user.email);
    return c.json({ success: true });
  } catch (e: any) {
    console.error("Error deleting queue:", e);
    return c.json({ error: e.message }, 500);
  }
});

// Helper for Routing Logic - Apply routing rule when new conversation initialized
async function applyRoutingRule(db: D1Database, conversationId: number, queueId: number) {
  try {
    const queue = await db.prepare("SELECT * FROM queues WHERE id = ?").bind(queueId).first() as any;
    if (!queue) {
      console.error(`Queue ${queueId} not found for conversation ${conversationId}`);
      return;
    }

    let assignedAgent: string | null = null;
    const rule = queue.routing_rule;
    const now = new Date().toISOString();

    if (rule === 'ia_first') {
      // IA-First: Always assign to IA for initial handling
      assignedAgent = 'ia';
    } else if (rule === 'round_robin') {
      // Round-Robin: Distribute evenly among active agents
      const agentsResult = await db.prepare(
        "SELECT user_email FROM user_profiles WHERE user_email IS NOT NULL ORDER BY id ASC"
      ).all();
      
      const agents = (agentsResult as any).results || [];
      if (agents.length > 0) {
        // Use conversation ID for deterministic round-robin distribution
        const index = conversationId % agents.length;
        assignedAgent = agents[index].user_email;
      }
    } else if (rule === 'manual') {
      // Manual: Leave unassigned, will be manually routed by admin
      assignedAgent = null;
    }

    // Update conversation with assigned agent and log which rule was applied
    await db.prepare(
      "UPDATE conversations SET assigned_agent_email = ?, routing_rule_applied = ?, updated_at = ? WHERE id = ?"
    ).bind(assignedAgent, rule, now, conversationId).run();

    // Log the routing decision for audit
    await logAudit(db, `conversation:${conversationId}`, `routing_applied_${rule}`, assignedAgent || 'system', {
      queue_id: queueId,
      assigned_to: assignedAgent,
      rule: rule
    });

  } catch (e: any) {
    console.error(`Error applying routing rule to conversation ${conversationId}:`, e);
  }
}

// Real-world Inbound Message Handler - Automatically creates conversation and applies routing
app.post("/api/chat/inbound", async (c) => {
  const { channelId, email, firstName, lastName, content } = await c.req.json();
  const now = new Date().toISOString();

  if (!channelId || !email || !content) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  try {
    // 1. Find or create lead
    let lead = await c.env.DB.prepare("SELECT id FROM customers WHERE email = ?").bind(email).first() as any;
    if (!lead) {
      const result = await c.env.DB.prepare(
        "INSERT INTO customers (first_name, last_name, email, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(firstName || 'Visitante', lastName || '', email, `channel:${channelId}`, now, now).run();
      lead = { id: result.meta.last_row_id };
    }

    // 2. Find active conversation for this lead on this channel
    let conversation = await c.env.DB.prepare(
      "SELECT id, queue_id FROM conversations WHERE lead_id = ? AND channel_id = ? AND status != 'resolvido' ORDER BY updated_at DESC"
    ).bind(lead.id, channelId).first() as any;

    let isNewConversation = false;
    if (!conversation) {
      isNewConversation = true;
      const channel = await c.env.DB.prepare("SELECT default_queue_id FROM channels WHERE id = ?").bind(channelId).first() as any;
      const queueId = channel?.default_queue_id || 1;
      const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const result = await c.env.DB.prepare(
        "INSERT INTO conversations (channel_id, lead_id, queue_id, status, sla_deadline, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(channelId, lead.id, queueId, 'novo', slaDeadline, now, now).run();
      
      conversation = { id: result.meta.last_row_id, queue_id: queueId };
      
      // 3. Apply routing rule automatically
      await applyRoutingRule(c.env.DB, conversation.id, queueId);
    }

    // 4. Save the message
    await c.env.DB.prepare(
      "INSERT INTO messages (conversation_id, author_type, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(conversation.id, 'visitor', email, content, now).run();

    // 5. Update conversation timestamp
    await c.env.DB.prepare(
      "UPDATE conversations SET last_message_at = ?, updated_at = ? WHERE id = ?"
    ).bind(now, now, conversation.id).run();

    return c.json({ success: true, conversationId: conversation.id });
  } catch (e: any) {
    console.error("Inbound message error:", e);
    return c.json({ error: e.message }, 500);
  }
});

// Simulated New Conversation for Testing - Auto-applies routing rule
app.post("/api/admin/conversations/simulate", authMiddleware, adminPermissionMiddleware, async (c) => {
  const { channelId, leadId } = await c.req.json();
  const now = new Date().toISOString();
  const user = c.get("user") as any;

  if (!channelId || !leadId) {
    return c.json({ error: "channelId and leadId são obrigatórios." }, 400);
  }

  try {
    const channel = await c.env.DB.prepare("SELECT default_queue_id FROM channels WHERE id = ?").bind(channelId).first() as any;
    if (!channel) {
      return c.json({ error: "Canal não encontrado." }, 404);
    }

    const queueId = channel.default_queue_id || 1; // Fallback to first queue
    const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h SLA

    const result = await c.env.DB.prepare(
      "INSERT INTO conversations (channel_id, lead_id, queue_id, status, sla_deadline, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(channelId, leadId, queueId, 'novo', slaDeadline, now, now).run();

    const conversationId = result.meta.last_row_id;
    
    // Apply routing rule automatically based on queue configuration
    await applyRoutingRule(c.env.DB, conversationId, queueId);

    await logAudit(c.env.DB, `conversation:${conversationId}`, "create_simulated", user.email, { channel_id: channelId, lead_id: leadId });

    return c.json({ success: true, conversationId });
  } catch (e: any) {
    console.error("Error simulating conversation:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.get("/api/admin/conversations/:id/messages", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC").bind(id).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post("/api/admin/conversations/:id/reply", authMiddleware, adminPermissionMiddleware, async (c) => {
  const id = c.req.param("id");
  const { content } = await c.req.json();
  const user = c.get("user") as any;

  if (!content || content.trim() === "") {
    return c.json({ error: "Message content is required" }, 400);
  }

  try {
    const now = new Date().toISOString();
    await c.env.DB.prepare(
      "INSERT INTO messages (conversation_id, author_type, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, 'agent', user.email, content, now).run();

    await c.env.DB.prepare(
      "UPDATE conversations SET last_message_at = ?, updated_at = ? WHERE id = ?"
    ).bind(now, now, id).run();

    await logAudit(c.env.DB, "conversation", "reply", user.email, { conversation_id: id });

    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get("/api/products/purchase-detail", authMiddleware, async (c) => {
  const sessionId = c.req.query("sessionId");
  if (!sessionId) return c.json({ error: "Missing sessionId" }, 400);
  // Mock response for now as Stripe is not fully integrated in this step
  return c.json({
    checkoutSessionId: sessionId,
    totalAmount: 0,
    currency: "BRL",
    products: []
  });
});

export default app;