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

// POST: Candidate submits job application (Public)
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const job_id = data.job_id ? parseInt(data.job_id, 10) : null;
    const job_title = (data.job_title || "General Application").trim();
    const full_name = (data.full_name || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const experience = (data.experience || "Not Specified").trim();
    const resume_url = (data.resume_url || "").trim();
    const cover_letter = (data.cover_letter || "").trim();

    if (!full_name || !email || !phone) {
      return new Response(JSON.stringify({
        success: false,
        error: "Full Name, Email, and Phone number are required."
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
