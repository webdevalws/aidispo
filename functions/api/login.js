// Login API Endpoint for Admin Authentication via Cloudflare D1
export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };

  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Wrong credentials" 
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // If D1 binding exists, query database
    if (env && env.DB) {
      // Auto-ensure table and default user exist
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT DEFAULT 'AI-DISPO Admin',
            role TEXT DEFAULT 'Administrator',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();

        await env.DB.prepare(`
          INSERT OR IGNORE INTO admins (email, password, name, role)
          VALUES (?, ?, ?, ?)
        `).bind('aidispo@admin.com', 'aiadmin', 'AI-DISPO Admin', 'Administrator').run();

        const user = await env.DB.prepare("SELECT * FROM admins WHERE LOWER(email) = ?").bind(email).first();

        if (user && user.password === password) {
          const token = btoa(JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
          }));

          return new Response(JSON.stringify({
            success: true,
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name || 'AI-DISPO Admin',
              role: user.role || 'Administrator'
            }
          }), {
            status: 200,
            headers: corsHeaders
          });
        }
      } catch (dbErr) {
        console.error("D1 Query Error:", dbErr);
      }
    }

    // Fallback/Direct Credential Verification for aidispo@admin.com / aiadmin
    if (email === 'aidispo@admin.com' && password === 'aiadmin') {
      const token = btoa(JSON.stringify({
        id: 1,
        email: 'aidispo@admin.com',
        role: 'Administrator',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000
      }));

      return new Response(JSON.stringify({
        success: true,
        token,
        user: {
          id: 1,
          email: 'aidispo@admin.com',
          name: 'AI-DISPO Admin',
          role: 'Administrator'
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: "Wrong credentials"
    }), {
      status: 401,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Server error: " + error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
