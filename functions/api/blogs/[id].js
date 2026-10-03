// Single Blog API (Get, Update, Delete) for Cloudflare D1
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

function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET: Retrieve single blog by ID or Slug & increment views
export async function onRequestGet(context) {
  const { params, env } = context;
  const idOrSlug = params.id;

  if (!env || !env.DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "D1 database not connected"
    }), { status: 500, headers: corsHeaders });
  }

  try {
    const isNumeric = /^\d+$/.test(idOrSlug);
    let blog;

    if (isNumeric) {
      blog = await env.DB.prepare("SELECT * FROM blogs WHERE id = ?").bind(parseInt(idOrSlug, 10)).first();
    } else {
      blog = await env.DB.prepare("SELECT * FROM blogs WHERE slug = ?").bind(idOrSlug).first();
    }

    if (!blog) {
      return new Response(JSON.stringify({
        success: false,
        error: "Blog post not found"
      }), { status: 404, headers: corsHeaders });
    }

    // Increment view count asynchronously
    await env.DB.prepare("UPDATE blogs SET views = views + 1 WHERE id = ?").bind(blog.id).run();
    blog.views = (blog.views || 0) + 1;

    return new Response(JSON.stringify({
      success: true,
      blog
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { status: 500, headers: corsHeaders });
  }
}

function sanitizePlainText(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .slice(0, maxLength);
}

function sanitizeRichHtml(html) {
  if (typeof html !== 'string') return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<applet\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"')
    .replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '');
}

// PUT: Update an existing blog
export async function onRequestPut(context) {
  const { request, params, env } = context;
  const id = parseInt(params.id, 10);

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized"
    }), { status: 401, headers: corsHeaders });
  }

  try {
    const data = await request.json();
    const title = sanitizePlainText(data.title, 250);
    const meta_title = sanitizePlainText(data.meta_title || title, 250);
    const meta_description = sanitizePlainText(data.meta_description, 500);
    let slug = sanitizePlainText(data.slug || title, 150);
    const content = sanitizeRichHtml(data.content || "");
    const tags = sanitizePlainText(data.tags, 500);
    const image_url = sanitizePlainText(data.image_url, 1000);

    if (!title || !content) {
      return new Response(JSON.stringify({
        success: false,
        error: "Title and Content are required fields."
      }), { status: 400, headers: corsHeaders });
    }

    slug = slugify(slug || title);

    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "D1 database not connected"
      }), { status: 500, headers: corsHeaders });
    }

    await env.DB.prepare(`
      UPDATE blogs 
      SET title = ?, meta_title = ?, meta_description = ?, slug = ?, content = ?, tags = ?, image_url = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(title, meta_title, meta_description, slug, content, tags, image_url, id).run();

    return new Response(JSON.stringify({
      success: true,
      message: "Blog updated successfully!"
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { status: 500, headers: corsHeaders });
  }
}

// DELETE: Remove a blog
export async function onRequestDelete(context) {
  const { request, params, env } = context;
  const id = parseInt(params.id, 10);

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized"
    }), { status: 401, headers: corsHeaders });
  }

  if (!env || !env.DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "D1 database not connected"
    }), { status: 500, headers: corsHeaders });
  }

  try {
    await env.DB.prepare("DELETE FROM blogs WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({
      success: true,
      message: "Blog post deleted successfully"
    }), { status: 200, headers: corsHeaders });
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
