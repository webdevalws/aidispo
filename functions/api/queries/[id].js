// Individual Query Handler (GET, PUT, DELETE)
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

// GET: Get single query
export async function onRequestGet(context) {
  const { params, request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const id = parseInt(params.id, 10);

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ success: false, error: "Database not connected" }), { status: 500, headers: corsHeaders });
  }

  try {
    const query = await env.DB.prepare("SELECT * FROM queries WHERE id = ?").bind(id).first();
    if (!query) {
      return new Response(JSON.stringify({ success: false, error: "Query not found" }), { status: 404, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ success: true, query }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

// PUT: Update Query Status (e.g. New -> In Progress -> Contacted -> Resolved)
export async function onRequestPut(context) {
  const { params, request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const id = parseInt(params.id, 10);

  try {
    const data = await request.json();
    const allowed = ['New', 'In Progress', 'Contacted', 'Resolved'];
    const rawStatus = (data.status || "In Progress").trim();
    const status = allowed.includes(rawStatus) ? rawStatus : 'In Progress';

    if (!env || !env.DB) {
      return new Response(JSON.stringify({ success: true, message: "Query status updated (local mode)" }), { status: 200, headers: corsHeaders });
    }

    await env.DB.prepare(`
      UPDATE queries 
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, id).run();

    return new Response(JSON.stringify({ success: true, message: "Query status updated successfully" }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

// DELETE: Delete a query
export async function onRequestDelete(context) {
  const { params, request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const id = parseInt(params.id, 10);

  try {
    if (!env || !env.DB) {
      return new Response(JSON.stringify({ success: true, message: "Query deleted (local mode)" }), { status: 200, headers: corsHeaders });
    }

    await env.DB.prepare("DELETE FROM queries WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true, message: "Query deleted successfully" }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
