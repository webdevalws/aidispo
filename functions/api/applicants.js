// Applicants Collection API (Apply for Job & List Applicants)
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

// GET: List all applicants (Admin only)
export async function onRequestGet(context) {
  const { request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const jobId = url.searchParams.get("job_id");

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ success: true, applicants: [], total: 0 }), { status: 200, headers: corsHeaders });
  }

  try {
    let query = "SELECT * FROM applicants";
    let params = [];

    if (jobId) {
      query += " WHERE job_id = ?";
      params.push(parseInt(jobId, 10));
    }

    query += " ORDER BY applied_at DESC";

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      success: true,
      applicants: results || [],
      total: (results || []).length
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
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

function sanitizeSafeUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^https?:\/\/[^\s<>"']+$/i.test(trimmed)) {
    return trimmed.slice(0, 500);
  }
  if (/^data:(image\/[a-z]+|application\/pdf);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

// POST: Candidate submits job application (Public)
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const job_id = data.job_id ? parseInt(data.job_id, 10) : null;
    const job_title = sanitizePlainText(data.job_title || "General Application", 120);
    const full_name = sanitizePlainText(data.full_name, 120);
    const email = sanitizeEmail(data.email);
    const phone = sanitizePhone(data.phone);
    const experience = sanitizePlainText(data.experience || "Not Specified", 80);
    const resume_url = sanitizeSafeUrl(data.resume_url);
    const cover_letter = sanitizePlainText(data.cover_letter, 5000);

    if (!full_name || !email || !phone) {
      return new Response(JSON.stringify({
        success: false,
        error: "Valid Full Name, Work Email, and Phone number are required."
      }), { status: 400, headers: corsHeaders });
    }

    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        success: true,
        message: "Application received successfully (local mode)"
      }), { status: 200, headers: corsHeaders });
    }

    const stmt = env.DB.prepare(`
      INSERT INTO applicants (job_id, job_title, full_name, email, phone, experience, resume_url, cover_letter, status, applied_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', datetime('now'))
    `).bind(job_id, job_title, full_name, email, phone, experience, resume_url, cover_letter);

    const info = await stmt.run();

    return new Response(JSON.stringify({
      success: true,
      id: info.meta ? info.meta.last_row_id : null,
      message: "Application submitted successfully! Our HR team will review your profile."
    }), { status: 201, headers: corsHeaders });


  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
