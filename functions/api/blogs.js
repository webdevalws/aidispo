// Blogs Collection API (List Blogs & Create Blog) for Cloudflare D1
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

// GET: Retrieve all published blogs with search & pagination
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const search = (url.searchParams.get("search") || "").trim();
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "100", 10);
  const offset = (page - 1) * limit;

  if (!env || !env.DB) {
    return new Response(JSON.stringify({
      success: true,
      blogs: [],
      total: 0,
      page,
      limit,
      notice: "D1 database not connected; using client storage."
    }), { status: 200, headers: corsHeaders });
  }

  try {
    // Ensure table exists
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        tags TEXT,
        image_url TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        author TEXT DEFAULT 'AI-DISPO Clinical Team',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    let query = "SELECT * FROM blogs";
    let countQuery = "SELECT COUNT(*) as count FROM blogs";
    let params = [];

    if (search) {
      query += " WHERE title LIKE ? OR tags LIKE ? OR meta_title LIKE ?";
      countQuery += " WHERE title LIKE ? OR tags LIKE ? OR meta_title LIKE ?";
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult ? countResult.count : 0;

    const queryParams = [...params, limit, offset];
    const { results } = await env.DB.prepare(query).bind(...queryParams).all();

    return new Response(JSON.stringify({
      success: true,
      blogs: results || [],
      total,
      page,
      limit
    }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { status: 500, headers: corsHeaders });
  }
}

// POST: Create a new blog post
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized. Please log in."
    }), { status: 401, headers: corsHeaders });
  }

  try {
    const data = await request.json();
    const title = (data.title || "").trim();
    const meta_title = (data.meta_title || title).trim();
    const meta_description = (data.meta_description || "").trim();
    let slug = (data.slug || "").trim();
    const content = data.content || "";
    const tags = (data.tags || "").trim();
    const image_url = (data.image_url || "").trim();
    const author = (data.author || "AI-DISPO Clinical Team").trim();

    if (!title || !content) {
      return new Response(JSON.stringify({
        success: false,
        error: "Title and Content are required fields."
      }), { status: 400, headers: corsHeaders });
    }

    if (!slug) {
      slug = slugify(title);
    } else {
      slug = slugify(slug);
    }

    if (!env || !env.DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "Cloudflare D1 Database binding 'DB' is not available."
      }), { status: 500, headers: corsHeaders });
    }

    // Insert blog
    const stmt = env.DB.prepare(`
      INSERT INTO blogs (title, meta_title, meta_description, slug, content, tags, image_url, author, views, likes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, datetime('now'), datetime('now'))
    `).bind(title, meta_title, meta_description, slug, content, tags, image_url, author);

    const info = await stmt.run();

    return new Response(JSON.stringify({
      success: true,
      id: info.meta ? info.meta.last_row_id : null,
      message: "Blog post published successfully!",
      slug
    }), { status: 201, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message.includes("UNIQUE constraint") ? "A blog with this URL slug already exists. Please choose a unique URL." : err.message
    }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
