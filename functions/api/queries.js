// Queries Collection API (Submit Contact Us Inquiry & Admin Query List)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

function verifyAuth(request) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  try {
    const token = auth.replace("Bearer ", "").trim();
    const payload = JSON.parse(atob(token));
    return payload && payload.exp > Date.now();
  } catch (e) {
    return false;
  }
}

function sanitizePlainText(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .slice(0, maxLength);
}

function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  const cleaned = email.trim().toLowerCase().slice(0, 150);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}

function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.trim().replace(/[^0-9+() -]/g, '').slice(0, 30);
}

// GET: List all queries/inquiries (Admin only)
export async function onRequestGet(context) {
  const { request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const rawStatus = url.searchParams.get("status");
  const statusFilter = sanitizePlainText(rawStatus || "ALL", 50);

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ success: true, queries: [], total: 0 }), { status: 200, headers: corsHeaders });
  }

  try {
    let query = "SELECT * FROM queries";
    let params = [];

    if (statusFilter && statusFilter !== "ALL") {
      query += " WHERE status = ?";
      params.push(statusFilter);
    }

    query += " ORDER BY created_at DESC";

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      success: true,
      queries: results || [],
      total: (results || []).length
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

// POST: Public submission from Contact Us form
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const name = sanitizePlainText(data.name, 120);
    const organization = sanitizePlainText(data.organization, 150);
    const email = sanitizeEmail(data.email);
    const phone = sanitizePhone(data.phone);
    const product = sanitizePlainText(data.product || "Syringe", 80);
    const volume = sanitizePlainText(data.volume || "Clinical Sample Batch Evaluation", 100);
    const sku = sanitizePlainText(data.sku, 100);
    const message = sanitizePlainText(data.message, 5000);

    if (!name || !email || !phone) {
      return new Response(JSON.stringify({
        success: false,
        error: "Valid Full Name, Work Email, and Phone number are required."
      }), { status: 400, headers: corsHeaders });
    }

    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        success: true,
        message: "Inquiry received successfully (local mode)"
      }), { status: 200, headers: corsHeaders });
    }

    const stmt = env.DB.prepare(`
      INSERT INTO queries (name, organization, email, phone, product, volume, sku, message, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', datetime('now'), datetime('now'))
    `).bind(name, organization, email, phone, product, volume, sku, message);

    const info = await stmt.run();

    return new Response(JSON.stringify({
      success: true,
      id: info.meta ? info.meta.last_row_id : null,
      message: "Procurement inquiry received successfully! A representative will contact you shortly."
    }), { status: 201, headers: corsHeaders });


  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
