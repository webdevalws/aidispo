// Jobs Collection API (List Jobs & Create Job) for Cloudflare D1
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

// GET: Retrieve jobs with optional status/search filters
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const search = (url.searchParams.get("search") || "").trim();

  if (!env || !env.DB) {
    return new Response(JSON.stringify({
      success: true,
      jobs: [],
      total: 0
    }), { status: 200, headers: corsHeaders });
  }

  try {
    let query = "SELECT j.*, (SELECT COUNT(*) FROM applicants a WHERE a.job_id = j.id) as applicants_count FROM jobs j";
    let params = [];
    let conditions = [];

    if (status) {
      conditions.push("j.status = ?");
      params.push(status);
    }
    if (search) {
      conditions.push("(j.title LIKE ? OR j.department LIKE ? OR j.location LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY j.created_at DESC";

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      success: true,
      jobs: results || [],
      total: (results || []).length
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { status: 500, headers: corsHeaders });
  }
}

// POST: Create new job posting
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized"
    }), { status: 401, headers: corsHeaders });
  }

  try {
    const data = await request.json();
    const title = (data.title || "").trim();
    const department = (data.department || "Clinical Engineering").trim();
    const location = (data.location || "Facility HQ, India").trim();
    const job_type = (data.job_type || "Full-Time").trim();
    const experience = (data.experience || "2-5 Years").trim();
    const salary = (data.salary || "").trim();
    const description = data.description || "";
    const requirements = (data.requirements || "").trim();
    const status = (data.status || "Active").trim();

    if (!title || !description) {
      return new Response(JSON.stringify({
        success: false,
        error: "Job Title and Job Description are required."
      }), { status: 400, headers: corsHeaders });
    }

    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "D1 database not connected"
      }), { status: 500, headers: corsHeaders });
    }

    const stmt = env.DB.prepare(`
      INSERT INTO jobs (title, department, location, job_type, experience, salary, description, requirements, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(title, department, location, job_type, experience, salary, description, requirements, status);

    const info = await stmt.run();

    return new Response(JSON.stringify({
      success: true,
      id: info.meta ? info.meta.last_row_id : null,
      message: "Job posting created successfully!"
    }), { status: 201, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
