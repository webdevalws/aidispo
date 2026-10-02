// Single Job Operations (GET, PUT, DELETE)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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

// GET: Retrieve single job
export async function onRequestGet(context) {
  const { params, env } = context;
  const id = parseInt(params.id, 10);

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ success: false, error: "Database not connected" }), { status: 500, headers: corsHeaders });
  }

  try {
    const job = await env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first();
    if (!job) {
      return new Response(JSON.stringify({ success: false, error: "Job not found" }), { status: 404, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ success: true, job }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

// PUT: Update job
export async function onRequestPut(context) {
  const { request, params, env } = context;
  const id = parseInt(params.id, 10);

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
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
      return new Response(JSON.stringify({ success: false, error: "Title and description are required." }), { status: 400, headers: corsHeaders });
    }

    await env.DB.prepare(`
      UPDATE jobs
      SET title = ?, department = ?, location = ?, job_type = ?, experience = ?, salary = ?, description = ?, requirements = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(title, department, location, job_type, experience, salary, description, requirements, status, id).run();

    return new Response(JSON.stringify({ success: true, message: "Job updated successfully!" }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

// DELETE: Remove job
export async function onRequestDelete(context) {
  const { request, params, env } = context;
  const id = parseInt(params.id, 10);

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  try {
    await env.DB.prepare("DELETE FROM jobs WHERE id = ?").bind(id).run();
    await env.DB.prepare("DELETE FROM applicants WHERE job_id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true, message: "Job deleted successfully" }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
