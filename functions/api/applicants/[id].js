// Single Applicant Operations (PUT status, DELETE)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
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

// PUT: Update applicant status
export async function onRequestPut(context) {
  const { request, params, env } = context;
  const id = parseInt(params.id, 10);

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  try {
    const data = await request.json();
    const status = (data.status || "Pending").trim();

    if (!env || !env.DB) {
      return new Response(JSON.stringify({ success: false, error: "Database not connected" }), { status: 500, headers: corsHeaders });
    }

    await env.DB.prepare("UPDATE applicants SET status = ? WHERE id = ?").bind(status, id).run();

    return new Response(JSON.stringify({ success: true, message: "Applicant status updated" }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

// DELETE: Remove applicant
export async function onRequestDelete(context) {
  const { request, params, env } = context;
  const id = parseInt(params.id, 10);

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  try {
    await env.DB.prepare("DELETE FROM applicants WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true, message: "Applicant record deleted" }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
